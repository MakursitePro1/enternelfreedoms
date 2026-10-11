import { seo, SITE_URL } from '@/lib/seo';
import { photos, facilityImages } from '@/lib/content';

export type SeoPageDefault = { path: string; name: string; title: string; description: string; keywords: string; image: string; preview: string };

/** Default SEO for every main public page; admin edits are stored as overrides in site settings. */
export const SEO_PAGES: SeoPageDefault[] = [
  { path: '/', name: 'হোম', title: 'হোম', description: 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—কুরআনকেন্দ্রিক ইসলামী ও সাধারণ শিক্ষার সমন্বিত পূর্ণাঙ্গ আবাসিক প্রতিষ্ঠান। ভর্তি, শিক্ষক, আবাসিক জীবন ও বইয়ের দোকান।', keywords: 'গফরগাঁও আবাসিক মাদ্রাসা, ময়মনসিংহ ইসলামী প্রতিষ্ঠান', image: photos[2], preview: photos[2] },
  { path: '/about', name: 'প্রতিষ্ঠান পরিচিতি', title: 'প্রতিষ্ঠান পরিচিতি', description: 'Eternal Freedom Institute Al Islamia-এর ইতিহাস, প্রতিষ্ঠাতা, লক্ষ্য-উদ্দেশ্য, শিক্ষাদর্শ, বিশেষত্ব, শিক্ষক-শিক্ষার্থী সংখ্যা, অর্জন ও ভবিষ্যৎ লক্ষ্য।', keywords: 'ইটারনাল ফ্রিডম ইনস্টিটিউট, মাদ্রাসা পরিচিতি', image: photos[5], preview: photos[5] },
  { path: '/academics', name: 'শিক্ষা কার্যক্রম', title: 'শিক্ষা কার্যক্রম', description: 'সাধারণ শিক্ষা (প্লে–দশম/দাখিল), নূরানী, নাজেরা, হিফজ, কিতাব, স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতা—প্রতিটি বিভাগের বিস্তারিত।', keywords: 'হিফজ বিভাগ, নূরানী, নাজেরা, কিতাব, স্পোকেন ইংলিশ', image: photos[0], preview: facilityImages.classroom },
  { path: '/admission', name: 'অনলাইন ভর্তি', title: 'অনলাইন ভর্তি', description: 'ভর্তির তথ্য, বিভাগ, যোগ্যতা, প্রয়োজনীয় কাগজপত্র, ফি তালিকা, অনলাইন আবেদন (ছবি ও কাগজ আপলোডসহ) ও আবেদনের অবস্থা।', keywords: 'মাদ্রাসা ভর্তি, অনলাইন ভর্তি আবেদন, আবাসিক ভর্তি', image: photos[4], preview: photos[4] },
  { path: '/residential', name: 'আবাসিক জীবন', title: 'আবাসিক জীবন, খাবার ও নিরাপত্তা', description: 'আবাসিক কক্ষ, তিন স্তরের বিছানা, খাবারের সাপ্তাহিক মেনু, রান্নাঘর ও বেকারি, দৈনিক রুটিন এবং শিক্ষার্থীর নিরাপত্তা ব্যবস্থা।', keywords: 'আবাসিক মাদ্রাসা, ছাত্রাবাস, খাবার মেনু', image: photos[1], preview: facilityImages.dorm },
  { path: '/campus', name: 'ক্যাম্পাস ও সুবিধা', title: 'ক্যাম্পাস ও সুবিধা', description: 'একাডেমিক ভবন, শ্রেণিকক্ষ, আবাসন, খেলার মাঠ, লাইব্রেরি, আইসিটি, চিকিৎসা, রান্নাঘর, বেকারি, পানি, লন্ড্রি ও সিসিটিভি—সব সুবিধা ছবিসহ।', keywords: 'মাদ্রাসা ক্যাম্পাস, আবাসিক সুবিধা', image: photos[2], preview: facilityImages.playground },
  { path: '/teachers', name: 'শিক্ষকমণ্ডলী', title: 'শিক্ষকমণ্ডলী', description: 'Eternal Freedom Institute Al Islamia-এর অভিজ্ঞ শিক্ষক ও কর্মীদের পরিচিতি—নাম, পদবি, যোগ্যতা, অভিজ্ঞতা ও বিভাগ।', keywords: 'মাদ্রাসা শিক্ষক, অভিজ্ঞ উস্তায', image: photos[5], preview: photos[5] },
  { path: '/books', name: 'বইয়ের দোকান', title: 'অনলাইন বইয়ের দোকান', description: 'Eternal Freedom প্রকাশনার বই দেখুন, বিস্তারিত পড়ুন এবং ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে অর্ডার করুন।', keywords: 'বই কিনুন, বিকাশ নগদ অর্ডার, ম্যাজিক ইংলিশ বই', image: photos[4], preview: facilityImages.library },
  { path: '/notices', name: 'নোটিশ বোর্ড', title: 'নোটিশ বোর্ড', description: 'ভর্তি, পরীক্ষা, ছুটি, অভিভাবক সভা ও গুরুত্বপূর্ণ ঘোষণা—Eternal Freedom Institute Al Islamia-এর সর্বশেষ নোটিশ।', keywords: 'মাদ্রাসা নোটিশ, ভর্তি বিজ্ঞপ্তি', image: photos[3], preview: photos[3] },
  { path: '/activities', name: 'খবর ও অনুষ্ঠান', title: 'খবর, অনুষ্ঠান ও অর্জন', description: 'Eternal Freedom Institute Al Islamia-এর খবর, অনুষ্ঠান, কার্যক্রম ও অর্জন—ছবি ও বিস্তারিতসহ।', keywords: 'মাদ্রাসা অনুষ্ঠান, অর্জন', image: photos[3], preview: photos[3] },
  { path: '/gallery', name: 'গ্যালারি', title: 'ফটো ও ভিডিও গ্যালারি', description: 'ক্যাম্পাস, শ্রেণিকক্ষ, কুরআন শিক্ষা, হিফজ, নাজেরা, কিতাব, আবাসিক জীবন, খাবার, খেলাধুলা, অনুষ্ঠান ও শিক্ষার্থীদের কার্যক্রমের ছবি ও ক্যাম্পাস ভিডিও।', keywords: 'মাদ্রাসা ছবি, ক্যাম্পাস ভিডিও', image: photos[0], preview: photos[0] },
  { path: '/faq', name: 'প্রশ্নোত্তর', title: 'অভিভাবক নির্দেশিকা ও প্রশ্নোত্তর', description: 'ভর্তি, আবাসিক জীবন, প্রয়োজনীয় কাগজপত্র, নিয়মকানুন ও শিক্ষার্থীর প্রস্তুতি নিয়ে অভিভাবকদের জন্য নির্দেশিকা ও সচরাচর জিজ্ঞাসা।', keywords: 'ভর্তি নিয়ম, আবাসিক নিয়ম, অভিভাবক প্রশ্ন', image: photos[2], preview: facilityImages.quran },
  { path: '/contact', name: 'যোগাযোগ', title: 'যোগাযোগ', description: 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—ফোন, ইমেইল, ঠিকানা, ম্যাপ ও বার্তা পাঠানোর ফর্ম।', keywords: 'মাদ্রাসা ঠিকানা, ফোন নম্বর, গফরগাঁও', image: photos[2], preview: photos[2] },
];

export const SEO_FIELDS = ['title', 'desc', 'kw', 'img', 'noindex'] as const;
export type SeoField = (typeof SEO_FIELDS)[number];
export const seoKey = (field: SeoField, path: string) => `seo.${field}.${path}`;
export type SeoOverrides = Record<string, string>;

export function absoluteUrl(url: string) {
  return url.startsWith('/') ? `${SITE_URL}${url}` : url;
}

/** Effective (default + admin override) SEO values for one page. */
export function resolvePageSeo(path: string, overrides: SeoOverrides = {}) {
  const d = SEO_PAGES.find((p) => p.path === path) ?? SEO_PAGES[0]!;
  return {
    ...d,
    title: overrides[seoKey('title', path)] || d.title,
    description: overrides[seoKey('desc', path)] || d.description,
    keywords: overrides[seoKey('kw', path)] || d.keywords,
    image: overrides[seoKey('img', path)] || d.image,
    noindex: overrides[seoKey('noindex', path)] === '1',
  };
}

/** Reads admin SEO overrides; works during server rendering and in the browser on any host. */
export async function fetchSeoOverrides(): Promise<SeoOverrides> {
  const url = import.meta.env['VITE_SUPABASE_URL'];
  const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return {};
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?select=key,value&key=like.seo.*`, { headers: { apikey: key }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return {};
    const rows = (await res.json()) as { key: string; value: string }[];
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

type HeadCtx = { matches: readonly { loaderData?: unknown }[] };

/** Builds the full head for a main public page, applying admin overrides loaded by the root route. */
export function pageSeo(ctx: HeadCtx, path: string) {
  const root = ctx.matches[0]?.loaderData as { seo?: SeoOverrides } | undefined;
  const p = resolvePageSeo(path, root?.seo ?? {});
  const base = seo(p.title, p.description, path, p.keywords);
  const image = absoluteUrl(p.image);
  const meta = base.meta.map((m) => ('name' in m && m.name === 'robots' && p.noindex ? { name: 'robots', content: 'noindex, nofollow' } : m));
  return {
    ...base,
    meta: [
      ...meta,
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: p.title },
      { name: 'twitter:image', content: image },
    ],
  };
}
