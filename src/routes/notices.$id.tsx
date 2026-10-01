import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, FileText, Megaphone } from 'lucide-react';
import { Site } from '@/components/Site';
import { supabase } from '@/integrations/supabase/client';
import { seo } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/notices/$id')({
  head: () => seo('নোটিশের বিস্তারিত', 'Eternal Freedom Institute Al Islamia-এর প্রকাশিত নোটিশের পূর্ণ বিবরণ।'),
  component: NoticeDetail,
});

type Notice = { id: string; title: string; body: string; category: string; file_url: string | null; published_at: string };

function NoticeDetail() {
  const { id } = Route.useParams();
  const [n, setN] = useState<Notice | null | undefined>(undefined);
  useEffect(() => { supabase.from('notices').select('*').eq('id', id).maybeSingle().then(({ data }) => setN(data ?? null)); }, [id]);
  if (n === undefined) return <Site><div className="mx-auto max-w-3xl px-5 py-24"><div className="h-64 animate-pulse rounded-2xl bg-secondary" /></div></Site>;
  if (!n) return <Site><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-3xl text-primary">নোটিশটি পাওয়া যায়নি</h1><Button asChild className="mt-6"><Link to="/notices">সব নোটিশ</Link></Button></section></Site>;
  return (
    <Site>
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/notices" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-gold"><ArrowLeft className="size-4 rtl:rotate-180" />সব নোটিশ</Link>
          <div className="mt-6 overflow-hidden rounded-3xl bg-background shadow-elegant">
            <div className="flex items-center gap-4 bg-primary p-6 text-primary-foreground sm:p-8"><Megaphone className="size-10 shrink-0 text-gold" /><div><span className="rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-primary">{n.category}</span><div className="mt-2 flex items-center gap-1.5 text-sm opacity-80"><CalendarDays className="size-4" />{new Date(n.published_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div></div>
            <div className="p-6 sm:p-10">
              <h1 className="font-display text-2xl font-semibold leading-snug text-primary sm:text-4xl">{n.title}</h1>
              <p className="mt-6 whitespace-pre-line text-lg leading-9 text-foreground/85">{n.body || 'বিস্তারিত তথ্যের জন্য প্রতিষ্ঠানের অফিসে যোগাযোগ করুন।'}</p>
              {n.file_url && <Button asChild className="mt-8"><a href={n.file_url} target="_blank" rel="noreferrer"><FileText className="size-4" />সংযুক্ত ফাইল দেখুন</a></Button>}
              <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">— কর্তৃপক্ষ, Eternal Freedom Institute Al Islamia</p>
            </div>
          </div>
        </div>
      </section>
    </Site>
  );
}
