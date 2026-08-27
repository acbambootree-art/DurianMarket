import fs from "fs";
import path from "path";
import { marked } from "marked";

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  draft: boolean;
  html: string;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

// ponytail: minimal key:value frontmatter parser — swap for gray-matter if we ever need nesting
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2] };
}

export function getArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8");
      const { meta, body } = parseFrontmatter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: meta.title ?? f,
        description: meta.description ?? "",
        date: meta.date ?? "",
        draft: meta.draft === "true",
        html: marked.parse(body, { async: false }),
      };
    })
    .filter((a) => !a.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}
