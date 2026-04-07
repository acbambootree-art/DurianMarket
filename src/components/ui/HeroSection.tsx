"use client";

export default function HeroSection({
  avgPrice,
  dayChange,
  dayChangePct,
  sellerCount,
}: {
  avgPrice: number;
  dayChange: number;
  dayChangePct: number;
  sellerCount: number;
}) {
  const isDown = dayChange < 0;
  const isUp = dayChange > 0;

  return (
    <section className="relative h-[420px] overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Live badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neon-green">
            Live Market Data
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-text-primary mb-2 tracking-tight">
          DURIAN<span className="text-neon-green">MKT</span>
        </h1>
        <p className="text-sm font-mono text-text-secondary mb-8 max-w-md">
          Singapore Musang King Price Index &mdash; tracking {sellerCount} sellers daily
        </p>

        {/* Price display */}
        <div className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-lg px-8 py-5 glow-green">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2">
            MSW/SGD Market Average
          </div>
          <div className="flex items-baseline justify-center gap-4">
            <span className="text-5xl md:text-6xl font-bold font-mono text-neon-green">
              ${avgPrice.toFixed(2)}
            </span>
            <div className="text-left">
              <div
                className={`text-lg font-mono font-bold ${
                  isUp ? "text-neon-red" : isDown ? "text-neon-green" : "text-text-muted"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
                {dayChange > 0 ? "+" : ""}
                {dayChange.toFixed(2)}
              </div>
              <div
                className={`text-xs font-mono ${
                  isUp ? "text-neon-red/70" : isDown ? "text-neon-green/70" : "text-text-muted"
                }`}
              >
                {dayChangePct > 0 ? "+" : ""}
                {dayChangePct.toFixed(2)}% today
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-3 tracking-wide">
            PER KILOGRAM &bull; UPDATED DAILY &bull; {sellerCount} SOURCES
          </div>
        </div>
      </div>
    </section>
  );
}
