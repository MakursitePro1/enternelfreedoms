import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2, Globe, Search, FileCode2, Link2, Type, AlignLeft, KeyRound, Share2, ListTree, ExternalLink, Home, Landmark, GraduationCap,
  ClipboardEdit, BedDouble, Building2, Users, BookOpen, Megaphone, CalendarDays, Images, HelpCircle, Phone, Upload, RotateCcw, Save,
  X, ImageIcon, Eye, EyeOff, XCircle, Sparkles, Pencil, TrendingUp,
} from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { SEO_PAGES, seoKey, resolvePageSeo, type SeoOverrides } from '@/lib/seo-pages';

type Props = {
  settings: Record<string, string>;
  uploading: boolean;
  pickImage: (file: File | undefined, set: (url: string) => void) => Promise<void>;
  onSave: (values: Record<string, string>, ok: string) => Promise<boolean>;
};

const icons: Record<string, typeof Home> = {
  '/': Home, '/about': Landmark, '/academics': GraduationCap, '/admission': ClipboardEdit, '/residential': BedDouble, '/campus': Building2,
  '/teachers': Users, '/books': BookOpen, '/notices': Megaphone, '/activities': CalendarDays, '/gallery': Images, '/faq': HelpCircle, '/contact': Phone,
};

type Draft = { title: string; description: string; keywords: string[]; image: string; noindex: boolean };

const len = (s: string) => [...s].length;
const bn = (n: number) => n.toLocaleString('bn-BD');
const splitKw = (s: string) => s.split(/[,،]/).map((k) => k.trim()).filter(Boolean);

function evaluate(d: Draft) {
  const full = `${d.title} | ${SITE_NAME}`;
  const text = `${d.title} ${d.description}`.toLowerCase();
  const list: { icon: typeof Type; label: string; ok: boolean; hint: string; weight: number }[] = [
    { icon: Type, label: 'শিরোনামের দৈর্ঘ্য', ok: len(full) >= 25 && len(full) <= 70, hint: `পূর্ণ শিরোনাম ${bn(len(full))} অক্ষর — ২৫–৭০ আদর্শ`, weight: 20 },
    { icon: AlignLeft, label: 'বর্ণনার দৈর্ঘ্য', ok: len(d.description) >= 70 && len(d.description) <= 170, hint: `${bn(len(d.description))} অক্ষর — ৭০–১৭০ আদর্শ`, weight: 20 },
    { icon: KeyRound, label: 'কীওয়ার্ড', ok: d.keywords.length >= 2, hint: `${bn(d.keywords.length)}টি — অন্তত ২টি দিন`, weight: 15 },
    { icon: Search, label: 'শিরোনাম/বর্ণনায় কীওয়ার্ড', ok: d.keywords.some((k) => text.includes(k.toLowerCase())), hint: 'অন্তত একটি কীওয়ার্ড লেখায় থাকা ভালো', weight: 10 },
    { icon: ImageIcon, label: 'শেয়ার ছবি', ok: !!d.image, hint: 'ফেসবুক/হোয়াটসঅ্যাপে শেয়ারের ছবি', weight: 15 },
    { icon: Eye, label: 'গুগলে দেখানোর অনুমতি', ok: !d.noindex, hint: d.noindex ? 'এই পেজ গুগল থেকে লুকানো' : 'গুগল পেজটি দেখাতে পারবে', weight: 10 },
    { icon: Link2, label: 'ক্যানোনিক্যাল ও Open Graph', ok: true, hint: 'স্বয়ংক্রিয়ভাবে সক্রিয়', weight: 10 },
  ];
  return { list, score: list.reduce((s, c) => s + (c.ok ? c.weight : 0), 0) };
}

function draftFor(path: string, overrides: SeoOverrides): Draft {
  const p = resolvePageSeo(path, overrides);
  return { title: p.title, description: p.description, keywords: splitKw(p.keywords), image: p.image, noindex: p.noindex };
}

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = 18, c = 2 * Math.PI * r;
  const tone = score >= 90 ? 'text-gold' : score >= 70 ? 'text-primary-foreground' : 'text-destructive';
  return (
    <div className="relative grid shrink-0 place-items-center rounded-full bg-primary" style={{ width: size, height: size }}>
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3.5" className="stroke-primary-foreground/20" />
        <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" className={tone} strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} />
      </svg>
      <span className="relative font-display text-[11px] font-bold text-gold" style={{ fontSize: size > 50 ? 16 : 11 }}>{bn(score)}</span>
    </div>
  );
}

function Meter({ value, min, max }: { value: number; min: number; max: number }) {
  const pct = Math.min(100, (value / (max * 1.15)) * 100);
  const ok = value >= min && value <= max;
  return <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-panel-dark-soft"><div className={`h-full rounded-full ${ok ? 'bg-gold' : 'bg-destructive'}`} style={{ width: `${pct}%` }} /></div>;
}

