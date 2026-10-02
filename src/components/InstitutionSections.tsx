import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Award, CalendarDays, ChevronLeft, ChevronRight, Quote, ShieldCheck, Camera, HeartPulse, Eye, Home, PhoneCall, Lock } from 'lucide-react';
import { Heading, DemoNote } from '@/components/Site';
import { useInstitutionContent, parseLabeled, type ContentKind, type InstitutionItem } from '@/lib/institution-content';
import { facilityImage, facilityImageList, initials, isDemo, photos, pick } from '@/lib/content';
import { youtubeEmbed } from '@/lib/site-settings';

export function itemImage(item: InstitutionItem, index = 0) {
  if (item.image_url) return item.image_url;
  const fac = item.kind === 'facility' ? facilityImage(item.category) : undefined;
  if (fac) return fac;
  return pick([...facilityImageList, ...photos], index);
}

export function InstitutionSections({ kind, eyebrow, title, empty, limit }: { kind: ContentKind; eyebrow: string; title: string; empty?: string; limit?: number }) {
  const items = useInstitutionContent(kind);
  const visible = limit ? items.slice(0, limit) : items;
  if (!visible.length && !empty) return null;
  return (
    <section className="bg-secondary px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Heading eyebrow={eyebrow} title={title} />
        {visible.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((item, i) => <InstitutionCard key={item.id} item={item} index={i} />)}</div> : <p className="text-muted-foreground">{empty}</p>}
      </div>
    </section>
  );
}

