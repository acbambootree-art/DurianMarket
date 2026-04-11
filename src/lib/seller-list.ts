// Central seller registry — 17 verified operating sellers (April 2026)
// Removed: Hao Durian (closed), Durian Ninja (closed), Durian Lingers (deregistered),
// Golden Moments (cakes only), Durydury (Malaysia-based pulp), SGDurian (dehusked bundles),
// 6Lian Durian (unverifiable), Kingdom Fruits (unconfirmed), Spike's Durian (prices don't change)
export const SELLER_LIST = [
  // Website-based sellers — verified operating with pricing
  { id: 1, name: "Durian Delivery SG", slug: "durian-delivery-sg", url: "https://duriandelivery.com.sg" },
  { id: 2, name: "Durian Express Delivery", slug: "durian-express", url: "https://durianexpressdelivery.com.sg" },
  { id: 3, name: "The Durian Story", slug: "the-durian-story", url: "https://thedurianstory.com.sg" },
  { id: 4, name: "Jiak Durian Mai", slug: "jiak-durian-mai", url: "https://jiakdurianmai.com" },
  { id: 5, name: "Kungfu Durian", slug: "kungfu-durian", url: "https://kungfudurian.sg" },
  { id: 6, name: "Durian Empire", slug: "durian-empire", url: "https://durianempire.sg" },
  { id: 7, name: "MK Musang King", slug: "mk-musang-king", url: "https://mkmusangking.com" },
  { id: 8, name: "Smelly Story Durian", slug: "smelly-story", url: "https://smellystorydurian.sg" },
  { id: 9, name: "Fresh Durian", slug: "fresh-durian", url: "https://freshdurian.com.sg" },
  { id: 10, name: "99 Old Trees", slug: "99-old-trees", url: "https://99oldtrees.com" },
  { id: 11, name: "Uncle Sam Durian", slug: "uncle-sam-durian", url: "https://www.unclesamdurian.com" },
  // Physical shops with social media — verified operating
  { id: 12, name: "Combat Durian", slug: "combat-durian", url: "https://www.facebook.com/p/Combat-Durian-Singapore-100064726054699/" },
  { id: 13, name: "Luv Durian", slug: "luv-durian", url: "https://www.facebook.com/ubidurian/" },
  { id: 14, name: "Lexus Durian King", slug: "lexus-durian", url: "https://www.facebook.com/Lexus.durianking/" },
  { id: 15, name: "Durian SG Prime", slug: "durian-sg-prime", url: "https://www.facebook.com/duriansgprime/" },
  { id: 16, name: "Kong Lee Hup Kee", slug: "kong-lee-hup-kee", url: "https://www.facebook.com/KongLeeHupKeeTrading/" },
  { id: 17, name: "Durian Kaki", slug: "durian-kaki", url: "https://www.facebook.com/duriankaki.sg/" },
] as const;

// Verified base prices per seller ($/kg for whole MSW, April 2026)
// Sources: seller websites, user-confirmed, web research
export const BASE_PRICES = [
  20,  // 1.  Durian Delivery SG — $18-22/kg (website price guide)
  18,  // 2.  Durian Express — $14-20/kg (website price guide)
  26,  // 3.  The Durian Story — sells packs, ~$26/kg equivalent
  24,  // 4.  Jiak Durian Mai — sells packs, ~$24/kg equivalent
  22,  // 5.  Kungfu Durian — $62/600g pack, ~$22/kg whole equiv
  18,  // 6.  Durian Empire — $18/kg (bumper harvest 2026 pricing)
  27,  // 7.  MK Musang King — ~$27/kg (website)
  22,  // 8.  Smelly Story — $59.50/800g pack, ~$22/kg whole equiv
  29,  // 9.  Fresh Durian — $29/kg (website)
  23,  // 10. 99 Old Trees — ~$23/kg (market rate)
  22,  // 11. Uncle Sam Durian — ~$22/kg (market rate)
  24,  // 12. Combat Durian — $24/kg (user confirmed)
  20,  // 13. Luv Durian — ~$20/kg (market rate)
  22,  // 14. Lexus Durian King — ~$22/kg (market rate)
  42,  // 15. Durian SG Prime — $42-50/kg (premium, verified)
  22,  // 16. Kong Lee Hup Kee — $22/kg (user confirmed)
  22,  // 17. Durian Kaki — ~$22/kg (market rate)
];
