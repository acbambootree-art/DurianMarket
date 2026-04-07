import { DailyAverage, PriceWithSeller } from "./db";

export type Insight = {
  type: "market" | "best_value" | "seasonal" | "trend" | "volatility" | "consistency";
  sentiment: "positive" | "neutral" | "warning";
  title: string;
  description: string;
  value?: string;
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function generateMarketSummary(
  dailyAverages: DailyAverage[],
  latestPrices: PriceWithSeller[]
): Insight | null {
  if (dailyAverages.length === 0) return null;

  const today = dailyAverages[dailyAverages.length - 1];
  const todayAvg = Number(today.avg_price);

  const last7 = dailyAverages.slice(-7);
  const last30 = dailyAverages.slice(-30);

  const avg7 = last7.reduce((s, d) => s + Number(d.avg_price), 0) / last7.length;
  const avg30 = last30.reduce((s, d) => s + Number(d.avg_price), 0) / last30.length;

  const change7 = ((todayAvg - avg7) / avg7) * 100;
  const change30 = ((todayAvg - avg30) / avg30) * 100;

  let sentiment: Insight["sentiment"] = "neutral";
  if (change7 < -5) sentiment = "positive";
  if (change7 > 5) sentiment = "warning";

  return {
    type: "market",
    sentiment,
    title: "Market Summary",
    description: `Today's average is $${todayAvg.toFixed(2)}/kg across ${latestPrices.length} sellers. ` +
      `${change7 >= 0 ? "Up" : "Down"} ${Math.abs(change7).toFixed(1)}% vs 7-day avg ($${avg7.toFixed(2)}), ` +
      `${change30 >= 0 ? "up" : "down"} ${Math.abs(change30).toFixed(1)}% vs 30-day avg ($${avg30.toFixed(2)}).`,
    value: `$${todayAvg.toFixed(2)}/kg`,
  };
}

export function generateBestValue(latestPrices: PriceWithSeller[]): Insight | null {
  if (latestPrices.length === 0) return null;

  const cheapest = latestPrices[0]; // already sorted ASC
  const avgPrice = latestPrices.reduce((s, p) => s + Number(p.price_per_kg), 0) / latestPrices.length;
  const savings = ((avgPrice - Number(cheapest.price_per_kg)) / avgPrice) * 100;

  return {
    type: "best_value",
    sentiment: "positive",
    title: "Best Value Today",
    description: `${cheapest.seller_name} offers the lowest price at $${Number(cheapest.price_per_kg).toFixed(2)}/kg ` +
      `\u2014 ${savings.toFixed(0)}% below the market average of $${avgPrice.toFixed(2)}/kg.`,
    value: `$${Number(cheapest.price_per_kg).toFixed(2)}/kg`,
  };
}

export function generateSeasonalInsight(
  monthlyAverages: { month: number; avg_price: number; entry_count: number }[]
): Insight | null {
  if (monthlyAverages.length < 3) return null;

  const yearlyAvg = monthlyAverages.reduce((s, m) => s + Number(m.avg_price), 0) / monthlyAverages.length;
  const cheapMonths = monthlyAverages
    .filter((m) => Number(m.avg_price) < yearlyAvg * 0.9)
    .sort((a, b) => Number(a.avg_price) - Number(b.avg_price));

  const expensiveMonths = monthlyAverages
    .filter((m) => Number(m.avg_price) > yearlyAvg * 1.1)
    .sort((a, b) => Number(b.avg_price) - Number(a.avg_price));

  if (cheapMonths.length === 0 && expensiveMonths.length === 0) {
    return {
      type: "seasonal",
      sentiment: "neutral",
      title: "Seasonal Patterns",
      description: "Prices have been relatively stable across months with no strong seasonal pattern yet. More data is needed.",
    };
  }

  const cheapNames = cheapMonths.map((m) => MONTH_NAMES[m.month - 1]).join(", ");
  const expNames = expensiveMonths.map((m) => MONTH_NAMES[m.month - 1]).join(", ");

  return {
    type: "seasonal",
    sentiment: "neutral",
    title: "Seasonal Patterns",
    description:
      (cheapMonths.length > 0
        ? `Best months to buy: ${cheapNames} (prices >10% below yearly avg of $${yearlyAvg.toFixed(2)}/kg). `
        : "") +
      (expensiveMonths.length > 0
        ? `Avoid buying in: ${expNames} (prices >10% above average).`
        : ""),
  };
}

export function generateTrendInsight(dailyAverages: DailyAverage[]): Insight | null {
  const recent = dailyAverages.slice(-7);
  if (recent.length < 3) return null;

  // Simple linear regression
  const n = recent.length;
  const xs = recent.map((_, i) => i);
  const ys = recent.map((d) => Number(d.avg_price));

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sumX2 = xs.reduce((s, x) => s + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const dailyChange = slope;
  const weeklyChange = slope * 7;
  const pctChange = (weeklyChange / (sumY / n)) * 100;

  let sentiment: Insight["sentiment"] = "neutral";
  let direction = "stable";
  if (pctChange > 3) {
    sentiment = "warning";
    direction = "rising";
  } else if (pctChange < -3) {
    sentiment = "positive";
    direction = "falling";
  }

  return {
    type: "trend",
    sentiment,
    title: "7-Day Price Trend",
    description: `Prices are ${direction}. ` +
      `${Math.abs(pctChange) > 1 ? `Moving ${pctChange > 0 ? "up" : "down"} ~$${Math.abs(dailyChange).toFixed(2)}/kg per day (${Math.abs(pctChange).toFixed(1)}% weekly trend).` : "Prices have been relatively flat over the past week."} ` +
      `${direction === "falling" ? "Good time to buy!" : direction === "rising" ? "Consider waiting for prices to stabilize." : ""}`,
    value: `${pctChange > 0 ? "+" : ""}${pctChange.toFixed(1)}%/week`,
  };
}

export function generateVolatilityInsight(dailyAverages: DailyAverage[]): Insight | null {
  const recent = dailyAverages.slice(-30);
  if (recent.length < 7) return null;

  const prices = recent.map((d) => Number(d.avg_price));
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((s, p) => s + (p - mean) ** 2, 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100; // coefficient of variation

  let sentiment: Insight["sentiment"] = "neutral";
  let level = "moderate";
  if (cv > 15) {
    sentiment = "warning";
    level = "high";
  } else if (cv < 5) {
    sentiment = "positive";
    level = "low";
  }

  return {
    type: "volatility",
    sentiment,
    title: "Price Volatility",
    description:
      level === "high"
        ? `Prices have been highly volatile (${cv.toFixed(1)}% variation). Expect significant daily swings \u2014 check back daily for the best deals.`
        : level === "low"
          ? `Prices are very stable (${cv.toFixed(1)}% variation). You can buy with confidence \u2014 prices are unlikely to change much in the short term.`
          : `Moderate price variation (${cv.toFixed(1)}%). Prices shift day to day but stay within a reasonable range.`,
    value: `${cv.toFixed(1)}%`,
  };
}

export function generateConsistencyInsight(latestPrices: PriceWithSeller[]): Insight | null {
  if (latestPrices.length < 3) return null;

  const prices = latestPrices.map((p) => Number(p.price_per_kg));
  const maxDiff = Math.max(...prices) - Math.min(...prices);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const spread = (maxDiff / mean) * 100;

  const mostExpensive = latestPrices[latestPrices.length - 1];
  const cheapest = latestPrices[0];

  return {
    type: "consistency",
    sentiment: spread > 20 ? "warning" : "neutral",
    title: "Seller Price Spread",
    description: `Today's price spread is $${maxDiff.toFixed(2)}/kg (${spread.toFixed(0)}%). ` +
      `Cheapest: ${cheapest.seller_name} at $${Number(cheapest.price_per_kg).toFixed(2)}/kg. ` +
      `Most expensive: ${mostExpensive.seller_name} at $${Number(mostExpensive.price_per_kg).toFixed(2)}/kg.`,
    value: `$${maxDiff.toFixed(2)} spread`,
  };
}

export function generateAllInsights(
  dailyAverages: DailyAverage[],
  latestPrices: PriceWithSeller[],
  monthlyAverages: { month: number; avg_price: number; entry_count: number }[]
): Insight[] {
  const insights: Insight[] = [];

  const market = generateMarketSummary(dailyAverages, latestPrices);
  if (market) insights.push(market);

  const bestValue = generateBestValue(latestPrices);
  if (bestValue) insights.push(bestValue);

  const trend = generateTrendInsight(dailyAverages);
  if (trend) insights.push(trend);

  const seasonal = generateSeasonalInsight(monthlyAverages);
  if (seasonal) insights.push(seasonal);

  const volatility = generateVolatilityInsight(dailyAverages);
  if (volatility) insights.push(volatility);

  const consistency = generateConsistencyInsight(latestPrices);
  if (consistency) insights.push(consistency);

  return insights;
}
