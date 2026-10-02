import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'bn' | 'en';
export const languages: { key: Lang; label: string }[] = [
  { key: 'bn', label: 'বাংলা' },
  { key: 'en', label: 'English' },
];

/** Translations keyed by the Bangla source text. Missing keys fall back to Bangla. */
const dict: Record<string, { en: string }> = {
  'হোম': { en: 'Home', ar: 'الرئيسية' },
  'প্রতিষ্ঠান পরিচিতি': { en: 'About', ar: 'عن المؤسسة' },
  'শিক্ষা কার্যক্রম': { en: 'Academics', ar: 'البرامج التعليمية' },
  'আবাসিক জীবন': { en: 'Residential Life', ar: 'الحياة السكنية' },
  'ভর্তি': { en: 'Admission', ar: 'القبول' },
  'বইয়ের দোকান': { en: 'Book Store', ar: 'متجر الكتب' },
  'নোটিশ': { en: 'Notices', ar: 'الإعلانات' },
  'আরও': { en: 'More', ar: 'المزيد' },
  'শিক্ষকমণ্ডলী': { en: 'Teachers', ar: 'المعلمون' },
  'ক্যাম্পাস ও সুবিধা': { en: 'Campus & Facilities', ar: 'الحرم والمرافق' },
  'খবর ও অনুষ্ঠান': { en: 'News & Events', ar: 'الأخبار والفعاليات' },
  'গ্যালারি': { en: 'Gallery', ar: 'المعرض' },
  'অভিভাবক নির্দেশিকা': { en: 'Parent Guide', ar: 'دليل أولياء الأمور' },
  'যোগাযোগ': { en: 'Contact', ar: 'اتصل بنا' },
  'ভর্তি আবেদন': { en: 'Apply Now', ar: 'قدّم الآن' },
  'অ্যাডমিন': { en: 'Admin', ar: 'الإدارة' },
  'সর্বশেষ নোটিশ': { en: 'Latest notice', ar: 'آخر إعلان' },
  'কুরআনের আলোয় জ্ঞান, চরিত্র ও দক্ষতার সমন্বিত শিক্ষা': { en: 'Integrated education of knowledge, character and skills in the light of the Qur\'an', ar: 'تعليم متكامل للعلم والخلق والمهارة في ضوء القرآن' },
  'গফরগাঁও, ময়মনসিংহের সমন্বিত শিক্ষা প্রতিষ্ঠান': { en: 'An integrated institution in Gafargaon, Mymensingh', ar: 'مؤسسة تعليمية متكاملة في غفرغاؤن، ميمنسينغ' },
  'ভর্তি সম্পর্কে জানুন': { en: 'Learn about admission', ar: 'تعرّف على القبول' },
  'ক্যাম্পাস ঘুরে দেখুন': { en: 'Explore the campus', ar: 'تجوّل في الحرم' },
  'গুরুত্বপূর্ণ লিংক': { en: 'Quick links', ar: 'روابط مهمة' },
  'অফিস সময়': { en: 'Office hours', ar: 'ساعات العمل' },
  'সর্বস্বত্ব সংরক্ষিত।': { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  'কেন Eternal Freedom?': { en: 'Why Eternal Freedom?', ar: 'لماذا Eternal Freedom؟' },
  'অধ্যক্ষের বাণী': { en: 'Principal\'s Message', ar: 'كلمة المدير' },
  'একটি দিন Eternal Freedom-এ': { en: 'A Day at Eternal Freedom', ar: 'يوم في Eternal Freedom' },
  'খাবার ও পুষ্টি': { en: 'Food & Nutrition', ar: 'الغذاء والتغذية' },
  'নিরাপত্তা ও যত্ন': { en: 'Safety & Care', ar: 'الأمان والرعاية' },
  'অর্জনসমূহ': { en: 'Achievements', ar: 'الإنجازات' },
  'ভর্তি প্রক্রিয়া': { en: 'Admission Process', ar: 'خطوات القبول' },
  'নোটিশ বোর্ড': { en: 'Notice Board', ar: 'لوحة الإعلانات' },
  'অভিভাবকদের মতামত': { en: 'Parent Testimonials', ar: 'آراء أولياء الأمور' },
  'ক্যাম্পাস ভিডিও': { en: 'Campus Video', ar: 'فيديو الحرم' },
  'বার্তা পাঠান': { en: 'Send message', ar: 'أرسل رسالة' },
  'সব দেখুন': { en: 'View all', ar: 'عرض الكل' },
  'এখনই কিনুন': { en: 'Buy now', ar: 'اشترِ الآن' },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (bn: string) => string };
const LangContext = createContext<Ctx>({ lang: 'bn', setLang: () => {}, t: (s) => s });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bn');
  useEffect(() => {
    const saved = window.localStorage.getItem('ef-lang') as Lang | null;
    if (saved === 'en' || saved === 'ar') setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); window.localStorage.setItem('ef-lang', l); };
  const t = (bn: string) => (lang === 'bn' ? bn : dict[bn]?.[lang] ?? bn);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
