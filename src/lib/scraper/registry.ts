import { SellerScrapeConfig } from "./types";
import { SELLER_LIST } from "../seller-list";
import { createShopifyScraper } from "./scrapers/shopify";
import { createWooCommerceScraper } from "./scrapers/woocommerce";
import { createGenericHtmlScraper } from "./scrapers/generic-html";
import { createChainScraper } from "./scrapers/chain";

const shopify = createShopifyScraper();
const woo = createWooCommerceScraper();
const html = createGenericHtmlScraper();
const shopifyThenHtml = createChainScraper(shopify, html);
const wooThenHtml = createChainScraper(woo, html);
const allStrategies = createChainScraper(shopify, woo, html);

// Facebook-only sellers (IDs 13-18) can't be scraped
const FACEBOOK_ONLY_IDS = new Set([13, 14, 15, 16, 17, 18]);

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
  switch (slug) {
    // Shopify stores
    case "durian-express":
    case "durian-empire":
    case "mk-musang-king":
    case "spikes-durian":
      return shopifyThenHtml;

    // WooCommerce stores
    case "smelly-story":
      return wooThenHtml;

    // All strategies
    case "durian-delivery-sg":
    case "the-durian-story":
    case "jiak-durian-mai":
    case "kungfu-durian":
    case "fresh-durian":
    case "99-old-trees":
    case "uncle-sam-durian":
      return allStrategies;

    default:
      return allStrategies;
  }
}
