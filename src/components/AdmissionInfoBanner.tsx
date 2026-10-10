import { Link } from '@tanstack/react-router';
import { ArrowRight, Banknote, CheckCircle2, Landmark, MapPin, MessageCircle, PlayCircle, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  'শিক্ষার্থীর জন্ম নিবন্ধনের কপি ও ১ কপি ছবি পাঠান (না থাকলে নাম, বাবা-মায়ের নাম ও জন্ম তারিখ)',
  'ভর্তি ফি প্রেরণ করে রিসিট হোয়াটসঅ্যাপ/ইনবক্সে পাঠান',
  'ভর্তি সম্পন্ন ও সফটওয়্যারে এন্ট্রির পর অর্থ দ্বীনি ও শিক্ষা কার্যক্রমে ব্যয় হয় — তাই আগে সিদ্ধান্ত চূড়ান্ত করুন',
];
const monthly = [
  ['মাদ্রাসা ও স্কুল বেতন', '৪,০০০'],
  ['৩ বেলা খাবার', '৪,০০০'],
  ['৩ বেলা নাস্তা', '১,৫০০'],
  ['আবাসিক ফি', '২,০০০'],
  ['শিক্ষা উপকরণ ও পরিচ্ছন্নতা', '১,০০০'],
];
const rules = ['৭ দিন পর প্রথম মোবাইলে কথা', '১ মাস পর প্রথম সাক্ষাৎ', 'প্রতি ১৫ দিন পর পর সাক্ষাৎ', 'বছরে ৪টি নির্ধারিত ছুটি', 'প্রতিদিনের ভিডিও আপডেট হোয়াটসঅ্যাপে'];

