import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'bn' | 'en';
export const languages: { key: Lang; label: string }[] = [
  { key: 'bn', label: 'বাংলা' },
  { key: 'en', label: 'English' },
];

/** Translations keyed by the Bangla source text. Missing keys fall back to Bangla. */
const dict: Record<string, { en: string }> = {
  'হোম': { en: 'Home' },
  'প্রতিষ্ঠান পরিচিতি': { en: 'About' },
  'শিক্ষা কার্যক্রম': { en: 'Academics' },
  'আবাসিক জীবন': { en: 'Residential Life' },
  'ভর্তি': { en: 'Admission' },
  'বইয়ের দোকান': { en: 'Book Store' },
  'নোটিশ': { en: 'Notices' },
  'আরও': { en: 'More' },
  'শিক্ষকমণ্ডলী': { en: 'Teachers' },
  'ক্যাম্পাস ও সুবিধা': { en: 'Campus & Facilities' },
  'খবর ও অনুষ্ঠান': { en: 'News & Events' },
  'গ্যালারি': { en: 'Gallery' },
  'অভিভাবক নির্দেশিকা': { en: 'Parent Guide' },
  'যোগাযোগ': { en: 'Contact' },
  'ভর্তি আবেদন': { en: 'Apply Now' },
  'অ্যাডমিন': { en: 'Admin' },
  'সর্বশেষ নোটিশ': { en: 'Latest notice' },
  'কুরআনের আলোয় জ্ঞান, চরিত্র ও দক্ষতার সমন্বিত শিক্ষা': { en: 'Integrated education of knowledge, character and skills in the light of the Qur\'an' },
  'গফরগাঁও, ময়মনসিংহের সমন্বিত শিক্ষা প্রতিষ্ঠান': { en: 'An integrated institution in Gafargaon, Mymensingh' },
  'ভর্তি সম্পর্কে জানুন': { en: 'Learn about admission' },
  'ক্যাম্পাস ঘুরে দেখুন': { en: 'Explore the campus' },
  'গুরুত্বপূর্ণ লিংক': { en: 'Quick links' },
  'অফিস সময়': { en: 'Office hours' },
  'সর্বস্বত্ব সংরক্ষিত।': { en: 'All rights reserved.' },
  'কেন Eternal Freedom?': { en: 'Why Eternal Freedom?' },
  'অধ্যক্ষের বাণী': { en: 'Principal\'s Message' },
  'একটি দিন Eternal Freedom-এ': { en: 'A Day at Eternal Freedom' },
  'খাবার ও পুষ্টি': { en: 'Food & Nutrition' },
  'নিরাপত্তা ও যত্ন': { en: 'Safety & Care' },
  'অর্জনসমূহ': { en: 'Achievements' },
  'ভর্তি প্রক্রিয়া': { en: 'Admission Process' },
  'নোটিশ বোর্ড': { en: 'Notice Board' },
  'অভিভাবকদের মতামত': { en: 'Parent Testimonials' },
  'ক্যাম্পাস ভিডিও': { en: 'Campus Video' },
  'বার্তা পাঠান': { en: 'Send message' },
  'সব দেখুন': { en: 'View all' },
  'এখনই কিনুন': { en: 'Buy now' },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (bn: string) => string };
const LangContext = createContext<Ctx>({ lang: 'bn', setLang: () => {}, t: (s) => s });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bn');
  useEffect(() => {
    const saved = window.localStorage.getItem('ef-lang') as Lang | null;
    if (saved === 'en') setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); window.localStorage.setItem('ef-lang', l); };
  const t = (bn: string) => (lang === 'bn' ? bn : dict[bn]?.[lang] ?? bn);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
