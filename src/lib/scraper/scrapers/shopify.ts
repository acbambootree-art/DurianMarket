import { ScraperFn } from "../types";
import { isValidPrice } from "../extract-price";

function packToPerKg(price: number, text: string): number {
  const lower = text.toLowerCase();
  const grams = lower.match(/(\d{3,4})\s*g(?:ram)?/);
  if (grams) {
    const g = parseInt(grams[1]);
    if (g >= 200 && g <= 2000) return (price / g) * 1000;
  }
  if (/per\s*kg|\/kg/i.test(lower)) return price;
  if (price >= 12 && price <= 40) return price;
  if (price >= 40 && price <= 90) return (price / 800) * 1000;
  if (price >= 90 && price <= 250) return (price / 1600) * 1000;
  return price;
}

export function createShopifyScraper(productKeywords?: string[]): ScraperFn {
  const keywords = productKeywords || ["musang", "mao shan", "msw", "d197"];

  return async (baseUrl, signal) => {
    const url = new URL("/products.json", baseUrl).toString();
    const res = await fetch(url, {
      signal,
      headers: { "User-Agent": "DurianMarket/1.0 (price-index)" },
    });

    if (!res.ok) throw new Error(`Shopify API returned ${res.status}`);

    const data = await res.json();
    const products = data.products || [];

    let bestPrice: number | null = null;

    for (const product of products) {
      const title = (product.title || "").toLowerCase();
      const matchesKeyword = keywords.some((kw) => title.includes(kw.toLowerCase()));
      if (!matchesKeyword || !product.variants?.length) continue;

      for (const variant of product.variants) {
        if (variant.available === false) continue;
        const rawPrice = parseFloat(variant.price || "0");
        if (rawPrice <= 0) continue;

        const context = `${title} ${variant.title || ""}`;
        const perKg = packToPerKg(rawPrice, context);

        if (isValidPrice(perKg) && (bestPrice === null || perKg < bestPrice)) {
          bestPrice = perKg;
        }
      }
    }

    if (bestPrice !== null) {
      return { pricePerKg: Math.round(bestPrice * 100) / 100, method: "shopify-json", confidence: "high" };
    }

    throw new Error("No MSW product found in Shopify catalog");
  };
}
