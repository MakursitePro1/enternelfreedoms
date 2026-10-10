import { createFileRoute, notFound } from '@tanstack/react-router';
import { AdminPage } from '@/components/admin/AdminPage';
import { adminPages, adminPageHead, type AdminPageKey } from '@/lib/admin-pages';

export const Route = createFileRoute('/Eternelfreeadmingo/$page')({
  loader: ({ params }) => {
    if (!Object.prototype.hasOwnProperty.call(adminPages, params.page) || params.page === 'overview') throw notFound();
    return { page: params.page as AdminPageKey };
  },
  head: ({ loaderData }) => loaderData ? adminPageHead(loaderData.page) : { meta: [{ title: 'পাতা পাওয়া যায়নি | Eternal Freedom' }, { name: 'robots', content: 'noindex, nofollow' }] },
  component: AdminPage,
});
