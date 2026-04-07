import { neon } from "@neondatabase/serverless";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(databaseUrl);
}

export type Seller = {
  id: number;
  name: string;
  slug: string;
  website_url: string;
  is_active: boolean;
  created_at: string;
};

export type PriceEntry = {
  id: number;
  seller_id: number;
  price_per_kg: number;
  recorded_date: string;
  notes: string | null;
  created_at: string;
};

export type PriceWithSeller = PriceEntry & {
  seller_name: string;
  seller_slug: string;
  website_url: string;
};

export type DailyAverage = {
  recorded_date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  seller_count: number;
};
