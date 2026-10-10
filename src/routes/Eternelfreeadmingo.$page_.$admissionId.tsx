import { createFileRoute, notFound } from '@tanstack/react-router';
import { AdminPage } from '@/components/admin/AdminPage';

export const Route = createFileRoute('/Eternelfreeadmingo/$page_/$admissionId')({
  loader: ({ params }) => { if (params.page !== 'admissions') throw notFound(); },
  head: () => ({ meta: [
    { title: 'আবেদনের সম্পূর্ণ বিস্তারিত | Eternal Freedom' },
    { name: 'description', content: 'অনুমোদিত প্রশাসকের জন্য শিক্ষার্থীর ভর্তি আবেদন ও জমা দেওয়া কাগজপত্র।' },
    { property: 'og:title', content: 'ভর্তি আবেদনের বিস্তারিত | Eternal Freedom' },
    { property: 'og:description', content: 'সুরক্ষিত ভর্তি আবেদন বিস্তারিত পাতা।' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: AdminPage,
});