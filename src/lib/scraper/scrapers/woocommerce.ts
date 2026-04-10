import { ScraperFn } from "../types";
import { isMswProduct, normalizeToPerKg, isValidPrice } from "../extract-price";

export function createWooCommerceScraper(): ScraperFn {
  return async (baseUrl, signal) => {
    const endpoints = [
      "/wp-json/wc/store/v1/products?search=musang+king&per_page=10",
      "/wp-json/wc/store/v1/products?search=mao+shan+wang&per_page=10",
    ];

    let bestPerKg: number | null = null;

    for (const endpoint of endpoints) {
      try {
        const url = new URL(endpoint, baseUrl).toString();
        const res = await fetch(url, {
          signal,
          headers: { "User-Agent": "DurianMarket/1.0 (price-index)" },
        });

        if (!res.ok) continue;

        const products = await res.json();
        if (!Array.isArray(products)) continue;

        for (const product of products) {
          const name = product.name || "";
          if (!isMswProduct(name)) continue;

          const rawPrice = parseFloat(product.prices?.price || product.price || "0");
          // WooCommerce Store API returns price in minor units (cents)
          const actualPrice = product.prices?.price ? rawPrice / 100 : rawPrice;
          if (actualPrice <= 0) continue;

          const description = (product.short_description || product.description || "")
            .replace(/<[^>]*>/g, " ")
            .slice(0, 500);
          const context = `${name} ${description}`;

          const perKg = normalizeToPerKg(actualPrice, context);
          if (isValidPrice(perKg) && (bestPerKg === null || perKg < bestPerKg)) {
            bestPerKg = perKg;
          }
        }
      } catch {
        continue;
      }
    }

    if (bestPerKg !== null) {
      return {
        pricePerKg: Math.round(bestPerKg * 100) / 100,
        method: "woocommerce-api",
        confidence: "high",
      };
    }

    throw new Error("No whole MSW product found via WooCommerce API");
  };
}
