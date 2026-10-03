import { createFileRoute } from '@tanstack/react-router';
import { Site } from '@/components/Site';
import { ContactSection } from '@/components/ContactSection';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/contact')({
  head: () => seo('যোগাযোগ', 'Eternal Freedom Institute Al Islamia, গফরগাঁও, ময়মনসিংহ—ফোন, ইমেইল, ঠিকানা, ম্যাপ ও বার্তা পাঠানোর ফর্ম।'),
  component: Contact,
});

function Contact() {
  return (
    <Site>
      <ContactSection />
    </Site>
  );
}
