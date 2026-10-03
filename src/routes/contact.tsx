import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { ContactForm } from '@/components/ContactForm';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { photos } from '@/lib/content';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/contact')({
  head: () => seo('যোগাযোগ', 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—ফোন, ইমেইল, ঠিকানা, ম্যাপ ও বার্তা পাঠানোর ফর্ম।'),
  component: Contact,
});

const MAPS_URL = 'https://www.google.com/maps/place/Eternal+Freedom+Institute+Al+Islamia/@24.4569854,90.5489134,880m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3756619166939f13:0xf7a04cb7cd46f8de!8m2!3d24.4569854!4d90.5514883!16s%2Fg%2F11vdtqt29c';
const MAP_EMBED = 'https://www.google.com/maps?q=24.4569854,90.5514883&z=16&hl=bn&output=embed';

function Contact() {
  const s = useSiteSettings();
  const cards: [typeof MapPin, string, string, string | undefined][] = [[MapPin, 'ঠিকানা', s.address, undefined], [Phone, 'ফোন', [s.phone, s.phone2].filter(Boolean).join(', '), telHref(s.phone)], [Mail, 'ইমেইল', s.email, `mailto:${s.email}`], [Clock, 'অফিস সময়', s.office_hours, undefined]];
  return (
    <Site>
      <PageIntro eyebrow="যোগাযোগ" title="আমরা আছি আপনার পাশে" description="ভর্তি, আবাসিক ব্যবস্থা, বই অর্ডার বা যেকোনো প্রশ্নে যোগাযোগ করুন।" image={photos[3]} />
      <section className="px-4 py-12 sm:px-5 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([Icon, label, value, href]) => { const inner = <><div className="grid size-12 place-items-center rounded-xl bg-primary text-gold-light"><Icon className="size-5" /></div><div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div><div className="mt-1 break-words text-[15px] font-bold text-primary sm:text-base">{value}</div></>; return href ? <a key={label} href={href} className="premium-card rounded-2xl border border-border/60 bg-background p-5">{inner}</a> : <div key={label} className="rounded-2xl border border-border/60 bg-background p-5">{inner}</div>; })}
        </div>
      </section>
      <section className="bg-secondary px-4 py-12 sm:px-5 sm:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Heading eyebrow="বার্তা" title="আমাদের লিখুন" description="ফর্মটি পূরণ করলে আপনার বার্তা সরাসরি প্রতিষ্ঠানের অ্যাডমিন প্যানেলে পৌঁছাবে।" />
            <ContactForm />
          </div>
          <div>
            <Heading eyebrow="অবস্থান" title="ম্যাপে আমাদের খুঁজুন" />
            <div className="overflow-hidden rounded-[1.75rem] border border-border/60 shadow-elegant">
              <iframe title="গুগল ম্যাপে প্রতিষ্ঠানের অবস্থান" src={MAP_EMBED} loading="lazy" className="h-[300px] w-full border-0 sm:h-[420px] lg:h-[440px]" />
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-primary px-4 py-3.5 text-sm font-bold text-gold-light transition-colors hover:bg-primary/90">
                <Navigation className="size-4" />গুগল ম্যাপে প্রতিষ্ঠানের সঠিক অবস্থান দেখুন
              </a>
            </div>
          </div>
        </div>
      </section>
    </Site>
  );
}
