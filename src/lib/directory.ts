// Durian seller directory — physical stalls, shops, and delivery businesses
// classified by Singapore neighbourhood. Data compiled Aug 2026 via web research.
import { SELLER_LIST } from "./seller-list";

export type Region = "Central" | "East" | "Northeast" | "North" | "West" | "Islandwide";

export interface DirectoryEntry {
  name: string;
  slug: string;
  address: string; // empty string for delivery-only
  postal?: string;
  area: string; // display name, e.g. "Geylang"
  region: Region;
  phone?: string;
  url?: string;
  hours?: string;
  description: string;
  deliveryOnly?: boolean;
}

// Compiled from seller websites, Facebook/Instagram, SethLui (May 2026), EatBook (Jan 2026),
// TheSmartLocal, Mothership, and business listings. Names matching SELLER_LIST link to the
// price tracker automatically (see trackedPriceSlug).
export const DIRECTORY: DirectoryEntry[] = [
  // ── Central ──────────────────────────────────────────────────────────
  { name: "Combat Durian", slug: "combat-durian", address: "206 Rangoon Road", postal: "218452", area: "Farrer Park", region: "Central", phone: "+65 9278 9928", url: "https://www.facebook.com/p/Combat-Durian-Singapore-100064726054699/", hours: "Daily 1pm-8pm", description: "Iconic 50+ year stall, formerly of Balestier Road, famed for premium Mao Shan Wang from its own Malaysian plantation." },
  { name: "Sindy Durian", slug: "sindy-durian", address: "Blk 89 Whampoa Drive #01-835", postal: "320089", area: "Whampoa", region: "Central", phone: "+65 9710 2427", url: "https://www.facebook.com/sindydurians/", hours: "Daily 1pm-12am", description: "30+ year family stall credited as one of the first to bring Mao Shan Wang to Singapore — Auntie Sindy hand-checks every fruit." },
  { name: "Durian 36", slug: "durian-36", address: "608 Geylang Road", postal: "389547", area: "Geylang", region: "Central", phone: "+65 9889 4906", url: "https://durian36.com", hours: "Daily 24 hours", description: "24-hour Geylang institution with 10+ varieties including Black Gold MSW, plus a one-for-one exchange policy." },
  { name: "Durian Culture", slug: "durian-culture", address: "77 Sims Avenue", postal: "387419", area: "Geylang", region: "Central", phone: "+65 9180 1080", url: "https://durianculture.com", hours: "Daily 24 hours", description: "Family-run since 1969 on the Sims Avenue durian strip — MSW, Black Thorn, Jin Feng, D24, D101 and Red Prawn round the clock." },
  { name: "Wonderful Durian", slug: "wonderful-durian", address: "147 Sims Avenue", postal: "387469", area: "Geylang", region: "Central", phone: "+65 9446 5556", hours: "Daily 24 hours", description: "Long-running 24-hour stall on the Geylang durian strip near Lorong 17, popular for late-night Mao Shan Wang." },
  { name: "Ah Hung D24 Sultan Durian", slug: "ah-hung-d24", address: "107 Sims Avenue", postal: "387433", area: "Geylang", region: "Central", phone: "+65 6743 3509", url: "https://www.facebook.com/pages/Ah-hung-D24-Sultan-Durian-Stall/170903656292770", hours: "Afternoons till late (seasonal)", description: "Old-school Sims Avenue stall trusted for D24 and MSW — staff famously tell you when the fruit isn't in season." },
  { name: "Wan Bao Durian", slug: "wan-bao-durian", address: "513 Geylang Road", postal: "389469", area: "Geylang", region: "Central", phone: "+65 8893 5225", hours: "Open till late", description: "Relaxed, affordable Geylang Road stall often recommended for durian beginners." },
  { name: "Jiak Durian Mai", slug: "jiak-durian-mai", address: "692 Geylang Road", postal: "389612", area: "Geylang", region: "Central", phone: "+65 8883 6152", url: "https://jiakdurianmai.com", description: "Tree-fall durian specialist with 1-2 hour express islandwide delivery and a one-for-one replacement guarantee." },
  { name: "S8 Durian", slug: "s8-durian", address: "95 Lavender Street", postal: "338721", area: "Kallang", region: "Central", phone: "+65 8082 2212", url: "https://s8durian.sg", hours: "Daily, afternoon till late", description: "Newer Kallang stall (est. 2024) known for A-grade Pahang Musang King, Black Gold and Black Thorn." },
  { name: "211 House of Durian", slug: "211-house-of-durian", address: "Blk 211 Lorong 8 Toa Payoh #01-21", postal: "310211", area: "Toa Payoh", region: "Central", phone: "+65 9489 7781", url: "https://www.facebook.com/211HouseOfDurian", hours: "Daily 1pm-10:30pm", description: "Toa Payoh favourite known for Bentong MSW, durian soft serve and end-of-season durian buffets." },
  { name: "Golden Moments Durian Cafe", slug: "golden-moments", address: "779 North Bridge Road #01-01", postal: "198747", area: "Bugis", region: "Central", phone: "+65 8818 8497", url: "https://goldenmoments.sg", hours: "Daily 12pm-10pm", description: "Durian cafe serving Black Gold MSW fresh, plus durian buffets, cakes and mochi." },
  { name: "Grandpa Durian", slug: "grandpa-durian", address: "19 Smith Street #01-01", postal: "058933", area: "Chinatown", region: "Central", phone: "+65 8139 3878", url: "https://duriangrandpa.com.sg", hours: "Daily 11am-11pm", description: "Chinatown durian cafe with its own Malaysian orchards, famous for a giant durian chendol and year-round fresh fruit." },
  { name: "HengBros Durian", slug: "hengbros-durian", address: "Blk 531 Upper Cross Street #01-41", postal: "050531", area: "Chinatown", region: "Central", phone: "+65 8509 9850", url: "https://hengbros.com.sg", hours: "Daily 5pm-10pm", description: "Old-tree MSW specialist at Hong Lim Complex doing durian chendol, desserts and event catering." },
  { name: "99 Old Trees", slug: "99-old-trees", address: "1 Teo Hong Road", postal: "088321", area: "Outram", region: "Central", phone: "+65 9822 2495", url: "https://99oldtrees.com", hours: "Daily 12pm-10pm", description: "Modern durian cafe opposite Outram Park MRT sourcing MSW from 15+ year-old trees on its own farm." },
  { name: "Zeng Zu Fu (Ah Lai Durian)", slug: "zeng-zu-fu", address: "Blk 55 Tiong Bahru Road #01-02", postal: "160055", area: "Tiong Bahru", region: "Central", phone: "+65 8898 9592", url: "https://www.zenzufudurians.com.sg", hours: "2pm-8pm (Fri-Sat till 9pm)", description: "Heritage seller with roots in 1950s Pahang — Red Prawn, XO, MSW, Black Gold and 60-minute delivery." },
  { name: "Ah Seng Durian (Alexandra)", slug: "ah-seng-durian-alexandra", address: "119 Bukit Merah Lane 1 #01-24", postal: "151119", area: "Alexandra", region: "Central", phone: "+65 9666 2570", url: "https://www.ahsengdurian.com.sg", hours: "Daily 12pm-10pm", description: "Alexandra branch of the famous 40-year Ghim Moh stall — strict quality checks on premium MSW, Black Thorn and Golden Phoenix." },
  { name: "Ah Di Dempsey Durian", slug: "ah-di-dempsey", address: "Blk 7 Dempsey Road (carpark)", postal: "249671", area: "Dempsey", region: "Central", phone: "+65 9018 2853", url: "https://www.facebook.com/AhDiDempsyDurian", hours: "Daily 3pm-11pm", description: "Veteran open-air stall in the Dempsey carpark with one of the widest variety line-ups — Black Thorn, Green Bamboo and kampung durians." },
  { name: "Four Seasons Durians", slug: "four-seasons-durians", address: "391 Orchard Road, Takashimaya Food Hall B2", postal: "238872", area: "Orchard", region: "Central", url: "https://www.fourseasonsdurians.com", hours: "Daily ~10am-9:30pm", description: "Takashimaya Food Hall counter selling MSW pulp, pastries and durian desserts — Orchard's durian fix." },

  // ── East ─────────────────────────────────────────────────────────────
  { name: "Fresh Durian", slug: "fresh-durian", address: "84 Bedok North Street 4 #01-37", postal: "460084", area: "Bedok", region: "East", phone: "+65 8709 0909", url: "https://freshdurian.com.sg", hours: "Daily 10am-10pm", description: "Farm-direct high-altitude Mao Shan Wang with 60-minute islandwide delivery." },
  { name: "Majestic Durian", slug: "majestic-durian", address: "84 Bedok North Street 4 #01-29", postal: "460084", area: "Bedok", region: "East", phone: "+65 8630 7351", hours: "Daily 2pm-10pm", description: "Known for its all-you-can-eat MSW and D24 durian buffets in Bedok North." },
  { name: "WTF Durian (Wow That's Fresh)", slug: "wtf-durian", address: "89 Bedok North Street 4", postal: "460089", area: "Bedok", region: "East", url: "https://www.burpple.com/wtfdurian", description: "Quality-focused Bedok stall carrying XO, D24 Sultan King, D13, Red Prawn and Golden Phoenix." },
  { name: "Lian Durian", slug: "lian-durian", address: "511 Bedok North Street 3 #01-64", postal: "460511", area: "Bedok", region: "East", description: "Neighbourhood Bedok North stall popular with locals for value MSW." },
  { name: "Louis Durian", slug: "louis-durian", address: "510 Bedok North Ave 3 #01-57", postal: "460510", area: "Bedok", region: "East", description: "Personal-touch stall (formerly Marine Parade) known for stocking more varieties than average." },
  { name: "818 Durian & Pastries", slug: "818-durian", address: "1550 Bedok North Ave 4 #02-24", postal: "489950", area: "Bedok", region: "East", phone: "+65 6493 9818", url: "https://818durian.com", description: "Own Malaysian plantation; MSW and Black Gold plus famous durian choux puffs and pastries." },
  { name: "227 Katong Durian", slug: "227-katong-durian", address: "227 East Coast Road", postal: "428924", area: "Katong", region: "East", phone: "+65 9751 4828", url: "https://227katongdurian.com", hours: "Daily 10am-10pm", description: "Ah Loon's air-conditioned Katong institution with rarer varieties like Green Bamboo and Black Thorn." },
  { name: "Parkway Durian", slug: "parkway-durian", address: "Blk 83 Marine Parade Central #01-568", postal: "440083", area: "Marine Parade", region: "East", phone: "+65 6348 8460", hours: "Daily 24 hours", description: "20+ year Marine Parade stalwart open round the clock, sourcing from Pahang, Muar and Johor." },
  { name: "Durian Express Delivery", slug: "durian-express-delivery", address: "296 Changi Road #01-614", postal: "419774", area: "Eunos", region: "East", phone: "+65 8116 8890", url: "https://durianexpressdelivery.com.sg", hours: "24/7 delivery", description: "24-hour durian delivery operation with an Eunos shopfront — order any time of night." },
  { name: "Luv Durian", slug: "luv-durian", address: "306 Ubi Ave 1 #01-199", postal: "400306", area: "Ubi", region: "East", phone: "+65 8285 8111", url: "https://www.facebook.com/ubidurian/", hours: "Daily 10am-11pm", description: "Ubi heartland shopfront specialising in authentic Pahang Musang King and King of Kings." },
  { name: "Durian Ninja", slug: "durian-ninja", address: "Blk 827 Tampines Street 81 #01-132", postal: "520827", area: "Tampines", region: "East", hours: "Evenings from ~6pm", description: "Tampines fruit stall famous for giving away up to 1,000kg of Bentong and Muar durians daily in season." },
  { name: "Kaki Kaki Durian", slug: "kaki-kaki-durian", address: "Tampines MRT Station, 20 Tampines Central 1", postal: "529538", area: "Tampines", region: "East", url: "https://www.facebook.com/KakiKakiDD/", description: "Chilled boxed Mao Shan Wang from a vending machine at Tampines MRT — launched Jan 2025." },
  { name: "Kong Lee Hup Kee", slug: "kong-lee-hup-kee", address: "440 Pasir Ris Drive 4 #01-03", postal: "510440", area: "Pasir Ris", region: "East", phone: "+65 9851 7753", url: "https://www.facebook.com/KongLeeHupKeeTrading/", hours: "Daily 2pm-6pm", description: "Husband-and-wife stall praised for personal service and transparent pricing." },

  // ── Northeast ────────────────────────────────────────────────────────
  { name: "The Durian Story", slug: "the-durian-story", address: "Blk 151 Serangoon North Ave 2 #01-11", postal: "550151", area: "Serangoon", region: "Northeast", phone: "+65 8797 6699", url: "https://thedurianstory.com.sg", hours: "Daily 1pm-10pm (seasonal)", description: "Air-conditioned dine-in durian store in Serangoon North with same-day islandwide delivery." },
  { name: "Durian Mpire by 717 Trading", slug: "durian-mpire", address: "22 Yio Chu Kang Road, Highland Centre #01-01", postal: "545535", area: "Serangoon", region: "Northeast", phone: "+65 6287 7717", url: "https://www.durianmpire.getz.co/", hours: "Mon-Thu 11am-8pm, Fri-Sun 11am-9pm", description: "50-year durian trading family; fresh durians plus durian pastries, with counters at Jewel Changi and T3." },
  { name: "Lexus Durian King", slug: "lexus-durian-king", address: "1001 Upper Serangoon Road", postal: "534739", area: "Kovan", region: "Northeast", phone: "+65 8778 3213", url: "https://www.facebook.com/Lexus.durianking/", hours: "Daily 24 hours", description: "24-hour Kovan flagship famous for MSW buffets, mass durian giveaways and celebrity visits." },
  { name: "Durian Culture (Kovan)", slug: "durian-culture-kovan", address: "1001 Upper Serangoon Road", postal: "534739", area: "Kovan", region: "Northeast", phone: "+65 8348 6181", hours: "Daily 1pm-1am", description: "Kovan outlet of the family-run trader (since 1969) selecting MSW from Pahang plantations, with seating on site." },
  { name: "D197 Durian Brother", slug: "d197-durian-brother", address: "Blk 698 Hougang Street 61 #01-06", postal: "530698", area: "Hougang", region: "Northeast", phone: "+65 9774 9774", hours: "Daily from 7pm", description: "Budget MSW specialist known for nightly $9.80/kg Mao Shan Wang deals." },
  { name: "Lian Hua Chun Fruits", slug: "lian-hua-chun", address: "682 Hougang Ave 4 #01-338", postal: "530682", area: "Hougang", region: "Northeast", description: "Long-established fruit shop whose Hougang branch is celebrated for durians, with kampung durians from $2." },
  { name: "Durian Empire", slug: "durian-empire", address: "168 Punggol Field, Punggol Plaza B1 Atrium", postal: "820168", area: "Punggol", region: "Northeast", phone: "+65 9767 1519", url: "https://durianempire.sg", hours: "Daily 5:30pm-10:30pm", description: "Punggol Plaza atrium stall praised for honest staff, pre-orders and a spacious eat-in area." },
  { name: "MK Musang King", slug: "mk-musang-king", address: "7 Ang Mo Kio Street 66 #01-01, Flora Vista", postal: "567708", area: "Ang Mo Kio", region: "Northeast", phone: "+65 8366 0101", url: "https://mkmusangking.com", description: "Small Flora Vista retail shop dealing in premium Musang King — call or WhatsApp ahead." },
  { name: "Good Durian", slug: "good-durian", address: "Blk 453 Ang Mo Kio Ave 10 #01-1805", postal: "560453", area: "Ang Mo Kio", region: "Northeast", phone: "+65 8821 5921", url: "https://gooddurian.com.sg", hours: "Daily 4pm-10pm", description: "Premium Mao Shan Wang delivered daily from its own plantation in Raub, Pahang." },
  { name: "Fruit Monkeys (Ang Mo Kio)", slug: "fruit-monkeys-amk", address: "7 Ang Mo Kio Street 66 #01-03, FloraVista", postal: "567708", area: "Ang Mo Kio", region: "Northeast", phone: "+65 9145 2860", url: "https://www.facebook.com/FruitMonkeysDurian/", hours: "Daily 12pm-10:30pm", description: "Air-conditioned indoor durian dining with Old Tree Black Gold MSW — gloves and water provided." },

  // ── North ────────────────────────────────────────────────────────────
  { name: "Kungfu Durian", slug: "kungfu-durian", address: "304 Woodlands St 31 #01-141", postal: "730304", area: "Woodlands", region: "North", phone: "+65 8118 6318", url: "https://kungfudurian.sg", description: "Woodlands stall with a second outlet at Jalan Legundi, Sembawang; free delivery above $120." },
  { name: "548 Durian Stall (Ah Kiat)", slug: "548-durian-stall", address: "Blk 548 Woodlands Drive 44, Vista Point wet market", postal: "730548", area: "Woodlands", region: "North", phone: "+65 9067 8805", url: "https://www.facebook.com/548durian/", description: "Long-running Woodlands wet-market durian stall known for affordable prices and delivery." },
  { name: "Young Boy Durian", slug: "young-boy-durian", address: "Blk 19 Marsiling Lane #01-309", postal: "730019", area: "Woodlands", region: "North", url: "https://www.tiktok.com/@young.boy.durian", description: "TikTok-active Marsiling stall pushing budget Musang King (~$12/kg) and Red Prawn deals." },
  { name: "Sembawang Durian Seng", slug: "sembawang-durian-seng", address: "14 Jalan Tampang, Sembawang Garden Arcade", area: "Sembawang", region: "North", phone: "+65 9344 1512", url: "https://www.facebook.com/p/Sembawang-Durian-Seng-100057449829835/", hours: "Durian season only", description: "Mr Yap's 35+ year seasonal stall, the north's cult favourite for lao tai po durians and buy-X-get-Y-free deals." },
  { name: "Durian Kaki", slug: "durian-kaki", address: "Blk 293 Yishun Street 22 #01-259", postal: "760293", area: "Yishun", region: "North", phone: "+65 8405 8509", url: "https://www.facebook.com/duriankaki.sg/", hours: "Daily 2pm-10pm", description: "Air-conditioned dine-in durian stall with a second outlet at Junction Nine near Khatib." },
  { name: "Fruit Monkeys", slug: "fruit-monkeys-yishun", address: "Blk 293 Yishun Street 22 #01-219", postal: "760293", area: "Yishun", region: "North", phone: "+65 9145 2860", hours: "Daily 1pm-9:30pm", description: "Transparent, affordable D13 and MSW plus frozen MSW puree; free delivery on orders above $100." },

  // ── West ─────────────────────────────────────────────────────────────
  { name: "Ah Seng Durian", slug: "ah-seng-durian", address: "20 Ghim Moh Road, Ghim Moh Market #01-119", postal: "270020", area: "Ghim Moh", region: "West", phone: "+65 9465 6160", url: "https://www.facebook.com/AhSengDurian/", hours: "Daily 12pm-8pm", description: "40+ year veteran famed for strict quality checks — opens fruit in front of you and replaces bad seeds." },
  { name: "Lele Durian", slug: "lele-durian", address: "20 Ghim Moh Road, Ghim Moh Market #01-125", postal: "270020", area: "Ghim Moh", region: "West", phone: "+65 9694 8584", hours: "Daily 1pm-9pm", description: "30+ year stall a few units from Ah Seng, known for D13 and bittersweet Black Gold MSW from Batu Pahat." },
  { name: "Bentong Durian", slug: "bentong-durian", address: "241 Holland Avenue #01-02", postal: "278976", area: "Holland Village", region: "West", phone: "+65 8816 9617", hours: "Daily 2pm-10pm", description: "Family-run shop with durians trucked in fresh daily from Bentong, Malaysia." },
  { name: "Uncle Sam Durian", slug: "uncle-sam-durian", address: "448 Clementi Ave 3, Clementi 448 Market #01-141", postal: "120448", area: "Clementi", region: "West", phone: "+65 9662 4246", url: "https://www.unclesamdurian.com", hours: "Daily 9am-9pm", description: "Black Gold Musang King from the family's own plantation in Raub, Pahang; bundle box discounts." },
  { name: "Super Durians", slug: "super-durians", address: "Bukit Timah Wet Market (Interim), Jalan Jurong Kechil", area: "Bukit Timah", region: "West", phone: "+65 8788 1332", url: "https://www.facebook.com/superdurians/", description: "Fresh Pahang Raub durians at the interim Bukit Timah market near Beauty World — WhatsApp orders with fast delivery." },
  { name: "The Durian Tree", slug: "the-durian-tree", address: "277 Bukit Batok East Ave 3 #01-371", postal: "650277", area: "Bukit Batok", region: "West", phone: "+65 9812 4148", url: "https://www.facebook.com/theduriantree/", hours: "Daily 1:30pm-11:30pm", description: "Neighbourhood stall with a wide spread — Kasap, Tong Lai, Black Pearl, S17, D13 and Old Tree MSW." },
  { name: "VLACK Durian", slug: "vlack-durian", address: "1 Bukit Batok Crescent, WCEGA Plaza #02-36", postal: "658064", area: "Bukit Batok", region: "West", phone: "+65 8770 9601", hours: "Daily ~12pm-10pm", description: "Founded by four friends; lets customers pick MSW by preferred sweetness-bitterness profile." },
  { name: "Hojiak Durian & Fruits", slug: "hojiak-durian", address: "Blk 351 Jurong East Street 31, Yuhua Place #01-77", postal: "600351", area: "Jurong East", region: "West", url: "https://www.facebook.com/hojiakduriannfruitsje", description: "Durian and fruit stall beside Yuhua Place Market with multiple Musang King grades and islandwide delivery." },
  { name: "Top Durian Station", slug: "top-durian-station", address: "Blk 963 Jurong West Street 93 #01-316", postal: "640963", area: "Jurong West", region: "West", phone: "+65 8427 8988", url: "https://www.facebook.com/TopDurianStation/", hours: "Daily 11am-11pm", description: "High-volume budget seller (~5,000kg a day) behind Jurong's 2025 durian price war, with tiered $2-$15 pricing." },
  { name: "Lexus Durian (Yew Tee)", slug: "lexus-durian-yew-tee", address: "61 Choa Chu Kang Drive #01-04", postal: "689715", area: "Choa Chu Kang", region: "West", phone: "+65 9467 1241", url: "https://www.instagram.com/lexus.durianking/", hours: "Daily 24 hours", description: "Yew Tee branch of the Lexus Durian King chain — accessible Musang King prices and durian buffets near Yew Tee MRT." },

  // ── Islandwide delivery ──────────────────────────────────────────────
  { name: "Durian Delivery SG", slug: "durian-delivery-sg", address: "", area: "Islandwide Delivery", region: "Islandwide", phone: "+65 8497 3036", url: "https://duriandelivery.com.sg", hours: "24/7 delivery", description: "Online-only durian delivery with 60-minute express service islandwide; free delivery above $100.", deliveryOnly: true },
  { name: "Smelly Story Durian", slug: "smelly-story-durian", address: "", area: "Islandwide Delivery", region: "Islandwide", phone: "+65 8539 0890", url: "https://smellystorydurian.sg", description: "Same-day islandwide durian delivery specialist, established 2021.", deliveryOnly: true },
];

export function areaSlug(area: string): string {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export interface AreaSummary {
  area: string;
  slug: string;
  region: Region;
  count: number;
}

export function getAreas(): AreaSummary[] {
  const map = new Map<string, AreaSummary>();
  for (const e of DIRECTORY) {
    const slug = areaSlug(e.area);
    const existing = map.get(slug);
    if (existing) existing.count++;
    else map.set(slug, { area: e.area, slug, region: e.region, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.area.localeCompare(b.area));
}

export function getArea(slug: string): AreaSummary | null {
  return getAreas().find((a) => a.slug === slug) ?? null;
}

export function getSellersByArea(slug: string): DirectoryEntry[] {
  return DIRECTORY.filter((e) => areaSlug(e.area) === slug).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

// Slug of the price-tracker seller if we track this business's prices
const trackedSlugs = new Map<string, string>(SELLER_LIST.map((s) => [s.name.toLowerCase(), s.slug]));
export function trackedPriceSlug(entry: DirectoryEntry): string | null {
  return trackedSlugs.get(entry.name.toLowerCase()) ?? null;
}
