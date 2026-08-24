import { fetchDurianNews } from "@/lib/news";
import NewsCard from "@/components/ui/NewsCard";

export const revalidate = 3600; // news refreshes hourly

export const metadata = {
  title: "Durian News - DurianMarket",
  description: "Latest durian news from Singapore and the region.",
};

export default async function NewsPage() {
  const news = await fetchDurianNews(30);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-mono text-text-primary">
          DURIAN <span className="text-neon-green">WIRE</span>
        </h1>
        <p className="text-xs font-mono text-text-secondary mt-1">
          Latest durian headlines from Singapore &amp; the region &bull; refreshed hourly
        </p>
      </div>

      {news.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.link} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
          NO NEWS AVAILABLE — CHECK BACK LATER
        </div>
      )}
    </div>
  );
}
