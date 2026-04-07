import { fetchDailyAverages, fetchPricesBySeller } from "@/lib/data";
import PriceTrendChart from "@/components/charts/PriceTrendChart";
import SellerPriceChart from "@/components/charts/SellerPriceChart";

export const revalidate = 3600;

export const metadata = {
  title: "Price Trends - DurianMarket",
  description: "Track Musang King durian price trends over time",
};

export default async function TrendsPage() {
  const [dailyAverages, pricesBySeller] = await Promise.all([
    fetchDailyAverages(365),
    fetchPricesBySeller(90),
  ]);

  const sellers = [...new Set(pricesBySeller.map((p) => p.seller_name))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          Price Trends
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          HISTORICAL MSW PRICE ANALYSIS
        </p>
      </div>

      <div className="space-y-6">
        <PriceTrendChart data={dailyAverages} />
        <SellerPriceChart prices={pricesBySeller} sellers={sellers} />
      </div>
    </div>
  );
}
