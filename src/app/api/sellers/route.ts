import { NextResponse } from "next/server";
import { getAllSellers } from "@/lib/sellers";

export async function GET() {
  try {
    const sellers = await getAllSellers();
    return NextResponse.json(sellers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
