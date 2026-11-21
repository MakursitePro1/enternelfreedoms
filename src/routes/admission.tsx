import { createFileRoute } from '@tanstack/react-router';
import { pageSeo } from '@/lib/seo-pages';
import { AdmissionApplication } from '@/components/AdmissionApplication';
import { Site } from '@/components/Site';

export const Route = createFileRoute('/admission')({
  head: (ctx) => pageSeo(ctx, '/admission'),
  component: Admission,
});

function Admission() {
  return <Site><AdmissionApplication /></Site>;
}
