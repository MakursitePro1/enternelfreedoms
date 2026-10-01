import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { ShoppingBag, Plus, Minus, CheckCircle2, Truck, Wallet, ShieldCheck, Search, X } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { submitOrder, trackOrder } from '@/lib/platform.functions';
import { Site, PageIntro, Heading, DemoNote } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { bookCovers, pick, isDemo, facilityImages } from '@/lib/content';
import { useCart } from '@/lib/cart';
import { useSiteSettings } from '@/lib/site-settings';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/books/')({
  validateSearch: (s: Record<string, unknown>): { cart?: number } => (s['cart'] ? { cart: 1 } : {}),
  head: () => seo('অনলাইন বইয়ের দোকান', 'Eternal Freedom প্রকাশনার বই দেখুন, বিস্তারিত পড়ুন এবং ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে অর্ডার করুন।'),
  component: Books,
});

export type Book = { id: string; title: string; description: string; price: number; cover_url: string | null; slug: string | null; author: string | null; pages: number | null; details: string | null };
type Method = 'ক্যাশ অন ডেলিভারি' | 'বিকাশ' | 'নগদ';

export function coverFor(b: Book, k: number) { return b.cover_url ?? pick(bookCovers, k); }

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
  const { cart, change, count } = useCart();
  const lookup = useServerFn(trackOrder);
  const [tracking, setTracking] = useState({ reference: '', phone: '' });
  const [tracked, setTracked] = useState<Awaited<ReturnType<typeof trackOrder>> | undefined>(undefined);
  const [trackingError, setTrackingError] = useState('');
  useEffect(() => { supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('active', true).order('created_at', { ascending: true }).then(({ data }) => { setBooks((data ?? []) as Book[]); setLoading(false); }); }, []);
  useEffect(() => { if (search.cart) setOpen(true); }, [search.cart]);
  async function checkOrder(e: FormEvent) { e.preventDefault(); setTrackingError(''); try { const found = await lookup({ data: tracking }); setTracked(found); if (!found) setTrackingError('এই নম্বরের সঙ্গে অর্ডার নম্বর মেলেনি।'); } catch { setTrackingError('অর্ডারের তথ্য পাওয়া যায়নি।'); } }
  return (
    <Site>
      <PageIntro eyebrow="বইয়ের দোকান" title="Eternal Freedom প্রকাশনা" description="প্রতিষ্ঠানের নিজস্ব বই—বিস্তারিত দেখুন, কার্টে রাখুন এবং ঘরে বসে অর্ডার করুন।" image={facilityImages.library} />
      <section className="border-b border-border px-5 py-8 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">{[[Truck, 'সারাদেশে হোম ডেলিভারি', 'ঠিকানায় বই পৌঁছে যাবে'], [Wallet, 'সহজ পেমেন্ট', 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ'], [ShieldCheck, 'নিরাপদ অর্ডার', 'অর্ডার নম্বর দিয়ে অবস্থা দেখুন']].map(([Icon, t, d]) => { const I = Icon as typeof Truck; return <div key={t as string} className="flex items-center gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-gold-light"><I className="size-5" /></div><div><div className="font-semibold text-primary">{t as string}</div><div className="text-sm text-muted-foreground">{d as string}</div></div></div>; })}</div></section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3"><Heading eyebrow="প্রকাশনা" title="সকল বই" /><Button onClick={() => setOpen(true)}><ShoppingBag className="size-4" /> কার্ট ({count.toLocaleString('bn-BD')})</Button></div>
        {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-[3/5] animate-pulse rounded-2xl bg-secondary" />)}</div> : books.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((b, k) => (
              <article key={b.id} className="group flex flex-col overflow-hidden rounded-2xl bg-secondary shadow-elegant premium-card">
                <Link to="/books/$id" params={{ id: b.id }} className="relative block aspect-[3/4] overflow-hidden"><img src={coverFor(b, k)} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />{!b.cover_url && <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-lg bg-background/90 p-3 text-center font-display text-sm font-semibold text-primary">{b.title}</div>}</Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{b.author}</span><DemoNote show={isDemo(b.slug)} /></div>
                  <Link to="/books/$id" params={{ id: b.id }}><h3 className="mt-1 font-display text-lg font-semibold text-primary hover:text-gold">{b.title}</h3></Link>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">{b.description}</p>
                  <div className="mt-4 flex items-center justify-between gap-2"><strong className="text-lg text-primary">৳ {Number(b.price).toLocaleString('bn-BD')}</strong>{(cart[b.id] ?? 0) > 0 ? <div className="flex items-center gap-1 rounded-lg bg-background"><Button aria-label="কমান" variant="ghost" size="icon" onClick={() => change(b.id, -1)}><Minus className="size-4" /></Button><span className="w-5 text-center text-sm">{cart[b.id]}</span><Button aria-label="বাড়ান" variant="ghost" size="icon" onClick={() => change(b.id, 1)}><Plus className="size-4" /></Button></div> : <Button size="sm" onClick={() => change(b.id, 1)}><Plus className="size-4" /> কার্টে রাখুন</Button>}</div>
                  <Button asChild variant="link" className="mt-1 h-auto px-0"><Link to="/books/$id" params={{ id: b.id }}>বিস্তারিত দেখুন</Link></Button>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl bg-secondary p-10 text-center text-muted-foreground">এই মুহূর্তে কোনো বই প্রকাশিত নেই।</p>}
      </section>
      <section className="bg-secondary px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="অর্ডারের খোঁজ" title="অর্ডারের অবস্থা দেখুন" /><form onSubmit={checkOrder} className="grid max-w-3xl gap-3 sm:grid-cols-[1fr_1fr_auto]"><input required aria-label="অর্ডার নম্বর" placeholder="অর্ডার নম্বর (BK-...)" value={tracking.reference} onChange={(e) => setTracking({ ...tracking, reference: e.target.value })} className="w-full rounded-lg bg-background px-4 py-3" /><input required aria-label="অর্ডারের ফোন নম্বর" placeholder="অর্ডারে দেওয়া মোবাইল নম্বর" value={tracking.phone} onChange={(e) => setTracking({ ...tracking, phone: e.target.value })} className="w-full rounded-lg bg-background px-4 py-3" /><Button type="submit"><Search className="size-4" />খুঁজুন</Button></form>{trackingError && <p role="alert" className="mt-4 text-destructive">{trackingError}</p>}{tracked && <p role="status" className="mt-5 rounded-xl bg-background p-5 text-primary">অবস্থা: <strong>{tracked.status}</strong> · ৳ {Number(tracked.total).toLocaleString('bn-BD')} · {tracked.payment_method} · {new Date(tracked.created_at).toLocaleDateString('bn-BD')}</p>}</div></section>
      {count > 0 && !open && <button type="button" onClick={() => setOpen(true)} className="fixed bottom-6 end-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-elegant"><ShoppingBag className="size-5 text-gold-light" />কার্ট ({count.toLocaleString('bn-BD')})</button>}
      {open && <CartDrawer books={books} onClose={() => setOpen(false)} />}
    </Site>
  );
}
