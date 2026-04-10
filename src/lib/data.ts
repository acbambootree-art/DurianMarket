// Unified data access layer — priority: Blob > Postgres > sample data
import { DailyAverage, PriceWithSeller } from "./db";
import { loadPriceHistory, BlobPriceEntry } from "./blob-store";

const hasDb = () => !!process.env.DATABASE_URL;
const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

// Convert BlobPriceEntry to PriceWithSeller
function blobToPrice(e: BlobPriceEntry, index: number): PriceWithSeller {
  return {
    id: index,
    seller_id: e.seller_id,
    price_per_kg: e.price_per_kg,
    recorded_date: e.recorded_date,
    notes: e.notes ?? null,
    created_at: e.recorded_date,
    seller_name: e.seller_name,
    seller_slug: e.seller_slug,
    website_url: e.website_url,
  };
}

async function fetchFromBlob(): Promise<BlobPriceEntry[]> {
  const store = await loadPriceHistory();
  return store?.entries || [];
}

export async function fetchLatestPrices(): Promise<PriceWithSeller[]> {
  if (hasBlob()) {
    const entries = await fetchFromBlob();
    if (entries.length > 0) {
      const latestDate = entries[entries.length - 1].recorded_date;
      return entries
        .filter((e) => e.recorded_date === latestDate)
        .map((e, i) => blobToPrice(e, i))
        .sort((a, b) => Number(a.price_per_kg) - Number(b.price_per_kg));
    }
  }
  if (hasDb()) {
    const { getLatestPrices } = await import("./prices");
    return getLatestPrices();
  }
  const { getSampleLatestPrices } = await import("./sample-data");
  return getSampleLatestPrices();
}

export async function fetchDailyAverages(days: number = 90): Promise<DailyAverage[]> {
  if (hasBlob()) {
    const entries = await fetchFromBlob();
    if (entries.length > 0) {
      // Group by date, compute averages
      const byDate = new Map<string, number[]>();
      for (const e of entries) {
        if (!byDate.has(e.recorded_date)) byDate.set(e.recorded_date, []);
        byDate.get(e.recorded_date)!.push(Number(e.price_per_kg));
      }
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split("T")[0];

      return Array.from(byDate.entries())
        .filter(([date]) => date >= cutoffStr)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, prices]) => ({
          recorded_date: date,
          avg_price: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
          min_price: Math.min(...prices),
          max_price: Math.max(...prices),
          seller_count: prices.length,
        }));
    }
  }
  if (hasDb()) {
    const { getDailyAverages } = await import("./prices");
    return getDailyAverages(days);
  }
  const { getSampleDailyAverages } = await import("./sample-data");
  return getSampleDailyAverages(days);
}

export async function fetchPricesBySeller(days: number = 90): Promise<PriceWithSeller[]> {
  if (hasBlob()) {
    const entries = await fetchFromBlob();
    if (entries.length > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split("T")[0];
      return entries
        .filter((e) => e.recorded_date >= cutoffStr)
        .map((e, i) => blobToPrice(e, i));
    }
  }
  if (hasDb()) {
    const { getPricesBySeller } = await import("./prices");
    return getPricesBySeller(days);
  }
  const { getSamplePricesBySeller } = await import("./sample-data");
  return getSamplePricesBySeller(days);
}

export async function fetchMonthlyAverages(): Promise<{ month: number; avg_price: number; entry_count: number }[]> {
  if (hasBlob()) {
    const entries = await fetchFromBlob();
    if (entries.length > 0) {
      const byMonth = new Map<number, number[]>();
      for (const e of entries) {
        const month = new Date(e.recorded_date).getMonth() + 1;
        if (!byMonth.has(month)) byMonth.set(month, []);
        byMonth.get(month)!.push(Number(e.price_per_kg));
      }
      return Array.from(byMonth.entries())
        .sort(([a], [b]) => a - b)
        .map(([month, prices]) => ({
          month,
          avg_price: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
          entry_count: prices.length,
        }));
    }
  }
  if (hasDb()) {
    const { getMonthlyAverages } = await import("./prices");
    return getMonthlyAverages();
  }
  const { getSampleMonthlyAverages } = await import("./sample-data");
  return getSampleMonthlyAverages();
}

export async function fetchSellers() {
  if (hasDb()) {
    const { getAllSellers } = await import("./sellers");
    return getAllSellers();
  }
  const { getSampleSellers } = await import("./sample-data");
  return getSampleSellers();
}
