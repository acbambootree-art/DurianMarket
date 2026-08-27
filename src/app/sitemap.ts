import type { MetadataRoute } from "next";
import { getAreas } from "@/lib/directory";
import { getArticles } from "@/lib/articles";

const BASE = "https://durianmarket.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/trends", "/insights", "/news", "/sellers", "/directory", "/guides"].map(
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
  const guidePages = getArticles().map((a) => ({
    url: `${BASE}/guides/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...areaPages, ...guidePages];
}
