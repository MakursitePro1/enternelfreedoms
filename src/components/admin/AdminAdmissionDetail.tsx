import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, FileText, GraduationCap, Users, ClipboardList, ShieldCheck, CheckCircle2, XCircle, Clock3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';
import { admissionParentDetails } from '@/lib/admission-details';

type Admission = Database['public']['Tables']['admissions']['Row'];
const statuses = ['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল'] as const;
type Status = typeof statuses[number];
const statusMeta: Record<Status, { Icon: typeof Clock3; active: string }> = {
  'নতুন': { Icon: Sparkles, active: 'border-gold bg-gold-soft text-gold-deep' },
  'যাচাই চলছে': { Icon: Clock3, active: 'border-gold bg-gold-soft text-gold-deep' },
  'অনুমোদিত': { Icon: CheckCircle2, active: 'border-gold bg-gold text-primary' },
  'বাতিল': { Icon: XCircle, active: 'border-destructive bg-destructive text-primary-foreground' },
};
export function AdminAdmissionDetail({ row, openDoc, onStatusChange }: { row: Admission | undefined; openDoc: (path: string) => void; onStatusChange?: (id: string, status: Status) => Promise<boolean> }) {
  const [saving, setSaving] = useState(false);
  const back = <Button asChild size="sm" className="border border-panel-dark-border bg-panel-dark-soft text-panel-dark-foreground hover:bg-panel-dark hover:text-gold"><Link to="/Eternelfreeadmingo/$page" params={{ page: 'admissions' }}><ArrowLeft />আবেদন তালিকা</Link></Button>;
  if (!row) return <section aria-label="আবেদনের সম্পূর্ণ বিস্তারিত">
    <div className="premium-panel min-w-0 rounded-2xl border border-panel-dark-border bg-panel-dark p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4"><h2 className="font-teacher text-lg font-bold text-gold">আবেদনের সম্পূর্ণ বিস্তারিত</h2>{back}</div>
      <p className="py-8 text-sm text-panel-dark-muted">আবেদনটি পাওয়া যায়নি।</p>
    </div>
  </section>;
  const docs = Array.isArray(row.documents) ? row.documents.filter((doc): doc is { label: string; name: string; path: string } => typeof doc === 'object' && doc !== null && !Array.isArray(doc) && typeof doc['label'] === 'string' && typeof doc['name'] === 'string' && typeof doc['path'] === 'string') : [];
  const parent = admissionParentDetails(row.notes);
  const groups = [
    { title: 'শিক্ষার্থীর তথ্য', Icon: GraduationCap, fields: [['শিক্ষার্থীর নাম', row.student_name], ['জন্মতারিখ', row.birth_date ? new Date(`${row.birth_date}T00:00:00`).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : null], ['শ্রেণি / বিভাগ', row.program], ...(row.previous_school ? [['পূর্ববর্তী শিক্ষাপ্রতিষ্ঠান', row.previous_school]] : [])] },
    { title: 'অভিভাবক ও যোগাযোগ', Icon: Users, fields: [[parent.structured ? 'বাবার পূর্ণ নাম' : 'অভিভাবকের নাম', row.guardian_name], [parent.structured ? 'বাবার মোবাইল নম্বর' : 'ফোন নম্বর', row.phone], ['মায়ের পূর্ণ নাম', parent.motherName], ['মায়ের মোবাইল নম্বর', parent.motherPhone], ...(row.address ? [['ঠিকানা', row.address]] : [])] },
    { title: 'আবেদনের বিবরণ', Icon: ClipboardList, fields: [['আবেদন নম্বর', row.reference], ['বর্তমান অবস্থা', row.status], ['জমা দেওয়ার সময়', new Date(row.created_at).toLocaleString('bn-BD')], ['ভর্তির শর্তাবলিতে সম্মতি', parent.consent], ['অভিভাবকের মন্তব্য / নোট', parent.guardianNote]] },
  ];
  return <section aria-label="আবেদনের সম্পূর্ণ বিস্তারিত">
    <div className="premium-panel min-w-0 rounded-2xl border border-panel-dark-border bg-panel-dark p-4 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-4">
        <h2 className="font-teacher text-lg font-bold text-gold">আবেদনের সম্পূর্ণ বিস্তারিত</h2>
        {back}
      </div>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-panel-dark-border pb-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-panel-dark-border bg-panel-dark-soft text-gold"><GraduationCap className="size-6" /></div>
        <div className="min-w-0"><h3 className="break-words font-teacher text-xl font-bold text-panel-dark-foreground">{row.student_name}</h3><p className="mt-1 text-xs text-panel-dark-muted">{row.program} · {row.reference}</p></div>
      </div>
      {onStatusChange && <section aria-label="আবেদনের সিদ্ধান্ত" className="mt-5 rounded-xl border border-panel-dark-border bg-panel-dark-soft p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gold"><ShieldCheck className="size-4" />আবেদনের সিদ্ধান্ত</h3>
        <p className="mt-1 text-xs text-panel-dark-muted">বর্তমান অবস্থা: <span className="font-semibold text-panel-dark-foreground">{row.status}</span></p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{statuses.map((s) => { const { Icon, active } = statusMeta[s]; const isActive = row.status === s; return <button key={s} type="button" disabled={saving || isActive} onClick={() => { setSaving(true); void onStatusChange(row.id, s).finally(() => setSaving(false)); }} className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors disabled:cursor-default ${isActive ? active : 'border-panel-dark-border bg-panel-dark text-panel-dark-foreground hover:text-gold'}`}><Icon className="size-4 shrink-0" /><span className="truncate">{s}</span></button>; })}</div>
      </section>}
      <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-2">{groups.map(({ title, Icon, fields }) => <section key={title} className="min-w-0">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><Icon className="size-4" />{title}</h3>
        <dl className="divide-y divide-panel-dark-border border-y border-panel-dark-border">{fields.map(([label, value]) => <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-4"><dt className="text-xs text-panel-dark-muted">{label}</dt><dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium leading-6 text-panel-dark-foreground">{value || 'দেওয়া হয়নি'}</dd></div>)}</dl>
      </section>)}
      <section className="min-w-0"><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold"><FileText className="size-4" />জমা দেওয়া কাগজপত্র <span className="text-xs text-panel-dark-muted">({docs.length.toLocaleString('bn-BD')})</span></h3>
        <div className="divide-y divide-panel-dark-border border-y border-panel-dark-border">{docs.map((doc) => <div key={doc.path} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"><div className="min-w-0"><p className="break-words text-sm font-semibold text-panel-dark-foreground">{doc.label}</p><p className="mt-1 break-all text-xs text-panel-dark-muted">{doc.name}</p></div><Button size="sm" className="border border-panel-dark-border bg-panel-dark-soft text-panel-dark-foreground hover:bg-panel-dark hover:text-gold" onClick={() => openDoc(doc.path)}><FileText />দেখুন</Button></div>)}{!docs.length && <p className="py-4 text-xs text-panel-dark-muted">সংযুক্ত কাগজপত্র নেই</p>}</div>
      </section></div>
    </div>
  </section>;
}
