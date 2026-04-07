"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DailyAverage } from "@/lib/db";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "ALL", days: 0 },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

type Props = {
  data: DailyAverage[];
  compact?: boolean;
};

export default function PriceTrendChart({ data, compact = false }: Props) {
  const [rangeIdx, setRangeIdx] = useState(1);
  const range = RANGES[rangeIdx];

  const filtered = range.days === 0 ? data : data.slice(-range.days);
  const avg = filtered.length > 0
    ? filtered.reduce((s, d) => s + Number(d.avg_price), 0) / filtered.length
    : 0;

  const chartData = filtered.map((d) => ({
    date: formatDate(d.recorded_date),
    fullDate: d.recorded_date,
    avg: Number(d.avg_price),
    min: Number(d.min_price),
    max: Number(d.max_price),
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
        NO DATA AVAILABLE
      </div>
    );
  }

  const lastPrice = chartData[chartData.length - 1]?.avg ?? 0;
  const firstPrice = chartData[0]?.avg ?? 0;
  const isUp = lastPrice >= firstPrice;

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-4">
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-mono text-sm text-text-secondary uppercase tracking-wide">
              MSW Price Index
            </h3>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-2xl font-bold font-mono text-text-primary">
                ${lastPrice.toFixed(2)}
              </span>
              <span
                className={`text-sm font-mono ${isUp ? "text-neon-red" : "text-neon-green"}`}
              >
                {isUp ? "▲" : "▼"}{" "}
                {Math.abs(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex gap-0.5">
            {RANGES.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setRangeIdx(i)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  i === rangeIdx
                    ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                    : "text-text-muted hover:text-text-secondary hover:bg-surface-light"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={compact ? 200 : 350}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isUp ? "#ff1744" : "#00e676"}
                stopOpacity={0.3}
              />
              <stop
                offset="100%"
                stopColor={isUp ? "#ff1744" : "#00e676"}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00b0ff" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#00b0ff" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#e1e7ef",
            }}
            formatter={(value, name) => [
              `$${Number(value).toFixed(2)}/kg`,
              name === "avg" ? "AVG" : name === "min" ? "LOW" : "HIGH",
            ]}
            labelStyle={{ color: "#4a5568" }}
          />
          {!compact && (
            <ReferenceLine
              y={avg}
              stroke="#4a5568"
              strokeDasharray="3 3"
              label={{
                value: `AVG $${avg.toFixed(2)}`,
                position: "right",
                fill: "#4a5568",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />
          )}
          {!compact && (
            <Area
              type="monotone"
              dataKey="max"
              stroke="transparent"
              fill="url(#rangeGradient)"
              fillOpacity={1}
            />
          )}
          <Area
            type="monotone"
            dataKey="avg"
            stroke={isUp ? "#ff1744" : "#00e676"}
            strokeWidth={2}
            fill="url(#priceGradient)"
            fillOpacity={1}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
