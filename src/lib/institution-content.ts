import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContentKind = 'teacher' | 'achievement' | 'event' | 'gallery' | 'testimonial' | 'facility' | 'meal' | 'program' | 'stat' | 'video' | 'safety' | 'fee' | 'faq' | 'news';
export type InstitutionItem = { id: string; kind: ContentKind; title: string; body: string; image_url: string | null; detail: string | null; category: string | null; published: boolean; sort_order: number; created_at: string; slug: string | null };

/** Field hints per kind so admins know what each box means. */
export const contentKinds: { key: ContentKind; label: string; titleLabel: string; detailLabel: string; categoryLabel: string; bodyLabel: string }[] = [
  { key: 'teacher', label: 'শিক্ষক ও কর্মী', titleLabel: 'নাম', detailLabel: 'পদবি', categoryLabel: 'বিভাগ / বিষয়', bodyLabel: 'যোগ্যতা: ...\nঅভিজ্ঞতা: ...\nপরিচিতি' },
  { key: 'event', label: 'খবর ও অনুষ্ঠান', titleLabel: 'শিরোনাম', detailLabel: 'তারিখ', categoryLabel: 'ধরন (বনভোজন, প্রতিযোগিতা...)', bodyLabel: 'বিস্তারিত' },
  { key: 'gallery', label: 'গ্যালারি ছবি', titleLabel: 'ছবির নাম', detailLabel: 'ছোট বিবরণ', categoryLabel: 'গ্যালারি বিভাগ (ক্যাম্পাস, হিফজ...)', bodyLabel: 'বিবরণ' },
  { key: 'video', label: 'ভিডিও', titleLabel: 'ভিডিওর নাম', detailLabel: 'ছোট বিবরণ', categoryLabel: 'বিভাগ', bodyLabel: 'বিবরণ (ছবির ঘরে YouTube লিংক দিন)' },
  { key: 'testimonial', label: 'অভিভাবকের মতামত', titleLabel: 'অভিভাবকের নাম', detailLabel: 'শিক্ষার্থীর শ্রেণি', categoryLabel: 'সম্পর্ক', bodyLabel: 'মতামত' },
  { key: 'achievement', label: 'অর্জন', titleLabel: 'অর্জনের নাম', detailLabel: 'সাল', categoryLabel: 'ধরন', bodyLabel: 'বিবরণ' },
  { key: 'facility', label: 'সুযোগ-সুবিধা', titleLabel: 'সুবিধার নাম', detailLabel: 'উপকারিতা (কমা দিয়ে)', categoryLabel: 'ছবির ধরন (dorm, dining, classroom, playground, library, quran)', bodyLabel: 'বিবরণ' },
  { key: 'meal', label: 'খাবারের মেনু', titleLabel: 'দিন', detailLabel: 'বিশেষ নোট', categoryLabel: 'তালিকা', bodyLabel: 'সকাল: ...\nদুপুর: ...\nরাত: ...' },
  { key: 'stat', label: 'পরিসংখ্যান', titleLabel: 'নাম (যেমন শিক্ষার্থী)', detailLabel: 'সংখ্যা (যেমন ৪৫০+)', categoryLabel: '—', bodyLabel: 'ছোট বিবরণ' },
  { key: 'safety', label: 'নিরাপত্তা ও যত্ন', titleLabel: 'শিরোনাম', detailLabel: '—', categoryLabel: '—', bodyLabel: 'বিবরণ' },
  { key: 'fee', label: 'ফি তালিকা', titleLabel: 'ফির নাম', detailLabel: 'পরিমাণ', categoryLabel: 'বিভাগ', bodyLabel: 'নোট' },
  { key: 'faq', label: 'প্রশ্নোত্তর', titleLabel: 'প্রশ্ন', detailLabel: '—', categoryLabel: 'বিভাগ (ভর্তি, আবাসিক জীবন...)', bodyLabel: 'উত্তর' },
  { key: 'program', label: 'বিভাগের অতিরিক্ত তথ্য', titleLabel: 'শিরোনাম', detailLabel: 'ছোট তথ্য', categoryLabel: 'বিভাগ', bodyLabel: 'বিস্তারিত' },
];

const CONTENT_CHANGED = 'ef-institution-content-changed';
export function notifyInstitutionContentChanged() {
  window.dispatchEvent(new Event(CONTENT_CHANGED));
  localStorage.setItem(CONTENT_CHANGED, `${Date.now()}-${Math.random()}`);
}

export function usePublishedContent(kind?: ContentKind) {
  const [items, setItems] = useState<InstitutionItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    let generation = 0;
    const refresh = async () => {
      const current = ++generation;
      let query = supabase.from('institution_content').select('*').eq('published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (kind) query = query.eq('kind', kind);
      const { data, error } = await query;
      if (alive && current === generation && !error) {
        setItems((previous) => JSON.stringify(previous) === JSON.stringify(data) ? previous : (data ?? []) as InstitutionItem[]);
        setLoaded(true);
      }
    };
    void refresh();
    if (kind && kind !== 'teacher') return () => { alive = false; };
    const visibleRefresh = () => { if (document.visibilityState === 'visible') void refresh(); };
    const storageRefresh = (event: StorageEvent) => { if (event.key === CONTENT_CHANGED) void refresh(); };
    const channel = supabase.channel(`published-content-${kind ?? 'all'}-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'institution_content' }, () => void refresh())
      .subscribe((status) => { if (status === 'SUBSCRIBED') void refresh(); });
    // Recovery reads cover disconnects and rows hidden by SELECT policies after unpublishing.
    const timer = window.setInterval(visibleRefresh, 5000);
    window.addEventListener(CONTENT_CHANGED, visibleRefresh);
    window.addEventListener('storage', storageRefresh);
    window.addEventListener('focus', visibleRefresh);
    window.addEventListener('online', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    return () => {
      alive = false;
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
      window.removeEventListener(CONTENT_CHANGED, visibleRefresh);
      window.removeEventListener('storage', storageRefresh);
      window.removeEventListener('focus', visibleRefresh);
      window.removeEventListener('online', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
    };
  }, [kind]);
  return { items, loaded };
}

export function useInstitutionContent(kind?: ContentKind) {
  return usePublishedContent(kind).items;
}

export function parseLabeled(body: string) {
  const fields: Record<string, string> = {};
  const rest: string[] = [];
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*([^:：]{2,12})[:：]\s*(.+)$/);
    if (m?.[1] && m[2]) fields[m[1].trim()] = m[2].trim(); else if (line.trim()) rest.push(line.trim());
  }
  return { fields, text: rest.join('\n') };
}
