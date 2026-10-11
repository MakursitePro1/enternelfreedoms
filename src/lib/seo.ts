export const SITE_URL = 'https://enternelfreedoms.lovable.app';
export const SITE_NAME = 'Eternal Freedom Institute Al Islamia';
const DEFAULT_KEYWORDS = 'Eternal Freedom Institute Al Islamia, গফরগাঁও মাদ্রাসা, ময়মনসিংহ আবাসিক প্রতিষ্ঠান, ইসলামী শিক্ষা, হিফজ, নূরানী, কিতাব বিভাগ, ম্যাজিক ইংলিশ';

export function seo(title: string, description: string, path = '/', keywords = '') {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { name: 'keywords', content: keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'bn_BD' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return { type: 'application/ld+json', children: JSON.stringify(data) };
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: SITE_NAME,
  alternateName: 'ইটারনাল ফ্রিডম ইনস্টিটিউট আল ইসলামিয়া',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description: 'গফরগাঁও, ময়মনসিংহের কুরআনকেন্দ্রিক ইসলামী ও সাধারণ শিক্ষার সমন্বিত পূর্ণাঙ্গ আবাসিক প্রতিষ্ঠান।',
  address: { '@type': 'PostalAddress', addressLocality: 'গফরগাঁও', addressRegion: 'ময়মনসিংহ', addressCountry: 'BD' },
};

export function breadcrumbLd(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}` })),
  };
}
