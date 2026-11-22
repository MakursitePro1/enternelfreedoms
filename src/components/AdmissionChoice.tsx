import { ChevronRight } from 'lucide-react';

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
  const card = 'admission-shine group flex min-h-0 cursor-pointer flex-col items-center justify-center gap-[clamp(2px,1svh,14px)] rounded-[clamp(18px,2.4vw,30px)] px-4 py-[clamp(6px,2svh,32px)] text-center shadow-[0_24px_50px_-20px_color-mix(in_oklab,var(--primary)_55%,transparent)] transition-transform hover:-translate-y-1 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 motion-reduce:transition-none sm:px-8';
  const title = 'font-display font-black leading-tight text-[clamp(1rem,min(3svh,5.5vw),2.3rem)] sm:text-[clamp(1.3rem,min(4.2svh,3.4vw),2.4rem)]';
  const sub = '[@media(max-height:680px)]:text-[0.68rem] [@media(max-height:680px)]:leading-tight font-medium text-[clamp(0.7rem,min(1.9svh,3.6vw),1.15rem)] sm:text-[clamp(0.85rem,min(2.2svh,2vw),1.15rem)]';
  const btn = '[@media(max-height:680px)]:h-[28px] mt-[clamp(0px,0.8svh,12px)] inline-flex h-[clamp(30px,5.6svh,60px)] w-full max-w-md shrink-0 items-center justify-center gap-[clamp(6px,1.2vw,14px)] rounded-full px-[clamp(10px,2vw,24px)] tracking-wide text-[clamp(0.9rem,min(2.3svh,4vw),1.25rem)] font-extrabold';
  const icon = 'relative size-[clamp(28px,min(calc(12svh-46px),16vw),120px)] shrink-0 sm:size-[clamp(56px,min(14svh,11vw),128px)]';
  return <div className="mx-auto flex h-[calc(100svh-var(--admission-offset,196px))] min-h-[420px] max-h-[860px] w-full max-w-6xl flex-col gap-[clamp(8px,2svh,24px)]">
    <div className="relative shrink-0 px-4 py-[clamp(2px,1svh,14px)] text-center">
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold bg-primary px-5 py-1 text-primary-foreground text-[clamp(0.85rem,min(2.2svh,4vw),1.4rem)] font-bold shadow-md sm:px-8">{copy('প্রিয় অভিভাবক,', 'Dear Guardian,')}</span>
        <p className="relative mx-auto mt-1 w-fit font-display font-black leading-tight text-primary text-[clamp(1.3rem,min(5svh,8vw),3.6rem)] [text-shadow:0_2px_0_var(--card),0_4px_10px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
          {copy('ভর্তি সংক্রান্ত সেবা', 'Admission Services')}
          <Sparks className="absolute -right-6 -top-4 size-6 text-gold sm:-right-10 sm:-top-6 sm:size-10" />
        </p>
        <span aria-hidden="true" className="mx-auto mt-1 flex w-fit items-center gap-2"><span className="h-[3px] w-[clamp(28px,8vw,80px)] rounded-full bg-gold" /><span className="size-2 rotate-45 bg-gold" /><span className="h-[3px] w-[clamp(28px,8vw,80px)] rounded-full bg-gold" /></span>
        <p className="mt-1 font-semibold text-foreground text-[clamp(0.75rem,min(1.9svh,3.4vw),1.2rem)]">{copy('আপনার প্রয়োজন অনুযায়ী নিচের অপশনটি নির্বাচন করুন', 'Choose the option below according to your need')}</p>
      </div>
    </div>
    <div className="grid min-h-0 flex-1 grid-rows-2 gap-[clamp(10px,2svh,28px)] sm:grid-cols-2 sm:grid-rows-1">
      <button type="button" onClick={() => onOpen('form')} className={`${card} border-[4px] border-gold bg-primary text-primary-foreground focus-visible:ring-gold`}>
        <span className={icon}><ApplicationIcon /><Sparks className="absolute -right-[45%] -top-[5%] size-[40%] text-gold-light" /></span>
        <span className={title}>{copy('নতুন ভর্তির আবেদন', 'New Admission Application')}</span>
        <span className={sub}>{copy('প্রথমবার আবেদন করতে এখানে ক্লিক করুন', 'Click here to apply for the first time')}</span>
        <span className={`${btn} admission-gloss admission-btn border border-gold-light bg-gold text-primary transition-colors group-hover:bg-gold-light`}>{copy('ভর্তি আবেদন করুন', 'Apply for Admission')}<span className="admission-arrow grid size-[1.6em] shrink-0 place-items-center rounded-full bg-primary text-gold-light"><ChevronRight className="size-[0.95em]" strokeWidth={3} /></span></span>
      </button>
      <button type="button" onClick={() => onOpen('notice')} className={`${card} border-[3px] border-primary bg-card text-primary focus-visible:ring-primary`}>
        <span className={icon}><DetailsIcon /></span>
        <span className={title}>{copy('ভর্তির সম্পর্কে বিস্তারিত জানতে', 'Learn More About Admission')}</span>
        <span className={`${sub} text-foreground`}>{copy('এখানে ক্লিক করুন', 'Click here')}</span>
        <span className={`${btn} admission-gloss admission-btn border border-primary-raised bg-primary text-primary-foreground transition-colors group-hover:bg-primary-raised`}>{copy('বিস্তারিত জানুন', 'Learn Details')}<span className="admission-arrow grid size-[1.6em] shrink-0 place-items-center rounded-full bg-gold text-primary"><ChevronRight className="size-[0.95em]" strokeWidth={3} /></span></span>
      </button>
    </div>
  </div>;
}
