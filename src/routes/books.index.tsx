import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useEffect, useState, createElement, type FormEvent } from 'react';
import { ShoppingBag, Plus, Minus, CheckCircle2, Truck, Wallet, ShieldCheck, Search, X, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { submitOrder, trackOrder } from '@/lib/platform.functions';
import { Site, Heading } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { bookCovers, pick, facilityImages } from '@/lib/content';
import magicCover from '@/assets/magic-english.jpg.asset.json';
import nuraniArt from '@/assets/book-nurani-art.jpg';
import adabArt from '@/assets/book-adab-art.jpg';
import hifzArt from '@/assets/book-hifz-art.jpg';
import duaArt from '@/assets/book-dua-art.jpg';
import { useCart } from '@/lib/cart';
import { useSiteSettings } from '@/lib/site-settings';
import { seo } from '@/lib/seo';

function SeeMoreClamp({ as = 'h3', to, className, children }: { as?: 'h3' | 'p'; to: string; className: string; children: React.ReactNode }) {
  const [over, setOver] = useState(false);
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const check = () => setOver(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    document.fonts?.ready.then(check).catch(() => {});
    window.addEventListener('resize', check);
    return () => { ro.disconnect(); window.removeEventListener('resize', check); };
  }, []);
  return (
    <>
      {as === 'p'
        ? createElement('p', { ref: ref as React.Ref<HTMLParagraphElement>, className }, children)
        : createElement('h3', { ref: ref as React.Ref<HTMLHeadingElement>, className }, children)}
      {over && (
        <Link to={to} className="mt-0.5 inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-bold text-gold-deep hover:underline sm:text-xs">
          আরও দেখুন
          <ArrowRight className="size-3 shrink-0" />
        </Link>
      )}
    </>
  );
}

export const Route = createFileRoute('/books/')({
  validateSearch: (s: Record<string, unknown>): { cart?: number } => (s['cart'] ? { cart: 1 } : {}),
  head: () => seo('অনলাইন বইয়ের দোকান', 'Eternal Freedom প্রকাশনার বই দেখুন, বিস্তারিত পড়ুন এবং ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে অর্ডার করুন।'),
  component: Books,
});

export type Book = { id: string; title: string; description: string; price: number; cover_url: string | null; slug: string | null; author: string | null; pages: number | null; details: string | null };
type Method = 'ক্যাশ অন ডেলিভারি' | 'বিকাশ' | 'নগদ';

export function coverFor(b: Book, k: number) { return b.cover_url ?? pick(bookCovers, k); }

const upcoming = [
  { title: 'নূরানী কায়দা ও তাজবিদ শিক্ষা', author: 'Eternal Freedom প্রকাশনা', description: 'শিশুদের সহজে শুদ্ধ কুরআন শেখার জন্য সাজানো নূরানী কায়দা।', category: 'কুরআন শিক্ষা', art: nuraniArt, light: false },
  { title: 'শিশুদের আদব-আখলাক', author: 'মোঃ আনছারুল হক (আনছার)', description: 'ছোটদের জন্য গল্পে গল্পে ইসলামি শিষ্টাচার ও সুন্দর চরিত্রের পাঠ।', category: 'শিশুদের বই', art: adabArt, light: true },
  { title: 'হিফজ সহায়িকা ও দৈনিক রুটিন', author: 'Eternal Freedom প্রকাশনা', description: 'হিফজ শিক্ষার্থীদের দৈনিক হিসাব রাখার সহায়ক বই।', category: 'কুরআন শিক্ষা', art: hifzArt, light: false },
  { title: 'দৈনন্দিন দোয়া ও মাসনুন আমল', author: 'Eternal Freedom প্রকাশনা', description: 'প্রতিদিনের প্রয়োজনীয় দোয়া, অর্থ ও উচ্চারণসহ।', category: 'দোয়া ও আমল', art: duaArt, light: false },
];
const categories = ['সব বই', 'ইংরেজি শিক্ষা', 'কুরআন শিক্ষা', 'শিশুদের বই', 'দোয়া ও আমল'];
const categoryBySlug: Record<string, string> = { 'magic-english': 'ইংরেজি শিক্ষা', 'nurani-qaida': 'কুরআন শিক্ষা', 'hifz-sahayika': 'কুরআন শিক্ষা', 'adab-akhlaq': 'শিশুদের বই', 'dua-amal': 'দোয়া ও আমল' };
const PAGE_SIZE = 4;