export function AdmissionInfoBanner() {
  return (
    <div className="px-2.5 py-6 max-[359px]:px-2 sm:px-5 sm:py-10">
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[0.75rem] bg-primary p-3 text-primary-foreground shadow-elegant sm:rounded-[1.25rem] sm:p-6 lg:p-8">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold text-primary sm:text-xs"><Sparkles className="size-3.5" />ভর্তি চলছে — আসন সীমিত</span>
          <h2 className="mt-3 font-display text-[1.4rem] font-bold leading-tight sm:text-3xl lg:text-[2.2rem]">যত দূর, তত নূর</h2>
          <div className="mt-2.5 h-1 w-16 rounded-full bg-gold sm:w-24" />
          <p className="mt-3 max-w-3xl text-[13px] leading-6 text-primary-foreground/90 sm:text-[15px] sm:leading-7">শর্তসাপেক্ষে সীমিত সংখ্যক শিক্ষার্থী ভর্তি নেওয়া হচ্ছে। অল্প কয়েকটি আসন, আগে আসলে আগে পাবেন। নিজস্ব বিস্তীর্ণ খেলার মাঠে নিয়মিত খেলাধুলার পাশাপাশি সুন্দর আবাসিক পরিবেশে আপনার সন্তানের বেড়ে ওঠার সুযোগ — সন্তানকে বন্দী দশা আবাসিক থেকে মুক্তি দিন।</p>

          <div className="mt-5 grid gap-2.5 sm:gap-4 lg:grid-cols-3">
            <div className="min-w-0 rounded-[0.75rem] bg-background p-4 text-foreground sm:rounded-[1rem] sm:p-5">
              <p className="flex items-center gap-2 font-display text-base font-bold text-primary"><span className="grid size-8 place-items-center rounded-lg bg-gold text-primary"><CheckCircle2 className="size-4" /></span>ভর্তির জন্য করণীয়</p>
              <ol className="mt-3 grid gap-2.5">
                {steps.map((t, i) => <li key={t} className="flex gap-2.5 text-[13px] leading-6"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{['১', '২', '৩'][i]}</span>{t}</li>)}
              </ol>
              <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-[12.5px] font-semibold text-primary">বয়স: ৬–১৬ বছর</p>
            </div>

            <div className="min-w-0 rounded-[0.75rem] bg-background p-4 text-foreground sm:rounded-[1rem] sm:p-5">
              <p className="flex items-center gap-2 font-display text-base font-bold text-primary"><span className="grid size-8 place-items-center rounded-lg bg-gold text-primary"><Banknote className="size-4" /></span>ফি ও মাসিক খরচ</p>
              <div className="mt-3 rounded-lg bg-primary px-3 py-2.5 text-primary-foreground">
                <p className="text-[12px] text-gold">ভর্তি ফি</p>
                <p className="font-display text-xl font-bold">৳ ৪০,০০০</p>
                <p className="text-[11.5px] leading-5 text-primary-foreground/85">২ কিস্তিতে দেওয়া যায় · একসাথে দিলে ৫,০০০ টাকা ডিসকাউন্ট · ২য় বছর সেশন চার্জ ২০,০০০</p>
              </div>
              <ul className="mt-2.5 grid gap-1.5">
                {monthly.map(([k, v]) => <li key={k} className="flex justify-between gap-3 border-b border-border pb-1.5 text-[13px]"><span>{k}</span><span className="font-bold text-primary">৳ {v}</span></li>)}
              </ul>
              <p className="mt-2 flex justify-between text-[13.5px] font-bold text-primary"><span>মাসিক মোট</span><span>৳ ১২,৫০০</span></p>
              <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">গ্রীষ্মকালে এসি বিলসহ ১৩,০০০ · সাবালক (সিঙ্গেল বেড) শীতে ১৪,৫০০ / গ্রীষ্মে ১৫,০০০</p>
            </div>

            <div className="min-w-0 rounded-[0.75rem] bg-background p-4 text-foreground sm:rounded-[1rem] sm:p-5">
              <p className="flex items-center gap-2 font-display text-base font-bold text-primary"><span className="grid size-8 place-items-center rounded-lg bg-gold text-primary"><ShieldCheck className="size-4" /></span>আবাসিক নীতিমালা</p>
              <ul className="mt-3 grid gap-2">
                {rules.map((r) => <li key={r} className="flex items-start gap-2 text-[13px] leading-6"><CheckCircle2 className="mt-1 size-4 shrink-0 text-gold-deep" />{r}</li>)}
              </ul>
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-secondary px-3 py-2 text-[12.5px] leading-5 text-primary"><MapPin className="mt-0.5 size-4 shrink-0" />গফরগাঁও উপজেলা সদর, চাঁদনীর মোড় হয়ে বধ্যভূমির পাশে — অন্য কোনো শাখা নেই।</p>
            </div>
          </div>

          <div className="mt-2.5 grid gap-2.5 sm:mt-4 sm:gap-4 md:grid-cols-2">
            <div className="min-w-0 rounded-[0.75rem] bg-background p-4 text-foreground sm:rounded-[1rem] sm:p-5">
              <p className="flex items-center gap-2 font-display text-base font-bold text-primary"><span className="grid size-8 place-items-center rounded-lg bg-gold text-primary"><Landmark className="size-4" /></span>অফিসিয়াল লেনদেন</p>
              <div className="mt-3 grid gap-2 text-[12.5px] leading-5 sm:grid-cols-2">
                <div className="rounded-lg bg-secondary p-2.5"><p className="font-bold text-primary">Dutch-Bangla Bank PLC</p><p>A/C: 2591100530533</p><p>Gafargaon Sub Branch</p><p>Routing: 090610150</p></div>
                <div className="rounded-lg bg-secondary p-2.5"><p className="font-bold text-primary">Shahjalal Islami Bank PLC</p><p>A/C: 407013100000094</p><p>Gafargaon Branch</p><p>Routing: 190611004</p></div>
              </div>
              <p className="mt-2 text-[12.5px]"><span className="font-bold text-primary">বিকাশ (এজেন্ট, ক্যাশ আউট):</span> 01711-022734</p>
              <p className="text-[11.5px] text-muted-foreground">Account Name: Eternal Freedom Institute Al Islamia</p>
            </div>
            <div className="flex min-w-0 flex-col justify-between gap-3 rounded-[0.75rem] bg-gold p-4 text-primary sm:rounded-[1rem] sm:p-5">
              <div>
                <p className="font-display text-base font-bold">অভিভাবকদের মতামত ও ভিডিও</p>
                <p className="mt-1 text-[12.5px] leading-5">ফোন কল সবসময় রিসিভ করা সম্ভব হয় না — অনুগ্রহ করে হোয়াটসঅ্যাপে/ইনবক্সে সংক্ষিপ্ত মেসেজ বা ভয়েস দিন।</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a href="https://www.facebook.com/share/p/17CkBNCYR2/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-[12.5px] font-bold text-primary-foreground"><Users className="size-4 shrink-0" />অভিভাবকদের মতামত</a>
                  <a href="https://www.facebook.com/share/v/18AExxGEdt/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-[12.5px] font-bold text-primary-foreground"><PlayCircle className="size-4 shrink-0" />৬৪ জেলার শিক্ষার্থীদের ভিডিও</a>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-raised"><Link to="/admission">অনলাইনে আবেদন <ArrowRight className="size-4" /></Link></Button>
                <Button asChild variant="outline" className="border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground"><a href="https://wa.me/8801711022734" target="_blank" rel="noreferrer"><MessageCircle className="size-4" />হোয়াটসঅ্যাপে মেসেজ</a></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
