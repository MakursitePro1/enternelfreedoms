import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { ArrowUpRight, Award, CalendarDays, ChevronLeft, ChevronRight, Quote, ShieldCheck, Camera, HeartPulse, Eye, Home, PhoneCall, Lock } from 'lucide-react';
import { Heading, DemoNote } from '@/components/Site';
import { Button } from '@/components/ui/button';
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
    <div className={hero ? 'grid grid-cols-5 border-t border-primary-foreground/25 text-primary-foreground' : `grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-5 ${dark ? 'bg-primary-foreground/15' : 'bg-border'} shadow-elegant`}>
      {items.map((s) => (
        <div key={s.id} className={hero ? 'min-w-0 border-r border-primary-foreground/20 px-0.5 py-2 text-center last:border-r-0 sm:px-3 sm:py-3' : `p-6 text-center ${dark ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
          <div className={`font-display font-bold text-gold ${hero ? 'text-base leading-tight sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>{s.detail}</div>
          <div className={`${hero ? 'mt-0.5 text-[10px] leading-tight sm:text-sm' : 'mt-1'} font-semibold ${dark || hero ? '' : 'text-primary'}`}>{s.title}</div>
          {s.body && <div className={`${hero ? 'mt-0.5 hidden text-xs leading-tight text-primary-foreground/75 sm:block' : `mt-1 text-xs ${dark ? 'opacity-70' : 'text-muted-foreground'}`}`}>{s.body}</div>}
        </div>
      ))}
    </div>
  );
}

