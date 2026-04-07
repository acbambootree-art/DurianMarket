import { PriceWithSeller } from "@/lib/db";

export default function PriceCard({ price, rank }: { price: PriceWithSeller; rank?: number }) {
  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4 hover:border-neon-green/30 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {rank && (
              <span className="text-xs font-mono text-text-muted">#{rank}</span>
            )}
            <h3 className="font-medium text-sm text-text-primary group-hover:text-neon-green transition-colors">
              {price.seller_name}
            </h3>
          </div>
          <a
            href={price.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-neon-blue/70 hover:text-neon-blue"
          >
            {price.website_url.replace("https://", "").replace("www.", "")}
          </a>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold font-mono text-neon-green">
            ${Number(price.price_per_kg).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wide">
            SGD/kg
          </div>
        </div>
      </div>
      {price.notes && (
        <p className="mt-2 text-[11px] font-mono text-text-muted">{price.notes}</p>
      )}
    </div>
  );
}