export function InstitutionCard({ item, index = 0 }: { item: InstitutionItem; index?: number }) {
  const embed = item.image_url ? youtubeEmbed(item.image_url) : null;
  return (
    <article className="overflow-hidden bg-background premium-card shadow-elegant">
      {embed ? <div className="aspect-video bg-primary"><iframe title={item.title} src={embed} loading="lazy" allowFullScreen className="h-full w-full" /></div> : <img src={itemImage(item, index)} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">{item.category && <span className="text-xs font-semibold text-gold">{item.category}</span>}<DemoNote show={isDemo(item.slug)} /></div>
        <h3 className="mt-2 font-display text-xl font-semibold text-primary">{item.title}</h3>
        {item.detail && <p className="mt-2 text-sm font-medium text-primary">{item.detail}</p>}
        {item.body && <p className="mt-3 line-clamp-4 whitespace-pre-line leading-7 text-muted-foreground">{item.body}</p>}
      </div>
    </article>
  );
}

export function StatsBar({ dark = false, hero = false }: { dark?: boolean; hero?: boolean }) {
  const items = useInstitutionContent('stat');
  if (!items.length) return null;
  return (
    <div className={hero ? 'grid grid-cols-6 border-t border-primary-foreground/25 text-primary-foreground sm:grid-cols-5' : `grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-5 ${dark ? 'bg-primary-foreground/15' : 'bg-border'} shadow-elegant`}>
      {items.map((s) => (
        <div key={s.id} className={hero ? 'col-span-2 min-w-0 border-b border-primary-foreground/15 px-1 py-2 text-center last:nth-[4]:col-span-3 nth-[5]:col-span-3 sm:col-span-1 sm:border-b-0 sm:border-r sm:border-primary-foreground/20 sm:px-3 sm:py-3 sm:last:border-r-0' : `p-6 text-center ${dark ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
          <div className={`font-display font-bold text-gold ${hero ? 'text-xl leading-tight sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>{s.detail}</div>
          <div className={`${hero ? 'mt-0.5 text-xs sm:text-sm' : 'mt-1'} font-semibold ${dark || hero ? '' : 'text-primary'}`}>{s.title}</div>
          {s.body && <div className={`${hero ? 'mt-0.5 text-[10px] leading-tight text-primary-foreground/75 sm:text-xs' : `mt-1 text-xs ${dark ? 'opacity-70' : 'text-muted-foreground'}`}`}>{s.body}</div>}
        </div>
      ))}
    </div>
  );
}

export function TeacherCard({ item }: { item: InstitutionItem }) {
  const { fields } = parseLabeled(item.body);
  return (
    <Link to="/teachers/$id" params={{ id: item.id }} className="group block overflow-hidden bg-background text-center premium-card shadow-elegant">
      <div className="relative bg-primary px-6 pb-14 pt-8"><div className="islamic-pattern absolute inset-0 opacity-40" /><span className="relative text-xs font-semibold text-gold-light">{item.category}</span></div>
      <div className="-mt-12 px-6 pb-7">
        {item.image_url ? <img src={item.image_url} alt={item.title} className="mx-auto size-24 rounded-full border-4 border-background object-cover" /> : <div className="mx-auto grid size-24 place-items-center rounded-full border-4 border-background bg-gold-gradient font-display text-2xl font-bold text-primary">{initials(item.title)}</div>}
        <h3 className="mt-4 font-display text-lg font-semibold text-primary">{item.title}</h3>
        <p className="text-sm text-gold">{item.detail}</p>
        {fields['যোগ্যতা'] && <p className="mt-3 text-xs leading-5 text-muted-foreground">{fields['যোগ্যতা']}</p>}
        {fields['অভিজ্ঞতা'] && <p className="mt-1 text-xs font-semibold text-primary">অভিজ্ঞতা: {fields['অভিজ্ঞতা']}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-gold">প্রোফাইল দেখুন <ArrowUpRight className="size-4" /></span>
        <div className="mt-2"><DemoNote show={isDemo(item.slug)} /></div>
      </div>
    </Link>
  );
}

export function TeachersGrid({ limit }: { limit?: number }) {
  const items = useInstitutionContent('teacher');
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return <p className="text-muted-foreground">শিক্ষকদের তথ্য শীঘ্রই প্রকাশ করা হবে।</p>;
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.slice(0, limit ?? list.length).map((t) => <TeacherCard key={t.id} item={t} />)}</div>;
}

export function TestimonialSlider() {
  const items = useInstitutionContent('testimonial');
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setI((x) => (x + 1) % items.length), 6000);
    return () => window.clearInterval(id);
  }, [items.length]);
  const cur = items[i % Math.max(items.length, 1)];
  if (!cur) return null;
  const embed = cur.image_url ? youtubeEmbed(cur.image_url) : null;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
      <div className="relative rounded-3xl bg-background p-8 shadow-elegant sm:p-12">
        <Quote className="size-12 text-gold" />
        <p key={cur.id} className="fade-slide mt-6 font-display text-xl leading-9 text-primary sm:text-2xl sm:leading-10">“{cur.body}”</p>
        <div className="mt-8 flex items-center gap-4">
          {cur.image_url && !embed ? <img src={cur.image_url} alt={cur.title} className="size-14 rounded-full object-cover" /> : <div className="grid size-14 place-items-center rounded-full bg-primary font-display text-lg text-gold-light">{initials(cur.title)}</div>}
          <div><div className="font-semibold text-primary">{cur.title}</div><div className="text-sm text-muted-foreground">{cur.detail}</div></div>
          <div className="ms-auto"><DemoNote show={isDemo(cur.slug)} /></div>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <button type="button" aria-label="আগের মতামত" onClick={() => setI((i - 1 + items.length) % items.length)} className="grid size-10 place-items-center rounded-full bg-secondary text-primary hover:bg-gold"><ChevronLeft className="size-5 rtl:rotate-180" /></button>
          <button type="button" aria-label="পরের মতামত" onClick={() => setI((i + 1) % items.length)} className="grid size-10 place-items-center rounded-full bg-secondary text-primary hover:bg-gold"><ChevronRight className="size-5 rtl:rotate-180" /></button>
          <div className="ms-2 flex gap-1.5">{items.map((t, k) => <button key={t.id} type="button" aria-label={`মতামত ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i % items.length ? 'w-6 bg-gold' : 'w-2 bg-border'}`} />)}</div>
        </div>
      </div>
      <div className="grid gap-3">
        {embed ? <div className="aspect-video overflow-hidden rounded-2xl bg-primary"><iframe title={cur.title} src={embed} loading="lazy" allowFullScreen className="h-full w-full" /></div> : items.slice(0, 4).map((t, k) => (
          <button key={t.id} type="button" onClick={() => setI(k)} className={`flex items-center gap-3 rounded-2xl p-4 text-start transition-colors ${k === i % items.length ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}>
            <div className={`grid size-10 shrink-0 place-items-center rounded-full font-display ${k === i % items.length ? 'bg-gold text-primary' : 'bg-secondary text-primary'}`}>{initials(t.title)}</div>
            <div className="min-w-0"><div className="truncate font-semibold">{t.title}</div><div className="truncate text-xs opacity-70">{t.detail}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function EventCard({ item, index = 0 }: { item: InstitutionItem; index?: number }) {
  return (
    <Link to="/activities/$id" params={{ id: item.id }} className="group block overflow-hidden bg-background premium-card shadow-elegant">
      <div className="relative overflow-hidden"><img src={itemImage(item, index)} alt={item.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />{item.category && <span className="absolute start-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-primary">{item.category}</span>}</div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5 text-gold" />{item.detail ?? new Date(item.created_at).toLocaleDateString('bn-BD')}<DemoNote show={isDemo(item.slug)} /></div>
        <h3 className="mt-3 font-display text-xl font-semibold text-primary">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-gold">বিস্তারিত পড়ুন <ArrowUpRight className="size-4" /></span>
      </div>
    </Link>
  );
}

export function ActivitiesTeaser() {
  const items = useInstitutionContent('event');
  if (!items.length) return null;
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.slice(0, 3).map((item, i) => <EventCard key={item.id} item={item} index={i} />)}</div>;
}

export function AchievementsGrid() {
  const items = useInstitutionContent('achievement');
  if (!items.length) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => (
        <div key={a.id} className="relative overflow-hidden rounded-2xl bg-background p-7 shadow-elegant premium-card">
          <div className="grid size-14 place-items-center rounded-2xl bg-gold-gradient text-primary"><Award className="size-7" /></div>
          <div className="mt-5 text-sm font-bold text-gold">{a.detail}</div>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-primary">{a.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{a.body}</p>
          <div className="mt-3"><DemoNote show={isDemo(a.slug)} /></div>
        </div>
      ))}
    </div>
  );
}

const safetyIcons = [Camera, Lock, HeartPulse, Eye, Home, PhoneCall];
export function SafetyGrid({ dark = false }: { dark?: boolean }) {
  const items = useInstitutionContent('safety');
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const Icon = safetyIcons[i % safetyIcons.length] ?? ShieldCheck;
        return (
          <div key={s.id} className={`flex gap-4 rounded-2xl p-6 ${dark ? 'bg-primary-foreground/10' : 'bg-background shadow-elegant'}`}>
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold text-primary"><Icon className="size-6" /></div>
            <div><h3 className={`font-semibold ${dark ? '' : 'text-primary'}`}>{s.title}</h3><p className={`mt-1 text-sm leading-6 ${dark ? 'opacity-75' : 'text-muted-foreground'}`}>{s.body}</p></div>
          </div>
        );
      })}
    </div>
  );
}

export function MealTable({ limit }: { limit?: number }) {
  const items = useInstitutionContent('meal');
  if (!items.length) return null;
  const rows = items.slice(0, limit ?? items.length).map((m) => ({ ...m, parsed: parseLabeled(m.body).fields }));
  return (
    <div className="overflow-x-auto rounded-2xl bg-background shadow-elegant">
      <table className="w-full min-w-[620px] text-sm">
        <thead><tr className="bg-primary text-primary-foreground"><th className="p-4 text-start">দিন</th><th className="p-4 text-start">সকালের নাশতা</th><th className="p-4 text-start">দুপুরের খাবার</th><th className="p-4 text-start">রাতের খাবার</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={r.id} className={i % 2 ? 'bg-secondary' : ''}><td className="p-4 font-semibold text-primary">{r.title}</td><td className="p-4 text-muted-foreground">{r.parsed['সকাল'] ?? '—'}</td><td className="p-4 text-muted-foreground">{r.parsed['দুপুর'] ?? '—'}</td><td className="p-4 text-muted-foreground">{r.parsed['রাত'] ?? '—'}</td></tr>)}</tbody>
      </table>
      {rows.some((r) => isDemo(r.slug)) && <div className="p-3 text-end"><DemoNote /></div>}
    </div>
  );
}

export function FeeTable() {
  const items = useInstitutionContent('fee');
  if (!items.length) return null;
  return (
    <div className="overflow-hidden rounded-2xl bg-background shadow-elegant">
      {items.map((f, i) => (
        <div key={f.id} className={`flex flex-wrap items-center justify-between gap-3 p-5 ${i % 2 ? 'bg-secondary' : ''}`}>
          <div><div className="font-semibold text-primary">{f.title}</div><div className="text-xs text-muted-foreground">{f.category}{f.body ? ` · ${f.body}` : ''}</div></div>
          <div className="font-display text-xl font-bold text-primary">{f.detail}</div>
        </div>
      ))}
      {items.some((f) => isDemo(f.slug)) && <div className="flex items-center justify-between gap-3 bg-accent p-4 text-xs text-muted-foreground"><span>চূড়ান্ত ফি প্রতিষ্ঠানের অফিস থেকে নিশ্চিত করুন।</span><DemoNote /></div>}
    </div>
  );
}
