import { NextRequest, NextResponse } from "next/server";
import { getScrapableConfigs } from "@/lib/scraper/registry";
import { runAllScrapers } from "@/lib/scraper/run-all";
import { ScrapeResult } from "@/lib/scraper/types";

export const maxDuration = 60; // Vercel Pro: 60s max

async function savePrices(results: ScrapeResult[]) {
  const successful = results.filter((r) => r.pricePerKg !== null);
  if (successful.length === 0) return 0;

  // Only save if database is configured
  if (!process.env.DATABASE_URL) return 0;

  const { upsertPrice } = await import("@/lib/prices");
  const { getDb } = await import("@/lib/db");

  const today = new Date().toISOString().split("T")[0];
  let saved = 0;

  for (const result of successful) {
    try {
      await upsertPrice(
        result.sellerId,
        result.pricePerKg!,
        today,
        `Auto-scraped via ${result.method}`
      );
      saved++;
    } catch {
      // skip individual save errors
    }
  }

  // Log scrape results
  try {
    const sql = getDb();
    for (const result of results) {
      await sql`
        INSERT INTO scrape_logs (seller_id, success, price_found, method, confidence, error_message, duration_ms)
        VALUES (${result.sellerId}, ${result.pricePerKg !== null}, ${result.pricePerKg}, ${result.method}, ${result.confidence}, ${result.error ?? null}, ${result.durationMs})
      `;
    }
  } catch {
    // scrape_logs table may not exist yet
  }

  return saved;
}

export async function GET(request: NextRequest) {
  // Verify cron secret for Vercel cron jobs
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
