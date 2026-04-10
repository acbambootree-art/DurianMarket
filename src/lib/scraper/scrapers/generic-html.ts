import { ScraperFn } from "../types";
import {
  extractFromJsonLd,
  extractFromHtml,
  extractWithRegex,
  normalizeToPerKg,
  isValidPrice,
} from "../extract-price";

export function createGenericHtmlScraper(paths?: string[]): ScraperFn {
  const pagePaths = paths || ["/", "/shop", "/products", "/store", "/durian-price"];

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

        // JSON-LD (most reliable)
        const jsonLd = extractFromJsonLd(html);
        if (jsonLd) {
          const perKg = normalizeToPerKg(jsonLd.price, jsonLd.context);
          if (isValidPrice(perKg)) {
            return {
              pricePerKg: Math.round(perKg * 100) / 100,
              method: "json-ld",
              confidence: "high",
            };
          }
        }

        // HTML element extraction
        const htmlExtract = extractFromHtml(html);
        if (htmlExtract) {
          const perKg = normalizeToPerKg(htmlExtract.price, htmlExtract.context);
          if (isValidPrice(perKg)) {
            return {
              pricePerKg: Math.round(perKg * 100) / 100,
              method: "css-selector",
              confidence: "medium",
            };
          }
        }

        // Regex fallback
        const regexExtract = extractWithRegex(html);
        if (regexExtract) {
          const perKg = normalizeToPerKg(regexExtract.price, regexExtract.context);
          if (isValidPrice(perKg)) {
            return {
              pricePerKg: Math.round(perKg * 100) / 100,
              method: "regex",
              confidence: "low",
            };
          }
        }
      } catch {
        continue;
      }
    }

    throw new Error("Could not extract whole MSW price");
  };
}
