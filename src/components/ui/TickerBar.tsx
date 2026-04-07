"use client";

import { PriceWithSeller } from "@/lib/db";

export default function TickerBar({ prices }: { prices: PriceWithSeller[] }) {
  if (prices.length === 0) return null;

  const avg =
    prices.reduce((s, p) => s + Number(p.price_per_kg), 0) / prices.length;

  const items = prices.map((p) => {
    const price = Number(p.price_per_kg);
    const diff = ((price - avg) / avg) * 100;
    return { name: p.seller_name, price, diff };
  });

  // Double for seamless scroll
  const doubled = [...items, ...items];

  return (
    <div className="bg-chart-bg border-b border-surface-border overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap py-1.5">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-4 text-[11px] font-mono"
          >
            <span className="text-text-secondary">{item.name}</span>
            <span className="text-text-primary font-medium">
              ${item.price.toFixed(2)}
            </span>
            <span
              className={
                item.diff < 0 ? "text-neon-green" : item.diff > 0 ? "text-neon-red" : "text-text-muted"
              }
            >
              {item.diff > 0 ? "+" : ""}
              {item.diff.toFixed(1)}%
            </span>
            <span className="text-surface-border ml-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
