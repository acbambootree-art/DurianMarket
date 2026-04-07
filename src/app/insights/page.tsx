import { fetchLatestPrices, fetchDailyAverages, fetchMonthlyAverages } from "@/lib/data";
import { generateAllInsights } from "@/lib/insights";
import InsightCard from "@/components/ui/InsightCard";

export const revalidate = 3600;

export const metadata = {
  title: "Market Signals - DurianMarket",
  description: "Auto-generated insights on when to buy Musang King durian in Singapore",
};

export default async function InsightsPage() {
  const [latestPrices, dailyAverages, monthlyAverages] = await Promise.all([
    fetchLatestPrices(),
    fetchDailyAverages(90),
    fetchMonthlyAverages(),
  ]);

  const insights = generateAllInsights(dailyAverages, latestPrices, monthlyAverages);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          Market Signals
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          AUTO-GENERATED ANALYSIS &bull; UPDATED HOURLY
        </p>
      </div>

      {insights.length > 0 ? (
        <div className="grid gap-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
          INSUFFICIENT DATA FOR ANALYSIS
        </div>
      )}

      <div className="mt-8 bg-surface rounded-lg border border-surface-border p-5">
        <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wide mb-3">
          Methodology
        </h2>
        <div className="text-xs text-text-muted font-mono space-y-2 leading-relaxed">
          <p>
            Signals are computed from daily price data across {23} sellers.
            Pure statistical analysis &mdash; no predictions, no AI.
          </p>
          <ul className="list-none space-y-1">
            <li className="flex gap-2">
              <span className="text-neon-blue">&#9654;</span>
              Market Summary &mdash; 7-day and 30-day moving average comparison
            </li>
            <li className="flex gap-2">
              <span className="text-neon-green">&#9654;</span>
              Best Value &mdash; Cheapest seller vs market average
            </li>
            <li className="flex gap-2">
              <span className="text-neon-amber">&#9654;</span>
              Trend &mdash; Linear regression on 7-day price window
            </li>
            <li className="flex gap-2">
              <span className="text-neon-purple">&#9654;</span>
              Seasonal &mdash; Monthly average vs yearly baseline
            </li>
            <li className="flex gap-2">
              <span className="text-neon-cyan">&#9654;</span>
              Volatility &mdash; Coefficient of variation (30-day)
            </li>
            <li className="flex gap-2">
              <span className="text-neon-red">&#9654;</span>
              Spread &mdash; Max price differential across sellers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
