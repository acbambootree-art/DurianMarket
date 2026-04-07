export type ScrapeResult = {
  sellerId: number;
  sellerName: string;
  pricePerKg: number | null;
  method: string; // e.g. "shopify-json", "json-ld", "css-selector", "regex"
  confidence: "high" | "medium" | "low";
  error?: string;
  durationMs: number;
};

export type ScraperFn = (url: string, signal: AbortSignal) => Promise<{
  pricePerKg: number;
  method: string;
  confidence: "high" | "medium" | "low";
}>;

export type SellerScrapeConfig = {
  sellerId: number;
  sellerName: string;
  url: string;
  scraper: ScraperFn;
};
