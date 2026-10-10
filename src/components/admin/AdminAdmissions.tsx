import { useState } from 'react';
import { GraduationCap, Clock3, CheckCircle2, XCircle, Search, MapPin, Users, Phone, FileText, ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';

type Admission = Database['public']['Tables']['admissions']['Row'];
const statuses = ['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল'] as const;
type Status = typeof statuses[number];
const previewRows: Admission[] = [
  { id: 'preview-1', reference: 'EFI-P001', student_name: 'আব্দুল্লাহ হাসান', guardian_name: 'মুহাম্মদ হাসান', program: 'হিফজ বিভাগ', status: 'নতুন', address: 'গফরগাঁও, ময়মনসিংহ', phone: '01XXXXXXXXX', birth_date: '2016-03-12', previous_school: 'প্রাথমিক বিদ্যালয়', notes: 'আবাসিক ভর্তির জন্য আবেদন।', documents: [], created_at: '2026-10-10T05:30:00Z' },
  { id: 'preview-2', reference: 'EFI-P002', student_name: 'মুহাম্মদ রায়হান', guardian_name: 'আব্দুর রহমান', program: 'নূরানী বিভাগ', status: 'যাচাই চলছে', address: 'ত্রিশাল, ময়মনসিংহ', phone: '01XXXXXXXXX', birth_date: '2019-01-20', previous_school: null, notes: 'শিক্ষার্থীর প্রাথমিক মূল্যায়ন বাকি।', documents: [], created_at: '2026-10-09T08:00:00Z' },
  { id: 'preview-3', reference: 'EFI-P003', student_name: 'আহমাদ ইব্রাহিম', guardian_name: 'মুহাম্মদ ইব্রাহিম', program: 'হিফজ বিভাগ', status: 'অনুমোদিত', address: 'ভালুকা, ময়মনসিংহ', phone: '01XXXXXXXXX', birth_date: '2014-07-05', previous_school: 'প্রাথমিক বিদ্যালয়', notes: 'ভর্তির জন্য অনুমোদিত।', documents: [], created_at: '2026-10-08T04:15:00Z' },
  { id: 'preview-4', reference: 'EFI-P004', student_name: 'ওমর ফারুক', guardian_name: 'মুহাম্মদ ফারুক', program: 'নূরানী বিভাগ', status: 'বাতিল', address: 'নান্দাইল, ময়মনসিংহ', phone: '01XXXXXXXXX', birth_date: '2018-05-11', previous_school: null, notes: 'অভিভাবকের অনুরোধে আবেদন বাতিল।', documents: [], created_at: '2026-10-07T06:45:00Z' },
];
const statusStyle: Record<string, string> = { 'নতুন': 'bg-gold-soft text-gold-deep', 'যাচাই চলছে': 'bg-secondary text-primary', 'অনুমোদিত': 'bg-primary text-primary-foreground', 'বাতিল': 'bg-background text-destructive border border-border' };
const inputStyle = 'h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring';

export function AdminAdmissions({ admissions, query, setQuery, onStatusChange, openDoc }: { admissions: Admission[]; query: string; setQuery: (value: string) => void; onStatusChange: (id: string, status: Status) => Promise<boolean>; openDoc: (path: string) => void }) {
  const [preview, setPreview] = useState(true);
  const [examples, setExamples] = useState(previewRows);
  const [status, setStatus] = useState('সব');
  const [program, setProgram] = useState('সব');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const rows = preview ? examples : admissions;
  const filtered = rows.filter((row) => (status === 'সব' || row.status === status) && (program === 'সব' || row.program === program) && [row.student_name, row.guardian_name, row.reference, row.phone, row.address].some((v) => v.toLowerCase().includes(query.trim().toLowerCase())));
  const metrics = [{ label: 'মোট আবেদন', count: rows.length, Icon: GraduationCap }, { label: 'যাচাই বাকি', count: rows.filter((r) => ['নতুন', 'যাচাই চলছে'].includes(r.status)).length, Icon: Clock3 }, { label: 'অনুমোদিত', count: rows.filter((r) => r.status === 'অনুমোদিত').length, Icon: CheckCircle2 }, { label: 'বাতিল', count: rows.filter((r) => r.status === 'বাতিল').length, Icon: XCircle }];
  async function changeStatus(row: Admission, next: Status) {
    if (preview) { setExamples((items) => items.map((item) => item.id === row.id ? { ...item, status: next } : item)); return; }
    setSaving(row.id);
    try { await onStatusChange(row.id, next); } finally { setSaving(null); }
  }
  return <section aria-label="ভর্তি আবেদন তালিকা" className="space-y-4">
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0"><h2 className="font-teacher text-base font-bold text-primary">ভর্তি কার্যক্রম</h2><p className="mt-1 text-xs text-muted-foreground">শিক্ষার্থী ও আবেদনের অবস্থা</p></div>
      <div className="grid shrink-0 grid-cols-2 rounded-lg border border-input bg-background p-1" role="group" aria-label="আবেদনের দৃশ্য">
        <Button size="sm" variant="ghost" aria-pressed={!preview} onClick={() => { setPreview(false); setExpanded(null); setStatus('সব'); setProgram('সব'); setQuery(''); }} className={!preview ? 'bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'text-primary'}>আবেদন তালিকা</Button>
        <Button size="sm" variant="ghost" aria-pressed={preview} onClick={() => { setPreview(true); setExpanded(null); setStatus('সব'); setProgram('সব'); setQuery(''); }} className={preview ? 'bg-gold text-primary hover:bg-gold-light' : 'text-primary'}>ডিজাইন প্রিভিউ</Button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{metrics.map(({ label, count, Icon }, index) => <div key={label} className={`min-w-0 rounded-lg border p-3 ${index === 0 ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background text-primary'}`}><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><p className="text-xs font-semibold">{label}</p><Icon className={`size-4 shrink-0 ${index === 0 ? 'text-gold' : 'text-gold-deep'}`} /></div><p className="mt-2 font-brand text-2xl font-bold">{count.toLocaleString('bn-BD')}</p></div>)}</div>
    <div className="grid min-w-0 gap-2 border-y border-input py-3 md:grid-cols-[minmax(0,1fr)_auto]">
      <label className="relative min-w-0 w-full"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label="আবেদন খুঁজুন" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="নাম, ফোন বা আবেদন নম্বর" className={`${inputStyle} w-full pl-9`} /></label>
      <div className="grid min-w-0 w-full grid-cols-2 gap-2 md:w-auto"><select aria-label="অবস্থা ফিল্টার" value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyle}><option value="সব">সব অবস্থা</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select><select aria-label="বিভাগ ফিল্টার" value={program} onChange={(e) => setProgram(e.target.value)} className={inputStyle}><option value="সব">সব বিভাগ</option>{Array.from(new Set(rows.map((r) => r.program))).map((p) => <option key={p}>{p}</option>)}</select></div>
    </div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><h3 className="font-semibold text-primary">{preview ? 'আবেদনের প্রিভিউ' : 'সকল ভর্তি আবেদন'}</h3><span className="text-xs text-muted-foreground">{filtered.length.toLocaleString('bn-BD')}টি আবেদন</span></div>
    <div className="grid min-w-0 items-start gap-3 lg:grid-cols-2 lg:gap-4">{filtered.map((row) => {
      const docs = Array.isArray(row.documents) ? row.documents.filter((doc): doc is { label: string; name: string; path: string } => typeof doc === 'object' && doc !== null && !Array.isArray(doc) && typeof doc['label'] === 'string' && typeof doc['name'] === 'string' && typeof doc['path'] === 'string') : [];
      const open = expanded === row.id;
      return <article key={row.id} aria-label={`${row.student_name} এর আবেদন`} className="min-w-0 overflow-hidden rounded-lg border border-input bg-background transition-colors hover:border-primary-raised">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2.5 sm:px-4"><p className="min-w-0 truncate font-brand text-[11px] font-semibold text-muted-foreground">{row.reference}</p><span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyle[row.status] ?? 'bg-secondary text-primary'}`}>{row.status}</span></div>
        <div className="p-3 sm:p-4"><div className="flex min-w-0 items-center gap-3"><div className="grid size-11 shrink-0 place-items-center rounded-lg border border-border bg-gold-soft text-gold-deep"><GraduationCap className="size-5" /></div><div className="min-w-0"><h4 className="break-words font-teacher text-base font-bold leading-6 text-primary">{row.student_name}</h4><p className="mt-1 text-xs font-semibold text-muted-foreground">{row.program}</p></div></div>
          <div className="mt-4 grid min-w-0 grid-cols-2 gap-x-3 gap-y-3 border-t border-border pt-3 text-xs"><p className="flex min-w-0 items-start gap-2"><Users className="size-4 shrink-0 text-gold-deep" /><span className="min-w-0 break-words font-medium"><span className="mb-0.5 block text-[11px] font-normal text-muted-foreground">অভিভাবক</span>{row.guardian_name}</span></p><p className="flex min-w-0 items-start gap-2"><Phone className="size-4 shrink-0 text-gold-deep" /><span className="min-w-0"><span className="mb-0.5 block text-[11px] font-normal text-muted-foreground">ফোন</span><span className="font-brand text-xs">{row.phone}</span></span></p><p className="col-span-2 flex min-w-0 items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" /><span className="min-w-0 break-words font-medium"><span className="mb-0.5 block text-[11px] font-normal text-muted-foreground">ঠিকানা</span>{row.address}</span></p></div>
          {open && <div id={`details-${row.id}`} className="mt-3 border-t border-border pt-3"><dl className="grid min-w-0 gap-3 text-xs sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">জন্মতারিখ</dt><dd className="mt-1 font-semibold">{row.birth_date ? new Date(row.birth_date).toLocaleDateString('bn-BD') : 'দেওয়া হয়নি'}</dd></div><div><dt className="text-xs text-muted-foreground">পূর্ববর্তী শিক্ষাপ্রতিষ্ঠান</dt><dd className="mt-1 font-semibold">{row.previous_school || 'দেওয়া হয়নি'}</dd></div></dl>{row.notes && <p className="mt-3 whitespace-pre-line text-xs leading-6">{row.notes}</p>}<div className="mt-3 flex flex-wrap gap-2">{docs.length ? docs.map((d) => <Button key={d.path} variant="outline" size="sm" onClick={() => openDoc(d.path)}><FileText />{d.label}</Button>) : <p className="text-xs text-muted-foreground">সংযুক্ত কাগজপত্র নেই</p>}</div></div>}
        </div>
        <div className="grid min-w-0 gap-3 border-t border-border px-3 py-3 sm:px-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center"><p className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />{new Date(row.created_at).toLocaleDateString('bn-BD')}</p><div className="grid min-w-0 w-full grid-cols-[minmax(0,1fr)_auto] gap-2 xl:w-auto"><select aria-label={`${row.student_name} এর অবস্থা`} disabled={saving === row.id} value={row.status} onChange={(e) => void changeStatus(row, e.target.value as Status)} className={`${inputStyle} h-9 w-full text-xs xl:w-28`}>{statuses.map((s) => <option key={s}>{s}</option>)}</select><Button variant="outline" size="sm" aria-expanded={open} aria-controls={`details-${row.id}`} onClick={() => setExpanded(open ? null : row.id)} className="h-9 border-primary bg-primary px-3 text-xs text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground">বিস্তারিত{open ? <ChevronUp /> : <ChevronDown />}</Button></div></div>
      </article>;
    })}{!filtered.length && <div className="py-12 text-center lg:col-span-2"><GraduationCap className="mx-auto size-10 text-gold-deep" /><p className="mt-3 font-semibold text-primary">{rows.length ? 'কোনো আবেদন পাওয়া যায়নি' : 'এখনো কোনো আবেদন নেই'}</p></div>}</div>
  </section>;
}