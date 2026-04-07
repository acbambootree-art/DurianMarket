import { ScraperFn } from "../types";

// Try multiple scrapers in order, return first success
export function createChainScraper(...scrapers: ScraperFn[]): ScraperFn {
  return async (url, signal) => {
    let lastError: Error | null = null;

    for (const scraper of scrapers) {
      try {
        return await scraper(url, signal);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError || new Error("All scrapers failed");
  };
}
