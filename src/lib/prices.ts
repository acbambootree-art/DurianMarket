import { getDb, PriceWithSeller, DailyAverage } from "./db";

export async function getLatestPrices(): Promise<PriceWithSeller[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT p.*, s.name as seller_name, s.slug as seller_slug, s.website_url
    FROM prices p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.recorded_date = (SELECT MAX(recorded_date) FROM prices)
    ORDER BY p.price_per_kg ASC
  `;
  return rows as PriceWithSeller[];
}

export async function getDailyAverages(days: number = 30): Promise<DailyAverage[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      recorded_date,
      ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
      MIN(price_per_kg) as min_price,
      MAX(price_per_kg) as max_price,
      COUNT(DISTINCT seller_id)::int as seller_count
    FROM prices
    WHERE recorded_date >= CURRENT_DATE - ${days}
    GROUP BY recorded_date
    ORDER BY recorded_date ASC
  `;
  return rows as DailyAverage[];
}

export async function getPricesBySeller(days: number = 30): Promise<PriceWithSeller[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT p.*, s.name as seller_name, s.slug as seller_slug, s.website_url
    FROM prices p
    JOIN sellers s ON s.id = p.seller_id
    WHERE p.recorded_date >= CURRENT_DATE - ${days}
    ORDER BY p.recorded_date ASC, s.name ASC
  `;
  return rows as PriceWithSeller[];
}

export async function getAllPrices(): Promise<PriceWithSeller[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT p.*, s.name as seller_name, s.slug as seller_slug, s.website_url
    FROM prices p
    JOIN sellers s ON s.id = p.seller_id
    ORDER BY p.recorded_date ASC, s.name ASC
  `;
  return rows as PriceWithSeller[];
}

export async function getMonthlyAverages(): Promise<{ month: number; avg_price: number; entry_count: number }[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT
      EXTRACT(MONTH FROM recorded_date)::int as month,
      ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
      COUNT(*)::int as entry_count
    FROM prices
    GROUP BY EXTRACT(MONTH FROM recorded_date)
    ORDER BY month
  `;
  return rows as { month: number; avg_price: number; entry_count: number }[];
}

export async function upsertPrice(
  sellerId: number,
  pricePerKg: number,
  recordedDate: string,
  notes?: string
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO prices (seller_id, price_per_kg, recorded_date, notes)
    VALUES (${sellerId}, ${pricePerKg}, ${recordedDate}, ${notes ?? null})
    ON CONFLICT (seller_id, recorded_date)
    DO UPDATE SET price_per_kg = ${pricePerKg}, notes = ${notes ?? null}
  `;
}
