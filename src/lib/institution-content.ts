import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type ContentKind = 'teacher' | 'achievement' | 'event' | 'gallery' | 'testimonial' | 'facility' | 'meal' | 'program' | 'stat';
export type InstitutionItem = { id: string; kind: ContentKind; title: string; body: string; image_url: string | null; detail: string | null; category: string | null; published: boolean; sort_order: number; created_at: string };

export const contentKinds: { key: ContentKind; label: string }[] = [
  { key: 'teacher', label: 'শিক্ষক ও কর্মী' },
  { key: 'achievement', label: 'অর্জন' },
  { key: 'event', label: 'খবর ও অনুষ্ঠান' },
  { key: 'gallery', label: 'গ্যালারি' },
  { key: 'testimonial', label: 'অভিভাবকের মতামত' },
  { key: 'facility', label: 'সুযোগ-সুবিধা' },
  { key: 'meal', label: 'খাবারের তথ্য' },
  { key: 'program', label: 'বিভাগের বিস্তারিত' },
  { key: 'stat', label: 'প্রতিষ্ঠানের তথ্য' },
];

export function useInstitutionContent(kind?: ContentKind) {
  const [items, setItems] = useState<InstitutionItem[]>([]);
  useEffect(() => {
    let alive = true;
    let query = supabase.from('institution_content').select('*').eq('published', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (kind) query = query.eq('kind', kind);
    query.then(({ data }) => { if (alive) setItems((data ?? []) as InstitutionItem[]); });
    return () => { alive = false; };
  }, [kind]);
  return items;
}