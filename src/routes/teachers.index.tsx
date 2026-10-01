import { createFileRoute } from '@tanstack/react-router';
import { Site, PageIntro, Heading } from '@/components/Site';
import { TeachersGrid } from '@/components/InstitutionSections';
import { photos } from '@/lib/content';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/teachers/')({
  head: () => seo('শিক্ষকমণ্ডলী', 'Eternal Freedom Institute Al Islamia-এর অভিজ্ঞ শিক্ষক ও কর্মীদের পরিচিতি—নাম, পদবি, যোগ্যতা, অভিজ্ঞতা ও বিভাগ।'),
  component: Teachers,
});

function Teachers() {
  return (
    <Site>
      <PageIntro eyebrow="শিক্ষকমণ্ডলী" title="শিক্ষক ও একাডেমিক টিম" description="একজন শিক্ষার্থীর শিক্ষাজীবনের সবচেয়ে গুরুত্বপূর্ণ অংশ শিক্ষক। সন্তানের শিক্ষকদের সম্পর্কে আগেই জেনে নিন।" image={photos[2]} />
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Heading eyebrow="আমাদের শিক্ষক" title="যোগ্য, অভিজ্ঞ ও আন্তরিক" description="প্রতিটি প্রোফাইলে শিক্ষকের যোগ্যতা, অভিজ্ঞতা ও পাঠদানের বিভাগ দেওয়া আছে।" />
          <TeachersGrid />
        </div>
      </section>
    </Site>
  );
}