export function TeacherCard({ item }: { item: InstitutionItem }) {
  const { fields } = parseLabeled(item.body);
  return (
    <Link to="/teachers/$id" params={{ id: item.id }} className="group block h-full overflow-hidden rounded-xl border-[0.5px] border-border bg-card p-1 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-primary font-teacher text-primary-foreground">
        <div className="relative overflow-hidden">
          {item.image_url
            ? <img src={item.image_url} alt={item.title} loading="lazy" width={768} height={960} className="aspect-[10/9] w-full object-cover object-top brightness-105 transition-transform duration-500 group-hover:scale-[1.03]" />
            : <div className="grid aspect-[10/9] w-full place-items-center"><div className="grid size-12 place-items-center rounded-full bg-gold font-display text-lg font-bold text-primary">{initials(item.title)}</div></div>}
          {item.category && <span className="absolute left-2 top-2 max-w-[85%] truncate rounded-md bg-gold px-1.5 py-0.5 text-[9px] font-bold leading-tight text-primary shadow-sm">{item.category}</span>}
        </div>
        <div className="flex min-h-28 flex-1 flex-col p-2 sm:p-2.5">
          <div className="flex flex-1 flex-col rounded-lg bg-primary-raised p-2.5 sm:p-3">
            <h3 className="line-clamp-2 text-[11px] font-bold leading-[15px] tracking-wide sm:text-[12px] sm:leading-4">{item.title}</h3>
            {item.detail && <p className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-wide text-gold-light">{item.detail}</p>}
            {fields['যোগ্যতা'] && <p className="mt-1 truncate text-[9px] leading-4 text-primary-foreground/80 sm:text-[10px]">{fields['যোগ্যতা']}</p>}
            {fields['অভিজ্ঞতা'] && <p className="truncate text-[9px] font-medium leading-4 text-primary-foreground/75 sm:text-[10px]">অভিজ্ঞতা: {fields['অভিজ্ঞতা']}</p>}
            <div className="mt-auto flex items-center justify-between gap-1 border-t border-primary-foreground/25 pt-2">
              <span className="min-w-0 truncate text-[9px] font-bold text-gold sm:text-[10px]">প্রোফাইল দেখুন</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TeachersGrid({ limit }: { limit?: number }) {
  const items = useInstitutionContent('teacher');
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return <p className="text-muted-foreground">শিক্ষকদের তথ্য শীঘ্রই প্রকাশ করা হবে।</p>;
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">{list.slice(0, limit ?? list.length).map((t) => <TeacherCard key={t.id} item={t} />)}</div>;
}

export function TeachersCarousel() {
  const items = useInstitutionContent('teacher');
  const [autoScroll] = useState(() => AutoScroll({ speed: 0.45, direction: 'forward', startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false }));
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, align: 'start' }, [autoScroll]);

  useEffect(() => {
    if (!carousel) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { if (motion.matches || items.length < 2) autoScroll.stop(); else autoScroll.play(0); };
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, [carousel, autoScroll, items.length]);

  if (!items.length) return <p className="text-muted-foreground">শিক্ষকদের তথ্য শীঘ্রই প্রকাশ করা হবে।</p>;
  return (
    <div>
      <div className="teacher-carousel-fade overflow-hidden" ref={viewportRef} aria-label="শিক্ষকদের প্রোফাইল" onMouseEnter={() => autoScroll.stop()} onMouseLeave={() => autoScroll.play(0)} onMouseDown={() => autoScroll.stop()} onTouchStart={() => autoScroll.stop()} onTouchEnd={() => autoScroll.play(0)}>
        <div className="-ml-2.5 flex touch-pan-y sm:-ml-3.5">
          {items.map((item) => (
            <div key={item.id} className="min-w-0 flex-[0_0_46%] pl-2.5 sm:flex-[0_0_28%] sm:pl-3.5 lg:flex-[0_0_19%] xl:flex-[0_0_16.666%]">
              <TeacherCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr] lg:items-stretch lg:gap-6">
      <div className="relative flex flex-col rounded-2xl bg-background p-5 shadow-elegant sm:p-7">
        <Quote className="size-7 text-gold sm:size-9" />
        <p key={cur.id} className="fade-slide mt-3 flex-1 font-display text-base leading-7 text-primary sm:mt-4 sm:text-xl sm:leading-8">“{cur.body}”</p>
        <div className="mt-5 flex items-center gap-3">
          {cur.image_url && !embed ? <img src={cur.image_url} alt={cur.title} className="size-10 shrink-0 rounded-full object-cover sm:size-11" /> : <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg text-gold-light sm:size-11">{initials(cur.title)}</div>}
          <div className="min-w-0"><div className="truncate font-semibold text-primary">{cur.title}</div><div className="truncate text-sm text-muted-foreground">{cur.detail}</div></div>
          <div className="ms-auto"><DemoNote show={isDemo(cur.slug)} /></div>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label="আগের মতামত" onClick={() => setI((i - 1 + items.length) % items.length)} className="size-9 rounded-full bg-secondary text-primary hover:bg-gold"><ChevronLeft className="size-5 rtl:rotate-180" /></Button>
          <Button type="button" variant="ghost" size="icon" aria-label="পরের মতামত" onClick={() => setI((i + 1) % items.length)} className="size-9 rounded-full bg-secondary text-primary hover:bg-gold"><ChevronRight className="size-5 rtl:rotate-180" /></Button>
          <div className="ms-2 flex gap-1.5">{items.map((t, k) => <Button key={t.id} type="button" variant="ghost" aria-label={`মতামত ${k + 1}`} onClick={() => setI(k)} className={`h-8 min-w-8 rounded-full px-0 transition-all ${k === i % items.length ? 'text-gold' : 'text-border'}`}><span className={`block h-2 rounded-full ${k === i % items.length ? 'w-6 bg-gold' : 'w-2 bg-border'}`} /></Button>)}</div>
        </div>
      </div>
      <div className="grid gap-2 lg:content-start">
        {embed ? <div className="aspect-video overflow-hidden rounded-2xl bg-primary"><iframe title={cur.title} src={embed} loading="lazy" allowFullScreen className="h-full w-full" /></div> : items.slice(0, 4).map((t, k) => {
          const tEmbed = t.image_url ? youtubeEmbed(t.image_url) : null;
          const active = k === i % items.length;
          return (
            <Button key={t.id} type="button" variant="ghost" aria-pressed={active} onClick={() => setI(k)} className={`flex h-16 w-full min-w-0 justify-start gap-3 rounded-xl px-3 text-start font-normal text-primary transition-colors sm:h-[68px] ${active ? 'bg-gold hover:bg-gold' : 'bg-background hover:bg-accent'}`}>
              {t.image_url && !tEmbed ? <img src={t.image_url} alt={t.title} loading="lazy" className="size-9 shrink-0 rounded-full object-cover sm:size-10" /> : <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-display text-gold sm:size-10">{initials(t.title)}</div>}
              <span className="min-w-0"><span className="block truncate font-semibold">{t.title}</span><span className="block truncate text-xs text-muted-foreground">{t.detail}</span></span>
            </Button>
          );
        })}
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
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {items.map((a) => (
        <div key={a.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background p-4 shadow-elegant transition-transform duration-300 hover:-translate-y-1 sm:p-6 sm:shadow-elegant">
          <div className="grid size-10 place-items-center rounded-xl bg-gold text-primary shadow-elegant sm:size-13 sm:rounded-2xl"><Award className="size-5 sm:size-7" /></div>
          <div className="mt-4"><span className="inline-block rounded-full bg-gold-soft px-2.5 py-1 font-display text-[11px] font-bold text-gold-deep sm:text-xs">{a.detail}</span></div>
          <h3 className="mt-2 font-display text-[14px] font-semibold leading-snug text-primary sm:text-lg">{a.title}</h3>
          <p className="mt-1.5 text-[11.5px] leading-5 text-muted-foreground sm:text-sm sm:leading-6">{a.body}</p>
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
    <div className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 ${dark ? '' : ''}`}>
      {items.map((s, i) => {
        const Icon = safetyIcons[i % safetyIcons.length] ?? ShieldCheck;
        return (
          <div key={s.id} className="group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-2xl border border-border/50 bg-primary p-2 shadow-elegant transition-transform duration-300 hover:-translate-y-1 sm:min-h-60 sm:rounded-3xl sm:p-2.5">
            <img src={pick(facilityImageList, i)} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute left-2.5 top-2.5 grid size-8 place-items-center rounded-lg bg-gold text-primary shadow-elegant sm:left-3.5 sm:top-3.5 sm:size-10"><Icon className="size-3.5 sm:size-5" /></div>
            <div className="relative rounded-lg bg-primary p-2.5 text-primary-foreground sm:rounded-xl sm:p-3">
              <h3 className="text-[12px] font-bold leading-snug text-gold sm:text-sm">{s.title}</h3>
              <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-4 text-primary-foreground/85 sm:text-[12.5px] sm:leading-5">{s.body}</p>
            </div>
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
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-elegant">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px] sm:text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              {['দিন', 'সকালের নাশতা', 'দুপুরের খাবার', 'রাতের খাবার'].map((h) => (
                <th key={h} className="border-b-2 border-gold p-3 text-start text-[13px] font-semibold tracking-wide max-[359px]:p-2.5 max-[359px]:text-[12px] sm:p-4 sm:text-sm">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={`transition-colors duration-200 hover:bg-accent/70 ${i % 2 ? 'bg-secondary' : ''} ${i < rows.length - 1 ? 'border-b border-border/50' : ''}`}>
                <td className="p-3 max-[359px]:p-2.5 sm:p-4"><span className="inline-block rounded-full bg-gold-soft px-2.5 py-1 font-display text-[12px] font-bold text-gold-deep max-[359px]:px-2 max-[359px]:text-[11px] sm:text-[13px]">{r.title}</span></td>
                <td className="p-3 font-medium text-foreground/80 max-[359px]:p-2.5 sm:p-4">{r.parsed['সকাল'] ?? '—'}</td>
                <td className="p-3 font-medium text-foreground/80 max-[359px]:p-2.5 sm:p-4">{r.parsed['দুপুর'] ?? '—'}</td>
                <td className="p-3 font-medium text-foreground/80 max-[359px]:p-2.5 sm:p-4">{r.parsed['রাত'] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.some((r) => isDemo(r.slug)) && <div className="border-t border-border/60 p-2.5 text-end max-[359px]:p-2 sm:p-3"><DemoNote /></div>}
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