export function AdminSeo({ settings, uploading, pickImage, onSave }: Props) {
  const queryClient = useQueryClient();
  const [path, setPath] = useState('/');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Draft>(() => draftFor('/', settings));
  const [kwInput, setKwInput] = useState('');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLElement>(null);

  useEffect(() => { setDraft(draftFor(path, settings)); setKwInput(''); }, [path, settings]);

  const pages = useMemo(() => SEO_PAGES.map((p) => {
    const d = draftFor(p.path, settings);
    const custom = ['title', 'desc', 'kw', 'img', 'noindex'].some((f) => !!settings[seoKey(f as 'title', p.path)]);
    return { ...p, draft: d, custom, score: evaluate(d).score };
  }), [settings]);
  const avg = Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length);
  const filtered = pages.filter((p) => !query || p.name.includes(query) || p.path.includes(query.toLowerCase()));

  const current = pages.find((p) => p.path === path) ?? pages[0]!;
  const Icon = icons[current.path] ?? Globe;
  const { list, score } = evaluate(draft);
  const saved = current.draft;
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const fullTitle = `${draft.title} | ${SITE_NAME}`;
  const shareImg = draft.image || current.image;

  function addKeywords(raw: string) {
    const next = splitKw(raw).filter((k) => !draft.keywords.includes(k));
    if (next.length) setDraft({ ...draft, keywords: [...draft.keywords, ...next].slice(0, 15) });
    setKwInput('');
  }

  async function persist(values: Record<string, string>, ok: string) {
    setSaving(true);
    const done = await onSave(values, ok);
    if (done) await queryClient.invalidateQueries({ queryKey: ['seo-overrides'] });
    setSaving(false);
  }

  function save() {
    const d = SEO_PAGES.find((p) => p.path === path)!;
    const kw = draft.keywords.join(', ');
    void persist({
      [seoKey('title', path)]: draft.title.trim() === d.title ? '' : draft.title.trim(),
      [seoKey('desc', path)]: draft.description.trim() === d.description ? '' : draft.description.trim(),
      [seoKey('kw', path)]: kw === d.keywords ? '' : kw,
      [seoKey('img', path)]: draft.image === d.image ? '' : draft.image,
      [seoKey('noindex', path)]: draft.noindex ? '1' : '',
    }, `“${current.name}” পেজের SEO প্রকাশিত হয়েছে — ওয়েবসাইটে সাথে সাথে কার্যকর।`);
  }

  function reset() {
    void persist({ [seoKey('title', path)]: '', [seoKey('desc', path)]: '', [seoKey('kw', path)]: '', [seoKey('img', path)]: '', [seoKey('noindex', path)]: '' }, `“${current.name}” পেজের SEO মূল অবস্থায় ফিরেছে।`);
  }

  const label = 'text-[11px] font-bold uppercase tracking-wide text-gold';
  const input = 'mt-1.5 w-full min-w-0 rounded-xl border border-panel-dark-border bg-panel-dark-soft px-3.5 py-2.5 text-sm text-panel-dark-foreground outline-none placeholder:text-panel-dark-muted focus:border-gold';

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          [TrendingUp, `${bn(avg)}%`, 'গড় SEO স্কোর'],
          [Globe, bn(pages.length), 'SEO-যুক্ত পাবলিক পেজ'],
          [Pencil, bn(pages.filter((p) => p.custom).length), 'অ্যাডমিন থেকে সম্পাদিত'],
          [ImageIcon, bn(pages.filter((p) => p.draft.image).length), 'শেয়ার ছবিসহ পেজ'],
        ] as const).map(([I, value, text]) => (
          <div key={text} className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-gold"><I className="size-5" /></div>
            <p className="mt-3 font-display text-xl font-bold text-primary sm:text-2xl">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Page list */}
        <aside className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background shadow-elegant xl:sticky xl:top-4 xl:self-start">
          <div className="bg-primary px-4 py-4">
            <h2 className="font-display text-base font-bold text-primary-foreground">পাবলিক পেজসমূহ</h2>
            <p className="mt-0.5 text-[11px] text-primary-foreground/80">যেকোনো পেজে ক্লিক করে SEO সম্পাদনা করুন</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="পেজ খুঁজুন" className="h-10 w-full min-w-0 bg-transparent text-sm text-foreground outline-none" />
            </div>
          </div>
          <div className="grid max-h-none gap-2 p-3 sm:grid-cols-2 xl:max-h-[calc(100vh-14rem)] xl:grid-cols-1 xl:overflow-y-auto">
            {filtered.map((p) => {
              const I = icons[p.path] ?? Globe;
              const active = p.path === path;
              return (
                <button key={p.path} type="button" onClick={() => { setPath(p.path); if (window.innerWidth < 1280) editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className={`flex min-w-0 items-center gap-3 rounded-xl border p-2.5 text-start transition ${active ? 'border-primary bg-accent' : 'border-border bg-background hover:border-primary/50 hover:bg-secondary'}`}>
                  <div className={`grid size-14 shrink-0 place-items-center rounded-xl border sm:size-16 ${active ? 'border-primary bg-primary text-gold' : 'border-border bg-accent text-primary'}`}>
                    <I className="size-7 sm:size-8" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-primary">{p.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground" dir="ltr">{p.path}</p>
                    {p.custom && <span className="mt-0.5 inline-block rounded-full bg-gold px-1.5 py-px text-[9.5px] font-bold text-primary">সম্পাদিত</span>}
                  </div>
                  <ScoreRing score={p.score} size={40} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Editor */}
        <section ref={editorRef} className="min-w-0 scroll-mt-20 space-y-5">
          <div className="overflow-hidden rounded-2xl border border-panel-dark-border bg-panel-dark shadow-elegant">
            <div className="flex flex-col gap-4 border-b border-panel-dark-border p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold text-primary"><Icon className="size-6" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gold">SEO সম্পাদক</p>
                <h3 className="truncate font-display text-lg font-bold text-panel-dark-foreground sm:text-xl">{current.name}</h3>
                <a href={current.path} target="_blank" rel="noreferrer" dir="ltr" className="inline-flex items-center gap-1 text-[11px] text-panel-dark-muted hover:text-gold">{SITE_URL}{current.path}<ExternalLink className="size-3" /></a>
              </div>
              <div className="flex items-center gap-3">
                <ScoreRing score={score} size={60} />
                <div><p className="text-[11px] text-panel-dark-muted">লাইভ স্কোর</p><p className="text-sm font-bold text-gold">{score >= 90 ? 'চমৎকার' : score >= 70 ? 'ভালো' : 'উন্নতি দরকার'}</p></div>
              </div>
            </div>

            <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
              <div className="space-y-4">
                <label className="block">
                  <span className={label}>পেজের শিরোনাম</span>
                  <input value={draft.title} maxLength={120} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={input} />
                  <Meter value={len(fullTitle)} min={25} max={70} />
                  <span className="mt-1 block text-[11px] text-panel-dark-muted">পূর্ণ শিরোনাম {bn(len(fullTitle))} অক্ষর (প্রতিষ্ঠানের নামসহ)</span>
                </label>
                <label className="block">
                  <span className={label}>মেটা বর্ণনা</span>
                  <textarea value={draft.description} maxLength={400} rows={4} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${input} resize-y`} />
                  <Meter value={len(draft.description)} min={70} max={170} />
                  <span className="mt-1 block text-[11px] text-panel-dark-muted">{bn(len(draft.description))} অক্ষর — গুগলে এই লেখা দেখায়</span>
                </label>
                <div>
                  <span className={label}>কীওয়ার্ড</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-xl border border-panel-dark-border bg-panel-dark-soft p-2">
                    {draft.keywords.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {k}<button type="button" aria-label={`${k} মুছুন`} onClick={() => setDraft({ ...draft, keywords: draft.keywords.filter((x) => x !== k) })}><X className="size-3" /></button>
                      </span>
                    ))}
                    <input value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addKeywords(kwInput); } }} onBlur={() => kwInput && addKeywords(kwInput)} placeholder="লিখে Enter চাপুন" className="h-7 min-w-[120px] flex-1 bg-transparent px-1 text-sm text-panel-dark-foreground outline-none placeholder:text-panel-dark-muted" />
                  </div>
                </div>
                <button type="button" onClick={() => setDraft({ ...draft, noindex: !draft.noindex })} className="flex w-full items-center gap-3 rounded-xl border border-panel-dark-border bg-panel-dark-soft p-3 text-start">
                  {draft.noindex ? <EyeOff className="size-5 text-destructive" /> : <Eye className="size-5 text-gold" />}
                  <span className="flex-1"><span className="block text-sm font-semibold text-panel-dark-foreground">গুগলে দেখানো</span><span className="block text-[11px] text-panel-dark-muted">{draft.noindex ? 'বন্ধ — পেজটি সার্চে আসবে না' : 'চালু — পেজটি সার্চে আসবে'}</span></span>
                  <span className={`relative h-6 w-11 rounded-full ${draft.noindex ? 'bg-panel-dark-border' : 'bg-gold'}`}><span className={`absolute top-1 size-4 rounded-full bg-primary transition-all ${draft.noindex ? 'left-1' : 'left-6'}`} /></span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className={label}>শেয়ার ছবি (ফেসবুক / হোয়াটসঅ্যাপ / গুগল)</span>
                  <div className="mt-1.5 overflow-hidden rounded-xl border border-panel-dark-border bg-panel-dark-soft">
                    <img src={shareImg} alt={draft.title} className="aspect-[1200/630] w-full object-cover" />
                    <div className="flex flex-wrap gap-2 p-2.5">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gold px-3 py-2 text-xs font-bold text-primary">
                        <Upload className="size-3.5" />{uploading ? 'আপলোড হচ্ছে…' : 'নতুন ছবি আপলোড'}
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { void pickImage(e.target.files?.[0], (url) => setDraft((d) => ({ ...d, image: url }))); e.target.value = ''; }} />
                      </label>
                      {draft.image !== current.image && <button type="button" onClick={() => setDraft({ ...draft, image: current.image })} className="inline-flex items-center gap-1.5 rounded-lg border border-panel-dark-border px-3 py-2 text-xs font-semibold text-panel-dark-foreground"><RotateCcw className="size-3.5" />মূল ছবি</button>}
                    </div>
                  </div>
                  <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="অথবা ছবির লিংক দিন" className={input} dir="ltr" />
                  <p className="mt-1 text-[11px] text-panel-dark-muted">আদর্শ মাপ ১২০০×৬৩০, ৩ MB-এর মধ্যে JPG/PNG/WEBP</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-panel-dark-border p-4 sm:p-5">
              <button type="button" disabled={saving || !draft.title.trim() || !draft.description.trim()} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-primary disabled:opacity-60">
                <Save className="size-4" />{saving ? 'সংরক্ষণ হচ্ছে…' : 'সংরক্ষণ ও প্রকাশ'}
              </button>
              <button type="button" disabled={saving || !current.custom} onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-panel-dark-border px-4 py-2.5 text-sm font-semibold text-panel-dark-foreground disabled:opacity-40">
                <RotateCcw className="size-4" />মূল অবস্থায় ফেরত
              </button>
              {dirty && <span className="inline-flex items-center gap-1 rounded-full bg-panel-dark-soft px-3 py-1 text-[11px] font-semibold text-gold"><Sparkles className="size-3" />অসংরক্ষিত পরিবর্তন</span>}
            </div>
          </div>

          {/* Previews */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><Search className="size-4" />গুগল সার্চে যেমন দেখাবে</p>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <img src="/favicon.png" alt="" className="size-7 rounded-full border border-border bg-background object-contain p-0.5" />
                  <div className="min-w-0"><p className="truncate text-xs font-semibold text-foreground">{SITE_NAME}</p><p className="truncate text-[11px] text-muted-foreground" dir="ltr">{SITE_URL}{current.path}</p></div>
                </div>
                <p className="mt-2 line-clamp-2 text-[17px] font-medium leading-snug text-primary">{fullTitle}</p>
                <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{draft.description}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><Share2 className="size-4" />ফেসবুক / হোয়াটসঅ্যাপে শেয়ার কার্ড</p>
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={shareImg} alt="" className="aspect-[1200/630] w-full object-cover" />
                <div className="border-t border-border bg-secondary p-3">
                  <p className="text-[10.5px] uppercase text-muted-foreground" dir="ltr">{SITE_URL.replace('https://', '')}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm font-bold text-foreground">{fullTitle}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{draft.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><CheckCircle2 className="size-4" />SEO যাচাই তালিকা</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {list.map((c) => (
                <div key={c.label} className={`flex items-start gap-3 rounded-xl border p-3 ${c.ok ? 'border-border bg-accent' : 'border-destructive/40 bg-background'}`}>
                  <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${c.ok ? 'bg-primary text-gold' : 'bg-destructive text-destructive-foreground'}`}><c.icon className="size-4" /></div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-primary">{c.label}</p><p className="text-[11px] text-muted-foreground">{c.hint}</p></div>
                  {c.ok ? <CheckCircle2 className="size-4 shrink-0 text-primary" /> : <XCircle className="size-4 shrink-0 text-destructive" />}
                </div>
              ))}
            </div>
          </div>

          {/* Search engine tools */}
          <div className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><ListTree className="size-4" />সার্চ ইঞ্জিন সংযোগ</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {([
                [ListTree, 'সাইটম্যাপ', '/sitemap.xml'],
                [FileCode2, 'robots.txt', '/robots.txt'],
                [Globe, 'Google Search Console', 'https://search.google.com/search-console'],
                [Search, 'Bing Webmaster', 'https://www.bing.com/webmasters'],
              ] as const).map(([I, t, href]) => (
                <a key={t} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary p-3 text-sm font-semibold text-primary hover:border-primary">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary text-gold"><I className="size-4" /></span>{t}<ExternalLink className="ms-auto size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

