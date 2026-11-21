import { useState, type ReactNode } from 'react';
import {
  BadgeCheck, Banknote, BookOpen, Building2, CalendarDays, Camera, Check, CheckCircle2, ClipboardList, Copy, ExternalLink,
  GraduationCap, HandHeart, Heart, Landmark, MapPin, MessageCircle, MonitorPlay, Navigation, Phone, Quote, ShieldCheck,
  Snowflake, Sparkles, Stethoscope, Sun, Users, Video, Wallet, Zap, Droplets, Shirt, Utensils, Bed, Trophy, Sprout, Eye, FileText, Info, Clock,
} from 'lucide-react';

type Kind = 'steps' | 'reviews' | 'location' | 'slogan' | 'programs' | 'aid' | 'policy' | 'updates' | 'payment' | 'services' | 'growth' | 'residential' | 'facilities' | 'fees' | 'monthly' | 'adult' | 'contact' | 'dua' | 'generic';
type Section = { kind: Kind; title: string; lines: string[] };

const headingKinds: [RegExp, Kind][] = [
  [/^✅/, 'steps'], [/^📖/, 'reviews'], [/^🗺/, 'location'], [/^🌟/, 'slogan'], [/^📚/, 'programs'], [/^💠/, 'aid'],
  [/^⚠/, 'policy'], [/^📹/, 'updates'], [/^🏃/, 'growth'], [/^👦/, 'residential'], [/^🏢/, 'facilities'], [/^📊/, 'monthly'],
  [/^🔔/, 'adult'], [/^📩/, 'contact'], [/^🤲/, 'dua'],
];

const lead = /^(?:[\p{Extended_Pictographic}\u2600-\u27BF\u2B00-\u2BFF\u{1F000}-\u{1FAFF}\uFE0F\u200D✿]|\s)+/u;
const keycap = /^([০-৯0-9])\uFE0F?\u20E3\s*/;
export const clean = (t: string) => t.replace(keycap, '').replace(lead, '').replace(/\uFE0F/g, '').replace(/[\s\p{Extended_Pictographic}]+$/u, '').trim();
const isUrl = (t: string) => /^https:\/\//.test(t);

function parse(text: string) {
  const paras = text.split(/\n\s*\n/).map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean)).filter((p) => p.length);
  const intro: string[] = [];
  const sections: Section[] = [];
  let serviceSeen = false;
  for (const p of paras) {
    const first = p[0]!;
    let kind: Kind | undefined = headingKinds.find(([r]) => r.test(first))?.[1];
    if (!kind && /^✿/.test(first)) { kind = serviceSeen ? 'fees' : 'services'; serviceSeen = true; }
    if (!kind && /^🔹/.test(first) && /bank/i.test(p[1] ?? '')) kind = 'payment';
    if (kind) {
      const keepFirst = kind === 'facilities' || kind === 'dua';
      sections.push({ kind, title: clean(first), lines: keepFirst ? p : p.slice(1) });
    } else if (!sections.length) intro.push(...p);
    else sections[sections.length - 1]!.lines.push(...p);
  }
  return { intro, sections };
}

const emojiIcons: [RegExp, typeof Check][] = [
  [/^🏢/, Building2], [/^❄/, Snowflake], [/^🛏/, Bed], [/^💧/, Droplets], [/^🧺/, Shirt], [/^🍽/, Utensils], [/^🛡/, Zap],
  [/^🏏/, Trophy], [/^🎥/, Camera], [/^🚑/, Stethoscope], [/^🖥/, MonitorPlay], [/^📝/, ClipboardList], [/^🌾/, Sprout], [/^🫪|^🫡/, Eye],
  [/^🏦/, Landmark], [/^📍/, MapPin], [/^👉/, Info], [/^🌸/, Sparkles],
];
const iconFor = (t: string) => emojiIcons.find(([r]) => r.test(t))?.[1] ?? Check;

