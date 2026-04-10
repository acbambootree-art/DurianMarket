import * as cheerio from "cheerio";

// Reasonable per-kg price range for whole Musang King in Singapore (SGD)
const MIN_REASONABLE_PER_KG = 12;
const MAX_REASONABLE_PER_KG = 50;

// Extract price from JSON-LD structured data — returns {price, context} for normalization
export function extractFromJsonLd(html: string): { price: number; context: string } | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const data = JSON.parse($(scripts[i]).html() || "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"] === "Offer") {
          const name = (item.name || "").toLowerCase();
          if (isMswProduct(name)) {
            const offer = item.offers || item;
            const offerList = Array.isArray(offer) ? offer : [offer];
            for (const o of offerList) {
              const price = parseFloat(o.price || o.lowPrice || "0");
              if (price > 0) {
                const context = `${name} ${item.description || ""}`;
                return { price, context };
              }
            }
          }
        }
      }
    } catch {
      // invalid JSON-LD, skip
    }
  }
  return null;
}

// Is a product name about Musang King whole durian (not cake, pulp, puree, dehusked)?
export function isMswProduct(text: string): boolean {
  const lower = text.toLowerCase();
  const hasMsw =
    lower.includes("musang") ||
    lower.includes("mao shan") ||
    lower.includes("msw") ||
    lower.includes("d197");
  if (!hasMsw) return false;

  // Exclude non-whole products
  const excludes = /cake|puff|puree|paste|mochi|swiss|crepe|ice ?cream|pancake|macaron|tart/i;
  if (excludes.test(lower)) return false;

  return true;
}

// Extract price from HTML using multiple strategies
export function extractFromHtml(html: string): { price: number; context: string } | null {
  const $ = cheerio.load(html);

  // Find all elements that mention MSW
  const results: { price: number; context: string }[] = [];

  $("*").each((_, el) => {
    const text = $(el).text();
    if (text.length > 500) return; // skip large containers
    if (!isMswProduct(text)) return;

    // Look for price in this element or nearby
    const priceMatches = text.match(/\$\s*(\d+(?:\.\d{1,2})?)/g);
    if (priceMatches) {
      for (const match of priceMatches) {
        const price = parseFloat(match.replace(/[$\s]/g, ""));
        if (price >= 5 && price <= 500) {
          results.push({ price, context: text });
        }
      }
    }
  });

  if (results.length === 0) return null;

  // Prefer the smallest price (usually the base variant)
  results.sort((a, b) => a.price - b.price);
  return results[0];
}

// Extract price using regex as last resort
export function extractWithRegex(html: string): { price: number; context: string } | null {
  const pattern = /(?:musang\s*king|mao\s*shan\s*wang|\bmsw\b|d197)([^]{0,300}?)\$\s*(\d+(?:\.\d{1,2})?)/i;
  const match = html.match(pattern);
  if (match) {
    const price = parseFloat(match[2]);
    const context = match[0];
    if (!isMswProduct(context)) return null;
    if (price >= 5 && price <= 500) return { price, context };
  }
  return null;
}

// Normalize a price + context to per-kg
// Returns null if we can't confidently convert
export function normalizeToPerKg(price: number, context: string): number | null {
  const lower = context.toLowerCase();

  // Explicit per-kg or per-kilogram
  if (/per\s*kg|\/\s*kg|\bkg\b(?!\w)/i.test(lower)) {
    // It's per-kg price. Verify range.
    if (price >= MIN_REASONABLE_PER_KG && price <= MAX_REASONABLE_PER_KG) return price;
    // If a per-kg price is outside the range, it's suspicious
    return null;
  }

  // Weight-based conversion (look for explicit gram values)
  const gramMatch = lower.match(/(\d{3,4})\s*g(?:ram)?(?!\w)/);
  if (gramMatch) {
    const grams = parseInt(gramMatch[1]);
    if (grams >= 200 && grams <= 3000) {
      const perKg = (price / grams) * 1000;
      if (perKg >= MIN_REASONABLE_PER_KG && perKg <= MAX_REASONABLE_PER_KG) return perKg;
      return null;
    }
  }

  // Weight-based conversion (kg)
  const kgMatch = lower.match(/(\d+(?:\.\d+)?)\s*kg/);
  if (kgMatch) {
    const kg = parseFloat(kgMatch[1]);
    if (kg >= 0.2 && kg <= 5) {
      const perKg = price / kg;
      if (perKg >= MIN_REASONABLE_PER_KG && perKg <= MAX_REASONABLE_PER_KG) return perKg;
      return null;
    }
  }

  // No explicit weight — use heuristics based on price range
  // Typical per-kg range
  if (price >= MIN_REASONABLE_PER_KG && price <= MAX_REASONABLE_PER_KG) return price;

  // If no weight and price is outside reasonable per-kg range, we can't confidently normalize.
  // Don't guess — return null and let caller know extraction failed.
  return null;
}

// Validate a scraped price is reasonable
export function isValidPrice(price: number | null, lastKnownPrice?: number): price is number {
  if (price === null) return false;
  if (price < MIN_REASONABLE_PER_KG || price > MAX_REASONABLE_PER_KG) return false;
  if (lastKnownPrice && Math.abs(price - lastKnownPrice) / lastKnownPrice > 0.5) {
    return false;
  }
  return true;
}
