import { Link } from '@tanstack/react-router';
import { ArrowLeft, FileText, GraduationCap, CalendarDays, Users, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Admission = Database['public']['Tables']['admissions']['Row'];
export function AdminAdmissionDetail({ row, openDoc }: { row: Admission | undefined; openDoc: (path: string) => void }) {
  const back = <Button asChild variant="outline" size="sm"><Link to="/Eternelfreeadmingo/$page" params={{ page: 'admissions' }}><ArrowLeft />আবেদন তালিকা</Link></Button>;
  if (!row) return <section className="space-y-4">{back}<p className="py-8 text-sm text-muted-foreground">আবেদনটি পাওয়া যায়নি।</p></section>;
  const docs = Array.isArray(row.documents) ? row.documents.filter((doc): doc is { label: string; name: string; path: string } => typeof doc === 'object' && doc !== null && !Array.isArray(doc) && typeof doc['label'] === 'string' && typeof doc['name'] === 'string' && typeof doc['path'] === 'string') : [];
  const groups = [
    { title: 'শিক্ষার্থীর তথ্য', Icon: GraduationCap, fields: [['শিক্ষার্থীর নাম', row.student_name], ['জন্মতারিখ', row.birth_date ? new Date(`${row.birth_date}T00:00:00`).toLocaleDateString('bn-BD') : null], ['বিভাগ', row.program], ['পূর্ববর্তী শিক্ষাপ্রতিষ্ঠান', row.previous_school]] },
    { title: 'অভিভাবক ও যোগাযোগ', Icon: Users, fields: [['অভিভাবকের নাম', row.guardian_name], ['ফোন নম্বর', row.phone], ['ঠিকানা', row.address]] },
    { title: 'আবেদনের বিবরণ', Icon: ClipboardList, fields: [['আবেদন নম্বর', row.reference], ['বর্তমান অবস্থা', row.status], ['জমা দেওয়ার সময়', new Date(row.created_at).toLocaleString('bn-BD')], ['অতিরিক্ত তথ্য / মন্তব্য', row.notes]] },
  ];
  return <section aria-label="আবেদনের সম্পূর্ণ বিস্তারিত" className="space-y-4">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="font-teacher text-lg font-bold text-primary">আবেদনের সম্পূর্ণ বিস্তারিত</h2>{back}</div>
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-y border-border py-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-gold-soft text-gold-deep"><GraduationCap className="size-6" /></div>
      <div className="min-w-0"><h3 className="break-words font-teacher text-xl font-bold text-primary">{row.student_name}</h3><p className="mt-1 text-xs text-muted-foreground">{row.program} · {row.reference}</p></div>
    </div>
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">{groups.map(({ title, Icon, fields }) => <section key={title} className="min-w-0">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><Icon className="size-4 text-gold-deep" />{title}</h3>
      <dl className="divide-y divide-border border-y border-border">{fields.map(([label, value]) => <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-4"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium leading-6 text-foreground">{value || 'দেওয়া হয়নি'}</dd></div>)}</dl>
    </section>)}
    <section className="min-w-0"><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><FileText className="size-4 text-gold-deep" />জমা দেওয়া কাগজপত্র <span className="text-xs text-muted-foreground">({docs.length.toLocaleString('bn-BD')})</span></h3>
      <div className="divide-y divide-border border-y border-border">{docs.map((doc) => <div key={doc.path} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"><div className="min-w-0"><p className="break-words text-sm font-semibold text-primary">{doc.label}</p><p className="mt-1 break-all text-xs text-muted-foreground">{doc.name}</p></div><Button variant="outline" size="sm" onClick={() => openDoc(doc.path)}><FileText />দেখুন</Button></div>)}{!docs.length && <p className="py-4 text-xs text-muted-foreground">সংযুক্ত কাগজপত্র নেই</p>}</div>
    </section></div>
  </section>;
}