function Text({ t }: { t: string }) {
  return <span className="min-w-0 break-words">{clean(t)}</span>;
}
function LinkButton({ href, label }: { href: string; label: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-w-0 max-w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground group-hover:bg-gold group-hover:text-primary"><ExternalLink className="size-4" /></span>
    <span className="min-w-0 break-all text-left leading-5">{label}</span>
  </a>;
}
function Card({ icon: Icon, title, children, className = '', tone = 'light' }: { icon: typeof Check; title: string; children: ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return <article className={`min-w-0 rounded-[1.25rem] border p-4 shadow-sm sm:p-7 ${dark ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'} ${className}`}>
    <header className="mb-5 flex min-w-0 items-center gap-3.5">
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${dark ? 'bg-gold text-primary' : 'bg-primary text-gold'}`}><Icon className="size-6" strokeWidth={1.8} /></span>
      <h3 className={`min-w-0 font-display text-xl font-bold leading-snug sm:text-2xl ${dark ? 'text-primary-foreground' : 'text-primary'}`}>{title}</h3>
    </header>
    {children}
  </article>;
}
function Bullets({ lines, dark = false }: { lines: string[]; dark?: boolean }) {
  return <ul className="space-y-3">{lines.map((l, i) => isUrl(l) ? <li key={i}><LinkButton href={l} label={l.replace('https://', '')} /></li> : <li key={i} className={`flex gap-3 text-[15px] leading-7 ${l.startsWith('(') ? (dark ? 'text-primary-foreground/80' : 'text-muted-foreground') : ''}`}>
    <span className={`mt-2.5 size-2 shrink-0 rotate-45 ${dark ? 'bg-gold' : 'bg-gold'}`} /><Text t={l} />
  </li>)}</ul>;
}
function CopyRow({ label, value, lang }: { label: string; value: string; lang: string }) {
  const [done, setDone] = useState(false);
  const digits = /\d{5,}/.test(value.replace(/-/g, ''));
  return <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-2.5 last:border-0">
    <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">{label}</p><p data-no-translate className="break-words text-[15px] font-semibold text-foreground">{value}</p></div>
    {digits && <button type="button" onClick={() => { void navigator.clipboard?.writeText(value.replace(/[\s-]/g, '')); setDone(true); window.setTimeout(() => setDone(false), 1600); }} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground">{done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{done ? (lang === 'en' ? 'Copied' : 'কপি হয়েছে') : (lang === 'en' ? 'Copy' : 'কপি')}</button>}
  </div>;
}

function Steps({ s }: { s: Section }) {
  const items: { text: string; notes: string[] }[] = [];
  for (const l of s.lines) { if (l.startsWith('(') && items.length) items[items.length - 1]!.notes.push(l); else items.push({ text: l, notes: [] }); }
  return <Card icon={ClipboardList} title={s.title} className="lg:col-span-12">
    <ol className="relative space-y-5 before:absolute before:bottom-4 before:left-[1.15rem] before:top-4 before:w-0.5 before:bg-border">
      {items.map((it, i) => <li key={i} className="relative flex gap-4">
        <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-4 border-card bg-gold font-display text-base font-bold text-primary">{(i + 1).toLocaleString('bn-BD')}</span>
        <div className="min-w-0 rounded-xl bg-secondary px-4 py-3 text-[15px] leading-7"><Text t={it.text} />{it.notes.map((n, j) => <p key={j} className="mt-1 text-sm text-muted-foreground">{clean(n)}</p>)}</div>
      </li>)}
    </ol>
  </Card>;
}
function Programs({ s }: { s: Section }) {
  const cards = s.lines.filter((l) => keycap.test(l));
  const notes = s.lines.filter((l) => !keycap.test(l));
  const icons = [BookOpen, GraduationCap, MessageCircle];
  return <Card icon={GraduationCap} title={s.title} className="lg:col-span-12">
    <div className="grid gap-4 md:grid-cols-3">{cards.map((c, i) => { const I = icons[i] ?? BookOpen; const [h, ...rest] = clean(c).split(/[:：]/); return <div key={i} className="min-w-0 rounded-2xl border border-border bg-secondary p-5">
      <span className="grid size-11 place-items-center rounded-xl bg-primary text-gold"><I className="size-5" /></span>
      <h4 className="mt-4 font-display text-lg font-bold text-primary">{h}</h4>
      {rest.length > 0 && <p className="mt-1.5 text-[15px] leading-7 text-foreground">{rest.join(':').trim()}</p>}
    </div>; })}</div>
    {notes.length > 0 && <div className="mt-5 space-y-2 rounded-xl border-l-4 border-gold bg-background px-4 py-3 text-sm leading-6 text-muted-foreground">{notes.map((n, i) => <p key={i}>{clean(n)}</p>)}</div>}
  </Card>;
}
function Policy({ s }: { s: Section }) {
  const items: { text: string; notes: string[] }[] = [];
  for (const l of s.lines) { if (/^🔸/.test(l) || !items.length) items.push({ text: l, notes: [] }); else items[items.length - 1]!.notes.push(l); }
  const icons = [Phone, Users, CalendarDays, Clock];
  return <Card icon={ShieldCheck} title={s.title} tone="dark" className="lg:col-span-12">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((it, i) => { const I = icons[i] ?? Clock; return <div key={i} className="relative min-w-0 rounded-2xl border border-gold bg-card p-5 text-foreground">
      <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-gold text-primary"><I className="size-5" /></span><span className="font-display text-3xl font-bold text-gold">{String(i + 1).padStart(2, '0')}</span></div>
      <p className="mt-4 text-base font-semibold leading-7 text-primary"><Text t={it.text} /></p>
      {it.notes.map((n, j) => <p key={j} className="mt-2 text-sm leading-6 text-muted-foreground">{clean(n)}</p>)}
    </div>; })}</div>
  </Card>;
}
function Payment({ s, lang }: { s: Section; lang: string }) {
  const groups: { name: string; rows: string[] }[] = [];
  for (const l of s.lines) { if (/^(🏦|🔹)/.test(l)) groups.push({ name: clean(l), rows: [] }); else groups[groups.length - 1]?.rows.push(l); }
  return <Card icon={Wallet} title={s.title} className="lg:col-span-12">
    <div className="grid gap-4 md:grid-cols-3">{groups.map((g, i) => { const I = i === groups.length - 1 ? Banknote : Landmark; return <div key={i} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-center gap-3 bg-primary px-5 py-4 text-primary-foreground"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-primary"><I className="size-5" /></span><h4 data-no-translate className="min-w-0 font-display text-base font-bold leading-snug">{g.name}</h4></div>
      <div className="px-5 py-2">{g.rows.map((r, j) => { const k = r.indexOf(':'); return <CopyRow key={j} lang={lang} label={k > 0 ? r.slice(0, k).trim() : ''} value={k > 0 ? r.slice(k + 1).trim() : r} />; })}</div>
    </div>; })}</div>
  </Card>;
}
function Facilities({ s }: { s: Section }) {
  return <Card icon={Building2} title={s.title.length > 40 ? '' : s.title} className="lg:col-span-12">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{s.lines.map((l, i) => { const I = iconFor(l); return <div key={i} className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-secondary p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-gold"><I className="size-5" /></span><p className="min-w-0 text-[15px] font-medium leading-6 text-foreground">{clean(l)}</p>
    </div>; })}</div>
  </Card>;
}
function Fees({ s }: { s: Section }) {
  const items: { text: string; notes: string[] }[] = [];
  for (const l of s.lines) { if (/^🔹/.test(l) || !items.length) items.push({ text: l, notes: [] }); else items[items.length - 1]!.notes.push(l); }
  return <Card icon={BadgeCheck} title={s.title} className="lg:col-span-7">
    <div className="grid gap-3">{items.map((it, i) => <div key={i} className={`min-w-0 rounded-2xl p-4 ${i === 1 ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary'}`}>
      <p className={`text-[15px] font-semibold leading-7 ${i === 1 ? 'text-primary-foreground' : 'text-foreground'}`}><Text t={it.text} /></p>
      {it.notes.map((n, j) => <p key={j} className={`mt-1 text-sm leading-6 ${i === 1 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{clean(n)}</p>)}
    </div>)}</div>
  </Card>;
}
function Monthly({ s }: { s: Section }) {
  const rows = s.lines.filter((l) => /^🔹/.test(l));
  const total = s.lines.find((l) => /^➡/.test(l));
  const rest = s.lines.filter((l) => !rows.includes(l) && l !== total);
  return <Card icon={Banknote} title={s.title} className="lg:col-span-5">
    <div className="overflow-hidden rounded-2xl border border-border">
      {rows.map((r, i) => { const t = clean(r); const k = t.lastIndexOf(':'); return <div key={i} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-[15px] odd:bg-secondary"><span className="min-w-0">{k > 0 ? t.slice(0, k) : t}</span><span className="shrink-0 font-bold text-primary">{k > 0 ? t.slice(k + 1).trim() : ''}</span></div>; })}
      {total && <div className="flex items-center justify-between gap-3 bg-primary px-4 py-4 text-primary-foreground"><span className="font-semibold">{clean(total).split(/[:：]/)[0]}</span><span className="font-display text-2xl font-bold text-gold">{clean(total).split(/[:：]/).slice(1).join(':').trim()}</span></div>}
    </div>
    {rest.map((n, i) => <p key={i} className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Sun className="size-4 shrink-0 text-gold" />{clean(n)}</p>)}
  </Card>;
}

function render(s: Section, i: number, lang: string) {
  switch (s.kind) {
    case 'steps': return <Steps key={i} s={s} />;
    case 'programs': return <Programs key={i} s={s} />;
    case 'policy': return <Policy key={i} s={s} />;
    case 'payment': return <Payment key={i} s={s} lang={lang} />;
    case 'facilities': return <Facilities key={i} s={{ ...s, title: lang === 'en' ? 'Residential facilities' : 'আবাসিক সুবিধাসমূহ' }} />;
    case 'fees': return <Fees key={i} s={s} />;
    case 'monthly': return <Monthly key={i} s={s} />;
    case 'slogan': return <article key={i} className="relative min-w-0 overflow-hidden rounded-[1.25rem] bg-primary p-5 text-center text-primary-foreground sm:p-10">
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative"><p className="text-sm font-bold text-gold">{s.title}</p>
        <p className="mt-3 font-display text-3xl font-bold text-gold-light sm:text-6xl">{clean(s.lines[0] ?? '')}</p>
        {s.lines.slice(1).map((l, j) => <p key={j} className="mx-auto mt-4 max-w-3xl text-base leading-8 text-primary-foreground/85">{clean(l)}</p>)}</div>
    </article>;
    case 'dua': return <article key={i} className="flex min-w-0 flex-col items-center gap-3 rounded-[1.25rem] border-2 border-gold bg-secondary p-6 text-center sm:p-8 lg:col-span-12">
      <HandHeart className="size-9 text-gold" /><p className="font-display text-xl font-bold text-primary sm:text-2xl">{clean(s.lines[0] ?? '')}</p>{s.lines.slice(1).map((l, j) => <p key={j} className="text-base font-semibold text-muted-foreground">{clean(l)}</p>)}
    </article>;
    case 'adult': return <Card key={i} icon={Bed} title={s.title} className="lg:col-span-5"><Bullets lines={s.lines} /></Card>;
    case 'reviews': return <Card key={i} icon={Video} title={s.title} className="lg:col-span-6"><Bullets lines={s.lines} /></Card>;
    case 'location': return <Card key={i} icon={Navigation} title={s.title} tone="dark" className="lg:col-span-6"><div className="space-y-3 text-[15px] leading-7">{s.lines.map((l, j) => isUrl(l) ? <a key={j} href={l} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-primary hover:bg-gold-light"><MapPin className="size-4" />Google Maps<ExternalLink className="size-3.5" /></a> : l.startsWith('“') || l.startsWith('"') ? <blockquote key={j} className="rounded-xl border-l-4 border-gold bg-card px-4 py-3 font-semibold text-primary">{clean(l)}</blockquote> : <p key={j} className="flex gap-2.5"><MapPin className="mt-1.5 size-4 shrink-0 text-gold" /><span>{clean(l)}</span></p>)}</div></Card>;
    case 'contact': return <Card key={i} icon={Phone} title={s.title} className="lg:col-span-7"><Bullets lines={s.lines} /></Card>;
    case 'aid': return <Card key={i} icon={Heart} title={s.title} className="lg:col-span-12"><Bullets lines={s.lines} /></Card>;
    case 'updates': return <Card key={i} icon={Camera} title={s.title} className="lg:col-span-12"><Bullets lines={s.lines} /></Card>;
    case 'services': return <Card key={i} icon={Sparkles} title={s.title} className="lg:col-span-12"><Bullets lines={s.lines} /></Card>;
    case 'growth': return <Card key={i} icon={Trophy} title={s.title} className="lg:col-span-6"><Bullets lines={s.lines} /></Card>;
    case 'residential': return <Card key={i} icon={Users} title={s.title} className="lg:col-span-6"><Bullets lines={s.lines} /></Card>;
    default: return <Card key={i} icon={FileText} title={s.title} className="lg:col-span-6"><Bullets lines={s.lines} /></Card>;
  }
}

export function AdmissionNotice({ text, lang }: { text: string; lang: string }) {
  const { intro, sections } = parse(text);
  const en = lang === 'en';
  const facts = [
    { icon: Users, label: en ? 'Age' : 'বয়স', value: en ? '6–16 years' : '৬–১৬ বছর' },
    { icon: BadgeCheck, label: en ? 'Admission fee' : 'ভর্তি ফি', value: en ? 'BDT 40,000' : '৪০,০০০ ৳' },
    { icon: Banknote, label: en ? 'Monthly cost' : 'মাসিক খরচ', value: en ? 'BDT 12,500' : '১২,৫০০ ৳' },
    { icon: CalendarDays, label: en ? 'Classes begin' : 'ক্লাস শুরু', value: en ? '1 January' : 'পহেলা জানুয়ারি' },
  ];
  const [title, ...introRest] = intro;
  return <div className="space-y-5 sm:space-y-6">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{facts.map((f) => <div key={f.label} className="flex min-w-0 items-center gap-3 rounded-[1.1rem] border border-border bg-card p-4 shadow-sm sm:gap-4 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold text-primary sm:size-14"><f.icon className="size-5 sm:size-7" strokeWidth={1.8} /></span>
      <div className="min-w-0"><p className="text-xs font-semibold text-muted-foreground sm:text-sm">{f.label}</p><p className="font-display text-base font-bold leading-tight text-primary sm:text-2xl">{f.value}</p></div>
    </div>)}</div>

    {intro.length > 0 && <div className="relative overflow-hidden rounded-[1.25rem] border border-border bg-card p-6 shadow-sm sm:p-10">
      <Quote className="absolute right-6 top-6 size-16 text-secondary sm:size-24" />
      <p className="relative font-display text-xl font-bold text-primary sm:text-3xl">{clean(title ?? '')}</p>
      <div className="relative mt-5 grid gap-5 border-l-4 border-gold pl-5 sm:pl-7 lg:grid-cols-2 lg:gap-8">
        {introRest.map((l, i) => <p key={i} className={`text-base leading-8 text-foreground sm:text-[17px] sm:leading-9 ${i === introRest.length - 1 && introRest.length % 2 ? 'lg:col-span-2' : ''}`}>{clean(l)}</p>)}
      </div>
    </div>}

    <ol className="relative">{sections.map((s, i) => {
      const n = en ? String(i + 1) : String(i + 1).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)] ?? d);
      const last = i === sections.length - 1;
      return <li key={i} className="relative min-w-0 pb-5 pl-11 sm:pb-6 sm:pl-16 lg:pl-20">
        {!last && <span aria-hidden className="absolute bottom-0 left-[1.0625rem] top-10 w-0.5 bg-gold sm:left-[1.4375rem] sm:top-14 lg:left-[1.6875rem]" />}
        <span className="absolute left-0 top-3 grid size-9 place-items-center rounded-full border-2 border-gold bg-primary font-display text-sm font-bold text-gold-light shadow-sm sm:size-12 sm:text-lg lg:size-14 lg:text-xl">{n}</span>
        {render(s, i, lang)}
      </li>;
    })}</ol>
  </div>;
}
