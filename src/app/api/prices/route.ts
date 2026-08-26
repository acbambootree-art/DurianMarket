import { NextRequest, NextResponse } from "next/server";
import { getDailyAverages, getLatestPrices, upsertPrice } from "@/lib/prices";
import { isAuthorized } from "@/lib/auth";
import { appendPriceEntries, BlobPriceEntry } from "@/lib/blob-store";
import { SELLER_LIST } from "@/lib/seller-list";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "latest";
    const days = parseInt(searchParams.get("days") ?? "30", 10);

    if (type === "averages") {
      const averages = await getDailyAverages(days);
      return NextResponse.json(averages);
    }

    const prices = await getLatestPrices();
    return NextResponse.json(prices);
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, entries } = body as {
      password: string;
      entries: { seller_id: number; price_per_kg: number; recorded_date: string; notes?: string }[];
    };

    if (!isAuthorized(password)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "No entries provided" }, { status: 400 });
    }

    for (const entry of entries) {
      if (!entry.seller_id || !entry.price_per_kg || !entry.recorded_date) {
        return NextResponse.json({ error: "Each entry needs seller_id, price_per_kg, recorded_date" }, { status: 400 });
      }
    }

    // Write to Blob — the store pages actually read (Blob > Postgres > sample)
    const blobEntries: BlobPriceEntry[] = entries.flatMap((entry) => {
      const seller = SELLER_LIST.find((s) => s.id === entry.seller_id);
      if (!seller) return [];
      return [{
        seller_id: entry.seller_id,
        seller_name: seller.name,
        seller_slug: seller.slug,
        website_url: seller.url,
        price_per_kg: entry.price_per_kg,
        recorded_date: entry.recorded_date,
        method: "manual",
        confidence: "high",
        notes: entry.notes,
      }];
    });

    const saved = await appendPriceEntries(blobEntries);

    // Fallback to Postgres only when Blob isn't configured
    if (saved === 0 && process.env.DATABASE_URL) {
      for (const entry of entries) {
        await upsertPrice(entry.seller_id, entry.price_per_kg, entry.recorded_date, entry.notes);
      }
    }

    return NextResponse.json({ success: true, count: saved || entries.length });
  } catch {
    return NextResponse.json({ error: "Failed to save prices" }, { status: 500 });
  }
}
