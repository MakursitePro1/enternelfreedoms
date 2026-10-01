import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Clock, Users, CalendarRange } from 'lucide-react';
import { Site, PageIntro, Heading } from '@/components/Site';
import { InstitutionSections } from '@/components/InstitutionSections';
import { programs, facilityImages } from '@/lib/content';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/academics/')({
  head: () => seo('শিক্ষা কার্যক্রম', 'সাধারণ শিক্ষা (প্লে–দশম/দাখিল), নূরানী, নাজেরা, হিফজ, কিতাব, স্পোকেন ইংলিশ, আইসিটি ও জীবনদক্ষতা—প্রতিটি বিভাগের বিস্তারিত।'),
  component: Academics,
});

const groups = ['সাধারণ শিক্ষা', 'কুরআন শিক্ষা', 'ইসলামিক স্টাডিজ', 'বিশেষ কার্যক্রম'];

function Academics() {
  return (
    <Site>
      <PageIntro eyebrow="শিক্ষা কার্যক্রম" title="একটি সমন্বিত শিক্ষাযাত্রা" description="অভিভাবকের সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন—“আমার সন্তান এখানে কী পড়বে?”—তার পূর্ণ উত্তর।" image={facilityImages.classroom} />
      {groups.map((g, gi) => (
        <section key={g} className={`px-5 py-20 lg:px-8 ${gi % 2 ? 'bg-secondary' : ''}`}>
          <div className="mx-auto max-w-7xl">
            <Heading eyebrow={`বিভাগ ${(gi + 1).toLocaleString('bn-BD')}`} title={g} />
            <div className="grid gap-5 md:grid-cols-2">
              {programs.filter((p) => p.group === g).map((p) => (
                <Link key={p.slug} to="/academics/$slug" params={{ slug: p.slug }} className="group flex flex-col rounded-2xl bg-background p-8 shadow-elegant premium-card">
                  <div className="flex items-center justify-between"><span className="font-display text-3xl text-gold">{p.number}</span><ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1 rtl:rotate-180" /></div>
                  <h2 className="mt-5 font-display text-2xl font-semibold text-primary">{p.name}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{p.text}</p>
                  <div className="mt-6 grid gap-2 text-sm sm:grid-cols-3">
                    <span className="flex items-center gap-2 text-primary"><Users className="size-4 text-gold" />{p.age}</span>
                    <span className="flex items-center gap-2 text-primary"><CalendarRange className="size-4 text-gold" />{p.duration}</span>
                    <span className="flex items-center gap-2 text-primary"><Clock className="size-4 text-gold" />{p.classes}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="bg-primary px-5 py-20 text-center text-primary-foreground lg:px-8">
        <h2 className="font-display text-3xl sm:text-4xl">আপনার সন্তানের জন্য সঠিক বিভাগ বেছে নিন</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-8 opacity-80">বিভাগ নির্বাচন নিয়ে দ্বিধা থাকলে আমাদের সঙ্গে কথা বলুন—শিক্ষার্থীর বয়স ও যোগ্যতা অনুযায়ী পরামর্শ দেওয়া হবে।</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light"><Link to="/admission">ভর্তি আবেদন</Link></Button><Button asChild size="lg" variant="outline" className="border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">পরামর্শ নিন</Link></Button></div>
      </section>
      <InstitutionSections kind="program" eyebrow="বিভাগভিত্তিক তথ্য" title="পাঠক্রমের অতিরিক্ত তথ্য" />
    </Site>
  );
}
