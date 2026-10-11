import { pageSeo } from '@/lib/seo-pages';
import { createFileRoute } from '@tanstack/react-router';
import { Site } from '@/components/Site';
import { ContactSection } from '@/components/ContactSection';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/contact')({
  head: (ctx) => pageSeo(ctx, '/contact'),
  component: Contact,
});

function Contact() {
  return (
    <Site>
      <ContactSection />
    </Site>
  );
}
