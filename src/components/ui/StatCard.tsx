export default function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  const isUp = sub?.startsWith("+");
  const isDown = sub?.startsWith("$-") || sub?.startsWith("-");

  return (
    <div
      className={`rounded-lg p-4 border ${
        accent
          ? "bg-neon-green/5 border-neon-green/30 glow-green"
          : "bg-surface border-surface-border"
      }`}
    >
      <div className="text-[10px] font-mono font-medium uppercase tracking-widest text-text-muted">
        {label}
      </div>
      <div
        className={`text-2xl font-bold font-mono mt-1 ${
          accent ? "text-neon-green" : "text-text-primary"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div
          className={`text-xs font-mono mt-1 ${
            isUp
              ? "text-neon-red"
              : isDown
                ? "text-neon-green"
                : "text-text-secondary"
          }`}
        >
          {isUp ? "▲ " : isDown ? "▼ " : ""}
          {sub}
        </div>
      )}
    </div>
  );
}
