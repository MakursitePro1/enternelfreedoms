import { Link, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, MapPin, ArrowRight, Phone, Mail, Clock, ChevronDown, ChevronRight, Megaphone, Globe, Facebook, Youtube } from 'lucide-react';
import { nav, moreNav, allNav } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { languages, useLang } from '@/lib/i18n';
import logoAsset from '@/assets/institute-logo.jpeg.asset.json';

function NoticeTicker() {
  const { t } = useLang();
  const [items, setItems] = useState<{ id: string; title: string; category: string }[]>([]);
  useEffect(() => {
    supabase.from('notices').select('id,title,category').order('published_at', { ascending: false }).limit(6).then(({ data }) => setItems(data ?? []));
  }, []);
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <div className="border-b border-border/60 bg-secondary">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 lg:px-8">
        <span className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"><Megaphone className="size-3.5 text-gold-light" />{t('সর্বশেষ নোটিশ')}</span>
        <div className="ticker-wrap relative min-w-0 flex-1 overflow-hidden py-2">
          <div className="ticker-track flex w-max gap-10 whitespace-nowrap">
            {loop.map((n, i) => (
              <Link key={`${n.id}-${i}`} to="/notices/$id" params={{ id: n.id }} className="text-sm text-primary hover:text-gold">
                <span className="mr-2 text-gold">✦</span><span className="font-semibold">[{n.category}]</span> {n.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 ${compact ? '' : 'rounded-md bg-primary-foreground/10 p-0.5'}`} role="group" aria-label="ভাষা নির্বাচন">
      <Globe className="mx-1 size-3.5 opacity-70" aria-hidden />
      {languages.map((l) => (
        <button key={l.key} type="button" onClick={() => setLang(l.key)} aria-pressed={lang === l.key}
          className={`rounded px-2 py-0.5 text-xs transition-colors ${lang === l.key ? 'bg-gold text-primary font-semibold' : 'hover:bg-primary-foreground/15'}`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function Site({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const s = useSiteSettings();
  const { t } = useLang();
  useEffect(() => {
    const close = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMore(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
  const moreActive = moreNav.some(([h]) => active(h));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2 text-xs lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 opacity-90">
            <a href={telHref(s.phone)} className="flex items-center gap-1.5 hover:text-gold-light"><Phone className="size-3.5 text-gold-light" />{s.phone}</a>
            <a href={`mailto:${s.email}`} className="hidden items-center gap-1.5 hover:text-gold-light sm:flex"><Mail className="size-3.5 text-gold-light" />{s.email}</a>
            <span className="hidden items-center gap-1.5 md:flex"><MapPin className="size-3.5 text-gold-light" />{s.address}</span>
          </div>
          <LanguageSwitch />
        </div>
      </div>
      <NoticeTicker />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src={logoAsset.url} alt="Eternal Freedom Institute Al Islamia লোগো" className="size-10 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-elegant ring-1 ring-border sm:size-11" />
            <span className="min-w-0">
              <strong className="block truncate font-brand text-base font-bold leading-tight text-primary sm:text-xl">Eternal Freedom</strong>
              <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">Institute Al Islamia</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 xl:flex">
            {nav.map(([href, label]) => (
              <Link key={href} to={href} className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary ${active(href) ? 'bg-primary text-primary-foreground shadow-elegant' : 'text-foreground/75'}`}>{t(label)}</Link>
            ))}
            <div className="relative" ref={moreRef}>
              <button type="button" onClick={() => setMore(!more)} aria-expanded={more} className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-primary ${moreActive ? 'bg-primary text-primary-foreground shadow-elegant' : 'text-foreground/75'}`}>
                {t('আরও')}<ChevronDown className={`size-4 transition-transform ${more ? 'rotate-180' : ''}`} />
              </button>
              {more && (
                <div className="absolute end-0 top-full mt-2 w-60 rounded-xl border border-border bg-background p-2 shadow-elegant">
                  {moreNav.map(([href, label]) => (
                    <Link key={href} to={href} onClick={() => setMore(false)} className={`block rounded-lg px-3 py-2.5 text-sm hover:bg-secondary ${active(href) ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground/80'}`}>{t(label)}</Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild className="hidden sm:inline-flex"><Link to="/admission">{t('ভর্তি আবেদন')} <ArrowUpRight className="size-4" /></Link></Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden bg-primary text-primary-foreground hover:bg-primary hover:text-gold-light" aria-label="মেনু খুলুন" aria-expanded={open}><Menu /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[86vw] max-w-sm gap-0 overflow-hidden rounded-r-2xl p-0 sm:max-w-sm">
                <SheetTitle className="sr-only">মেনু</SheetTitle>
                <SheetDescription className="sr-only">নেভিগেশন মেনু</SheetDescription>
                <div className="flex h-full flex-col">
                  <div className="border-b border-border/60 px-5 py-4">
                    <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                      <img src={logoAsset.url} alt="Eternal Freedom Institute Al Islamia লোগো" className="size-10 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-border" />
                      <span className="min-w-0">
                         <strong className="block truncate font-brand text-base font-bold leading-tight text-primary">Eternal Freedom</strong>
                        <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Institute Al Islamia</span>
                      </span>
                    </Link>
                  </div>
                  <nav className="min-h-0 flex-1 overflow-auto px-2.5 py-3">
                    {allNav.map(([href, label]) => (
                      <Link key={href} to={href} onClick={() => setOpen(false)} className={`group flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${active(href) ? 'bg-primary text-primary-foreground' : 'text-foreground/85 hover:bg-secondary/60 hover:text-primary'}`}>
                        <span className="truncate">{t(label)}</span>
                        <ChevronRight className={`size-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${active(href) ? 'text-gold-light' : 'text-muted-foreground/60'}`} />
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t border-border/60 p-4">
                    <Button asChild className="w-full"><Link to="/admission" onClick={() => setOpen(false)}>{t('ভর্তি আবেদন')} <ArrowUpRight className="size-4" /></Link></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
             <div className="flex items-center gap-3"><img src={logoAsset.url} alt="Eternal Freedom Institute Al Islamia লোগো" className="size-12 shrink-0 rounded-full bg-white object-contain p-0.5 shadow-elegant" /><div><div className="font-brand text-2xl font-bold">Eternal Freedom</div><p className="text-xs opacity-75">Institute Al Islamia</p></div></div>
            <p className="mt-6 max-w-xs leading-7 opacity-80">{t('কুরআনের আলোয় জ্ঞান, চরিত্র ও দক্ষতার সমন্বিত শিক্ষা')}।</p>
            <div className="mt-6 flex gap-2">
              {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" aria-label="ফেসবুক" className="grid size-10 place-items-center rounded-lg bg-primary-foreground/10 hover:bg-gold hover:text-primary"><Facebook className="size-4" /></a>}
              {s.youtube && <a href={s.youtube} target="_blank" rel="noreferrer" aria-label="ইউটিউব" className="grid size-10 place-items-center rounded-lg bg-primary-foreground/10 hover:bg-gold hover:text-primary"><Youtube className="size-4" /></a>}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gold-light">{t('গুরুত্বপূর্ণ লিংক')}</h3>
            <div className="grid gap-2.5 text-sm opacity-85">{nav.slice(1).map(([href, label]) => <Link key={href} to={href} className="hover:text-gold-light">{t(label)}</Link>)}</div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gold-light">{t('আরও')}</h3>
            <div className="grid gap-2.5 text-sm opacity-85">{moreNav.map(([href, label]) => <Link key={href} to={href} className="hover:text-gold-light">{t(label)}</Link>)}</div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-gold-light">{t('যোগাযোগ')}</h3>
            <div className="space-y-3 text-sm opacity-85">
              <p className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-light" />{s.address}</p>
              <a href={telHref(s.phone)} className="flex gap-2 hover:text-gold-light"><Phone className="mt-0.5 size-4 shrink-0 text-gold-light" />{s.phone}{s.phone2 ? `, ${s.phone2}` : ''}</a>
              <a href={`mailto:${s.email}`} className="flex gap-2 break-all hover:text-gold-light"><Mail className="mt-0.5 size-4 shrink-0 text-gold-light" />{s.email}</a>
              <p className="flex gap-2"><Clock className="mt-0.5 size-4 shrink-0 text-gold-light" />{s.office_hours}</p>
              <a href="https://www.google.com/maps/place/Eternal+Freedom+Institute+Al+Islamia/@24.4569854,90.5489134,880m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3756619166939f13:0xf7a04cb7cd46f8de!8m2!3d24.4569854!4d90.5514883!16s%2Fg%2F11vdtqt29c" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-gold-light">গুগল ম্যাপে দেখুন <ArrowUpRight className="size-3.5" /></a>
            </div>
          </div>
        </div>
        <div className="relative border-t border-primary-foreground/15 px-5 py-5 text-center text-xs opacity-70">
          © {new Date().getFullYear()} Eternal Freedom Institute Al Islamia. {t('সর্বস্বত্ব সংরক্ষিত।')}
          <Link to="/admin" className="ms-3 hover:underline">{t('অ্যাডমিন')}</Link>
        </div>
      </footer>
    </div>
  );
}

export function Heading({ eyebrow, title, description, center = false, light = false, hideDescriptionOnMobile = false, compact = false }: { eyebrow: string; title: string; description?: string; center?: boolean; light?: boolean; hideDescriptionOnMobile?: boolean; compact?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`${compact ? 'mb-7' : 'mb-10'} ${center ? 'mx-auto max-w-3xl text-center' : ''}`}>
      <div className={`mb-5 flex items-center gap-3 ${compact ? 'mb-4' : 'mb-5'} ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold sm:w-10" />
        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm ring-1 sm:text-xs ${light ? 'bg-gold text-primary ring-gold/60' : 'bg-primary text-gold ring-gold/60'}`}>
          <span className={`size-1.5 shrink-0 rounded-full shadow-[0_0_6px] ${light ? 'bg-primary shadow-primary' : 'bg-gold shadow-gold'}`} />
          {t(eyebrow)}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold sm:w-10" />
      </div>
      <h2 className={`font-display text-3xl font-semibold leading-tight ${compact ? 'sm:text-3xl' : 'sm:text-4xl'} ${light ? 'text-primary-foreground' : 'text-primary'}`}>{t(title)}</h2>
      {description && <p className={`mt-5 leading-8 ${center ? 'mx-auto' : ''} max-w-2xl ${compact ? 'mt-3 text-[13px] leading-6 sm:text-[15px]' : ''} ${hideDescriptionOnMobile ? 'hidden sm:block' : ''} ${light ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{description}</p>}
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image?: string | undefined }) {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-primary px-5 py-20 text-primary-foreground sm:py-24 lg:px-8">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className={`absolute inset-0 ${image ? 'bg-hero-overlay' : ''}`} />
      <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-primary-foreground/70"><Link to="/" className="hover:text-gold-light">{t('হোম')}</Link><span>/</span><span className="text-gold-light">{t(eyebrow)}</span></div>
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{t(title)}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/85 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}

export function TextLink({ to, children, light = false }: { to: string; children: ReactNode; light?: boolean }) {
  return <Link to={to} className={light ? "inline-flex items-center gap-2 border-b border-gold pb-1 font-semibold text-gold hover:text-gold-light" : "inline-flex items-center gap-2 border-b border-gold pb-1 font-semibold text-primary hover:text-gold"}>{children}<ArrowRight className="size-4 rtl:rotate-180" /></Link>;
}

export function DemoNote(_props?: { show?: boolean }) {
  return null;
}
