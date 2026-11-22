import { ChevronRight } from 'lucide-react';
import campusLeft from '@/assets/admission-campus-left.jpg.asset.json';
import campusRight from '@/assets/admission-campus-right.jpg.asset.json';

type Copy = (bn: string, en: string) => string;

function Sparks({ className }: { className: string }) {
  return <svg aria-hidden="true" viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
    <path d="M8 4 L11 16" /><path d="M30 8 L20 19" /><path d="M36 26 L23 26" />
  </svg>;
}

function ApplicationIcon() {
  return <svg aria-hidden="true" viewBox="0 0 120 120" className="size-full">
    <circle cx="60" cy="60" r="58" fill="#1f7a4c" />
    <path d="M33 26h40a6 6 0 0 1 6 6v52l-18 14H33a6 6 0 0 1-6-6V32a6 6 0 0 1 6-6Z" fill="#ffffff" />
    <g stroke="#1f7a4c" strokeWidth="5" strokeLinecap="round"><path d="M38 42h30" /><path d="M38 54h30" /><path d="M38 66h22" /><path d="M38 78h14" /></g>
    <g transform="rotate(42 78 74)">
      <rect x="71" y="38" width="15" height="48" rx="2" fill="#f5c518" />
      <rect x="78.5" y="38" width="7.5" height="48" fill="#e2a90c" />
      <rect x="71" y="30" width="15" height="10" rx="3" fill="#f49ba8" />
      <rect x="71" y="38" width="15" height="4" fill="#d9d9d9" />
      <path d="M71 86h15l-7.5 14Z" fill="#f6dfb4" />
      <path d="M76 95.5h5l-2.5 4.5Z" fill="#374151" />
    </g>
  </svg>;
}

function DetailsIcon() {
  return <svg aria-hidden="true" viewBox="0 0 120 120" className="size-full">
    <circle cx="60" cy="60" r="58" fill="#eef1ea" />
    <path d="M24 38a5 5 0 0 1 5-5h19l7 7h32a5 5 0 0 1 5 5v40H24Z" fill="#f2b40f" />
    <rect x="31" y="44" width="54" height="16" rx="2" fill="#ffffff" />
    <path d="M22 54a4 4 0 0 1 4-4h66a4 4 0 0 1 4 4l-3 32a5 5 0 0 1-5 4H29a5 5 0 0 1-5-4Z" fill="#ffd43b" />
    <path d="M86 84 L99 97" stroke="#1d6fa3" strokeWidth="7" strokeLinecap="round" />
    <circle cx="78" cy="76" r="14" fill="#cfeaf7" stroke="#1d6fa3" strokeWidth="5" />
    <path d="M71 72a8 8 0 0 1 6-5" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>;
}

export function AdmissionChoice({ copy, onOpen }: { copy: Copy; onOpen: (view: 'notice' | 'form') => void }) {
  return <div className="mx-auto w-full max-w-5xl">
    <div className="relative overflow-hidden rounded-2xl px-3 pb-6 pt-4 text-center sm:pb-9 sm:pt-6">
      <img src={campusLeft.url} alt="" aria-hidden="true" loading="eager" className="pointer-events-none absolute left-0 top-0 h-full w-[30%] object-cover object-left opacity-90 [mask-image:linear-gradient(to_right,black_45%,transparent)]" />
      <img src={campusRight.url} alt="" aria-hidden="true" loading="eager" className="pointer-events-none absolute right-0 top-0 h-full w-[28%] object-cover object-right opacity-90 [mask-image:linear-gradient(to_left,black_45%,transparent)]" />
      <div className="relative">
        <span className="inline-block rounded-full bg-secondary px-6 py-1.5 text-lg font-bold text-primary shadow-sm sm:px-9 sm:py-2 sm:text-2xl">{copy('প্রিয় অভিভাবক,', 'Dear Guardian,')}</span>
        <p className="relative mx-auto mt-2 w-fit font-display text-[2rem] font-black leading-tight text-primary sm:text-6xl">
          {copy('ভর্তি সংক্রান্ত সেবা', 'Admission Services')}
          <Sparks className="absolute -right-7 -top-6 size-7 text-gold sm:-right-12 sm:-top-9 sm:size-11" />
        </p>
        <p className="mt-2 text-sm font-semibold text-foreground sm:text-xl">{copy('আপনার প্রয়োজন অনুযায়ী নিচের অপশনটি নির্বাচন করুন', 'Choose the option below according to your need')}</p>
      </div>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
      <button type="button" onClick={() => onOpen('form')} className="group flex cursor-pointer flex-col items-center gap-3 rounded-[1.75rem] border-[5px] border-gold bg-primary px-5 py-7 text-center text-primary-foreground shadow-xl transition-transform hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold motion-reduce:transition-none sm:px-8 sm:py-9">
        <span className="relative size-24 sm:size-32"><ApplicationIcon /><Sparks className="absolute -right-8 -top-3 size-9 text-gold-light sm:-right-11 sm:size-11" /></span>
        <span className="mt-1 font-display text-[1.7rem] font-black leading-snug sm:text-[2.4rem]">{copy('নতুন ভর্তির আবেদন', 'New Admission Application')}</span>
        <span className="text-sm font-medium sm:text-lg">{copy('প্রথমবার আবেদন করতে এখানে ক্লিক করুন', 'Click here to apply for the first time')}</span>
        <span className="mt-3 inline-flex h-14 w-full max-w-md items-center justify-center gap-4 rounded-full bg-gold-light text-lg font-extrabold text-primary shadow-lg ring-2 ring-gold transition-colors group-hover:bg-gold sm:h-16 sm:text-xl">{copy('ভর্তি আবেদন করুন', 'Apply for Admission')}<ChevronRight className="size-6 shrink-0" strokeWidth={3} /></span>
      </button>
      <button type="button" onClick={() => onOpen('notice')} className="group flex cursor-pointer flex-col items-center gap-3 rounded-[1.75rem] border-[3px] border-primary bg-card px-5 py-7 text-center text-primary shadow-xl transition-transform hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary motion-reduce:transition-none sm:px-8 sm:py-9">
        <span className="size-24 sm:size-32"><DetailsIcon /></span>
        <span className="mt-1 font-display text-[1.7rem] font-black leading-snug sm:text-[2.4rem]">{copy('ভর্তির সম্পর্কে বিস্তারিত জানতে', 'Learn More About Admission')}</span>
        <span className="text-base font-semibold text-foreground sm:text-xl">{copy('এখানে ক্লিক করুন', 'Click here')}</span>
        <span className="mt-3 inline-flex h-14 w-full max-w-md items-center justify-center gap-4 rounded-full border-[3px] border-primary bg-card text-lg font-extrabold text-primary transition-colors group-hover:bg-secondary sm:h-16 sm:text-xl">{copy('বিস্তারিত জানুন', 'Learn Details')}<ChevronRight className="size-6 shrink-0" strokeWidth={3} /></span>
      </button>
    </div>
  </div>;
}
