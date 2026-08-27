import Link from "next/link";
import { getArticles } from "@/lib/articles";

export const metadata = {
  title: "Durian Guides - Varieties, Prices & Buying Tips | DurianMarket",
  description:
    "Guides to buying durian in Singapore — Musang King vs D24, seasonal prices, how to pick a good durian, delivery tips, and more.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  const articles = getArticles();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-text-primary">Durian Guides</h1>
        <p className="text-sm text-text-secondary mt-2">
          Everything you need to know before buying durian in Singapore — varieties,
          seasons, prices, and how not to get ripped off.
        </p>
      </div>

      <div className="space-y-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/guides/${a.slug}`}
            className="block bg-surface rounded-lg border border-surface-border p-4 hover:border-neon-green/40 transition-colors"
          >
            <div className="text-[10px] font-mono text-text-muted mb-1">{a.date}</div>
            <h2 className="font-semibold text-base text-text-primary">{a.title}</h2>
            <p className="text-sm text-text-secondary mt-1">{a.description}</p>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-sm font-mono text-text-muted">No guides published yet.</p>
        )}
      </div>
    </div>
  );
}
