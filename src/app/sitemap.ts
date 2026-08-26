import type { MetadataRoute } from "next";
import { getAreas } from "@/lib/directory";

const BASE = "https://durianmarket.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/trends", "/insights", "/news", "/sellers", "/directory"].map(
    (path) => ({
      url: `${BASE}${path}`,
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );
  const areaPages = getAreas().map((a) => ({
    url: `${BASE}/directory/${a.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...areaPages];
}
