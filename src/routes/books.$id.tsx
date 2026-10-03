import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, ArrowRight, BookOpen, User, FileText, Truck, Wallet, Plus, Minus, CheckCircle2, ShieldCheck, PackageCheck, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Site } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { bookCovers, pick } from '@/lib/content';
import { submitOrder, DELIVERY_ZONES } from '@/lib/platform.functions';
import { useSiteSettings } from '@/lib/site-settings';
import { seo } from '@/lib/seo';
import type { Book } from './books.index';

export const Route = createFileRoute('/books/$id')({
  head: () => seo('বইয়ের বিস্তারিত ও অর্ডার', 'বইয়ের বিবরণ, মূল্য ও ডেলিভারি তথ্য দেখে এই পেজ থেকেই ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে অর্ডার করুন।'),
  component: BookDetail,
});

type Method = 'ক্যাশ অন ডেলিভারি' | 'বিকাশ' | 'নগদ';
type Zone = keyof typeof DELIVERY_ZONES;
const bn = (n: number) => n.toLocaleString('bn-BD');

function BookDetail() {
  const { id } = Route.useParams();
  const s = useSiteSettings();
  const order = useServerFn(submitOrder);
  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const [others, setOthers] = useState<Book[]>([]);
  const [qty, setQty] = useState(1);
  const [zone, setZone] = useState<Zone>('outside');
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '', payment_method: 'ক্যাশ অন ডেলিভারি' as Method, payment_reference: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  useEffect(() => {
    supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('id', id).eq('active', true).maybeSingle().then(({ data }) => setBook((data as Book) ?? null));
    supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('active', true).neq('id', id).limit(4).then(({ data }) => setOthers((data ?? []) as Book[]));
  }, [id]);
  if (book === undefined) return <Site><div className="mx-auto max-w-6xl px-5 py-24"><div className="h-96 animate-pulse rounded-2xl bg-secondary" /></div></Site>;
  if (!book) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">বইটি পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/books">সব বই দেখুন</Link></Button></section></Site>;
  const cover = book.cover_url ?? pick(bookCovers, 0);
  const subtotal = Number(book.price) * qty;
  const charge = DELIVERY_ZONES[zone].charge;
  const total = subtotal + charge;

  async function checkout(e: FormEvent) {
    e.preventDefault(); setError('');
    if (!/^01\d{9}$/.test(form.phone)) { setError('১১ সংখ্যার সঠিক মোবাইল নম্বর দিন।'); return; }
    if (form.address.trim().length < 8) { setError('সম্পূর্ণ ঠিকানা লিখুন।'); return; }
    if (form.payment_method !== 'ক্যাশ অন ডেলিভারি' && form.payment_reference.trim().length < 5) { setError('পেমেন্টের ট্রানজেকশন আইডি দিন।'); return; }
    setBusy(true);
    try { const r = await order({ data: { ...form, payment_reference: form.payment_reference || undefined, delivery_zone: zone, items: [{ id: book!.id, quantity: qty }] } }); setReference(r.reference); }
    catch (err) { setError(err instanceof Error ? err.message : 'অর্ডার জমা দেওয়া যায়নি।'); }
    finally { setBusy(false); }
  }
  const input = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring';

  return (
    <Site>
      <section className="px-2.5 pt-4 sm:px-5 sm:pt-6">
        <div className="islamic-pattern mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-elegant sm:p-10">
          <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-gold"><ArrowLeft className="size-4 rtl:rotate-180" />সব বই</Link>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[.8fr_1.2fr] lg:gap-12">
            <div className="mx-auto w-full max-w-[280px] md:max-w-sm"><div className="rounded-[1.5rem] bg-gold p-2.5 shadow-elegant"><img src={cover} alt={book.title} className="w-full rounded-2xl object-cover" /></div></div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><span className="size-1.5 rounded-full bg-primary" />Eternal Freedom প্রকাশনা</span>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{book.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-foreground/85">{book.author && <span className="flex items-center gap-1.5"><User className="size-4 text-gold" />{book.author}</span>}{book.pages ? <span className="flex items-center gap-1.5"><FileText className="size-4 text-gold" />{bn(book.pages)} পৃষ্ঠা</span> : null}<span className="flex items-center gap-1.5"><BookOpen className="size-4 text-gold" />প্রিন্টেড কপি</span></div>
              <div className="mt-6 font-display text-5xl font-bold text-gold">৳ {bn(Number(book.price))}</div>
              <p className="mt-5 leading-8 text-primary-foreground/85">{book.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[[Truck, 'সারাদেশে ডেলিভারি'], [Wallet, 'COD / বিকাশ / নগদ'], [Clock, '২–৫ কর্মদিবস'], [ShieldCheck, 'নিরাপদ অর্ডার']].map(([I, t]) => { const Icon = I as typeof Truck; return <div key={t as string} className="flex items-center gap-2 rounded-xl bg-primary-raised p-3 text-xs font-semibold"><Icon className="size-4 shrink-0 text-gold" />{t as string}</div>; })}
              </div>
              <Button asChild size="lg" className="mt-6 bg-gold text-primary hover:bg-gold-light"><a href="#checkout">এখনই অর্ডার করুন</a></Button>
            </div>
          </div>
        </div>
      </section>

      <section id="checkout" className="scroll-mt-20 px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            {book.details && <div className="mb-8 rounded-3xl bg-secondary p-6 sm:p-8"><h2 className="font-display text-2xl font-semibold text-primary">বইয়ের বিস্তারিত</h2><p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">{book.details}</p></div>}
            <div className="rounded-3xl border border-border bg-background p-5 shadow-elegant sm:p-8">
              {reference ? (
                <div className="py-8 text-center"><CheckCircle2 className="mx-auto size-14 text-primary" /><h2 className="mt-4 font-display text-2xl text-primary">অর্ডার জমা হয়েছে</h2><p className="mt-3">অর্ডার নম্বর: <strong className="select-all text-primary">{reference}</strong></p><p className="mt-3 text-sm text-muted-foreground">নম্বরটি সংরক্ষণ করুন। আমরা ফোনে নিশ্চিত করে আপনার ঠিকানায় বই পাঠাব। বইয়ের দোকান পেজ থেকে অর্ডারের অবস্থা দেখতে পারবেন।</p><Button asChild className="mt-6"><Link to="/books">অর্ডারের অবস্থা দেখুন</Link></Button></div>
              ) : (
                <form onSubmit={checkout} className="space-y-5">
                  <h2 className="font-display text-2xl font-semibold text-primary">চেকআউট</h2>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><MapPin className="size-4 text-gold" />ডেলিভারির তথ্য</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input required aria-label="নাম" placeholder="আপনার নাম" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className={input} />
                      <input required aria-label="মোবাইল নম্বর" type="tel" placeholder="মোবাইল নম্বর (01XXXXXXXXX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                      <textarea required aria-label="ঠিকানা" placeholder="সম্পূর্ণ ঠিকানা (বাড়ি, গ্রাম/রোড, থানা, জেলা)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${input} min-h-24 sm:col-span-2`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Truck className="size-4 text-gold" />ডেলিভারি এলাকা</h3>
                    <div className="grid grid-cols-2 gap-2">{(Object.keys(DELIVERY_ZONES) as Zone[]).map((z) => <button key={z} type="button" onClick={() => setZone(z)} className={`rounded-xl border-2 p-3 text-start text-sm ${zone === z ? 'border-primary bg-accent text-primary' : 'border-border text-muted-foreground'}`}><span className="block font-semibold">{DELIVERY_ZONES[z].label}</span><span className="text-xs">চার্জ ৳ {bn(DELIVERY_ZONES[z].charge)}</span></button>)}</div>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><Wallet className="size-4 text-gold" />পেমেন্ট পদ্ধতি</h3>
                    <div className="grid grid-cols-3 gap-2">{(['ক্যাশ অন ডেলিভারি', 'বিকাশ', 'নগদ'] as Method[]).map((m) => <button key={m} type="button" onClick={() => setForm({ ...form, payment_method: m })} className={`rounded-xl border-2 px-2 py-3 text-xs font-semibold ${form.payment_method === m ? 'border-primary bg-accent text-primary' : 'border-border text-muted-foreground'}`}>{m}</button>)}</div>
                    {form.payment_method !== 'ক্যাশ অন ডেলিভারি' && (
                      <div className="mt-3 rounded-xl bg-accent p-4 text-sm leading-7 text-primary">
                        <ol className="list-decimal ps-5"><li>{form.payment_method} অ্যাপে “Send Money” নির্বাচন করুন</li><li>নম্বর: <strong className="select-all">{form.payment_method === 'বিকাশ' ? s.bkash : s.nagad}</strong></li><li>পরিমাণ: <strong>৳ {bn(total)}</strong></li><li>ট্রানজেকশন আইডি নিচে লিখুন</li></ol>
                        <input required aria-label="ট্রানজেকশন আইডি" placeholder="ট্রানজেকশন আইডি (TrxID)" value={form.payment_reference} onChange={(e) => setForm({ ...form, payment_reference: e.target.value })} className={`${input} mt-3`} />
                      </div>
                    )}
                  </div>
                  {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" size="lg" disabled={busy} className="w-full lg:hidden">{busy ? 'জমা হচ্ছে...' : `অর্ডার নিশ্চিত করুন · ৳ ${bn(total)}`}</Button>
                  <Button type="submit" size="lg" disabled={busy} className="hidden w-full lg:flex">{busy ? 'জমা হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}</Button>
                </form>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-elegant sm:p-6">
              <h2 className="font-display text-xl font-semibold">অর্ডার সারাংশ</h2>
              <div className="mt-4 flex gap-3 rounded-2xl bg-primary-raised p-3"><img src={cover} alt={book.title} className="h-24 w-[72px] shrink-0 rounded-lg object-cover" /><div className="min-w-0"><div className="line-clamp-2 font-semibold">{book.title}</div><div className="mt-1 text-sm text-gold">৳ {bn(Number(book.price))}</div>
                <div className="mt-2 flex w-fit items-center gap-1 rounded-lg bg-primary"><Button type="button" aria-label="কমান" variant="ghost" size="icon" className="size-8 text-primary-foreground hover:bg-primary-raised" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="size-4" /></Button><span className="w-6 text-center text-sm">{bn(qty)}</span><Button type="button" aria-label="বাড়ান" variant="ghost" size="icon" className="size-8 text-primary-foreground hover:bg-primary-raised" onClick={() => setQty(Math.min(20, qty + 1))}><Plus className="size-4" /></Button></div></div></div>
              <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt className="text-primary-foreground/80">সাবটোটাল</dt><dd>৳ {bn(subtotal)}</dd></div><div className="flex justify-between"><dt className="text-primary-foreground/80">ডেলিভারি ({DELIVERY_ZONES[zone].label})</dt><dd>৳ {bn(charge)}</dd></div><div className="flex justify-between border-t border-primary-foreground/25 pt-3 text-lg font-bold"><dt>সর্বমোট</dt><dd className="text-gold">৳ {bn(total)}</dd></div></dl>
              <ul className="mt-5 space-y-2 text-xs text-primary-foreground/85">{[[PackageCheck, 'অর্ডারের পর ফোনে নিশ্চিতকরণ'], [Truck, 'কুরিয়ারে ২–৫ কর্মদিবসে ডেলিভারি'], [ShieldCheck, 'অর্ডার নম্বর দিয়ে অবস্থা ট্র্যাক']].map(([I, t]) => { const Icon = I as typeof Truck; return <li key={t as string} className="flex items-center gap-2"><Icon className="size-4 text-gold" />{t as string}</li>; })}</ul>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && <section className="bg-secondary px-2.5 py-10 sm:px-5 sm:py-16 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-5 flex items-end justify-between gap-4 sm:mb-8"><h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-primary sm:text-2xl"><span className="h-6 w-1.5 shrink-0 rounded-full bg-gold sm:h-7 sm:w-2" />আরও বই</h2><Link to="/books" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-gold-deep hover:underline sm:text-sm">সব বই দেখুন <ArrowRight className="size-3.5 rtl:rotate-180 sm:size-4" /></Link></div><div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">{others.map((o, k) => <Link key={o.id} to="/books/$id" params={{ id: o.id }} className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow duration-300 hover:shadow-elegant sm:rounded-lg"><div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-secondary p-2 sm:p-4"><img src={o.cover_url ?? pick(bookCovers, k + 1)} alt={o.title} loading="lazy" width={768} height={1024} className="h-full w-full object-cover shadow-elegant" /><span className="absolute bottom-1.5 start-1.5 inline-flex items-center rounded bg-background px-1.5 py-0.5 text-[10px] font-bold text-primary sm:bottom-2.5 sm:start-2.5 sm:rounded-md sm:px-2 sm:py-1 sm:text-xs">৳ {bn(Number(o.price))}</span></div><div className="flex flex-1 flex-col p-2.5 sm:p-4"><h3 className="line-clamp-2 min-h-8 font-book-title text-xs font-bold leading-4 text-primary sm:min-h-10 sm:text-sm sm:leading-5">{o.title}</h3><div className="mt-auto flex items-center justify-between gap-1.5 pt-2 sm:pt-3.5"><span className="text-[10px] font-bold text-gold-deep sm:text-xs">বিস্তারিত দেখুন</span><ArrowRight className="size-3 shrink-0 text-gold-deep transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 sm:size-3.5" /></div></div></Link>)}</div></div></section>}
    </Site>
  );
}
