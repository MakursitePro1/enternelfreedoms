import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, PlayCircle, Truck, Wallet, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import cover from '@/assets/magic-english.jpg.asset.json';

type Featured = { id: string; title: string; price: number; cover_url: string | null; author: string | null };

const slides = [
  { icon: BookOpen, tag: 'স্পোকেন ও রিটেন', title: 'ইংরেজি বলা ও লেখা — এক বইয়ে', text: 'দৈনন্দিন কথোপকথন থেকে গ্রামার ও লেখা—ধাপে ধাপে সহজ উপস্থাপনায়।' },
  { icon: PlayCircle, tag: 'ভিডিও লেসনসহ', title: 'দেখে দেখে শিখুন, দ্রুত আত্মবিশ্বাসী হন', text: 'প্রতিটি অধ্যায়ের সঙ্গে ভিডিও লেসন—ঘরে বসেই শেখা আরও সহজ।' },
  { icon: Truck, tag: 'সারাদেশে ডেলিভারি', title: 'ঘরে বসে অর্ডার, দোরগোড়ায় বই', text: 'ক্যাশ অন ডেলিভারি, বিকাশ বা নগদে নিশ্চিন্তে পেমেন্ট করুন।' },
];

export function FeaturedBookBanner() {
  const [book, setBook] = useState<Featured | null>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    supabase.from('books').select('id,title,price,cover_url,author').eq('slug', 'magic-english').eq('active', true).maybeSingle().then(({ data }) => setBook((data as Featured) ?? null));
  }, []);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => window.clearInterval(id);
  }, []);
  if (!book) return null;
  const s = slides[i]!;
  const Icon = s.icon;
  return (
    <section className="px-2.5 py-14 sm:px-5 sm:py-20">
      <div className="islamic-pattern relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary p-5 text-primary-foreground shadow-elegant sm:p-10 lg:p-12">
        <div className="relative grid items-center gap-8 md:grid-cols-[1.15fr_.85fr] lg:gap-12">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary"><span className="size-1.5 rounded-full bg-primary" />বিশেষ প্রকাশনা</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl"><span className="text-gold">Magic English</span><br />Spoken & Written</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">লেখক: {book.author}</p>

            <div className="mt-6 min-h-[150px] rounded-2xl bg-primary-raised p-5 sm:min-h-[140px]">
              <div key={i} className="fade-slide">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold"><Icon className="size-4" />{s.tag}</div>
                <h3 className="mt-2 font-display text-lg font-semibold sm:text-xl">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-primary-foreground/80">{s.text}</p>
              </div>
              <div className="mt-4 flex gap-1.5">
                {slides.map((x, k) => <button key={x.tag} type="button" aria-label={`স্লাইড ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-gold' : 'w-3 bg-primary-foreground/30'}`} />)}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div><div className="text-xs text-primary-foreground/70">মূল্য</div><div className="font-display text-4xl font-bold text-gold">৳ {Number(book.price).toLocaleString('bn-BD')}</div></div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/books/$id" params={{ id: book.id }}><ShoppingBag className="size-4" />এখনই অর্ডার করুন</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link to="/books/$id" params={{ id: book.id }}>বিস্তারিত<ArrowRight className="size-4" /></Link></Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/85">
              {['ক্যাশ অন ডেলিভারি', 'বিকাশ / নগদ', 'সারাদেশে হোম ডেলিভারি'].map((t) => <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-gold" />{t}</span>)}
            </div>
          </div>

          <Link to="/books/$id" params={{ id: book.id }} className="group order-1 mx-auto w-full max-w-[260px] md:order-2 md:max-w-[340px]">
            <div className="rounded-[1.5rem] bg-gold p-2.5 shadow-elegant transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1">
              <img src={book.cover_url ?? cover.url} alt={book.title} className="aspect-[657/906] w-full rounded-2xl object-cover" />
            </div>
            <div className="mx-auto -mt-4 flex w-fit items-center gap-2 rounded-full bg-background px-4 py-2 text-xs font-bold text-primary shadow-elegant"><Wallet className="size-4 text-gold" />৳ {Number(book.price).toLocaleString('bn-BD')}</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
