"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceWithSeller } from "@/lib/db";

const COLORS = [
  "#00e676", "#ffc400", "#ff1744", "#00b0ff", "#d500f9",
  "#18ffff", "#ff6d00", "#76ff03", "#f50057", "#00e5ff",
  "#ffea00", "#651fff", "#1de9b6", "#ff3d00", "#00bfa5",
  "#aa00ff", "#64dd17", "#304ffe", "#c6ff00", "#6200ea",
  "#00c853", "#dd2c00", "#0091ea",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

type Props = {
  prices: PriceWithSeller[];
  sellers: string[];
};

export default function SellerPriceChart({ prices, sellers }: Props) {
  const defaultVisible = new Set<string>(
    sellers.length <= 7 ? sellers : sellers.slice(0, 7)
  );
  const [visible, setVisible] = useState<Set<string>>(defaultVisible);

  const dateMap = new Map<string, Record<string, number>>();
  for (const p of prices) {
    const key = p.recorded_date;
    if (!dateMap.has(key)) dateMap.set(key, {});
    dateMap.get(key)![p.seller_name] = Number(p.price_per_kg);
  }

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date: formatDate(date),
      ...values,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
        NO DATA AVAILABLE
      </div>
    );
  }

  function toggleSeller(name: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-mono text-sm text-text-secondary uppercase tracking-wide">
          Seller Breakdown
        </h3>
        <div className="flex gap-0.5 text-xs font-mono">
          <button
            onClick={() => setVisible(new Set(sellers))}
            className="px-2 py-1 rounded text-text-muted hover:text-text-secondary hover:bg-surface-light"
          >
            ALL
          </button>
          <button
            onClick={() => setVisible(new Set(sellers.slice(0, 7)))}
            className="px-2 py-1 rounded text-text-muted hover:text-text-secondary hover:bg-surface-light"
          >
            TOP 7
          </button>
          <button
            onClick={() => setVisible(new Set())}
            className="px-2 py-1 rounded text-text-muted hover:text-text-secondary hover:bg-surface-light"
          >
            NONE
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {sellers.map((seller, i) => (
          <button
            key={seller}
            onClick={() => toggleSeller(seller)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all border ${
              visible.has(seller)
                ? "border-transparent text-black"
                : "text-text-muted border-surface-border bg-transparent hover:border-text-muted"
            }`}
            style={
              visible.has(seller)
                ? { backgroundColor: COLORS[i % COLORS.length], color: "#0a0e17" }
                : undefined
            }
          >
            {seller}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#4a5568", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#4a5568", fontFamily: "monospace" }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#e1e7ef",
              maxHeight: "300px",
              overflow: "auto",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}/kg`]}
            labelStyle={{ color: "#4a5568" }}
          />
          {sellers
            .filter((s) => visible.has(s))
            .map((seller) => {
              const i = sellers.indexOf(seller);
              return (
                <Line
                  key={seller}
                  type="monotone"
                  dataKey={seller}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls
                />
              );
            })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
