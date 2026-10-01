import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, ShieldAlert, Backpack, FileCheck2, PhoneCall } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { useInstitutionContent } from '@/lib/institution-content';
import { faq as staticFaq, parentRules, prepareList, requiredDocs } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/faq')({
  head: () => seo('অভিভাবক নির্দেশিকা ও প্রশ্নোত্তর', 'ভর্তি, আবাসিক জীবন, প্রয়োজনীয় কাগজপত্র, নিয়মকানুন ও শিক্ষার্থীর প্রস্তুতি নিয়ে অভিভাবকদের জন্য নির্দেশিকা ও সচরাচর জিজ্ঞাসা।'),
  component: Faq,
});

function Faq() {
  const db = useInstitutionContent('faq');
  const all = [...db.map((f) => ({ q: f.title, a: f.body, c: f.category ?? 'সাধারণ' })), ...staticFaq.map(([q, a]) => ({ q, a, c: 'সাধারণ' }))];
  const cats = ['সব', ...Array.from(new Set(all.map((f) => f.c)))];
  const [cat, setCat] = useState('সব');
  const [open, setOpen] = useState<number | null>(0);
  const list = cat === 'সব' ? all : all.filter((f) => f.c === cat);
  return (
    <Site>
      <PageIntro eyebrow="অভিভাবক নির্দেশিকা" title="নির্দেশিকা ও সচরাচর জিজ্ঞাসা" description="একই প্রশ্নের উত্তর জানতে বারবার ফোন করতে হবে না—প্রয়োজনীয় সব তথ্য এখানে।" />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[[ShieldAlert, 'নিয়মকানুন', parentRules], [Backpack, 'শিক্ষার্থীর প্রস্তুতি', prepareList], [FileCheck2, 'প্রয়োজনীয় কাগজপত্র', requiredDocs]].map(([Icon, t, items]) => { const I = Icon as typeof ShieldAlert; return <div key={t as string} className="rounded-2xl bg-secondary p-7"><div className="grid size-12 place-items-center rounded-xl bg-primary text-gold-light"><I className="size-6" /></div><h2 className="mt-5 font-display text-xl font-semibold text-primary">{t as string}</h2><ul className="mt-4 space-y-2">{(items as string[]).map((x) => <li key={x} className="flex gap-2 text-sm leading-6 text-muted-foreground"><span className="text-gold">✦</span>{x}</li>)}</ul></div>; })}
        </div>
      </section>
      <section className="bg-secondary px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Heading center eyebrow="প্রশ্ন ও উত্তর" title="সচরাচর জিজ্ঞাসা" />
          <div className="mb-8 flex flex-wrap justify-center gap-2">{cats.map((c) => <button key={c} type="button" onClick={() => { setCat(c); setOpen(0); }} className={`rounded-full px-4 py-2 text-sm font-medium ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-background text-primary hover:bg-accent'}`}>{c}</button>)}</div>
          <div className="space-y-3">
            {list.map((f, k) => (
              <div key={f.q} className="overflow-hidden rounded-2xl bg-background shadow-elegant">
                <button type="button" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)} className="flex w-full items-center justify-between gap-4 p-5 text-start"><span className="font-semibold text-primary">{f.q}</span><ChevronDown className={`size-5 shrink-0 text-gold transition-transform ${open === k ? 'rotate-180' : ''}`} /></button>
                {open === k && <p className="px-5 pb-5 leading-8 text-muted-foreground">{f.a}</p>}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:flex-row sm:text-start"><PhoneCall className="size-10 text-gold" /><div className="flex-1"><h3 className="font-display text-xl">আপনার প্রশ্নের উত্তর পাননি?</h3><p className="text-sm opacity-80">আমাদের লিখুন—দ্রুত উত্তর দেওয়া হবে।</p></div><Button asChild className="bg-gold text-primary hover:bg-gold-light"><Link to="/contact">যোগাযোগ করুন</Link></Button></div>
        </div>
      </section>
    </Site>
  );
}
