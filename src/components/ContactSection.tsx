import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { Heading } from '@/components/Site';
import { defaultSettings, telHref, useSiteSettings } from '@/lib/site-settings';

export const CONTACT_MAP_URL = 'https://maps.app.goo.gl/npSrmEkrXeXM4Ac68';
const CONTACT_MAP_EMBED = 'https://www.google.com/maps?q=24.4569854,90.5514883&z=14&hl=bn&output=embed';

function InfoRow({ icon: Icon, label, children, href }: { icon: typeof MapPin; label: string; children: React.ReactNode; href?: string }) {
  const body = (
    <div className="group flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary px-3 py-2.5 transition-colors hover:bg-primary/90 sm:gap-4 sm:px-4 sm:py-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold text-primary sm:size-11">
        <Icon className="size-4 sm:size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gold sm:text-[11px]">{label}</p>
        <div className="text-[13px] font-semibold leading-5 text-primary-foreground sm:text-[15px] sm:leading-6">{children}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{body}</a> : body;
}

export function ContactSection() {
  const s = useSiteSettings();
  const phone = s.phone && s.phone !== defaultSettings.phone ? s.phone : '';
  const email = s.email && s.email !== defaultSettings.email ? s.email : '';
  const hours = s.office_hours && s.office_hours !== defaultSettings.office_hours ? s.office_hours : '';

  return (
    <section id="contact" className="px-2.5 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid items-end gap-2 sm:gap-3 lg:grid-cols-[1fr_auto]">
          <Heading compact className="mb-0 lg:mb-7" eyebrow="যোগাযোগ" title="আমাদের সঙ্গে যোগাযোগ করুন" description="ভর্তি, আবাসিক ব্যবস্থা, বই অর্ডার বা যেকোনো প্রশ্নে সরাসরি বার্তা পাঠান।" />
          <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold-light sm:mb-8 sm:w-fit sm:justify-start">
            <MapPin className="size-4 shrink-0" /> গফরগাঁও, ময়মনসিংহ <ArrowUpRight className="size-4 shrink-0" />
          </a>
        </div>

        <div className="mt-3 grid items-start gap-3 sm:mt-5 sm:gap-6 lg:mt-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
          <div className="min-w-0">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              <InfoRow icon={MapPin} label="অবস্থান">
                গফরগাঁও উপজেলা সদর, ময়মনসিংহ<br />চাঁদনীর মোড় হয়ে বধ্যভূমির পাশে, জামতলা মোড়ের নিচে
              </InfoRow>
              {phone && (
                <InfoRow icon={Phone} label="ফোন" href={telHref(phone)}>
                  {phone}{s.phone2 ? `, ${s.phone2}` : ''}
                </InfoRow>
              )}
              {email && (
                <InfoRow icon={Mail} label="ইমেইল" href={`mailto:${email}`}>
                  <span className="break-all">{email}</span>
                </InfoRow>
              )}
              {hours && (
                <InfoRow icon={Clock3} label="অফিস সময়">
                  {hours}
                </InfoRow>
              )}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-primary/25 bg-secondary shadow-md">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <p className="flex items-center gap-2 text-sm font-bold text-primary"><MapPin className="size-4 text-gold-deep" /> প্রতিষ্ঠানের অবস্থান</p>
                <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold text-gold-deep">লাইভ ম্যাপ</span>
              </div>
              <iframe title="Eternal Freedom Institute Al Islamia-এর অবস্থান" src={CONTACT_MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-40 w-full border-0 sm:h-48 lg:h-56" />
              <div className="flex justify-center px-3 pb-3 pt-3 sm:pb-4">
                <a href={CONTACT_MAP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-[13px] font-bold text-primary shadow-md transition-all hover:-translate-y-0.5 hover:bg-gold-light sm:px-6 sm:text-sm">
                  <MapPin className="size-4 shrink-0" /> গুগল ম্যাপে সঠিক অবস্থান দেখুন <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg sm:p-6 lg:p-7">
            <div className="pointer-events-none absolute inset-0 islamic-pattern opacity-[0.06]" aria-hidden="true" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold text-primary">
                  <Mail className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gold">সরাসরি বার্তা</p>
                  <h3 className="font-display text-lg font-semibold text-primary-foreground sm:text-xl">আমাদের লিখুন</h3>
                </div>
              </div>
              <p className="mb-4 text-[13px] leading-6 text-primary-foreground/75">আপনার প্রশ্ন বা মতামত লিখে পাঠান — দ্রুত উত্তর দেওয়া হবে ইনশাআল্লাহ।</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
