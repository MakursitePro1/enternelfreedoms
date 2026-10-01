import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const defaultSettings: Record<string, string> = {
  phone: '০১৭০০-০০০০০০',
  phone2: '',
  email: 'info@eternalfreedoms.com',
  address: 'গফরগাঁও, ময়মনসিংহ, বাংলাদেশ',
  office_hours: 'শনি–বৃহস্পতি, সকাল ৮টা – বিকেল ৫টা',
  bkash: '০১৭০০-০০০০০০',
  nagad: '০১৭০০-০০০০০০',
  facebook: '',
  youtube: '',
  admission_badge: 'ভর্তি চলছে',
  video_url: '',
  is_demo: 'true',
};

export const settingFields: [string, string][] = [
  ['phone', 'প্রধান ফোন নম্বর'], ['phone2', 'বিকল্প ফোন নম্বর'], ['email', 'ইমেইল'], ['address', 'ঠিকানা'],
  ['office_hours', 'অফিস সময়'], ['bkash', 'বিকাশ নম্বর (পেমেন্টের জন্য)'], ['nagad', 'নগদ নম্বর (পেমেন্টের জন্য)'],
  ['facebook', 'ফেসবুক পেজ লিংক'], ['youtube', 'ইউটিউব চ্যানেল লিংক'], ['admission_badge', 'হোম পেজের ভর্তি ব্যাজ লেখা'],
  ['video_url', 'ক্যাম্পাস ভিডিও (YouTube লিংক)'], ['is_demo', 'নমুনা তথ্যের নোট দেখাবে? (true / false)'],
];

let cache: Record<string, string> | null = null;
const listeners = new Set<(s: Record<string, string>) => void>();

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(cache ?? defaultSettings);
  useEffect(() => {
    listeners.add(setSettings);
    if (!cache) {
      supabase.from('site_settings').select('key,value').then(({ data }) => {
        const next = { ...defaultSettings };
        for (const row of data ?? []) next[row.key] = row.value;
        cache = next;
        listeners.forEach((l) => l(next));
      });
    }
    return () => { listeners.delete(setSettings); };
  }, []);
  return settings;
}

export function telHref(phone: string) {
  const map: Record<string, string> = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  return 'tel:' + phone.replace(/[০-৯]/g, (d) => map[d]).replace(/[^0-9+]/g, '');
}

export function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
