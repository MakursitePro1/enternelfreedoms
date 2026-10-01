import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { ContactForm } from '@/components/ContactForm';
import { useSiteSettings, telHref } from '@/lib/site-settings';
import { photos } from '@/lib/content';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/contact')({
  head: () => seo('যোগাযোগ', 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—ফোন, ইমেইল, ঠিকানা, ম্যাপ ও বার্তা পাঠানোর ফর্ম।'),
  component: Contact,
});

function Contact() {
  const s = useSiteSettings();
  const cards: [typeof MapPin, string, string, string | undefined][] = [[MapPin, 'ঠিকানা', s.address, undefined], [Phone, 'ফোন', [s.phone, s.phone2].filter(Boolean).join(', '), telHref(s.phone)], [Mail, 'ইমেইল', s.email, `mailto:${s.email}`], [Clock, 'অফিস সময়', s.office_hours, undefined]];
  return (
    <Site>
      <PageIntro eyebrow="যোগাযোগ" title="আমরা আছি আপনার পাশে" description="ভর্তি, আবাসিক ব্যবস্থা, বই অর্ডার বা যেকোনো প্রশ্নে যোগাযোগ করুন।" image={photos[3]} />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([Icon, label, value, href]) => { const inner = <><div className="grid size-14 place-items-center rounded-2xl bg-primary text-gold-light"><Icon className="size-6" /></div><div className="mt-4 text-xs text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold text-primary">{value}</div></>; return href ? <a key={label} href={href} className="rounded-2xl bg-secondary p-6 premium-card">{inner}</a> : <div key={label} className="rounded-2xl bg-secondary p-6">{inner}</div>; })}
        </div>
      </section>
      <section className="bg-secondary px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div><Heading eyebrow="বার্তা" title="আমাদের লিখুন" description="ফর্মটি পূরণ করলে আপনার বার্তা সরাসরি প্রতিষ্ঠানের অ্যাডমিন প্যানেলে পৌঁছাবে।" /><ContactForm /></div>
          <div><Heading eyebrow="অবস্থান" title="ম্যাপে আমাদের খুঁজুন" /><div className="overflow-hidden rounded-2xl shadow-elegant"><iframe title="গুগল ম্যাপে প্রতিষ্ঠানের অবস্থান" src="https://www.google.com/maps?q=Gafargaon,+Mymensingh&output=embed" loading="lazy" className="h-[460px] w-full border-0" /></div></div>
        </div>
      </section>
    </Site>
  );
}
