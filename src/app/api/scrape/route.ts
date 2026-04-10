import { NextRequest, NextResponse } from "next/server";
import { getScrapableConfigs } from "@/lib/scraper/registry";
import { runAllScrapers } from "@/lib/scraper/run-all";
import { ScrapeResult } from "@/lib/scraper/types";
import { appendPriceEntries, BlobPriceEntry } from "@/lib/blob-store";
import { SELLER_LIST } from "@/lib/seller-list";

export const maxDuration = 60;

async function savePrices(results: ScrapeResult[]): Promise<number> {
  const successful = results.filter((r) => r.pricePerKg !== null);
  if (successful.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];

  const entries: BlobPriceEntry[] = successful.map((r) => {
    const seller = SELLER_LIST.find((s) => s.id === r.sellerId);
    return {
      seller_id: r.sellerId,
      seller_name: r.sellerName,
      seller_slug: seller?.slug || "",
      website_url: seller?.url || "",
      price_per_kg: r.pricePerKg!,
      recorded_date: today,
      method: r.method,
      confidence: r.confidence,
      notes: `Auto-scraped via ${r.method}`,
    };
  });

  return await appendPriceEntries(entries);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow requests without auth in dev, require auth in production
  if (process.env.NODE_ENV === "production" && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const start = Date.now();
  const configs = getScrapableConfigs();

  const results = await runAllScrapers(configs);

  const successful = results.filter((r) => r.pricePerKg !== null);
  const failed = results.filter((r) => r.pricePerKg === null);

  const saved = await savePrices(results);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalSellers: configs.length,
    successful: successful.length,
    failed: failed.length,
    saved,
    durationMs: Date.now() - start,
    results: results.map((r) => ({
      seller: r.sellerName,
      price: r.pricePerKg ? `$${r.pricePerKg}/kg` : null,
      method: r.method,
      confidence: r.confidence,
      error: r.error,
      durationMs: r.durationMs,
    })),
  });
}
