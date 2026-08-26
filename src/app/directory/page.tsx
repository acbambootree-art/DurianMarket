import Link from "next/link";
import { DIRECTORY, getAreas, Region } from "@/lib/directory";

export const metadata = {
  title: "Durian Directory Singapore - Every Durian Seller by Area | DurianMarket",
  description:
    "The complete directory of durian sellers in Singapore, organised by neighbourhood — Geylang, Balestier, Whampoa, Sengkang, Bukit Timah and more. Addresses, opening hours, and live Musang King prices.",
  alternates: { canonical: "/directory" },
};

const REGION_ORDER: Region[] = ["Central", "East", "Northeast", "North", "West", "Islandwide"];

export default function DirectoryPage() {
  const areas = getAreas();
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    areas: areas.filter((a) => a.region === region).sort((a, b) => a.area.localeCompare(b.area)),
  })).filter((g) => g.areas.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          Singapore Durian Directory
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          {DIRECTORY.length} SELLERS &bull; {areas.length} AREAS &bull; UPDATED AUG 2026
        </p>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          Every durian stall, shop, and delivery service in Singapore, organised by
          neighbourhood. Pick your area to see who&apos;s selling near you, where to find
          them, and how their Musang King prices compare.
        </p>
      </div>

      <div className="space-y-8">
        {byRegion.map(({ region, areas }) => (
          <section key={region}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3 border-b border-surface-border pb-2">
              {region === "Islandwide" ? "Islandwide Delivery" : `${region} Singapore`}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {areas.map((a) => (
                <Link
                  key={a.slug}
                  href={`/directory/${a.slug}`}
                  className="bg-surface rounded-lg border border-surface-border p-3 hover:border-neon-green/40 hover:bg-surface-light transition-colors group"
                >
                  <div className="font-medium text-sm text-text-primary group-hover:text-neon-green transition-colors">
                    {a.area}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted mt-0.5">
                    {a.count} SELLER{a.count > 1 ? "S" : ""}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
