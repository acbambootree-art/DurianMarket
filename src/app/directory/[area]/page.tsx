import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArea,
  getAreas,
  getSellersByArea,
  trackedPriceSlug,
  DirectoryEntry,
} from "@/lib/directory";
import { fetchLatestPrices } from "@/lib/data";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAreas().map((a) => ({ area: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  const isDelivery = area.region === "Islandwide";
  const title = isDelivery
    ? `Durian Delivery Singapore - ${area.count} Sellers Compared | DurianMarket`
    : `Durian in ${area.area} - ${area.count} Seller${area.count > 1 ? "s" : ""}, Addresses & Prices | DurianMarket`;
  const description = isDelivery
    ? `Compare ${area.count} durian delivery services in Singapore — Musang King prices, ordering links, and who delivers islandwide.`
    : `Where to buy durian in ${area.area}, Singapore. ${area.count} verified durian seller${area.count > 1 ? "s" : ""} with addresses, opening hours, contact numbers, and live Musang King prices.`;
  return {
    title,
    description,
    alternates: { canonical: `/directory/${slug}` },
    openGraph: { title, description, type: "website" },
  };
}

function mapsUrl(e: DirectoryEntry): string {
  const q = encodeURIComponent(`${e.name} ${e.address} Singapore ${e.postal ?? ""}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function jsonLd(entries: DirectoryEntry[], areaName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Durian sellers in ${areaName}, Singapore`,
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "FoodEstablishment",
        name: e.name,
        servesCuisine: "Durian",
        description: e.description,
        ...(e.url ? { url: e.url } : {}),
        ...(e.phone ? { telephone: e.phone } : {}),
        ...(e.address
          ? {
              address: {
                "@type": "PostalAddress",
                streetAddress: e.address,
                addressLocality: "Singapore",
                addressCountry: "SG",
                ...(e.postal ? { postalCode: e.postal } : {}),
              },
            }
          : {}),
      },
    })),
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const sellers = getSellersByArea(slug);
  const latestPrices = await fetchLatestPrices();
  const priceBySlug = new Map(latestPrices.map((p) => [p.seller_slug, Number(p.price_per_kg)]));
  const otherAreas = getAreas().filter((a) => a.slug !== slug);
  const isDelivery = area.region === "Islandwide";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(sellers, area.area)) }}
      />

      <div className="mb-6">
        <div className="text-[10px] font-mono text-text-muted mb-2">
          <Link href="/directory" className="hover:text-neon-green">
            DIRECTORY
          </Link>{" "}
          / {area.area.toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold font-mono text-text-primary">
          {isDelivery ? "Durian Delivery in Singapore" : `Durian in ${area.area}`}
        </h1>
        <p className="text-xs font-mono text-text-muted mt-1">
          {sellers.length} VERIFIED SELLER{sellers.length > 1 ? "S" : ""} &bull;{" "}
          {area.region.toUpperCase()} {isDelivery ? "" : "SINGAPORE"}
        </p>
        <p className="text-sm text-text-secondary mt-3 max-w-2xl">
          {isDelivery
            ? "These sellers deliver durian across Singapore — order online and get Musang King at your door. Prices below are tracked daily where available."
            : `Verified durian sellers in ${area.area} with addresses, contact details, and opening hours. Sellers we track daily show their latest Musang King price per kg.`}
        </p>
      </div>

      <div className="space-y-3">
        {sellers.map((e) => {
          const priceSlug = trackedPriceSlug(e);
          const price = priceSlug ? priceBySlug.get(priceSlug) : undefined;
          return (
            <div
              key={e.slug}
              className="bg-surface rounded-lg border border-surface-border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-base text-text-primary">{e.name}</h2>
                  <p className="text-sm text-text-secondary mt-1">{e.description}</p>
                </div>
                {price !== undefined && (
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold font-mono text-neon-green">
                      ${price.toFixed(2)}
                    </div>
                    <div className="text-[9px] font-mono text-text-muted">MSW $/KG TODAY</div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-mono text-text-muted">
                {e.address && (
                  <a
                    href={mapsUrl(e)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neon-blue"
                  >
                    📍 {e.address}
                    {e.postal ? `, S${e.postal}` : ""}
                  </a>
                )}
                {e.deliveryOnly && <span>🛵 DELIVERY ONLY</span>}
                {e.hours && <span>🕐 {e.hours}</span>}
                {e.phone && (
                  <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="hover:text-neon-blue">
                    📞 {e.phone}
                  </a>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                {e.url && (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue/70 hover:text-neon-blue"
                  >
                    VISIT &#8599;
                  </a>
                )}
                {priceSlug && (
                  <Link href="/sellers" className="text-neon-green/70 hover:text-neon-green">
                    PRICE HISTORY &#8599;
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-3 border-b border-surface-border pb-2">
          Durian in other areas
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherAreas.map((a) => (
            <Link
              key={a.slug}
              href={`/directory/${a.slug}`}
              className="text-xs font-mono px-2.5 py-1.5 bg-surface border border-surface-border rounded hover:border-neon-green/40 hover:text-neon-green text-text-secondary transition-colors"
            >
              {a.area} ({a.count})
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
