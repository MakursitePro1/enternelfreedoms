import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, PlayCircle, Truck, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import readerImage from '@/assets/magic-english-reader.jpg.asset.json';

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
    <section id="magic-english" className="scroll-mt-24 px-3 py-10 sm:px-5 sm:py-16 lg:py-20">
      <div className="islamic-pattern relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary p-4 text-primary-foreground shadow-elegant sm:p-8 lg:p-12">
        <div className="relative grid items-center gap-5 sm:gap-8 md:grid-cols-[1.1fr_.9fr] lg:gap-14">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-primary sm:px-3 sm:text-xs"><span className="size-1.5 rounded-full bg-primary" />বিশেষ প্রকাশনা</span>
            <h2 className="mt-2.5 font-display text-2xl font-bold leading-tight sm:mt-4 sm:text-4xl lg:text-5xl"><span className="text-gold">Magic English</span><br />Spoken & Written</h2>
            <p className="mt-1.5 text-[11px] text-primary-foreground/80 sm:mt-2 sm:text-sm">লেখক: {book.author}</p>

            <div className="mt-3 min-h-[104px] rounded-2xl bg-primary-raised p-3 sm:mt-6 sm:min-h-[140px] sm:p-5">
              <div key={i} className="fade-slide">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-gold sm:text-xs"><Icon className="size-3.5 sm:size-4" />{s.tag}</div>
                <h3 className="mt-1 font-display text-sm font-semibold sm:mt-2 sm:text-lg lg:text-xl">{s.title}</h3>
                <p className="mt-1 text-[11px] leading-5 text-primary-foreground/80 sm:mt-1.5 sm:text-sm sm:leading-6">{s.text}</p>
              </div>
              <div className="mt-2.5 flex gap-1.5 sm:mt-4">
                {slides.map((x, k) => <button key={x.tag} type="button" aria-label={`স্লাইড ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-8 bg-gold' : 'w-3 bg-primary-foreground/30'}`} />)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:mt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
              <div><div className="text-[10px] text-primary-foreground/70 sm:text-xs">মূল্য</div><div className="font-display text-xl font-bold text-gold sm:text-3xl lg:text-4xl">৳ {Number(book.price).toLocaleString('bn-BD')}</div></div>
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-2.5">
                <Button asChild size="lg" className="bg-gold px-2 text-xs text-primary hover:bg-gold-light sm:px-6 sm:text-base"><Link to="/books/$id" params={{ id: book.id }}><ShoppingBag className="size-4" />এখনই অর্ডার করুন</Link></Button>
                <Button asChild size="lg" variant="secondary" className="px-2 text-xs sm:px-6 sm:text-base"><Link to="/books/$id" params={{ id: book.id }}>বিস্তারিত<ArrowRight className="size-4" /></Link></Button>
              </div>
            </div>
            <div className="mt-3 hidden flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-primary-foreground/85 sm:mt-5 sm:flex sm:gap-x-5 sm:text-xs">
              {['ক্যাশ অন ডেলিভারি', 'বিকাশ / নগদ', 'সারাদেশে হোম ডেলিভারি'].map((t) => <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-gold sm:size-4" />{t}</span>)}
            </div>
          </div>

          <Link to="/books/$id" params={{ id: book.id }} className="group order-1 mx-auto w-full max-w-[215px] sm:max-w-[260px] md:order-2 md:max-w-[320px] lg:max-w-[400px]">
            <div className="rounded-[1.5rem] bg-gold p-1.5 sm:p-2.5 shadow-elegant transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-1">
              <img src={readerImage.url} alt="ম্যাজিক ইংলিশ বই পড়ছে একজন শিক্ষার্থী" loading="lazy" decoding="async" className="aspect-[657/906] w-full rounded-xl sm:rounded-2xl object-cover" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
