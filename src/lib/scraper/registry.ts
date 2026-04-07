import { SellerScrapeConfig } from "./types";
import { SELLER_LIST } from "../seller-list";
import { createShopifyScraper } from "./scrapers/shopify";
import { createWooCommerceScraper } from "./scrapers/woocommerce";
import { createGenericHtmlScraper } from "./scrapers/generic-html";
import { createChainScraper } from "./scrapers/chain";

// Map each website-based seller to its scraper strategy
// Facebook-only sellers are excluded (can't scrape without browser)

const shopify = createShopifyScraper();
const woo = createWooCommerceScraper();
const html = createGenericHtmlScraper();
const shopifyThenHtml = createChainScraper(shopify, html);
const wooThenHtml = createChainScraper(woo, html);
const allStrategies = createChainScraper(shopify, woo, html);

// Seller IDs that are Facebook-only (no website to scrape)
const FACEBOOK_ONLY_IDS = new Set([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);

export function getScrapableConfigs(): SellerScrapeConfig[] {
  return SELLER_LIST
    .filter((s) => !FACEBOOK_ONLY_IDS.has(s.id))
    .map((seller) => ({
      sellerId: seller.id,
      sellerName: seller.name,
      url: seller.url,
      scraper: getScraperForSeller(seller.slug),
    }));
}

function getScraperForSeller(slug: string) {
  // Known platform mappings based on earlier research
  switch (slug) {
    // Shopify stores
    case "durian-express":
    case "durian-empire":
    case "mk-musang-king":
    case "spikes-durian":
      return shopifyThenHtml;

    // WooCommerce stores
    case "durydury":
    case "smelly-story":
      return wooThenHtml;

    // Sites with known structures — try everything
    case "durian-delivery-sg":
    case "the-durian-story":
    case "jiak-durian-mai":
    case "kungfu-durian":
    case "golden-moments":
    case "fresh-durian":
    case "99-old-trees":
    case "sgdurian":
    case "uncle-sam-durian":
      return allStrategies;

    default:
      return allStrategies;
  }
}
