import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { AdminAdmissionDetail } from './AdminAdmissionDetail';
import { GraduationCap, Clock3, CheckCircle2, XCircle, Search, MapPin, Users, Phone, ArrowUpRight, CalendarDays, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { admissionPrograms } from '@/lib/admission-programs';
import type { Database } from '@/integrations/supabase/types';

type Admission = Database['public']['Tables']['admissions']['Row'];
const statuses = ['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল'] as const;
type Status = typeof statuses[number];
const PAGE_SIZE = 30;
const statusStyle: Record<string, string> = { 'নতুন': 'bg-gold-soft text-gold-deep', 'যাচাই চলছে': 'bg-secondary text-primary', 'অনুমোদিত': 'bg-primary text-primary-foreground', 'বাতিল': 'bg-background text-destructive border border-border' };
const inputStyle = 'h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring';
const bn = (n: number) => n.toLocaleString('bn-BD');
const daysLeft = (d: string) => Math.max(0, 90 - Math.floor((Date.now() - new Date(d).getTime()) / 86400000));

export function AdminAdmissions({ admissions, trashed, query, setQuery, onStatusChange, onTrash, openDoc, admissionId }: { admissions: Admission[]; trashed: Admission[]; query: string; setQuery: (value: string) => void; onStatusChange: (id: string, status: Status) => Promise<boolean>; onTrash: (id: string, trashed: boolean) => Promise<boolean>; openDoc: (path: string) => void; admissionId?: string | undefined }) {
  const [view, setView] = useState<'list' | 'trash'>('list');
  const [status, setStatus] = useState('সব');
  const [program, setProgram] = useState('সব');
  const [page, setPage] = useState(1);
  const [saving, setSaving] = useState<string | null>(null);
  const rows = view === 'trash' ? trashed : admissions;
  const programFilters = [...new Set([...admissionPrograms.map(([name]) => name), ...admissions.map((row) => row.program), ...trashed.map((row) => row.program)])];
  const q = query.trim().toLowerCase();
  const filtered = rows.filter((row) => (status === 'সব' || row.status === status) && (program === 'সব' || row.program === program) && [row.student_name, row.guardian_name, row.reference, row.phone, row.address, row.program, row.notes ?? ''].some((v) => v.toLowerCase().includes(q)));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  useEffect(() => setPage(1), [view, status, program, query]);
  const metrics = [{ label: 'মোট আবেদন', count: admissions.length, Icon: GraduationCap }, { label: 'যাচাই বাকি', count: admissions.filter((r) => ['নতুন', 'যাচাই চলছে'].includes(r.status)).length, Icon: Clock3 }, { label: 'অনুমোদিত', count: admissions.filter((r) => r.status === 'অনুমোদিত').length, Icon: CheckCircle2 }, { label: 'বাতিল', count: admissions.filter((r) => r.status === 'বাতিল').length, Icon: XCircle }];
  async function act(id: string, fn: () => Promise<boolean>) { setSaving(id); try { await fn(); } finally { setSaving(null); } }
  if (admissionId) return <AdminAdmissionDetail row={[...admissions, ...trashed].find((row) => row.id === admissionId)} openDoc={openDoc} onStatusChange={onStatusChange} />;
  return <section aria-label="ভর্তি আবেদন তালিকা" className="space-y-4">
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0"><h2 className="font-teacher text-base font-bold text-primary">ভর্তি কার্যক্রম</h2><p className="mt-1 text-xs text-muted-foreground">শিক্ষার্থী ও আবেদনের অবস্থা</p></div>
      <div className="grid shrink-0 grid-cols-2 rounded-lg border border-input bg-background p-1" role="group" aria-label="আবেদনের দৃশ্য">
        <Button size="sm" variant="ghost" aria-pressed={view === 'list'} onClick={() => setView('list')} className={view === 'list' ? 'bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'text-primary'}>আবেদন তালিকা</Button>
        <Button size="sm" variant="ghost" aria-pressed={view === 'trash'} onClick={() => setView('trash')} className={view === 'trash' ? 'bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'text-primary'}><Trash2 className="size-3.5" />ডিলিট ফাইল ({bn(trashed.length)})</Button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{metrics.map(({ label, count, Icon }, index) => <div key={label} className={`min-w-0 rounded-lg border p-3 ${index === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background text-primary'}`}><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><p className="text-xs font-semibold">{label}</p><Icon className={`size-4 shrink-0 ${index === 0 ? 'text-gold' : 'text-gold-deep'}`} /></div><p className="mt-2 font-brand text-2xl font-bold">{bn(count)}</p></div>)}</div>
    <div className="grid min-w-0 gap-2 border-y border-input py-3 md:grid-cols-[minmax(0,1fr)_auto]">
      <label className="relative min-w-0 w-full"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label="আবেদন খুঁজুন" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="নাম, ফোন বা আবেদন নম্বর" className={`${inputStyle} w-full pl-9`} /></label>
      <div className="grid min-w-0 w-full grid-cols-2 gap-2 md:w-auto"><select aria-label="অবস্থা ফিল্টার" value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle}><option value="সব">সব অবস্থা</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select><select aria-label="বিভাগ ফিল্টার" value={program} onChange={(e) => setProgram(e.target.value)} className={`${inputStyle} max-w-64`}><option value="সব">সব শ্রেণি / বিভাগ</option>{programFilters.map((name) => <option key={name}>{name}</option>)}</select></div>
    </div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><div className="min-w-0"><h3 className="font-semibold text-primary">{view === 'trash' ? 'ডিলিট ফাইল' : 'সকল ভর্তি আবেদন'}</h3>{view === 'trash' && <p className="mt-0.5 text-[11px] text-muted-foreground">ডিলিট করা আবেদন ৩ মাস পর্যন্ত এখানে থাকে, এরপর স্থায়ীভাবে মুছে যায়।</p>}</div><span className="text-xs text-muted-foreground">{bn(filtered.length)}টি আবেদন</span></div>
    <div className="grid min-w-0 items-start gap-3 md:grid-cols-2 2xl:grid-cols-3">{visible.map((row) => <article key={row.id} aria-label={`${row.student_name} এর আবেদন`} className="group min-w-0 overflow-hidden rounded-xl border border-input bg-background transition-colors hover:border-primary">
      <div className="flex min-w-0 items-start gap-3 p-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-gold"><GraduationCap className="size-5" /></div>
        <div className="min-w-0 flex-1"><div className="flex min-w-0 items-center justify-between gap-2"><h4 className="truncate font-teacher text-sm font-bold text-primary">{row.student_name}</h4><span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusStyle[row.status] ?? 'bg-secondary text-primary'}`}>{row.status}</span></div><div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5"><span className="font-brand text-[11px] font-semibold text-gold-deep">{row.reference}</span><span className="inline-flex max-w-full items-center rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-gold"><span className="truncate">{row.program}</span></span></div></div>
      </div>
      <div className="mx-3 grid min-w-0 grid-cols-2 gap-2 rounded-lg bg-secondary p-2.5 text-[11px]">
        <p className="flex min-w-0 items-center gap-1.5"><Users className="size-3.5 shrink-0 text-gold-deep" /><span className="truncate font-medium text-foreground">{row.guardian_name}</span></p>
        <p className="flex min-w-0 items-center gap-1.5"><Phone className="size-3.5 shrink-0 text-gold-deep" /><span className="truncate font-brand text-foreground">{row.phone}</span></p>
        {row.address && <p className="col-span-2 flex min-w-0 items-center gap-1.5"><MapPin className="size-3.5 shrink-0 text-gold-deep" /><span className="truncate font-medium text-foreground">{row.address}</span></p>}
      </div>
      <div className="flex min-w-0 items-center gap-2 p-3">
        <p className="mr-auto flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5 shrink-0" />{view === 'trash' && row.deleted_at ? `${bn(daysLeft(row.deleted_at))} দিন বাকি` : new Date(row.created_at).toLocaleDateString('bn-BD')}</p>
        {view === 'list' ? <>
          <select aria-label={`${row.student_name} এর অবস্থা`} disabled={saving === row.id} value={row.status} onChange={(e) => void act(row.id, () => onStatusChange(row.id, e.target.value as Status))} className={`${inputStyle} h-8 w-24 px-2 text-[11px]`}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
          <Button size="icon" variant="outline" aria-label={`${row.student_name} এর আবেদন ডিলিট`} disabled={saving === row.id} onClick={() => { if (window.confirm('আবেদনটি ডিলিট ফাইলে সরাতে চান? ৩ মাস পর্যন্ত ফিরিয়ে আনা যাবে।')) void act(row.id, () => onTrash(row.id, true)); }} className="size-8 text-destructive"><Trash2 className="size-3.5" /></Button>
        </> : <Button size="sm" variant="outline" disabled={saving === row.id} onClick={() => void act(row.id, () => onTrash(row.id, false))} className="h-8 px-2.5 text-[11px]"><RotateCcw className="size-3.5" />ফিরিয়ে আনুন</Button>}
        <Button asChild size="sm" className="h-8 px-2.5 text-[11px]"><Link to="/Eternelfreeadmingo/$page/$admissionId" params={{ page: 'admissions', admissionId: row.id }}>সকল তথ্য<ArrowUpRight className="size-3.5" /></Link></Button>
      </div>
    </article>)}{!filtered.length && <div className="py-12 text-center md:col-span-2 2xl:col-span-3"><GraduationCap className="mx-auto size-10 text-gold-deep" /><p className="mt-3 font-semibold text-primary">{view === 'trash' ? 'ডিলিট ফাইল খালি' : rows.length ? 'কোনো আবেদন পাওয়া যায়নি' : 'এখনো কোনো আবেদন নেই'}</p></div>}</div>
    {pages > 1 && <nav aria-label="পেজিনেশন" className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
      <Button size="icon" variant="outline" aria-label="আগের পাতা" disabled={current === 1} onClick={() => setPage(current - 1)} className="size-8"><ChevronLeft className="size-4" /></Button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <Button key={n} size="icon" variant={n === current ? 'default' : 'outline'} aria-current={n === current ? 'page' : undefined} onClick={() => setPage(n)} className="size-8 font-brand text-xs">{bn(n)}</Button>)}
      <Button size="icon" variant="outline" aria-label="পরের পাতা" disabled={current === pages} onClick={() => setPage(current + 1)} className="size-8"><ChevronRight className="size-4" /></Button>
    </nav>}
  </section>;
}
