"use client";

import { useState, useEffect } from "react";

type Seller = {
  id: number;
  name: string;
  slug: string;
  website_url: string;
};

// Import from central seller list
import { SELLER_LIST } from "@/lib/seller-list";

const DEFAULT_SELLERS: Seller[] = SELLER_LIST.map((s) => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  website_url: s.url,
}));

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sellers] = useState<Seller[]>(DEFAULT_SELLERS);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved) setIsAuthenticated(true);
  }, []);

  function handleLogin() {
    setIsAuthenticated(true);
    sessionStorage.setItem("admin_auth", "1");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const entries = sellers
      .filter((s) => prices[s.id] && parseFloat(prices[s.id]) > 0)
      .map((s) => ({
        seller_id: s.id,
        price_per_kg: parseFloat(prices[s.id]),
        recorded_date: date,
        notes: notes[s.id] || undefined,
      }));

    if (entries.length === 0) {
      setStatus({ type: "error", message: "Enter at least one price" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, entries }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus({
          type: "success",
          message: `Saved ${data.count} prices for ${date}`,
        });
        setPrices({});
        setNotes({});
      } else {
        const err = await res.json();
        setStatus({ type: "error", message: err.error || "Failed to save" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    }
    setSubmitting(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-surface rounded-lg border border-surface-border p-6">
          <h1 className="text-lg font-bold font-mono text-text-primary mb-4">ADMIN ACCESS</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-3 py-2 bg-surface-light border border-surface-border rounded-lg font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-neon-green/50"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-neon-green/10 text-neon-green border border-neon-green/30 py-2 rounded-lg font-mono font-medium hover:bg-neon-green/20 transition-colors"
            >
              AUTHENTICATE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold font-mono text-text-primary mb-1">Price Entry</h1>
      <p className="text-xs font-mono text-text-muted mb-6">
        ENTER DAILY MSW PRICES FROM EACH SELLER
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-surface-light border border-surface-border rounded-lg font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-neon-green/50"
          />
        </div>

        <div className="bg-surface rounded-lg border border-surface-border overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-surface-border text-[10px] font-mono uppercase tracking-widest text-text-muted">
            Prices (SGD/kg)
          </div>
          <div className="divide-y divide-surface-border">
            {sellers.map((seller) => (
              <div key={seller.id} className="px-4 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium text-sm text-text-primary">
                    {seller.name}
                  </div>
                  <a
                    href={seller.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-neon-blue/70 hover:text-neon-blue"
                  >
                    {seller.website_url.replace("https://", "").replace("www.", "")}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={prices[seller.id] || ""}
                    onChange={(e) =>
                      setPrices((prev) => ({ ...prev, [seller.id]: e.target.value }))
                    }
                    className="w-24 px-2 py-1.5 bg-surface-light border border-surface-border rounded text-right font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-neon-green/50"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={notes[seller.id] || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [seller.id]: e.target.value }))
                    }
                    className="w-32 px-2 py-1.5 bg-surface-light border border-surface-border rounded text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-neon-green/50 hidden sm:block"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm font-mono ${
              status.type === "success"
                ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                : "bg-neon-red/10 text-neon-red border border-neon-red/30"
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-neon-green/10 text-neon-green border border-neon-green/30 py-3 rounded-lg font-mono font-semibold text-base hover:bg-neon-green/20 transition-colors disabled:opacity-50"
        >
          {submitting ? "SAVING..." : "SUBMIT PRICES"}
        </button>
      </form>
    </div>
  );
}
