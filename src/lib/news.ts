// Durian news — polls SG/MY publisher RSS feeds directly (no aggregator ToS issues),
// filters for durian coverage, and accumulates matches in Vercel Blob since durian
// news is bursty and rolls out of general feeds quickly.
import * as cheerio from "cheerio";
import { put, head } from "@vercel/blob";

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string; // ISO string
};

const FEEDS: { url: string; source: string }[] = [
  { url: "https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml", source: "CNA" },
  { url: "https://mothership.sg/feed/", source: "Mothership" },
  { url: "https://theindependent.sg/feed/", source: "The Independent SG" },
  { url: "https://www.straitstimes.com/news/singapore/rss.xml", source: "The Straits Times" },
  { url: "https://stomp.straitstimes.com/rss", source: "Stomp" },
  { url: "https://www.malaymail.com/feed/rss/malaysia", source: "Malay Mail" },
  { url: "https://eatbook.sg/feed/", source: "EatBook" },
];

// Recent durian coverage with direct publisher links, so the page isn't empty
// while the feed-watcher accumulates new stories.
const SEED_ITEMS: NewsItem[] = [
  {
    title: "'If you want to eat durians, don't wait for the price to drop; durians don't wait for you': Singapore sellers say prices are rising again",
    link: "https://theindependent.sg/if-you-want-to-eat-durians-don-t-wait-for-the-price-to-drop-durians-don-t-wait-for-you-singapore-sellers-say-prices-are-rising-again/",
    source: "The Independent SG",
    pubDate: "2026-07-15T00:00:00.000Z",
  },
  {
    title: "In Singapore, 'durian tsunami' won't last long as prices rise and wave ebbs",
    link: "https://www.scmp.com/news/asia/southeast-asia/article/3360478/singapore-durian-tsunami-wont-last-long-prices-rise-and-wave-ebbs",
    source: "South China Morning Post",
    pubDate: "2026-07-14T00:00:00.000Z",
  },
  {
    title: "Love durians? Be prepared to pay more as prices in Singapore climb, sellers say",
    link: "https://www.asiaone.com/singapore/love-durians-pay-more-again-singapore",
    source: "AsiaOne",
    pubDate: "2026-07-14T00:00:00.000Z",
  },
  {
    title: "PropNex agent, 35, sells up to 200kg of durians per day from parents' Pasir Ris landed home",
    link: "https://mothership.sg/2026/07/propnex-agent-sell-durians-parents-semi-detached-home/",
    source: "Mothership",
    pubDate: "2026-07-10T00:00:00.000Z",
  },
  {
    title: "Durian prices in Singapore drop, but sellers say unlikely to match Malaysia's lows",
    link: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/06/23/durian-prices-in-singapore-drop-but-sellers-say-unlikely-to-match-malaysias-lows",
    source: "The Star",
    pubDate: "2026-06-23T00:00:00.000Z",
  },
  {
    title: "Singapore durian prices: Why they won't match Malaysia's dip",
    link: "https://www.malaymail.com/news/singapore/2026/06/24/singapore-durian-prices-why-they-wont-match-malaysias-dip/224925",
    source: "Malay Mail",
    pubDate: "2026-06-24T00:00:00.000Z",
  },
  {
    title: "Singapore durian fans scramble to enjoy Musang King while decade-low prices last",
    link: "https://e.vnexpress.net/news/business/economy/singapore-durian-fans-scramble-to-enjoy-musang-king-while-decade-low-prices-last-5002796.html",
    source: "VNExpress",
    pubDate: "2026-06-20T00:00:00.000Z",
  },
  {
    title: "'Never seen prices this low': Singapore sees Musang King durian demand surge as Malaysia glut halves prices",
    link: "https://www.malaymail.com/news/singapore/2026/01/06/never-seen-prices-this-low-singapore-sees-musang-king-durian-demand-surge-as-malaysia-glut-halves-prices/204471",
    source: "Malay Mail",
    pubDate: "2026-01-06T00:00:00.000Z",
  },
  {
    title: "Singapore durian vendors slash prices after bumper Musang King harvest in Malaysia",
    link: "https://www.malaymail.com/news/singapore/2025/12/31/singapore-durian-vendors-slash-prices-after-bumper-musang-king-harvest-in-malaysia/203844",
    source: "Malay Mail",
    pubDate: "2025-12-31T00:00:00.000Z",
  },
];

const BLOB_KEY = "news/archive.json";
const MAX_ARCHIVE = 200;

async function loadArchive(): Promise<NewsItem[] | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const info = await head(BLOB_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (!info?.url) return null;
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as NewsItem[];
  } catch {
    return null;
  }
}

async function saveArchive(items: NewsItem[]): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await put(BLOB_KEY, JSON.stringify(items), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch {
    // non-fatal — archive just doesn't grow this round
  }
}

async function fetchFeed(feed: { url: string; source: string }): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const $ = cheerio.load(xml, { xml: true });

    const items: NewsItem[] = [];
    $("item").each((_, el) => {
      const $el = $(el);
      const title = $el.find("title").first().text().trim();
      const description = $el.find("description").first().text();
      if (!/durian/i.test(title) && !/durian/i.test(description)) return;

      const link = $el.find("link").first().text().trim();
      const rawDate = $el.find("pubDate").first().text().trim();
      const parsed = new Date(rawDate);
      const pubDate = isNaN(parsed.getTime())
        ? new Date().toISOString()
        : parsed.toISOString();
      if (title && link) items.push({ title, link, source: feed.source, pubDate });
    });
    return items;
  } catch {
    return [];
  }
}

export async function fetchDurianNews(limit = 20): Promise<NewsItem[]> {
  const [feedResults, archive] = await Promise.all([
    Promise.all(FEEDS.map(fetchFeed)),
    loadArchive(),
  ]);

  const seen = new Set<string>();
  const merged: NewsItem[] = [];
  // fresh feed items first so an updated headline wins over an archived copy
  for (const item of [...feedResults.flat(), ...(archive ?? []), ...SEED_ITEMS]) {
    const key = item.link || item.title;
    if (seen.has(key) || seen.has(item.title)) continue;
    seen.add(key);
    seen.add(item.title);
    merged.push(item);
  }

  merged.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
  const capped = merged.slice(0, MAX_ARCHIVE);

  // persist only when there's something not already archived (first run: archive is null)
  if (capped.length > (archive?.length ?? 0)) await saveArchive(capped);

  return capped.slice(0, limit);
}
