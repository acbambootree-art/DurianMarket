import { fetchLatestPrices, fetchDailyAverages, fetchMonthlyAverages } from "@/lib/data";
import { generateAllInsights } from "@/lib/insights";
import PriceCard from "@/components/ui/PriceCard";
import StatCard from "@/components/ui/StatCard";
import InsightCard from "@/components/ui/InsightCard";
import PriceTrendChart from "@/components/charts/PriceTrendChart";
import TickerBar from "@/components/ui/TickerBar";
import HeroSection from "@/components/ui/HeroSection";

export const revalidate = 300; // 5 min revalidation

export default async function DashboardPage() {
  const [latestPrices, dailyAverages, monthlyAverages] = await Promise.all([
    fetchLatestPrices(),
    fetchDailyAverages(90),
    fetchMonthlyAverages(),
  ]);

  const insights = generateAllInsights(dailyAverages, latestPrices, monthlyAverages);

  const todayAvg =
    latestPrices.length > 0
      ? latestPrices.reduce((s, p) => s + Number(p.price_per_kg), 0) / latestPrices.length
      : 0;

  const cheapest = latestPrices[0];
  const mostExpensive = latestPrices[latestPrices.length - 1];

  const prevDay = dailyAverages.length >= 2 ? dailyAverages[dailyAverages.length - 2] : null;
  const dayChange = prevDay ? todayAvg - Number(prevDay.avg_price) : 0;
  const dayChangePct = prevDay ? (dayChange / Number(prevDay.avg_price)) * 100 : 0;

  return (
    <div>
      {/* Ticker Bar */}
      <TickerBar prices={latestPrices} />

      {/* Hero Section */}
      <HeroSection
        avgPrice={todayAvg}
        dayChange={dayChange}
        dayChangePct={dayChangePct}
        sellerCount={latestPrices.length}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="Market Average"
            value={`$${todayAvg.toFixed(2)}`}
            sub={
              dayChange !== 0
                ? `${dayChange > 0 ? "+" : ""}$${dayChange.toFixed(2)} from yesterday`
                : undefined
            }
            accent
          />
          <StatCard
            label="Low"
            value={cheapest ? `$${Number(cheapest.price_per_kg).toFixed(2)}` : "-"}
            sub={cheapest?.seller_name}
          />
          <StatCard
            label="High"
            value={mostExpensive ? `$${Number(mostExpensive.price_per_kg).toFixed(2)}` : "-"}
            sub={mostExpensive?.seller_name}
          />
          <StatCard
            label="Sellers"
            value={String(latestPrices.length)}
            sub="Live tracking"
          />
        </div>

        {/* Chart */}
        <div className="mb-6">
          <PriceTrendChart data={dailyAverages} compact />
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wide mb-3">
              Market Signals
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {insights.slice(0, 4).map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Seller Prices */}
        <div>
          <h2 className="text-sm font-mono text-text-secondary uppercase tracking-wide mb-3">
            All Sellers
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestPrices.map((price, i) => (
              <PriceCard key={price.id} price={price} rank={i + 1} />
            ))}
          </div>
          {latestPrices.length === 0 && (
            <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
              NO DATA AVAILABLE
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
