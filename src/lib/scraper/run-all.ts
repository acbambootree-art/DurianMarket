import { ScrapeResult, SellerScrapeConfig } from "./types";

const TIMEOUT_MS = 8000;

async function scrapeSeller(config: SellerScrapeConfig): Promise<ScrapeResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await config.scraper(config.url, controller.signal);
    return {
      sellerId: config.sellerId,
      sellerName: config.sellerName,
      pricePerKg: result.pricePerKg,
      method: result.method,
      confidence: result.confidence,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      sellerId: config.sellerId,
      sellerName: config.sellerName,
      pricePerKg: null,
      method: "failed",
      confidence: "low",
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - start,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runAllScrapers(configs: SellerScrapeConfig[]): Promise<ScrapeResult[]> {
  const results = await Promise.allSettled(configs.map(scrapeSeller));

  return results.map((r) => {
    if (r.status === "fulfilled") return r.value;
    return {
      sellerId: 0,
      sellerName: "unknown",
      pricePerKg: null,
      method: "failed",
      confidence: "low" as const,
      error: r.reason?.message || "Unknown error",
      durationMs: 0,
    };
  });
}
