import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { Heading } from '@/components/Site';
import { defaultSettings, telHref, useSiteSettings } from '@/lib/site-settings';

export const CONTACT_MAP_URL = 'https://www.google.com/maps/place/Eternal+Freedom+Institute+Al+Islamia/@24.4569854,90.5489134,880m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3756619166939f13:0xf7a04cb7cd46f8de!8m2!3d24.4569854!4d90.5514883!16s%2Fg%2F11vdtqt29c';
const CONTACT_MAP_EMBED = 'https://www.google.com/maps?q=24.4569854,90.5514883&z=17&hl=bn&output=embed';

export function ContactSection() {
  const s = useSiteSettings();
  const phone = s.phone && s.phone !== defaultSettings.phone ? s.phone : '';
  const email = s.email && s.email !== defaultSettings.email ? s.email : '';
  const hours = s.office_hours && s.office_hours !== defaultSettings.office_hours ? s.office_hours : '';

  return (
    <section id="contact" className="px-2.5 py-5 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[90rem] overflow-hidden rounded-2xl bg-primary text-primary-foreground sm:rounded-3xl">
        <div className="grid gap-4 border-b border-primary-foreground/20 px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
          <div>
            <Heading compact light eyebrow="যোগাযোগ" title="আমাদের সঙ্গে যোগাযোগ করুন" description="ভর্তি, আবাসিক ব্যবস্থা, বই অর্ডার বা যেকোনো প্রশ্নে সরাসরি বার্তা পাঠান।" />
          </div>
          <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg border border-gold px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-primary">
            <MapPin className="size-4 shrink-0" /> গফরগাঁও, ময়মনসিংহ <ArrowUpRight className="size-4 shrink-0" />
          </a>
        </div>
        <div className="grid items-start gap-7 px-4 py-6 sm:gap-9 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-12 lg:py-10">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold text-gold sm:text-2xl">প্রতিষ্ঠানের ঠিকানা</h3>
            <div className="mt-4 divide-y divide-primary-foreground/20 border-y border-primary-foreground/20">
              <div className="flex gap-3 py-3.5 sm:gap-4"><MapPin className="mt-1 size-5 shrink-0 text-gold" /><div className="min-w-0"><p className="text-xs text-gold-light">অবস্থান</p><p className="font-semibold leading-7">Eternal Freedom Institute Al Islamia<br />গফরগাঁও, ময়মনসিংহ, বাংলাদেশ</p></div></div>
              {phone && <a href={telHref(phone)} className="flex gap-3 py-3.5 hover:text-gold sm:gap-4"><Phone className="mt-1 size-5 shrink-0 text-gold" /><div><p className="text-xs text-gold-light">ফোন</p><p className="font-semibold">{phone}{s.phone2 ? `, ${s.phone2}` : ''}</p></div></a>}
              {email && <a href={`mailto:${email}`} className="flex gap-3 py-3.5 hover:text-gold sm:gap-4"><Mail className="mt-1 size-5 shrink-0 text-gold" /><div className="min-w-0"><p className="text-xs text-gold-light">ইমেইল</p><p className="break-all font-semibold">{email}</p></div></a>}
              {hours && <div className="flex gap-3 py-3.5 sm:gap-4"><Clock3 className="mt-1 size-5 shrink-0 text-gold" /><div><p className="text-xs text-gold-light">অফিস সময়</p><p className="font-semibold">{hours}</p></div></div>}
            </div>
            <div className="mt-5 overflow-hidden rounded-xl bg-secondary">
              <iframe title="Eternal Freedom Institute Al Islamia-এর অবস্থান" src={CONTACT_MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-48 w-full border-0 sm:h-56 lg:h-64" />
              <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 bg-gold px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-gold-light sm:px-5">
                <span>গুগল ম্যাপে সঠিক অবস্থান দেখুন</span><ArrowUpRight className="size-4 shrink-0" />
              </a>
            </div>
          </div>
          <div className="min-w-0 rounded-xl bg-background p-4 text-foreground sm:p-6 lg:p-8">
            <div className="mb-5 border-b border-border pb-4">
              <p className="text-xs font-bold text-gold-deep">সরাসরি বার্তা</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-primary sm:text-2xl">আমাদের লিখুন</h3>
              <p className="mt-1 text-sm text-muted-foreground">আপনার প্রশ্ন বা মতামত লিখে পাঠান।</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
