// Sample data for development/demo when no database is connected
import { DailyAverage, PriceWithSeller } from "./db";
import { SELLER_LIST, BASE_PRICES } from "./seller-list";

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generatePricesForDate(dateStr: string, dayOffset: number): PriceWithSeller[] {
  // Simulate seasonal variation: cheaper in June-Aug, pricier in Jan-Mar
  const month = new Date(dateStr).getMonth();
  const seasonalFactor =
    month >= 5 && month <= 7 ? -3 : // Jun-Aug: peak season, cheaper
    month >= 0 && month <= 2 ? 2 :   // Jan-Mar: off-season, pricier
    0;

  // Simulate a slow trend
  const trendFactor = Math.sin(dayOffset / 15) * 1.5;

  return SELLER_LIST.map((seller, i) => {
    const noise = (seededRandom(dayOffset * SELLER_LIST.length + i) - 0.5) * 4;
    const price = Math.max(12, BASE_PRICES[i] + seasonalFactor + trendFactor + noise);
    return {
      id: dayOffset * SELLER_LIST.length + i + 1,
      seller_id: seller.id,
      price_per_kg: Math.round(price * 100) / 100,
      recorded_date: dateStr,
      notes: null,
      created_at: dateStr,
      seller_name: seller.name,
      seller_slug: seller.slug,
      website_url: seller.url,
    };
  });
}

export function getSampleLatestPrices(): PriceWithSeller[] {
  const today = new Date().toISOString().split("T")[0];
  return generatePricesForDate(today, 90).sort(
    (a, b) => a.price_per_kg - b.price_per_kg
  );
}

export function getSampleDailyAverages(days: number = 90): DailyAverage[] {
  const result: DailyAverage[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const prices = generatePricesForDate(dateStr, 90 - i);
    const vals = prices.map((p) => p.price_per_kg);
    result.push({
      recorded_date: dateStr,
      avg_price: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
      min_price: Math.min(...vals),
      max_price: Math.max(...vals),
      seller_count: vals.length,
    });
  }
  return result;
}

export function getSamplePricesBySeller(days: number = 90): PriceWithSeller[] {
  const result: PriceWithSeller[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    result.push(...generatePricesForDate(dateStr, 90 - i));
  }
  return result.sort((a, b) => a.recorded_date.localeCompare(b.recorded_date));
}

export function getSampleMonthlyAverages(): { month: number; avg_price: number; entry_count: number }[] {
  const monthlyPrices = [
    26, 27, 25, 23, 21, 18, 16, 17, 20, 22, 24, 25,
  ];
  return monthlyPrices.map((avg, i) => ({
    month: i + 1,
    avg_price: avg,
    entry_count: 28,
  }));
}

export function getSampleSellers() {
  return SELLER_LIST.map((s) => ({
    ...s,
    website_url: s.url,
    is_active: true,
    created_at: "2025-01-01",
  }));
}