export function CartDrawer({ books, onClose }: { books: Book[]; onClose: () => void }) {
  const { cart, change, clear } = useCart();
  const s = useSiteSettings();
  const order = useServerFn(submitOrder);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', payment_method: 'ক্যাশ অন ডেলিভারি' as Method, payment_reference: '' });
  const selected = books.filter((b) => (cart[b.id] ?? 0) > 0);
  const total = selected.reduce((sum, b) => sum + Number(b.price) * (cart[b.id] ?? 0), 0);
  async function checkout(e: FormEvent) {
    e.preventDefault(); setError('');
    if (!/^01\d{9}$/.test(form.phone)) { setError('১১ সংখ্যার সঠিক মোবাইল নম্বর দিন।'); return; }
    if (form.payment_method !== 'ক্যাশ অন ডেলিভারি' && form.payment_reference.trim().length < 5) { setError('পেমেন্টের ট্রানজেকশন আইডি দিন।'); return; }
    setBusy(true);
    try { const r = await order({ data: { ...form, payment_reference: form.payment_reference || undefined, items: selected.map((b) => ({ id: b.id, quantity: cart[b.id] ?? 0 })) } }); setReference(r.reference); clear(); }
    catch (err) { setError(err instanceof Error ? err.message : 'অর্ডার জমা দেওয়া যায়নি।'); }
    finally { setBusy(false); }
  }
  const input = 'w-full rounded-lg bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring';
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-primary/65" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-xl sm:rounded-s-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-primary">আপনার কার্ট</h2><Button variant="ghost" size="icon" aria-label="বন্ধ করুন" onClick={onClose}><X /></Button></div>
        {reference ? (
          <div className="mt-10 text-center"><CheckCircle2 className="mx-auto size-14 text-primary" /><h3 className="mt-4 font-display text-2xl text-primary">অর্ডার জমা হয়েছে</h3><p className="mt-3">অর্ডার নম্বর: <strong className="select-all text-primary">{reference}</strong></p><p className="mt-3 text-sm text-muted-foreground">এই নম্বরটি সংরক্ষণ করুন। প্রতিষ্ঠান অর্ডার ও পেমেন্ট যাচাই করে আপনার ঠিকানায় বই পাঠাবে।</p><Button className="mt-6" onClick={onClose}>ঠিক আছে</Button></div>
        ) : selected.length ? (<>
          <div className="mt-6 space-y-3">{selected.map((b) => <div key={b.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl bg-secondary p-4"><div className="min-w-0"><h3 className="truncate font-semibold">{b.title}</h3><p className="text-sm text-muted-foreground">৳ {Number(b.price).toLocaleString('bn-BD')} × {cart[b.id]}</p></div><div className="flex items-center gap-1"><Button aria-label="কমান" variant="ghost" size="icon" onClick={() => change(b.id, -1)}><Minus className="size-4" /></Button><span className="w-5 text-center">{cart[b.id]}</span><Button aria-label="বাড়ান" variant="ghost" size="icon" onClick={() => change(b.id, 1)}><Plus className="size-4" /></Button></div></div>)}</div>
          <div className="mt-5 flex justify-between rounded-xl bg-primary p-4 font-semibold text-primary-foreground"><span>মোট (ডেলিভারি চার্জ ছাড়া)</span><span>৳ {total.toLocaleString('bn-BD')}</span></div>
          <form onSubmit={checkout} className="mt-6 space-y-3">
            <h3 className="font-semibold text-primary">ডেলিভারির তথ্য</h3>
            <input required aria-label="নাম" placeholder="আপনার নাম" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className={input} />
            <input required aria-label="মোবাইল নম্বর" type="tel" placeholder="মোবাইল নম্বর (01XXXXXXXXX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
            <textarea required aria-label="ঠিকানা" placeholder="সম্পূর্ণ ঠিকানা (গ্রাম, থানা, জেলা)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${input} min-h-24`} />
            <h3 className="pt-2 font-semibold text-primary">পেমেন্ট পদ্ধতি</h3>
            <div className="grid grid-cols-3 gap-2">{(['ক্যাশ অন ডেলিভারি', 'বিকাশ', 'নগদ'] as Method[]).map((m) => <button key={m} type="button" onClick={() => setForm({ ...form, payment_method: m })} className={`rounded-xl border-2 px-2 py-3 text-xs font-semibold ${form.payment_method === m ? 'border-primary bg-accent text-primary' : 'border-border text-muted-foreground'}`}>{m}</button>)}</div>
            {form.payment_method !== 'ক্যাশ অন ডেলিভারি' && (
              <div className="rounded-xl bg-accent p-4 text-sm leading-7 text-primary">
                <p className="font-semibold">{form.payment_method} দিয়ে পেমেন্টের ধাপ:</p>
                <ol className="mt-1 list-decimal ps-5">
                  <li>{form.payment_method} অ্যাপ থেকে “Send Money” নির্বাচন করুন</li>
                  <li>নম্বর: <strong className="select-all">{form.payment_method === 'বিকাশ' ? s.bkash : s.nagad}</strong></li>
                  <li>পরিমাণ: <strong>৳ {total.toLocaleString('bn-BD')}</strong></li>
                  <li>প্রাপ্ত ট্রানজেকশন আইডি নিচে লিখুন</li>
                </ol>
                <input required aria-label="ট্রানজেকশন আইডি" placeholder="ট্রানজেকশন আইডি (TrxID)" value={form.payment_reference} onChange={(e) => setForm({ ...form, payment_reference: e.target.value })} className="mt-3 w-full rounded-lg bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
              </div>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={busy} className="w-full">{busy ? 'জমা হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}</Button>
          </form>
        </>) : <div className="mt-16 text-center text-muted-foreground"><ShoppingBag className="mx-auto size-12 text-gold" /><p className="mt-4">কার্ট খালি। পছন্দের বই কার্টে রাখুন।</p></div>}
      </aside>
    </div>
  );
}

function Books() {
  const search = Route.useSearch();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('সব বই');
  const [page, setPage] = useState(1);
  const { cart, change, count } = useCart();
  const lookup = useServerFn(trackOrder);
  const [tracking, setTracking] = useState({ reference: '', phone: '' });
  const [tracked, setTracked] = useState<Awaited<ReturnType<typeof trackOrder>> | undefined>(undefined);
  const [trackingError, setTrackingError] = useState('');
  useEffect(() => { supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('active', true).order('created_at', { ascending: true }).then(({ data }) => { setBooks((data ?? []) as Book[]); setLoading(false); }); }, []);
  useEffect(() => { if (search.cart) setOpen(true); }, [search.cart]);
  async function checkOrder(e: FormEvent) { e.preventDefault(); setTrackingError(''); try { const found = await lookup({ data: tracking }); setTracked(found); if (!found) setTrackingError('এই নম্বরের সঙ্গে অর্ডার নম্বর মেলেনি।'); } catch { setTrackingError('অর্ডারের তথ্য পাওয়া যায়নি।'); } }
  const magic = books.find((book) => book.slug === 'magic-english');
  const catalogue = [
    ...books.map((book, index) => ({ key: book.id, title: book.title, author: book.author ?? '', description: book.description, category: categoryBySlug[book.slug ?? ''] ?? 'অন্যান্য', art: coverFor(book, index), light: false, book })),
    ...upcoming.filter((item) => !books.some((book) => book.title === item.title)).map((item) => ({ ...item, key: item.title, book: null as Book | null })),
  ];
  const filtered = catalogue.filter((item) => (category === 'সব বই' || item.category === category) && `${item.title} ${item.author} ${item.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const changeCategory = (value: string) => { setCategory(value); setPage(1); };
  return (
    <Site>
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5"><section className="relative flex min-h-[410px] flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground sm:min-h-[510px] sm:rounded-[1.25rem]">
        <img src={facilityImages.library} alt="প্রতিষ্ঠানের বই ও পাঠাগার" className="absolute inset-0 h-full w-full object-cover brightness-[.4]" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-20 lg:px-12"><span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-primary"><BookOpen className="size-4" />Eternal Freedom প্রকাশনা</span><h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">আমাদের বইয়ের সংগ্রহ</h1><p className="mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">প্রকাশিত বই দেখুন, পছন্দের বই খুঁজুন এবং ঘরে বসেই অর্ডার করুন।</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><a href="#catalogue">বইগুলো দেখুন <ArrowRight className="size-4" /></a></Button><Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground"><a href="#order-tracking">অর্ডারের অবস্থা</a></Button></div>{magic && <Link to="/books/$id" params={{ id: magic.id }} className="group mt-4 inline-flex w-fit max-w-sm items-center gap-3 rounded-lg border border-gold bg-primary-raised p-2 pe-4 text-start sm:mt-5"><img src={magic.cover_url ?? magicCover.url} alt={magic.title} loading="lazy" width={112} height={150} className="h-16 w-12 shrink-0 rounded-sm object-cover sm:h-20 sm:w-15" /><span className="min-w-0"><span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-primary"><Sparkles className="size-3" />ফিচার্ড বই</span><span className="mt-1.5 block truncate font-display text-sm font-bold sm:text-base">{magic.title}</span><span className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-gold-light">৳ {Number(magic.price).toLocaleString('bn-BD')}<ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" /></span></span></Link>}</div>
      </section></div>

      <section className="border-b border-border px-5 py-6 sm:py-8 lg:px-8"><div className="mx-auto grid max-w-7xl gap-0 sm:grid-cols-3 sm:gap-5">{[[Truck, 'সারাদেশে হোম ডেলিভারি', 'ঠিকানায় বই পৌঁছে যাবে'], [Wallet, 'সহজ পেমেন্ট', 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ'], [ShieldCheck, 'নিরাপদ অর্ডার', 'অর্ডার নম্বর দিয়ে অবস্থা দেখুন']].map(([Icon, title, text]) => { const I = Icon as typeof Truck; return <div key={title as string} className="flex min-w-0 items-center gap-3 border-b border-border py-3 last:border-0 sm:border-0 sm:py-0"><div className="grid size-11 shrink-0 place-items-center rounded-md bg-primary text-gold-light"><I className="size-5" /></div><div className="min-w-0"><div className="font-semibold text-primary">{title as string}</div><div className="text-xs leading-5 text-muted-foreground sm:text-sm">{text as string}</div></div></div>; })}</div></section>

      {magic && <section className="px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><Heading compact eyebrow="বিশেষ প্রকাশনা" title="এই মুহূর্তের বিশেষ বই" /><div className="grid overflow-hidden rounded-lg bg-primary text-primary-foreground md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"><div className="flex min-h-72 items-center justify-center bg-primary-raised px-8 py-9 sm:min-h-96 sm:px-12 sm:py-12 lg:min-h-[470px]"><img src={magic.cover_url ?? magicCover.url} alt={magic.title} loading="lazy" className="w-full max-w-48 rounded-sm shadow-elegant sm:max-w-64 lg:max-w-72" /></div><div className="flex min-w-0 flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14"><span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" />ফিচার্ড বই</span><h2 className="mt-5 font-hero text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Magic English<br /><span className="text-gold">Spoken & Written</span></h2><p className="mt-4 max-w-lg text-sm leading-7 sm:text-base">ইংরেজি বলা ও লেখার চর্চা এক বইয়ে। ধাপে ধাপে সহজ পাঠে শেখার পথচলা শুরু করুন।</p><ul className="mt-5 grid gap-3 border-y border-gold py-5 text-sm sm:grid-cols-2">{['স্পোকেন ও রিটেন ইংলিশ', 'ধাপে ধাপে সহজ পাঠ', 'ভিডিও লেসনসহ', 'সারাদেশে ডেলিভারি'].map((feature) => <li key={feature} className="flex items-start gap-2 leading-6"><CheckCircle2 className="mt-1 size-4 shrink-0 text-gold" />{feature}</li>)}</ul><p className="mt-5 text-sm">লেখক: <strong>{magic.author}</strong></p><div className="mt-6 flex flex-wrap items-center gap-4"><strong className="font-display text-3xl text-gold">৳ {Number(magic.price).toLocaleString('bn-BD')}</strong><Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/books/$id" params={{ id: magic.id }}>বইটি দেখুন <ArrowRight className="size-4" /></Link></Button></div></div></div></div></section>}

      <section id="catalogue" className="scroll-mt-24 px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><Heading compact className="mb-0" eyebrow="বইয়ের সংগ্রহ" title="সব বই এক জায়গায়" /><Button variant="outline" onClick={() => setOpen(true)}><ShoppingBag className="size-4" />কার্ট ({count.toLocaleString('bn-BD')})</Button></div>
        <div className="mb-6 grid gap-4 border-y border-border py-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-center"><div className="flex flex-wrap gap-2" role="group" aria-label="বইয়ের বিভাগ">{categories.map((value) => <Button key={value} type="button" variant="outline" aria-pressed={category === value} onClick={() => changeCategory(value)} className={`h-10 rounded-md border px-3 font-semibold sm:px-4 ${category === value ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'border-border bg-card text-primary hover:border-gold hover:bg-gold-soft'}`}>{value}</Button>)}</div><label className="relative block w-full"><Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="search" aria-label="বই খুঁজুন" placeholder="বই বা লেখক খুঁজুন" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="h-11 w-full rounded-md border border-field-border bg-background ps-10 pe-3 text-sm text-primary outline-none focus:border-gold focus:ring-2 focus:ring-ring" /></label></div>
        <p role="status" className="mb-5 text-sm font-semibold text-muted-foreground">{filtered.length.toLocaleString('bn-BD')}টি বই</p>
        {loading ? <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[3/5] animate-pulse rounded-md bg-secondary" />)}</div> : visible.length ? <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">{visible.map((item) => <article key={item.key} className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow duration-300 hover:shadow-elegant"><div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-secondary p-2 sm:p-4"><div className="relative aspect-[3/4] h-[88%] max-h-72 shadow-elegant"><img src={item.art} alt={item.book ? item.title : ''} loading="lazy" width={768} height={1024} className="h-full w-full object-cover" />{!item.book && <div className={`absolute inset-0 flex flex-col items-center justify-center px-3 text-center font-display font-bold leading-snug sm:px-6 ${item.light ? 'text-primary' : 'text-gold-light'}`}><span className="text-xs sm:text-xl">{item.title}</span></div>}{item.book && <span className="absolute bottom-1.5 start-1.5 inline-flex items-center rounded bg-background px-1.5 py-0.5 text-[10px] font-bold text-primary sm:bottom-2.5 sm:start-2.5 sm:rounded-md sm:px-2 sm:py-1 sm:text-xs">৳ {Number(item.book.price).toLocaleString('bn-BD')}</span>}</div><span className={`absolute end-1.5 top-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold sm:end-2.5 sm:top-2.5 sm:rounded-md sm:px-2 sm:py-1 sm:text-[10px] ${item.book ? 'bg-gold text-primary' : 'bg-primary text-primary-foreground'}`}>{item.book ? 'অর্ডার চলছে' : 'শীঘ্রই'}</span></div><div className="flex flex-1 flex-col p-2.5 sm:p-4"><span className="text-[10px] font-semibold text-gold-deep sm:text-xs">{item.category}</span>{item.book ? <SeeMoreClamp as="h3" to={`/books/${item.book.id}`} className="mt-1 line-clamp-2 min-h-8 font-book-title text-xs font-bold leading-4 text-primary sm:mt-1.5 sm:min-h-10 sm:text-sm sm:leading-5">{item.title}</SeeMoreClamp> : <h3 className="mt-1 line-clamp-2 min-h-8 font-book-title text-xs font-bold leading-4 text-primary sm:mt-1.5 sm:min-h-10 sm:text-sm sm:leading-5">{item.title}</h3>}{item.book && <SeeMoreClamp as="p" to={`/books/${item.book.id}`} className="mt-1 hidden line-clamp-2 text-[11px] leading-5 text-muted-foreground sm:mt-2 sm:block sm:min-h-10 sm:text-sm sm:leading-6">{item.description}</SeeMoreClamp>}<div className="mt-auto flex items-center justify-between gap-1.5 pt-2 sm:pt-3.5">{item.book ? <>{(cart[item.book.id] ?? 0) > 0 ? <div className="flex shrink-0 items-center gap-1"><Button aria-label="কমান" variant="outline" size="icon" className="size-7 sm:size-8" onClick={() => change(item.book?.id ?? '', -1)}><Minus className="size-3.5 sm:size-4" /></Button><span className="w-5 text-center text-xs sm:text-sm">{cart[item.book.id]}</span><Button aria-label="বাড়ান" variant="outline" size="icon" className="size-7 sm:size-8" onClick={() => change(item.book?.id ?? '', 1)}><Plus className="size-3.5 sm:size-4" /></Button></div> : <Button size="sm" className="h-7 min-w-0 flex-1 justify-center px-2 text-[10px] sm:h-9 sm:flex-none sm:px-3 sm:text-sm" onClick={() => change(item.book?.id ?? '', 1)}><Plus className="size-3 shrink-0 sm:size-4" />কার্টে রাখুন</Button>}<Button asChild variant="link" className="h-auto min-w-0 whitespace-nowrap px-0 py-0 text-[10px] text-primary sm:text-xs"><Link to="/books/$id" params={{ id: item.book.id }}>বিস্তারিত<span className="hidden sm:inline"> দেখুন</span> <ArrowRight className="size-3 sm:size-3.5" /></Link></Button></> : <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground sm:text-sm"><BookOpen className="size-4 shrink-0" />প্রকাশের অপেক্ষায়</span>}</div></div></article>)}</div> : <div className="border-y border-border py-12 text-center text-muted-foreground">এই নামে কোনো বই পাওয়া যায়নি।</div>}
        {totalPages > 1 && <nav aria-label="বইয়ের পৃষ্ঠা" className="mt-9 flex items-center justify-center gap-2"><Button variant="outline" size="icon" aria-label="আগের পৃষ্ঠা" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>{Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} aria-label={`পৃষ্ঠা ${i + 1}`} aria-current={page === i + 1 ? 'page' : undefined} onClick={() => setPage(i + 1)} className="size-10">{(i + 1).toLocaleString('bn-BD')}</Button>)}<Button variant="outline" size="icon" aria-label="পরের পৃষ্ঠা" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button></nav>}
      </div></section>

      <section id="order-tracking" className="scroll-mt-24 bg-secondary px-5 py-12 sm:py-16 lg:px-8"><div className="mx-auto max-w-7xl"><Heading compact eyebrow="অর্ডারের খোঁজ" title="অর্ডারের অবস্থা দেখুন" /><form onSubmit={checkOrder} className="grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"><input required aria-label="অর্ডার নম্বর" placeholder="অর্ডার নম্বর (BK-...)" value={tracking.reference} onChange={(e) => setTracking({ ...tracking, reference: e.target.value })} className="min-h-12 w-full min-w-0 rounded-md border border-field-border bg-background px-4 py-3 outline-none focus:border-gold" /><input required aria-label="অর্ডারের ফোন নম্বর" placeholder="অর্ডারে দেওয়া মোবাইল নম্বর" value={tracking.phone} onChange={(e) => setTracking({ ...tracking, phone: e.target.value })} className="min-h-12 w-full min-w-0 rounded-md border border-field-border bg-background px-4 py-3 outline-none focus:border-gold" /><Button type="submit" className="min-h-12 sm:col-span-2 lg:col-span-1"><Search className="size-4" />খুঁজুন</Button></form>{trackingError && <p role="alert" className="mt-4 text-destructive">{trackingError}</p>}{tracked && <p role="status" className="mt-5 rounded-md bg-background p-5 text-primary">অবস্থা: <strong>{tracked.status}</strong> · ৳ {Number(tracked.total).toLocaleString('bn-BD')} · {tracked.payment_method} · {new Date(tracked.created_at).toLocaleDateString('bn-BD')}</p>}</div></section>
      <div className="px-2.5 py-6 sm:px-5 sm:py-8"><section className="relative overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground sm:rounded-[1.25rem]"><img src={facilityImages.classroom} alt="প্রতিষ্ঠানের শ্রেণিকক্ষ" loading="lazy" className="absolute inset-0 h-full w-full object-cover brightness-[.35]" /><div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><span className="text-sm font-bold text-gold-light">Eternal Freedom Institute Al Islamia</span><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">ভর্তি সম্পর্কে আরও জানুন</h2><p className="mt-3 max-w-xl text-sm leading-7">আমাদের শিক্ষা কার্যক্রম ও ভর্তি প্রক্রিয়ার বিস্তারিত দেখুন।</p><Button asChild size="lg" className="mt-6 bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি তথ্য দেখুন <ArrowRight className="size-4" /></Link></Button></div></section></div>
      {count > 0 && !open && <Button onClick={() => setOpen(true)} className="fixed bottom-6 start-6 z-50 h-12 rounded-full shadow-elegant"><ShoppingBag className="size-5 text-gold-light" />কার্ট ({count.toLocaleString('bn-BD')})</Button>}
      {open && <CartDrawer books={books} onClose={() => setOpen(false)} />}
    </Site>
  );
}
