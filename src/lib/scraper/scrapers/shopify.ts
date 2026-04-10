import { ScraperFn } from "../types";
import { isMswProduct, normalizeToPerKg, isValidPrice } from "../extract-price";

export function createShopifyScraper(): ScraperFn {
  return async (baseUrl, signal) => {
    const url = new URL("/products.json?limit=250", baseUrl).toString();
    const res = await fetch(url, {
      signal,
      headers: { "User-Agent": "DurianMarket/1.0 (price-index)" },
    });

    if (!res.ok) throw new Error(`Shopify API returned ${res.status}`);

    const data = await res.json();
    const products = data.products || [];

    let bestPerKg: number | null = null;
    let bestMethod = "shopify-json";

    for (const product of products) {
      const title = product.title || "";
      const body = (product.body_html || "").replace(/<[^>]*>/g, " ").slice(0, 500);

      if (!isMswProduct(title)) continue;
      if (!product.variants?.length) continue;

      for (const variant of product.variants) {
        if (variant.available === false) continue;
        const rawPrice = parseFloat(variant.price || "0");
        if (rawPrice <= 0) continue;

        // Build full context: title + variant title + body text
        const variantTitle = variant.title || "";
        const context = `${title} ${variantTitle} ${body}`;

        const perKg = normalizeToPerKg(rawPrice, context);

        if (isValidPrice(perKg) && (bestPerKg === null || perKg < bestPerKg)) {
          bestPerKg = perKg;
        }
      }
    }

    if (bestPerKg !== null) {
      return {
        pricePerKg: Math.round(bestPerKg * 100) / 100,
        method: bestMethod,
        confidence: "high",
      };
    }

    throw new Error("No whole MSW product found in Shopify catalog");
  };
}
