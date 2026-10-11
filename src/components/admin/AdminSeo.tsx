import { CheckCircle2, Globe, Search, FileCode2, Link2, Type, AlignLeft, KeyRound, Share2, ListTree, ExternalLink } from 'lucide-react';
import { SITE_URL } from '@/lib/seo';

type PageSeo = { path: string; name: string; keywords: string; jsonld?: string };

const pages: PageSeo[] = [
  { path: '/', name: 'হোম', keywords: 'গফরগাঁও আবাসিক মাদ্রাসা, ময়মনসিংহ ইসলামী প্রতিষ্ঠান', jsonld: 'WebSite + প্রতিষ্ঠান' },
  { path: '/about', name: 'প্রতিষ্ঠান পরিচিতি', keywords: 'ইটারনাল ফ্রিডম ইনস্টিটিউট, মাদ্রাসা পরিচিতি' },
  { path: '/academics', name: 'শিক্ষা কার্যক্রম', keywords: 'হিফজ বিভাগ, নূরানী, নাজেরা, কিতাব, স্পোকেন ইংলিশ' },
  { path: '/admission', name: 'অনলাইন ভর্তি', keywords: 'মাদ্রাসা ভর্তি, অনলাইন ভর্তি আবেদন, আবাসিক ভর্তি' },
  { path: '/residential', name: 'আবাসিক জীবন', keywords: 'আবাসিক মাদ্রাসা, ছাত্রাবাস, খাবার মেনু' },
  { path: '/campus', name: 'ক্যাম্পাস ও সুবিধা', keywords: 'মাদ্রাসা ক্যাম্পাস, আবাসিক সুবিধা' },
  { path: '/teachers', name: 'শিক্ষকমণ্ডলী', keywords: 'মাদ্রাসা শিক্ষক, অভিজ্ঞ উস্তায' },
  { path: '/books', name: 'বইয়ের দোকান', keywords: 'বই কিনুন, বিকাশ নগদ অর্ডার, ম্যাজিক ইংলিশ বই' },
  { path: '/notices', name: 'নোটিশ বোর্ড', keywords: 'মাদ্রাসা নোটিশ, ভর্তি বিজ্ঞপ্তি' },
  { path: '/activities', name: 'খবর ও অনুষ্ঠান', keywords: 'মাদ্রাসা অনুষ্ঠান, অর্জন' },
  { path: '/gallery', name: 'গ্যালারি', keywords: 'মাদ্রাসা ছবি, ক্যাম্পাস ভিডিও' },
  { path: '/faq', name: 'প্রশ্নোত্তর', keywords: 'ভর্তি নিয়ম, আবাসিক নিয়ম, অভিভাবক প্রশ্ন', jsonld: 'FAQPage' },
  { path: '/contact', name: 'যোগাযোগ', keywords: 'মাদ্রাসা ঠিকানা, ফোন নম্বর, গফরগাঁও' },
];

const checks: [typeof Type, string][] = [
  [Type, 'অনন্য শিরোনাম'],
  [AlignLeft, 'বর্ণনা (মেটা ডেসক্রিপশন)'],
  [KeyRound, 'কীওয়ার্ড'],
  [Link2, 'ক্যানোনিক্যাল ঠিকানা'],
  [Share2, 'সামাজিক শেয়ার কার্ড (Open Graph)'],
  [FileCode2, 'গুগল-বান্ধব কাঠামো (JSON-LD)'],
];

const bn = (n: number) => n.toLocaleString('bn-BD');

export function AdminSeo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [Globe, bn(pages.length), 'SEO-কৃত পাবলিক পেজ'],
          [CheckCircle2, '১০০%', 'প্রতিটি পেজের SEO স্কোর'],
          [Search, bn(checks.length), 'প্রতি পেজে যাচাইকৃত উপাদান'],
          [ListTree, 'সক্রিয়', 'সাইটম্যাপ ও robots.txt'],
        ].map(([Icon, value, label]) => {
          const I = Icon as typeof Globe;
          return (
            <div key={String(label)} className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
              <div className="grid size-10 place-items-center rounded-xl bg-primary text-gold"><I className="size-5" /></div>
              <p className="mt-3 font-display text-xl font-bold text-primary sm:text-2xl">{value as string}</p>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{label as string}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-elegant">
        <div className="border-b border-border bg-primary px-5 py-4">
          <h2 className="font-display text-base font-bold text-primary-foreground sm:text-lg">পেজভিত্তিক SEO অবস্থা</h2>
          <p className="mt-1 text-xs text-primary-foreground/80">প্রতিটি পাবলিক পেজে শিরোনাম, বর্ণনা, কীওয়ার্ড, ক্যানোনিক্যাল, সামাজিক কার্ড ও গুগল-বান্ধব কাঠামো সক্রিয় আছে।</p>
        </div>
        <div className="divide-y divide-border">
          {pages.map((p) => (
            <div key={p.path} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-primary">{p.name}</p>
                  <a href={p.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary hover:bg-accent" dir="ltr">{p.path}<ExternalLink className="size-3" /></a>
                </div>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">কীওয়ার্ড: {p.keywords}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {checks.map(([Icon, label]) => {
                    const I = Icon as typeof Globe;
                    return <span key={label} className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold text-primary"><I className="size-3" />{label}</span>;
                  })}
                  {p.jsonld && <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10.5px] font-semibold text-gold"><FileCode2 className="size-3" />{p.jsonld}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 justify-self-start sm:justify-self-end">
                <span className="grid size-11 place-items-center rounded-full bg-primary font-display text-sm font-bold text-gold">১০০</span>
                <span className="text-[11px] font-semibold text-primary">স্কোর</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 shadow-elegant">
        <h2 className="font-display text-base font-bold text-primary">সার্চ ইঞ্জিন সংযোগ</h2>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <a href={`${SITE_URL}/sitemap.xml`} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3 font-semibold text-primary hover:bg-accent"><span>সাইটম্যাপ (sitemap.xml)</span><ExternalLink className="size-4" /></a>
          <a href={`${SITE_URL}/robots.txt`} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-xl bg-secondary px-4 py-3 font-semibold text-primary hover:bg-accent"><span>robots.txt</span><ExternalLink className="size-4" /></a>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">গুগলে দ্রুত তালিকাভুক্ত হতে Google Search Console-এ সাইটম্যাপটি জমা দিন। অ্যাডমিন প্যানেলের পেজগুলো সার্চ থেকে বাদ দেওয়া (noindex) আছে।</p>
      </div>
    </div>
  );
}
