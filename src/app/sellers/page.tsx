import { fetchLatestPrices } from "@/lib/data";

export const revalidate = 300;

export const metadata = {
  title: "Seller Rankings - DurianMarket",
  description: "Compare Musang King durian prices across Singapore sellers",
};

function getSignal(pctDiff: number, isCheapest: boolean, isExpensive: boolean) {
  if (isCheapest) return { label: "BUY", color: "text-neon-green" };
  if (isExpensive) return { label: "HIGH", color: "text-neon-red" };
  if (pctDiff < -5) return { label: "LOW", color: "text-neon-green" };
  if (pctDiff > 5) return { label: "HOLD", color: "text-neon-amber" };
  return { label: "—", color: "text-text-muted" };
}

export default async function SellersPage() {
  const latestPrices = await fetchLatestPrices();

  const overallAvg =
    latestPrices.length > 0
      ? latestPrices.reduce((s, p) => s + Number(p.price_per_kg), 0) / latestPrices.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          Seller Rankings
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          {latestPrices.length} SELLERS &bull; RANKED BY PRICE &bull; AVG ${overallAvg.toFixed(2)}/KG
        </p>
      </div>

      {latestPrices.length > 0 ? (
        <>
          {/* Mobile: card layout */}
          <div className="md:hidden space-y-2">
            {latestPrices.map((price, i) => {
              const priceNum = Number(price.price_per_kg);
              const diff = priceNum - overallAvg;
              const pctDiff = (diff / overallAvg) * 100;
              const isCheapest = i === 0;
              const isExpensive = i === latestPrices.length - 1;
              const signal = getSignal(pctDiff, isCheapest, isExpensive);

              return (
                <div
                  key={price.id}
                  className={`bg-surface rounded-lg border border-surface-border p-3 ${
                    isCheapest ? "border-neon-green/30 bg-neon-green/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono text-text-muted w-5 shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-text-primary truncate">
                            {price.seller_name}
                          </span>
                          {isCheapest && (
                            <span className="text-[9px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/30 px-1 py-0.5 rounded shrink-0">
                              BEST
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-lg font-bold font-mono text-neon-green">
                        ${priceNum.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 ml-7">
                    <span
                      className={`text-xs font-mono ${
                        diff < 0 ? "text-neon-green" : diff > 0 ? "text-neon-red" : "text-text-muted"
                      }`}
                    >
                      {diff !== 0
                        ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)} (${pctDiff > 0 ? "+" : ""}${pctDiff.toFixed(0)}%)`
                        : "avg"}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${signal.color}`}>
                        {signal.label}
                      </span>
                      <a
                        href={price.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-neon-blue/70"
                      >
                        VISIT &#8599;
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden md:block bg-surface rounded-lg border border-surface-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-text-muted border-b border-surface-border">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3 text-right">Price/kg</th>
                  <th className="px-4 py-3 text-right">vs Avg</th>
                  <th className="px-4 py-3 text-center">Signal</th>
                  <th className="px-4 py-3">Link</th>
                </tr>
              </thead>
              <tbody>
                {latestPrices.map((price, i) => {
                  const priceNum = Number(price.price_per_kg);
                  const diff = priceNum - overallAvg;
                  const pctDiff = (diff / overallAvg) * 100;
                  const isCheapest = i === 0;
                  const isExpensive = i === latestPrices.length - 1;
                  const signal = getSignal(pctDiff, isCheapest, isExpensive);

                  return (
                    <tr
                      key={price.id}
                      className={`border-t border-surface-border hover:bg-surface-light transition-colors ${
                        isCheapest ? "bg-neon-green/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-sm text-text-muted">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-sm text-text-primary">
                          {price.seller_name}
                        </span>
                        {isCheapest && (
                          <span className="ml-2 text-[10px] font-mono bg-neon-green/10 text-neon-green border border-neon-green/30 px-1.5 py-0.5 rounded">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-bold font-mono text-lg text-neon-green">
                        ${priceNum.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right text-sm font-mono ${
                          diff < 0
                            ? "text-neon-green"
                            : diff > 0
                              ? "text-neon-red"
                              : "text-text-muted"
                        }`}
                      >
                        {diff !== 0
                          ? `${diff > 0 ? "+" : ""}${diff.toFixed(2)} (${pctDiff > 0 ? "+" : ""}${pctDiff.toFixed(0)}%)`
                          : "—"}
                      </td>
                      <td className={`px-4 py-3 text-center font-mono text-sm font-bold ${signal.color}`}>
                        {signal.label}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={price.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-neon-blue/70 hover:text-neon-blue"
                        >
                          VISIT &#8599;
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-2 border-t border-surface-border text-[10px] font-mono text-text-muted">
              MKT AVG: ${overallAvg.toFixed(2)}/kg &bull; DATE:{" "}
              {latestPrices[0]?.recorded_date ?? "—"} &bull; ALL PRICES IN SGD
            </div>
          </div>
        </>
      ) : (
        <div className="bg-surface rounded-lg border border-surface-border p-8 text-center text-text-muted font-mono text-sm">
          NO DATA AVAILABLE
        </div>
      )}
    </div>
  );
}
