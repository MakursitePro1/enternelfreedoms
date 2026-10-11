import { seo } from '@/lib/seo';

export const adminPages = {
  overview: 'সারসংক্ষেপ', admissions: 'ভর্তি আবেদন', orders: 'বইয়ের অর্ডার',
  messages: 'যোগাযোগ বার্তা', notices: 'নোটিশ', books: 'বই', settings: 'সেটিংস',
  seo: 'SEO', teacher: 'শিক্ষক ও কর্মী', event: 'খবর ও অনুষ্ঠান', gallery: 'গ্যালারি ছবি',
  video: 'ভিডিও', testimonial: 'অভিভাবকের মতামত', achievement: 'অর্জন',
  facility: 'সুযোগ-সুবিধা', meal: 'খাবারের মেনু', stat: 'পরিসংখ্যান',
  safety: 'নিরাপত্তা ও যত্ন', fee: 'ফি তালিকা', faq: 'প্রশ্নোত্তর', program: 'বিভাগের অতিরিক্ত তথ্য',
} as const;

export type AdminPageKey = keyof typeof adminPages;
export type AdminTab = 'overview' | 'admissions' | 'orders' | 'messages' | 'notices' | 'books' | 'content' | 'seo' | 'settings';

export function adminPageHead(key: AdminPageKey) {
  return { meta: [...seo(`${adminPages[key]} — প্রশাসনিক ব্যবস্থাপনা`, `Eternal Freedom Institute Al Islamia-এর ${adminPages[key]} পরিচালনার অনুমোদিত পাতা।`).meta, { name: 'robots', content: 'noindex, nofollow' }] };
}