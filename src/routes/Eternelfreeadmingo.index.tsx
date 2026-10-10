import { createFileRoute } from '@tanstack/react-router';
import { AdminPage } from '@/components/admin/AdminPage';
import { adminPageHead } from '@/lib/admin-pages';

export const Route = createFileRoute('/Eternelfreeadmingo/')({ head: () => adminPageHead('overview'), component: AdminPage });
