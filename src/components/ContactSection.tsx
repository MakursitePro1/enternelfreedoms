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
    <section id="contact" className="px-2.5 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid items-end gap-4 lg:grid-cols-[1fr_auto]">
          <Heading compact eyebrow="যোগাযোগ" title="আমাদের সঙ্গে যোগাযোগ করুন" description="ভর্তি, আবাসিক ব্যবস্থা, বই অর্ডার বা যেকোনো প্রশ্নে সরাসরি বার্তা পাঠান।" />
          <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg border border-gold bg-gold px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-gold-light sm:mb-8">
            <MapPin className="size-4 shrink-0" /> গফরগাঁও, ময়মনসিংহ <ArrowUpRight className="size-4 shrink-0" />
          </a>
        </div>
        <div className="grid items-start gap-5 sm:gap-7 lg:mt-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-9">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-primary sm:text-xl">প্রতিষ্ঠানের ঠিকানা</h3>
            <div className="mt-3 space-y-3.5">
              <div className="flex gap-3 sm:gap-4"><MapPin className="mt-0.5 size-5 shrink-0 text-gold-deep" /><div className="min-w-0"><p className="text-xs font-semibold text-muted-foreground">অবস্থান</p><p className="font-semibold leading-7 text-primary">Eternal Freedom Institute Al Islamia<br />গফরগাঁও, ময়মনসিংহ, বাংলাদেশ</p></div></div>
              {phone && <a href={telHref(phone)} className="flex gap-3 transition-colors hover:text-gold-deep sm:gap-4"><Phone className="mt-0.5 size-5 shrink-0 text-gold-deep" /><div><p className="text-xs font-semibold text-muted-foreground">ফোন</p><p className="font-semibold text-primary">{phone}{s.phone2 ? `, ${s.phone2}` : ''}</p></div></a>}
              {email && <a href={`mailto:${email}`} className="flex gap-3 transition-colors hover:text-gold-deep sm:gap-4"><Mail className="mt-0.5 size-5 shrink-0 text-gold-deep" /><div className="min-w-0"><p className="text-xs font-semibold text-muted-foreground">ইমেইল</p><p className="break-all font-semibold text-primary">{email}</p></div></a>}
              {hours && <div className="flex gap-3 sm:gap-4"><Clock3 className="mt-0.5 size-5 shrink-0 text-gold-deep" /><div><p className="text-xs font-semibold text-muted-foreground">অফিস সময়</p><p className="font-semibold text-primary">{hours}</p></div></div>}
            </div>
            <div className="mt-5 overflow-hidden rounded-xl bg-secondary shadow-sm">
              <iframe title="Eternal Freedom Institute Al Islamia-এর অবস্থান" src={CONTACT_MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-40 w-full border-0 sm:h-48 lg:h-56" />
              <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 bg-gold px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-gold-light sm:px-5">
                <span>গুগল ম্যাপে সঠিক অবস্থান দেখুন</span><ArrowUpRight className="size-4 shrink-0" />
              </a>
            </div>
          </div>
          <div className="min-w-0 rounded-2xl bg-primary p-4 text-primary-foreground sm:p-6 lg:p-7">
            <div className="mb-4">
              <p className="text-xs font-bold text-gold">সরাসরি বার্তা</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-primary-foreground sm:text-2xl">আমাদের লিখুন</h3>
              <p className="mt-1 text-sm text-primary-foreground/75">আপনার প্রশ্ন বা মতামত লিখে পাঠান।</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
