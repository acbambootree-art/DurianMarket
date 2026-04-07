import { getDb, Seller } from "./db";

export async function getAllSellers(): Promise<Seller[]> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM sellers WHERE is_active = true ORDER BY name`;
  return rows as Seller[];
}

export async function getSellerBySlug(slug: string): Promise<Seller | null> {
  const sql = getDb();
  const rows = await sql`SELECT * FROM sellers WHERE slug = ${slug} LIMIT 1`;
  return (rows[0] as Seller) ?? null;
}
