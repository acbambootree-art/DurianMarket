import { ScraperFn } from "../types";
import { extractFromJsonLd, extractFromHtml, extractWithRegex, isValidPrice } from "../extract-price";

// Generic HTML scraper — tries JSON-LD, CSS selectors, then regex
export function createGenericHtmlScraper(paths?: string[]): ScraperFn {
  const pagePaths = paths || ["/", "/shop", "/products", "/store"];

  return async (baseUrl, signal) => {
    for (const path of pagePaths) {
      try {
        const url = new URL(path, baseUrl).toString();
        const res = await fetch(url, {
          signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; DurianMarket/1.0)",
            "Accept": "text/html",
          },
        });

        if (!res.ok) continue;
        const html = await res.text();

        // Try JSON-LD first (most reliable)
        const jsonLdPrice = extractFromJsonLd(html);
        if (jsonLdPrice && isValidPrice(jsonLdPrice)) {
          return { pricePerKg: Math.round(jsonLdPrice * 100) / 100, method: "json-ld", confidence: "high" };
        }

        // Try CSS selector extraction
        const htmlPrice = extractFromHtml(html);
        if (htmlPrice && isValidPrice(htmlPrice)) {
          return { pricePerKg: Math.round(htmlPrice * 100) / 100, method: "css-selector", confidence: "medium" };
        }

        // Regex fallback
        const regexPrice = extractWithRegex(html);
        if (regexPrice && isValidPrice(regexPrice)) {
          return { pricePerKg: Math.round(regexPrice * 100) / 100, method: "regex", confidence: "low" };
        }
      } catch {
        continue;
      }
    }

    throw new Error("Could not extract MSW price from any page");
  };
}
