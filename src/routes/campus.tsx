import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, CheckCircle2, Images, MapPin, ShieldCheck } from 'lucide-react';
import { Site, Heading } from '@/components/Site';
import { SafetyGrid, itemImage } from '@/components/InstitutionSections';
import { useInstitutionContent } from '@/lib/institution-content';
import { facilityImages } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/campus')({
  head: () => seo('ক্যাম্পাস ও সুবিধা', 'একাডেমিক ভবন, শ্রেণিকক্ষ, আবাসন, খেলার মাঠ, লাইব্রেরি, আইসিটি, চিকিৎসা, রান্নাঘর, বেকারি, পানি, লন্ড্রি ও সিসিটিভি—সব সুবিধা ছবিসহ।'),
  component: Campus,
});

const campusSpaces = [
  { title: 'শ্রেণিকক্ষ', image: facilityImages.classroom },
  { title: 'কুরআন শিক্ষার পরিবেশ', image: facilityImages.quran },
  { title: 'আবাসিক কক্ষ', image: facilityImages.dorm },
  { title: 'পাঠাগার', image: facilityImages.library },
  { title: 'খাবারের স্থান', image: facilityImages.dining },
  { title: 'খেলার মাঠ', image: facilityImages.playground },
];

function Campus() {
  const items = useInstitutionContent('facility');
  const safety = useInstitutionContent('safety');
  const spaces = items.length
    ? items.map((item, index) => ({ id: item.id, title: item.title, image: itemImage(item, index), body: item.body, detail: item.detail }))
    : campusSpaces.map((space) => ({ ...space, id: space.title, body: '', detail: null }));

  return (
    <Site>
      <div className="px-2.5 pt-2.5 sm:px-5 sm:pt-5">
        <section className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[0.75rem] bg-primary text-primary-foreground sm:min-h-[570px] sm:rounded-[1.25rem]">
          <img src={facilityImages.playground} alt="ক্যাম্পাসের খেলার মাঠ" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-24 sm:px-8 sm:pb-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-primary"><MapPin className="size-4" />গফরগাঁও, ময়মনসিংহ</span>
            <p className="mt-6 text-sm font-semibold text-gold-light">ক্যাম্পাস ও সুবিধা</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">পড়াশোনা, বসবাস ও বেড়ে ওঠার পরিসর</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8">শ্রেণিকক্ষ থেকে পাঠাগার, আবাসিক কক্ষ থেকে খেলার মাঠ—ছবিতে ঘুরে দেখুন আমাদের ক্যাম্পাস।</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><a href="#campus-spaces">সুবিধাগুলো দেখুন <ArrowRight className="size-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">যোগাযোগ করুন</Link></Button>
            </div>
          </div>
        </section>
      </div>

      <section className="px-5 py-14 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading compact eyebrow="এক নজরে ক্যাম্পাস" title="ছবিতে আমাদের পরিসর" description="ক্যাম্পাসের বিভিন্ন অংশ একসঙ্গে দেখুন।" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
            {campusSpaces.map((space) => (
              <div key={space.title} className="group relative aspect-[4/3] min-w-0 overflow-hidden rounded-lg sm:aspect-[16/10]">
                <img src={space.image} alt={space.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute bottom-2 left-2 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground sm:bottom-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-sm">{space.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="campus-spaces" className="scroll-mt-24 px-5 pb-16 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading compact eyebrow="সুযোগ-সুবিধা" title="ক্যাম্পাসের প্রতিটি অংশ" />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {spaces.map((space, index) => (
              <article key={space.id} className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative aspect-[4/3] overflow-hidden"><img src={space.image} alt={space.title} loading="lazy" className="h-full w-full object-cover" /><span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-md bg-gold font-display text-sm font-bold text-primary">{String(index + 1).padStart(2, '0')}</span></div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-display text-lg font-bold text-primary sm:text-xl">{space.title}</h3>
                  {space.body && <p className="mt-2 text-sm leading-7 text-muted-foreground">{space.body}</p>}
                  {space.detail && <ul className="mt-4 grid gap-2 border-t border-border pt-4">{space.detail.split(',').filter(Boolean).map((detail) => <li key={detail} className="flex items-start gap-2 text-sm font-medium text-primary"><CheckCircle2 className="mt-1 size-4 shrink-0 text-gold-deep" />{detail.trim()}</li>)}</ul>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {safety.length > 0 && <section className="bg-primary px-5 py-16 text-primary-foreground sm:py-20 lg:px-8"><div className="mx-auto max-w-7xl"><Heading light eyebrow="নিরাপত্তা" title="শিক্ষার্থীর নিরাপত্তা ও যত্ন" /><SafetyGrid dark /></div></section>}

      <section className="px-5 py-16 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-deep"><Images className="size-5" />নিজে এসে দেখুন</span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">ক্যাম্পাস ঘুরে দেখতে চান?</h2>
            <p className="mt-4 max-w-lg leading-8 text-muted-foreground">ক্যাম্পাস ও সুবিধা সম্পর্কে আরও জানতে আমাদের সঙ্গে যোগাযোগ করুন।</p>
            <Button asChild size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary-raised"><Link to="/contact"><ShieldCheck className="size-4" />যোগাযোগ করুন <ArrowRight className="size-4" /></Link></Button>
          </div>
          <img src={facilityImages.classroom} alt="ক্যাম্পাসের শ্রেণিকক্ষ" loading="lazy" className="aspect-[16/10] w-full rounded-lg object-cover" />
        </div>
      </section>
    </Site>
  );
}
