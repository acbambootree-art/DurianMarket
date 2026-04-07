import { ScraperFn } from "../types";
import { isValidPrice } from "../extract-price";

// Convert pack price to per-kg based on product name/description
function packToPerKg(price: number, text: string): number {
  const lower = text.toLowerCase();
  // Match explicit weight patterns
  const grams = lower.match(/(\d{3,4})\s*g(?:ram)?/);
  if (grams) {
    const g = parseInt(grams[1]);
    if (g >= 200 && g <= 2000) return (price / g) * 1000;
  }
  // Match "per kg" indicator — already per kg
  if (/per\s*kg|\/kg/i.test(lower)) return price;
  // If price is in typical per-kg range, assume per kg
  if (price >= 12 && price <= 40) return price;
  // If price looks like a pack price, assume 800g (most common)
  if (price >= 40 && price <= 90) return (price / 800) * 1000;
  // Higher prices likely multi-pack
  if (price >= 90 && price <= 250) return (price / 1600) * 1000;
  return price;
}

export function createWooCommerceScraper(): ScraperFn {
  return async (baseUrl, signal) => {
    const endpoints = [
      "/wp-json/wc/store/v1/products?search=musang+king&per_page=5",
      "/wp-json/wc/store/v1/products?search=mao+shan+wang&per_page=5",
    ];

    for (const endpoint of endpoints) {
      try {
        const url = new URL(endpoint, baseUrl).toString();
        const res = await fetch(url, {
          signal,
          headers: { "User-Agent": "DurianMarket/1.0 (price-index)" },
        });

        if (!res.ok) continue;

        const products = await res.json();
        if (!Array.isArray(products) || products.length === 0) continue;

        // Find cheapest MSW product
        let bestPrice: number | null = null;

        for (const product of products) {
          const rawPrice = parseFloat(product.prices?.price || product.price || "0");
          // WooCommerce Store API returns price in minor units (cents)
          const actualPrice = product.prices?.price ? rawPrice / 100 : rawPrice;

          if (actualPrice <= 0) continue;

          const context = [
            product.name || "",
            product.short_description || "",
            product.description || "",
          ].join(" ");

          const perKg = packToPerKg(actualPrice, context);

          if (isValidPrice(perKg)) {
            if (bestPrice === null || perKg < bestPrice) {
              bestPrice = perKg;
            }
          }
        }

        if (bestPrice !== null) {
          return { pricePerKg: Math.round(bestPrice * 100) / 100, method: "woocommerce-api", confidence: "high" };
        }
      } catch {
        continue;
      }
    }

    throw new Error("No MSW product found via WooCommerce API");
  };
}
