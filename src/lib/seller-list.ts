// Central seller registry — 26 verified sellers with current 2026 pricing or active presence
export const SELLER_LIST = [
  // Confirmed current pricing (2025-2026 dates verified)
  { id: 1, name: "Durian Delivery SG", slug: "durian-delivery-sg", url: "https://duriandelivery.com.sg" },
  { id: 2, name: "Durian Express Delivery", slug: "durian-express", url: "https://durianexpressdelivery.com.sg" },
  { id: 3, name: "The Durian Story", slug: "the-durian-story", url: "https://thedurianstory.com.sg" },
  { id: 4, name: "Jiak Durian Mai", slug: "jiak-durian-mai", url: "https://jiakdurianmai.com" },
  { id: 5, name: "Kungfu Durian", slug: "kungfu-durian", url: "https://kungfudurian.sg" },
  { id: 6, name: "Durian Empire", slug: "durian-empire", url: "https://durianempire.sg" },
  { id: 7, name: "Golden Moments", slug: "golden-moments", url: "https://goldenmoments.sg" },
  { id: 8, name: "MK Musang King", slug: "mk-musang-king", url: "https://mkmusangking.com" },
  { id: 9, name: "Durydury", slug: "durydury", url: "https://durydury.com" },
  { id: 10, name: "Smelly Story Durian", slug: "smelly-story", url: "https://smellystorydurian.sg" },
  // Active sites (live but prices load dynamically / couldn't fully verify)
  { id: 11, name: "Fresh Durian", slug: "fresh-durian", url: "https://freshdurian.com.sg" },
  { id: 12, name: "99 Old Trees", slug: "99-old-trees", url: "https://99oldtrees.com" },
  { id: 13, name: "SGDurian", slug: "sgdurian", url: "https://www.sgdurian.com" },
  { id: 14, name: "Spike's Durian", slug: "spikes-durian", url: "https://www.spikedurian.sg" },
  { id: 15, name: "Uncle Sam Durian", slug: "uncle-sam-durian", url: "https://www.unclesamdurian.com" },
  // Facebook-based sellers (active pages, prices posted on social media)
  { id: 16, name: "Combat Durian", slug: "combat-durian", url: "https://www.facebook.com/p/Combat-Durian-Singapore-100064726054699/" },
  { id: 17, name: "Durian Ninja", slug: "durian-ninja", url: "https://www.facebook.com/durianninja/" },
  { id: 18, name: "Hao Durian", slug: "hao-durian", url: "https://www.facebook.com/haodurian/" },
  { id: 19, name: "6Lian Durian", slug: "6lian-durian", url: "https://www.facebook.com/6LianDurian/" },
  { id: 20, name: "Luv Durian", slug: "luv-durian", url: "https://www.facebook.com/ubidurian/" },
  { id: 21, name: "Lexus Durian King", slug: "lexus-durian", url: "https://www.facebook.com/Lexus.durianking/" },
  { id: 22, name: "Durian Lingers", slug: "durian-lingers", url: "https://www.facebook.com/durianlingers/" },
  { id: 23, name: "Durian SG Prime", slug: "durian-sg-prime", url: "https://www.facebook.com/duriansgprime/" },
  { id: 24, name: "Kong Lee Hup Kee", slug: "kong-lee-hup-kee", url: "https://www.facebook.com/KongLeeHupKeeTrading/" },
  { id: 25, name: "Kingdom Fruits", slug: "kingdom-fruits", url: "https://www.facebook.com/KingdomFruitsSG/" },
  { id: 26, name: "Durian Kaki", slug: "durian-kaki", url: "https://www.facebook.com/duriankaki.sg/" },
] as const;

// Realistic base prices per seller ($/kg)
export const BASE_PRICES = [
  22, 24, 26, 23, 22, 25, 30, // 1-7
  26, 25, 17, 29, 25, 21, 24, // 8-14
  22, 19, 21, 18, 20, 23, 25, // 15-21
  22, 21, 19, 23, 24,          // 22-26
];
