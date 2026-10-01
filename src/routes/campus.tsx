import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Site, PageIntro, Heading, DemoNote } from '@/components/Site';
import { SafetyGrid, itemImage } from '@/components/InstitutionSections';
import { useInstitutionContent } from '@/lib/institution-content';
import { facilityImages, isDemo } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/campus')({
  head: () => seo('ক্যাম্পাস ও সুবিধা', 'একাডেমিক ভবন, শ্রেণিকক্ষ, আবাসন, খেলার মাঠ, লাইব্রেরি, আইসিটি, চিকিৎসা, রান্নাঘর, বেকারি, পানি, লন্ড্রি ও সিসিটিভি—সব সুবিধা ছবিসহ।'),
  component: Campus,
});

function Campus() {
  const items = useInstitutionContent('facility');
  return (
    <Site>
      <PageIntro eyebrow="ক্যাম্পাস ও সুবিধা" title="প্রিমিয়াম ক্যাম্পাস শোকেস" description="প্রতিটি সুবিধা শুধু নামে নয়—ছবি, সংক্ষিপ্ত তথ্য ও উপকারিতাসহ।" image={facilityImages.playground} />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {items.map((f, k) => (
            <article key={f.id} className={`grid items-center gap-8 overflow-hidden rounded-3xl bg-secondary lg:grid-cols-2 ${k % 2 ? 'lg:[&>img]:order-2' : ''}`}>
              <img src={itemImage(f, k)} alt={f.title} loading="lazy" className="h-72 w-full object-cover lg:h-full lg:min-h-80" />
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3"><span className="font-display text-4xl text-gold">{String(k + 1).padStart(2, '0')}</span><DemoNote show={isDemo(f.slug)} /></div>
                <h2 className="mt-3 font-display text-2xl font-semibold text-primary sm:text-3xl">{f.title}</h2>
                <p className="mt-3 leading-8 text-muted-foreground">{f.body}</p>
                {f.detail && <ul className="mt-5 grid gap-2 sm:grid-cols-2">{f.detail.split(',').map((b) => <li key={b} className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="size-4 text-gold" />{b.trim()}</li>)}</ul>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-primary px-5 py-20 text-primary-foreground lg:px-8"><div className="mx-auto max-w-7xl"><Heading light eyebrow="নিরাপত্তা" title="শিক্ষার্থীর নিরাপত্তা ও যত্ন" /><SafetyGrid dark /><div className="mt-10"><Button asChild className="bg-gold text-primary hover:bg-gold-light"><Link to="/contact">ক্যাম্পাস পরিদর্শনের সময় নিন</Link></Button></div></div></section>
    </Site>
  );
}
