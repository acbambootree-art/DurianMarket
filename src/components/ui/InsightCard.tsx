import { Insight } from "@/lib/insights";

const sentimentConfig = {
  positive: {
    border: "border-l-neon-green",
    bg: "bg-neon-green/5",
    icon: "▲",
    iconColor: "text-neon-green",
  },
  neutral: {
    border: "border-l-neon-blue",
    bg: "bg-neon-blue/5",
    icon: "◆",
    iconColor: "text-neon-blue",
  },
  warning: {
    border: "border-l-neon-red",
    bg: "bg-neon-red/5",
    icon: "▼",
    iconColor: "text-neon-red",
  },
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const config = sentimentConfig[insight.sentiment];

  return (
    <div
      className={`rounded-lg border-l-2 border border-surface-border p-4 ${config.border} ${config.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-mono text-sm ${config.iconColor}`}>
              {config.icon}
            </span>
            <h3 className="font-medium text-sm text-text-primary font-mono">
              {insight.title}
            </h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {insight.description}
          </p>
        </div>
        {insight.value && (
          <div
            className={`text-lg font-bold font-mono whitespace-nowrap ${config.iconColor}`}
          >
            {insight.value}
          </div>
        )}
      </div>
    </div>
  );
}
