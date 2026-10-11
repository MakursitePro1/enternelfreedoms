// Admin-managed marketing/verification integrations. Settings live in site_settings
// under integ.<id>.on / integ.<id>.<field>; the root loader reads them and pageSeo
// injects the matching meta tags and scripts into every public page head.

export type IntegrationField = { key: string; label: string; placeholder: string; hint: string };
export type IntegrationKind = 'analytics' | 'tag' | 'verify' | 'index';
export type Integration = {
  id: string;
  name: string;
  bn: string;
  desc: string;
  kind: IntegrationKind;
  /** Solid brand color for the logo tile. */
  color: string;
  /** Brand logo: SVG viewBox + path data (fill = currentColor unless paths carry their own fill). */
  logo: { viewBox: string; paths: { d: string; fill?: string }[] };
  fields: IntegrationField[];
  helpUrl: string;
  helpLabel: string;
};

const GOOGLE_G = [
  { d: 'M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z', fill: '#4285F4' },
  { d: 'M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z', fill: '#34A853' },
  { d: 'M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z', fill: '#FBBC05' },
  { d: 'M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z', fill: '#EA4335' },
];

export const INTEGRATIONS: Integration[] = [
  {
    id: 'ga4', name: 'Google Analytics 4', bn: 'গুগল অ্যানালিটিক্স', kind: 'analytics',
    desc: 'ওয়েবসাইটের দর্শক, পেজভিউ ও কার্যক্রমের পূর্ণ পরিসংখ্যান।',
    color: '#E37400',
    logo: { viewBox: '0 0 24 24', paths: [
      { d: 'M19 3h2a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z' },
      { d: 'M11 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z' },
      { d: 'M3 15h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z' },
    ] },
    fields: [{ key: 'id', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', hint: 'Google Analytics → Admin → Data Streams থেকে G- দিয়ে শুরু হওয়া আইডি' }],
    helpUrl: 'https://analytics.google.com', helpLabel: 'Google Analytics খুলুন',
  },
  {
    id: 'gtm', name: 'Google Tag Manager', bn: 'গুগল ট্যাগ ম্যানেজার', kind: 'tag',
    desc: 'এক জায়গা থেকে সব মার্কেটিং ট্যাগ পরিচালনা করুন।',
    color: '#246FDB',
    logo: { viewBox: '0 0 24 24', paths: [
      { d: 'M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V22l4-2.5L16 22v-7.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7zm0 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z' },
    ] },
    fields: [{ key: 'id', label: 'Container ID', placeholder: 'GTM-XXXXXXX', hint: 'Tag Manager → Admin → Container Settings থেকে GTM- আইডি' }],
    helpUrl: 'https://tagmanager.google.com', helpLabel: 'Tag Manager খুলুন',
  },
  {
    id: 'fbpixel', name: 'Meta Pixel (Facebook)', bn: 'ফেসবুক পিক্সেল', kind: 'analytics',
    desc: 'ফেসবুক ও ইনস্টাগ্রাম বিজ্ঞাপনের কার্যকারিতা মাপুন।',
    color: '#1877F2',
    logo: { viewBox: '0 0 24 24', paths: [
      { d: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z' },
    ] },
    fields: [{ key: 'id', label: 'Pixel ID', placeholder: '1234567890123456', hint: 'Meta Events Manager → Data Sources থেকে সংখ্যার Pixel ID' }],
    helpUrl: 'https://business.facebook.com/events_manager', helpLabel: 'Events Manager খুলুন',
  },
  {
    id: 'pinterest', name: 'Pinterest Tag', bn: 'পিন্টারেস্ট ট্যাগ', kind: 'tag',
    desc: 'পিন্টারেস্ট দর্শক ও কনভার্সন ট্র্যাক করুন।',
    color: '#E60023',
    logo: { viewBox: '0 0 24 24', paths: [
      { d: 'M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.17-.11-.95-.2-2.4.04-3.44l1.4-5.96s-.36-.72-.36-1.78c0-1.67.97-2.92 2.17-2.92 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.14 0 3.78-2.25 3.78-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.14.9 2.74.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.4.16-1.5-.7-2.43-2.89-2.43-4.65 0-3.78 2.75-7.26 7.93-7.26 4.16 0 7.4 2.97 7.4 6.93 0 4.14-2.61 7.47-6.23 7.47-1.22 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.15 1.12.35 2.31.53 3.55.53 6.63 0 12-5.37 12-12S18.63 0 12 0z' },
    ] },
    fields: [
      { key: 'id', label: 'Tag ID', placeholder: '2612345678901', hint: 'Pinterest Ads → Conversions থেকে Tag ID' },
      { key: 'verify', label: 'ডোমেইন ভেরিফিকেশন কোড (ঐচ্ছিক)', placeholder: 'p:domain_verify কোড', hint: 'Pinterest → Settings → Claimed accounts থেকে' },
    ],
    helpUrl: 'https://ads.pinterest.com', helpLabel: 'Pinterest Ads খুলুন',
  },
  {
    id: 'gsc', name: 'Google Search Console', bn: 'গুগল সার্চ কনসোল', kind: 'verify',
    desc: 'গুগলে ওয়েবসাইটের অবস্থান, ইনডেক্স ও সার্চ পারফরম্যান্স দেখুন।',
    color: '#4285F4',
    logo: { viewBox: '0 0 24 24', paths: GOOGLE_G },
    fields: [{ key: 'verify', label: 'ভেরিফিকেশন কোড', placeholder: 'google-site-verification কোড', hint: 'Search Console → Settings → Ownership verification → HTML tag থেকে content-এর অংশ' }],
    helpUrl: 'https://search.google.com/search-console', helpLabel: 'Search Console খুলুন',
  },
  {
    id: 'bing', name: 'Bing Webmaster Tools', bn: 'বিং ওয়েবমাস্টার', kind: 'verify',
    desc: 'বিং ও মাইক্রোসফ্ট সার্চে ওয়েবসাইট যাচাই ও পরিসংখ্যান।',
    color: '#008373',
    logo: { viewBox: '0 0 24 24', paths: [
      { d: 'M5 3v3.8l4.5 1.8 1.9 5.4 4.1 1.7 5.5-2.1v-3.6l-9-3.6V3L5 3z' },
    ] },
    fields: [{ key: 'verify', label: 'ভেরিফিকেশন কোড', placeholder: 'msvalidate.01 কোড', hint: 'Bing Webmaster → সাইট যোগ → HTML meta tag থেকে content-এর অংশ' }],
    helpUrl: 'https://www.bing.com/webmasters', helpLabel: 'Bing Webmaster খুলুন',
  },
  {
    id: 'gindex', name: 'Google Index', bn: 'গুগল ইনডেক্স', kind: 'index',
    desc: 'সাইটম্যাপ জমা দিয়ে সব পেজ দ্রুত গুগলে ইনডেক্স করুন।',
    color: '#34A853',
    logo: { viewBox: '0 0 24 24', paths: GOOGLE_G },
    fields: [],
    helpUrl: 'https://search.google.com/search-console', helpLabel: 'সাইটম্যাপ জমা দিন',
  },
];

export type IntegrationValues = Record<string, string>;
export const integKey = (id: string, field: string) => `integ.${id}.${field}`;
export const integOn = (values: IntegrationValues, id: string) => values[integKey(id, 'on')] === '1';
export const integVal = (values: IntegrationValues, id: string, field: string) => (values[integKey(id, field)] ?? '').trim();

/** Reads admin integration settings; works during server rendering and in the browser on any host. */
export async function fetchIntegrationSettings(): Promise<IntegrationValues> {
  const url = import.meta.env['VITE_SUPABASE_URL'];
  const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return {};
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?select=key,value&key=like.integ.*`, { headers: { apikey: key }, signal: AbortSignal.timeout(2500) });
    if (!res.ok) return {};
    const rows = (await res.json()) as { key: string; value: string }[];
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

const safeId = (raw: string) => raw.replace(/[^A-Za-z0-9._-]/g, '');

type HeadScript = Record<string, unknown>;
type HeadMeta = { name: string; content: string };

/** Meta tags + scripts for enabled integrations, injected into every public page head. */
export function integrationHead(values: IntegrationValues): { meta: HeadMeta[]; scripts: HeadScript[] } {
  const meta: HeadMeta[] = [];
  const scripts: HeadScript[] = [];

  if (integOn(values, 'gsc')) {
    const code = safeId(integVal(values, 'gsc', 'verify'));
    if (code) meta.push({ name: 'google-site-verification', content: code });
  }
  if (integOn(values, 'bing')) {
    const code = safeId(integVal(values, 'bing', 'verify'));
    if (code) meta.push({ name: 'msvalidate.01', content: code });
  }
  if (integOn(values, 'pinterest')) {
    const code = safeId(integVal(values, 'pinterest', 'verify'));
    if (code) meta.push({ name: 'p:domain_verify', content: code });
  }

  const gtm = safeId(integVal(values, 'gtm', 'id'));
  if (integOn(values, 'gtm') && gtm) {
    scripts.push({ children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');` });
  }

  const ga4 = safeId(integVal(values, 'ga4', 'id'));
  if (integOn(values, 'ga4') && ga4) {
    scripts.push({ src: `https://www.googletagmanager.com/gtag/js?id=${ga4}`, async: true });
    scripts.push({ children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');` });
  }

  const fb = safeId(integVal(values, 'fbpixel', 'id'));
  if (integOn(values, 'fbpixel') && fb) {
    scripts.push({ children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fb}');fbq('track','PageView');` });
  }

  const pin = safeId(integVal(values, 'pinterest', 'id'));
  if (integOn(values, 'pinterest') && pin) {
    scripts.push({ children: `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version='3.0';var t=document.createElement('script');t.async=!0,t.src=e;var r=document.getElementsByTagName('script')[0];r.parentNode.insertBefore(t,r)}}('https://s.pinimg.com/ct/core.js');pintrk('load','${pin}');pintrk('page');` });
  }

  return { meta, scripts };
}

/** GTM <noscript> iframe for the document body, when GTM is enabled. */
export function gtmNoscriptUrl(values: IntegrationValues): string {
  const gtm = safeId(integVal(values, 'gtm', 'id'));
  return integOn(values, 'gtm') && gtm ? `https://www.googletagmanager.com/ns.html?id=${gtm}` : '';
}
