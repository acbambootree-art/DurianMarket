// Unified data access layer: uses database when available, falls back to sample data
import { DailyAverage, PriceWithSeller } from "./db";

const hasDb = () => !!process.env.DATABASE_URL;

export async function fetchLatestPrices(): Promise<PriceWithSeller[]> {
  if (hasDb()) {
    const { getLatestPrices } = await import("./prices");
    return getLatestPrices();
  }
  const { getSampleLatestPrices } = await import("./sample-data");
  return getSampleLatestPrices();
}

export async function fetchDailyAverages(days: number = 90): Promise<DailyAverage[]> {
  if (hasDb()) {
    const { getDailyAverages } = await import("./prices");
    return getDailyAverages(days);
  }
  const { getSampleDailyAverages } = await import("./sample-data");
  return getSampleDailyAverages(days);
}

export async function fetchPricesBySeller(days: number = 90): Promise<PriceWithSeller[]> {
  if (hasDb()) {
    const { getPricesBySeller } = await import("./prices");
    return getPricesBySeller(days);
  }
  const { getSamplePricesBySeller } = await import("./sample-data");
  return getSamplePricesBySeller(days);
}

export async function fetchMonthlyAverages(): Promise<{ month: number; avg_price: number; entry_count: number }[]> {
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
