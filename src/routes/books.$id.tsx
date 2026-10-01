import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, User, FileText, ShoppingBag, Truck, Wallet, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Site, DemoNote } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { bookCovers, isDemo } from '@/lib/content';
import { useCart } from '@/lib/cart';
import { seo } from '@/lib/seo';
import type { Book } from './books.index';

export const Route = createFileRoute('/books/$id')({
  head: () => seo('বইয়ের বিস্তারিত', 'বইয়ের প্রচ্ছদ, বিবরণ, লেখক, পৃষ্ঠা ও মূল্য দেখে অনলাইনে অর্ডার করুন।'),
  component: BookDetail,
});

function BookDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { cart, change } = useCart();
  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const [others, setOthers] = useState<Book[]>([]);
  useEffect(() => {
    supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('id', id).eq('active', true).maybeSingle().then(({ data }) => setBook((data as Book) ?? null));
    supabase.from('books').select('id,title,description,price,cover_url,slug,author,pages,details').eq('active', true).neq('id', id).limit(4).then(({ data }) => setOthers((data ?? []) as Book[]));
  }, [id]);
  if (book === undefined) return <Site><div className="mx-auto max-w-6xl px-5 py-24"><div className="h-96 animate-pulse rounded-2xl bg-secondary" /></div></Site>;
  if (!book) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">বইটি পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/books">সব বই দেখুন</Link></Button></section></Site>;
  const qty = cart[book.id] ?? 0;
  const cover = book.cover_url ?? bookCovers[0];
  return (
    <Site>
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link to="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold"><ArrowLeft className="size-4 rtl:rotate-180" />সব বই</Link>
          <div className="mt-8 grid gap-10 md:grid-cols-[.8fr_1.2fr]">
            <div className="relative mx-auto w-full max-w-sm"><div className="absolute -inset-4 rounded-3xl bg-gold-gradient opacity-25 blur-2xl" /><img src={cover} alt={book.title} className="relative w-full rounded-2xl shadow-elegant" />{!book.cover_url && <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 rounded-xl bg-background/90 p-4 text-center font-display text-lg font-semibold text-primary">{book.title}</div>}</div>
            <div>
              <DemoNote show={isDemo(book.slug)} />
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-primary sm:text-5xl">{book.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">{book.author && <span className="flex items-center gap-1.5"><User className="size-4 text-gold" />{book.author}</span>}{book.pages ? <span className="flex items-center gap-1.5"><FileText className="size-4 text-gold" />{book.pages.toLocaleString('bn-BD')} পৃষ্ঠা</span> : null}<span className="flex items-center gap-1.5"><BookOpen className="size-4 text-gold" />Eternal Freedom প্রকাশনা</span></div>
              <div className="mt-6 font-display text-4xl font-bold text-primary">৳ {Number(book.price).toLocaleString('bn-BD')}</div>
              <p className="mt-6 text-lg leading-8 text-foreground/85">{book.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {qty > 0 && <div className="flex items-center gap-1 rounded-lg bg-secondary"><Button aria-label="কমান" variant="ghost" size="icon" onClick={() => change(book.id, -1)}><Minus className="size-4" /></Button><span className="w-6 text-center">{qty}</span><Button aria-label="বাড়ান" variant="ghost" size="icon" onClick={() => change(book.id, 1)}><Plus className="size-4" /></Button></div>}
                <Button size="lg" variant="secondary" onClick={() => change(book.id, 1)}><Plus className="size-4" />কার্টে রাখুন</Button>
                <Button size="lg" onClick={() => { if (!qty) change(book.id, 1); navigate({ to: '/books', search: { cart: 1 } }); }}><ShoppingBag className="size-4" />এখনই অর্ডার করুন</Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl bg-secondary p-4 text-sm"><Truck className="size-5 text-gold" />ঠিকানায় হোম ডেলিভারি</div><div className="flex items-center gap-3 rounded-xl bg-secondary p-4 text-sm"><Wallet className="size-5 text-gold" />ক্যাশ অন ডেলিভারি / বিকাশ / নগদ</div></div>
            </div>
          </div>
          {book.details && <div className="mt-14 rounded-3xl bg-secondary p-8 sm:p-10"><h2 className="font-display text-2xl font-semibold text-primary">বইয়ের বিস্তারিত</h2><p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">{book.details}</p></div>}
        </div>
      </section>
      {others.length > 0 && <section className="bg-secondary px-5 py-16 lg:px-8"><div className="mx-auto max-w-6xl"><h2 className="mb-6 font-display text-2xl font-semibold text-primary">আরও বই</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{others.map((o, k) => <Link key={o.id} to="/books/$id" params={{ id: o.id }} className="overflow-hidden rounded-2xl bg-background shadow-elegant premium-card"><img src={o.cover_url ?? bookCovers[(k + 1) % bookCovers.length]} alt={o.title} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="p-4"><h3 className="font-semibold text-primary">{o.title}</h3><div className="mt-1 text-sm font-bold text-primary">৳ {Number(o.price).toLocaleString('bn-BD')}</div></div></Link>)}</div></div></section>}
    </Site>
  );
}
