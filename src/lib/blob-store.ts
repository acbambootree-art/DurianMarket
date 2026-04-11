// Blob-based price persistence — uses Vercel Blob storage as a simple JSON store
// Stores a single file with all historical scraped prices
import { put, head } from "@vercel/blob";
import { SELLER_LIST } from "./seller-list";

const BLOB_KEY = "prices/history.json";

export type BlobPriceEntry = {
  seller_id: number;
  seller_name: string;
  seller_slug: string;
  website_url: string;
  price_per_kg: number;
  recorded_date: string; // YYYY-MM-DD
  method: string;
  confidence: string;
  notes?: string;
};

export type BlobStore = {
  last_updated: string;
  entries: BlobPriceEntry[];
};

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function loadPriceHistory(): Promise<BlobStore | null> {
  if (!hasBlobToken()) return null;

  try {
    const info = await head(BLOB_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!info?.url) return null;

    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;

    const data = await res.json();
    return data as BlobStore;
  } catch {
    return null;
  }
}

export async function savePriceHistory(store: BlobStore): Promise<boolean> {
  if (!hasBlobToken()) return false;

  try {
    await put(BLOB_KEY, JSON.stringify(store), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return true;
  } catch {
    return false;
  }
}

export async function appendPriceEntries(newEntries: BlobPriceEntry[]): Promise<number> {
  const existing = (await loadPriceHistory()) || {
    last_updated: new Date().toISOString(),
    entries: [],
  };

  // Remove existing entries for same (seller_id, recorded_date) combos
  const keysToReplace = new Set(
    newEntries.map((e) => `${e.seller_id}-${e.recorded_date}`)
  );
  const filtered = existing.entries.filter(
    (e) => !keysToReplace.has(`${e.seller_id}-${e.recorded_date}`)
  );

  // Self-healing: prune entries for sellers/slugs no longer in the registry
  const validSlugs = new Set<string>(SELLER_LIST.map((s) => s.slug));
  const pruned = filtered.filter((e) => validSlugs.has(e.seller_slug));

  // Add new entries
  const merged: BlobStore = {
    last_updated: new Date().toISOString(),
    entries: [...pruned, ...newEntries].sort((a, b) =>
      a.recorded_date.localeCompare(b.recorded_date)
    ),
  };

  // Keep only last 365 days to prevent unbounded growth
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 365);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  merged.entries = merged.entries.filter((e) => e.recorded_date >= cutoffStr);

  const success = await savePriceHistory(merged);
  return success ? newEntries.length : 0;
}
