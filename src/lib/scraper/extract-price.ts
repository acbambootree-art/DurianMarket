import * as cheerio from "cheerio";

// Extract price from JSON-LD structured data
export function extractFromJsonLd(html: string): number | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const data = JSON.parse($(scripts[i]).html() || "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"] === "Offer") {
          const offer = item.offers || item;
          const offerList = Array.isArray(offer) ? offer : [offer];
          for (const o of offerList) {
            const name = (item.name || "").toLowerCase();
            if (name.includes("musang") || name.includes("mao shan") || name.includes("msw")) {
              const price = parseFloat(o.price || o.lowPrice || "0");
              if (price > 0) return price;
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

// Extract price from HTML using common CSS patterns
export function extractFromHtml(html: string): number | null {
  const $ = cheerio.load(html);

  // Look for product cards/elements containing "musang king" or "mao shan wang" or "msw"
  const mswKeywords = /musang\s*king|mao\s*shan\s*wang|\bmsw\b|d197/i;
  const pricePattern = /\$\s*(\d+(?:\.\d{2})?)/;

  // Strategy 1: Find elements with MSW text and look for nearby price
  const allText = $("body").text();
  const sections = allText.split(/\n/);
  for (const section of sections) {
    if (mswKeywords.test(section)) {
      const match = section.match(pricePattern);
      if (match) {
        const price = parseFloat(match[1]);
        if (price >= 5 && price <= 100) return price;
      }
    }
  }

  // Strategy 2: Look in common price selectors
  const priceSelectors = [
    ".price", ".product-price", ".woocommerce-Price-amount",
    "[data-price]", ".sale-price", ".current-price",
    ".ProductItem-price", ".product__price",
  ];

  for (const sel of priceSelectors) {
    $(sel).each((_, el) => {
      const text = $(el).text();
      const match = text.match(pricePattern);
      if (match) {
        const price = parseFloat(match[1]);
        if (price >= 5 && price <= 100) return false; // break
      }
    });
  }

  return null;
}

// Extract price using regex as last resort
export function extractWithRegex(html: string): number | null {
  const mswBlock = /(?:musang\s*king|mao\s*shan\s*wang|\bmsw\b|d197)[^]*?\$\s*(\d+(?:\.\d{2})?)/i;
  const match = html.match(mswBlock);
  if (match) {
    const price = parseFloat(match[1]);
    if (price >= 5 && price <= 100) return price;
  }
  return null;
}

// Normalize price to per-kg
// Some sellers sell by pack (e.g. 800g for $X). Detect and convert.
export function normalizeToPerKg(price: number, context: string): number {
  const lower = context.toLowerCase();

  // Check for weight indicators
  if (/400\s*g/i.test(lower)) return price * 2.5;  // 400g -> per kg
  if (/500\s*g/i.test(lower)) return price * 2;    // 500g -> per kg
  if (/600\s*g/i.test(lower)) return price / 0.6;  // 600g -> per kg
  if (/800\s*g/i.test(lower)) return price / 0.8;  // 800g -> per kg

  // If price seems like a per-kg price already ($15-$35 range), keep it
  if (price >= 12 && price <= 40) return price;

  // If price is in "per pack" range ($40-$80), likely 800g-1kg pack
  if (price >= 40 && price <= 80) return price; // assume ~1kg

  return price;
}

// Validate a scraped price is reasonable
export function isValidPrice(price: number, lastKnownPrice?: number): boolean {
  if (price < 5 || price > 100) return false;
  if (lastKnownPrice && Math.abs(price - lastKnownPrice) / lastKnownPrice > 0.5) {
    return false; // >50% deviation from last known
  }
  return true;
}
