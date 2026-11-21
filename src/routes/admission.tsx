import { pageSeo } from '@/lib/seo-pages';
import { AdmissionApplication } from '@/components/AdmissionApplication';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Search, Phone, Sparkles, SearchCheck } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { Site } from '@/components/Site';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { photos, facilityImages } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { trackAdmission } from '@/lib/platform.functions';

export const Route = createFileRoute('/admission')({
  head: (ctx) => pageSeo(ctx, '/admission'),
  component: Admission,
});
const heroSlides = [
  { src: photos[2], alt: 'ইটারনাল ফ্রিডমের শিক্ষার্থী ও শিক্ষকবৃন্দ' },
  { src: facilityImages.classroom, alt: 'শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা' },
  { src: facilityImages.quran, alt: 'কুরআন তিলাওয়াতরত শিক্ষার্থীরা' },
];
function Admission() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setSlide((x) => (x + 1) % heroSlides.length), 6000); return () => window.clearInterval(id); }, []);
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState({ reference: '', phone: '' });
  const [tracked, setTracked] = useState<{ student_name: string; program: string; status: string } | null | undefined>(undefined);
  const [lookupError, setLookupError] = useState('');
  const s = useSiteSettings();
  const track = useServerFn(trackAdmission);
  async function lookup(e: FormEvent) {
    e.preventDefault(); setBusy(true); setLookupError('');
    try { setTracked(await track({ data: tracking })); }
    catch { setLookupError('আবেদনের তথ্য খুঁজে পাওয়া যায়নি।'); }
    finally { setBusy(false); }
  }
  return <Site>
      {/* হিরো — হোম পেজের মতো */}
      <div className="px-2.5 pb-2.5 pt-2.5 sm:px-5 sm:pb-5 sm:pt-5">
        <section className="relative flex flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground shadow-elegant sm:min-h-[calc(100svh-230px)] sm:rounded-[1.25rem]">
          {heroSlides.map((sl, k) => <img key={sl.src} src={sl.src} alt={sl.alt} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${k === slide ? 'opacity-100' : 'opacity-0'}`} />)}
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-4 pt-16 max-[359px]:px-4 max-[359px]:pt-10 sm:justify-center sm:py-6 lg:px-8">
            <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary shadow-elegant sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"><Sparkles className="size-3 shrink-0 sm:size-3.5" />{s.admission_badge}</span>
            <p className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-gold-light sm:mt-4 sm:gap-3 sm:text-sm"><span className="h-px w-5 shrink-0 bg-gold sm:w-8" />Eternal Freedom Institute Al Islamia</p>
            <h1 className="mt-1.5 max-w-5xl font-display text-[1.75rem] font-bold leading-[1.15] max-[359px]:text-[1.5rem] sm:mt-2.5 sm:text-5xl lg:text-6xl">অনলাইন ভর্তি<br /><span className="text-gold-light">সন্তানের নতুন যাত্রা শুরু হোক</span></h1>
            <p className="mt-2 max-w-xl text-[12.5px] leading-5 text-primary-foreground/90 sm:mt-2.5 sm:text-base sm:leading-7">বিভাগ, যোগ্যতা, ফি ও কাগজপত্র দেখে ঘরে বসেই নোটিশ পড়ে সম্মতি দিন এবং শিক্ষার্থীর তথ্য দিয়ে আবেদন করুন।</p>
            <div className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
              <Button size="lg" asChild className="max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-gold text-primary hover:bg-gold-light"><a href="#apply">আবেদন শুরু করুন <ArrowRight className="size-3.5 sm:size-4 rtl:rotate-180" /></a></Button>
              <Button size="lg" variant="outline" asChild className="max-sm:h-10 max-sm:w-full max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] border-primary-foreground/60 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="#track">আবেদনের অবস্থা</a></Button>
              <Button size="lg" asChild className="max-sm:col-span-2 max-sm:h-10 max-sm:w-full max-sm:gap-1 max-sm:px-2 max-sm:text-[12.5px] max-[359px]:text-[11.5px] bg-primary-foreground text-primary shadow-elegant hover:bg-primary-foreground/90"><a href={telHref(s.phone)}><Phone className="size-4" />সরাসরি কথা বলুন</a></Button>
            </div>
            <div className="mt-3.5 flex gap-1.5 sm:mt-6 sm:gap-2">{heroSlides.map((sl, k) => <button key={sl.src} type="button" aria-label={`ছবি ${k + 1}`} onClick={() => setSlide(k)} className={`h-1.5 rounded-full transition-all ${k === slide ? 'w-8 bg-gold sm:w-10' : 'w-4 bg-primary-foreground/40 sm:w-5'}`} />)}</div>
          </div>
          <div id="track" className="relative w-full scroll-mt-28 px-2.5 pb-2.5 max-[359px]:px-2 max-[359px]:pb-2 sm:px-6 sm:pb-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-2xl bg-primary p-4 shadow-elegant sm:rounded-[1.25rem] sm:p-5">
              <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center">
                <div className="flex min-w-0 items-center gap-3 lg:shrink-0">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-primary shadow-elegant sm:size-11"><SearchCheck className="size-5" strokeWidth={2.2} /></span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] font-semibold text-primary-foreground sm:text-base">আবেদন ট্র্যাক করুন</p>
                    <p className="text-[11px] text-primary-foreground/70 sm:text-xs">আবেদন নম্বর ও ফোন দিয়ে সর্বশেষ অবস্থা জানুন</p>
                  </div>
                </div>
                <form onSubmit={lookup} className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:gap-2.5">
                  <input aria-label="আবেদন নম্বর" placeholder="আবেদন নম্বর (EF-...)" required value={tracking.reference} onChange={(e) => setTracking({ ...tracking, reference: e.target.value })} className="min-w-0 rounded-xl bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold" />
                  <input aria-label="অভিভাবকের ফোন" placeholder="অভিভাবকের ফোন" required value={tracking.phone} onChange={(e) => setTracking({ ...tracking, phone: e.target.value })} className="min-w-0 rounded-xl bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-gold" />
                  <Button type="submit" disabled={busy} className="h-11 rounded-xl bg-gold px-5 text-sm font-bold text-primary hover:bg-gold-light"><Search className="size-4" /> খুঁজুন</Button>
                </form>
              </div>
              {tracked === null && <p className="mt-3 rounded-xl border border-gold/40 px-4 py-2.5 text-[12.5px] text-gold-light">এই নম্বর ও ফোন দিয়ে কোনো আবেদন পাওয়া যায়নি।</p>}
              {tracked && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-gold px-4 py-3 text-[13px] font-semibold text-primary sm:text-sm"><span>{tracked.student_name} · {tracked.program}</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" />অবস্থা: {tracked.status}</span></div>}
            </div>
          </div>
        </section>
      </div>

      {lookupError && <p role="alert" className="px-5 text-sm text-destructive">{lookupError}</p>}
      <AdmissionApplication />
    </Site>;
}
