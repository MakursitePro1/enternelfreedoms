import { pageSeo } from '@/lib/seo-pages';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Search, CalendarDays, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Phone, Megaphone, BellRing } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { photos, facilityImages } from '@/lib/content';

export const Route = createFileRoute('/notices/')({
  head: (ctx) => pageSeo(ctx, '/notices'),
  component: Notices,
});

type Notice = { id: string; title: string; body: string; category: string; published_at: string };
const categories = ['সব', 'ভর্তি', 'পরীক্ষা', 'ছুটি', 'অভিভাবক সভা', 'গুরুত্বপূর্ণ', 'সাধারণ'];
const PAGE = 6;

function NoticesHero() {
  return (
    <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[420px] sm:rounded-[1.25rem]">
      <img src={photos[3]} alt="Eternal Freedom Institute Al Islamia ক্যাম্পাস" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-10 lg:px-8">
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Megaphone className="size-3 shrink-0 sm:size-3.5" />নোটিশ বোর্ড</span>
        <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />সর্বশেষ ঘোষণা, ভর্তি ও পরীক্ষার খবর</p>
        <h1 className="mt-1.5 max-w-5xl font-display text-[1.65rem] font-bold leading-[1.15] max-[359px]:text-[1.4rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">নোটিশ ও<br /><span className="text-gold-light">ঘোষণা</span></h1>
        <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">প্রতিষ্ঠানের সকল গুরুত্বপূর্ণ ঘোষণা এক জায়গায়—বিভাগ অনুযায়ী খুঁজে নিন, কোনোটিই মিস হবে না।</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
          <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px]"><a href="#notice-list">নোটিশ দেখুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></a></Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/contact">যোগাযোগ করুন</Link></Button>
        </div>
      </div>
      <div className="relative w-full px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-secondary shadow-elegant sm:rounded-[1.25rem]">
          <div className="grid gap-3 px-4 py-4 sm:grid-cols-3 sm:gap-6 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><BellRing className="size-4" /></span><div className="min-w-0"><div className="text-sm font-semibold text-primary">নিয়মিত হালনাগাদ</div><div className="text-xs text-muted-foreground">সর্বশেষ ঘোষণা সবার আগে</div></div></div>
            <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><CalendarDays className="size-4" /></span><div className="min-w-0"><div className="text-sm font-semibold text-primary">তারিখ অনুযায়ী</div><div className="text-xs text-muted-foreground">নতুন নোটিশ উপরে দেখা যায়</div></div></div>
            <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><Search className="size-4" /></span><div className="min-w-0"><div className="text-sm font-semibold text-primary">সহজে খুঁজুন</div><div className="text-xs text-muted-foreground">বিভাগ ও শব্দ দিয়ে ফিল্টার</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Notices() {
  const [all, setAll] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('সব');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  useEffect(() => { supabase.from('notices').select('id,title,body,category,published_at').order('published_at', { ascending: false }).then(({ data }) => { setAll(data ?? []); setLoading(false); }); }, []);
  const filtered = useMemo(() => all.filter((n) => (cat === 'সব' || n.category === cat) && (!q.trim() || (n.title + n.body).toLowerCase().includes(q.trim().toLowerCase()))), [all, cat, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const list = filtered.slice(page * PAGE, page * PAGE + PAGE);
  useEffect(() => setPage(0), [cat, q]);
  return (
    <Site>
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <NoticesHero />
      </div>

      {/* Filter toolbar */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[0.75rem] bg-secondary p-4 shadow-elegant sm:rounded-[1.25rem] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:flex sm:flex-wrap sm:gap-2.5">
                {categories.map((c) => (
                  <button key={c} type="button" onClick={() => setCat(c)}
                    className={`rounded-full border-2 px-4 py-2 text-[13px] font-semibold shadow-sm transition-colors sm:text-sm ${cat === c ? 'border-gold bg-primary text-primary-foreground' : 'border-field-border bg-background text-primary hover:border-gold hover:bg-gold-soft'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <label className="relative block lg:w-80">
                <Search className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input aria-label="নোটিশ খুঁজুন" placeholder="নোটিশ খুঁজুন..." value={q} onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-xl border-[1.5px] border-field-border bg-background py-3 pe-4 ps-11 text-sm font-medium text-primary outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notice list */}
      <div id="notice-list" className="scroll-mt-24 px-2.5 py-2.5 sm:px-5 sm:py-5">
        <section className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <Heading compact className="mb-0" eyebrow="সব ঘোষণা" title={cat === 'সব' ? 'সর্বশেষ নোটিশসমূহ' : `${cat} সংক্রান্ত নোটিশ`} />
            {!loading && filtered.length > 0 && <span className="shrink-0 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-primary sm:text-sm">{filtered.length.toLocaleString('bn-BD')} টি নোটিশ</span>}
          </div>
          <div className="space-y-3 sm:space-y-4">
            {loading ? [0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary sm:h-32" />) : list.length ? list.map((n) => { const d = new Date(n.published_at); return (
              <Link key={n.id} to="/notices/$id" params={{ id: n.id }} className="group flex gap-4 rounded-2xl bg-background p-4 shadow-elegant premium-card transition-colors hover:bg-secondary/40 sm:gap-5 sm:p-6">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary text-center text-primary-foreground sm:size-20"><div><div className="font-display text-2xl leading-none text-gold-light sm:text-3xl">{d.toLocaleDateString('bn-BD', { day: 'numeric' })}</div><div className="mt-1 text-[11px] sm:text-xs">{d.toLocaleDateString('bn-BD', { month: 'short' })}</div></div></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-accent px-2.5 py-0.5 font-semibold text-primary">{n.category}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="size-3" />{d.toLocaleDateString('bn-BD')}</span>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold text-primary transition-colors group-hover:text-gold sm:text-xl">{n.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{n.body}</p>
                  <span className="mt-3 hidden items-center gap-1.5 text-sm font-semibold text-primary sm:inline-flex">বিস্তারিত দেখুন <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" /></span>
                </div>
                <ArrowRight className="hidden size-5 shrink-0 self-center text-primary transition-transform group-hover:translate-x-1 sm:block rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            ); }) : <div className="rounded-2xl bg-secondary p-10 text-center shadow-elegant sm:p-14"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-gold-light"><Search className="size-6" /></span><p className="mt-4 font-display text-lg font-semibold text-primary">কোনো নোটিশ পাওয়া যায়নি</p><p className="mt-1.5 text-sm text-muted-foreground">অন্য বিভাগ বেছে নিন অথবা অন্য শব্দ দিয়ে খুঁজুন।</p><Button variant="secondary" className="mt-5" onClick={() => { setCat('সব'); setQ(''); }}>সব নোটিশ দেখুন</Button></div>}
          </div>
          {pages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button variant="secondary" size="icon" aria-label="আগের পাতা" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4 rtl:rotate-180" /></Button>
              {Array.from({ length: pages }, (_, i) => <Button key={i} variant={i === page ? 'default' : 'secondary'} size="icon" onClick={() => setPage(i)}>{(i + 1).toLocaleString('bn-BD')}</Button>)}
              <Button variant="secondary" size="icon" aria-label="পরের পাতা" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="size-4 rtl:rotate-180" /></Button>
            </div>
          )}
        </section>
      </div>

      {/* CTA banner */}
      <div className="px-2.5 py-2.5 sm:px-5 sm:py-5 sm:pb-5">
        <section className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:rounded-[1.25rem]">
          <img src={facilityImages.quran} alt="কুরআন শিক্ষা" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-bold text-primary sm:text-xs"><Sparkles className="size-3.5" />ভর্তি চলছে</span>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-4xl">নতুন ঘোষণা মিস করবেন না—<br className="hidden sm:block" /> এখনই ভর্তির আবেদন করুন</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/90 sm:text-base sm:leading-8">আসন সীমিত। নোটিশের সর্বশেষ খবর জানতে সাথেই থাকুন, অথবা সরাসরি কথা বলুন আমাদের সাথে।</p>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Button size="lg" asChild className="bg-gold text-primary hover:bg-gold-light max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px]"><Link to="/admission">অনলাইনে আবেদন করুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></Link></Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px]"><Link to="/contact"><Phone className="size-4" />যোগাযোগ করুন</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </Site>
  );
}
