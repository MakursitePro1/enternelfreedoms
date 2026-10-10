import { useMemo, useState } from 'react';
import { Megaphone, CalendarDays, Search, Pencil, Trash2, Plus, FileText, Tag, Paperclip, Eye, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type NoticeRow = { id: string; title: string; body: string; category: string; file_url: string | null; published_at: string };

const CATEGORIES = ['সাধারণ', 'ভর্তি', 'পরীক্ষা', 'ছুটি', 'অভিভাবক সভা', 'গুরুত্বপূর্ণ'] as const;
const emptyForm = { id: '', title: '', body: '', category: 'সাধারণ', file_url: '' };

const field = 'min-w-0 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring';
const when = (d: string) => new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
const whenShort = (d: string) => new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

const catTone: Record<string, string> = {
  'গুরুত্বপূর্ণ': 'bg-primary text-primary-foreground',
  'ভর্তি': 'bg-gold text-primary',
  'পরীক্ষা': 'bg-accent text-primary border border-border',
  'ছুটি': 'bg-secondary text-primary border border-border',
  'অভিভাবক সভা': 'bg-secondary text-primary border border-border',
  'সাধারণ': 'bg-secondary text-muted-foreground border border-border',
};

export function AdminNotices({ notices, onSave, onDelete }: { notices: NoticeRow[]; onSave: (n: { id?: string | undefined; title: string; body: string; category: string; file_url?: string | undefined }) => Promise<boolean>; onDelete: (id: string) => void }) {
  const [form, setForm] = useState(emptyForm);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const rows = useMemo(() => [...notices].sort((a, b) => b.published_at.localeCompare(a.published_at)), [notices]);
  const shown = rows.filter((n) => (!cat || n.category === cat) && (!q.trim() || `${n.title} ${n.body} ${n.category}`.toLowerCase().includes(q.trim().toLowerCase())));
  const chosen = touched ? (rows.find((n) => n.id === chosenId) ?? shown[0] ?? null) : (shown[0] ?? null);

  const thisMonth = rows.filter((n) => { const d = new Date(n.published_at); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const withFile = rows.filter((n) => n.file_url).length;
  const catCount = new Set(rows.map((n) => n.category)).size;
  const stats = [
    { label: 'মোট নোটিশ', value: rows.length, Icon: Megaphone, cls: 'bg-primary text-primary-foreground' },
    { label: 'এই মাসে', value: thisMonth, Icon: CalendarDays, cls: 'bg-gold text-primary' },
    { label: 'বিভাগ', value: catCount, Icon: Tag, cls: 'bg-card text-primary border border-border' },
    { label: 'সংযুক্ত ফাইল', value: withFile, Icon: Paperclip, cls: 'bg-card text-primary border border-border' },
  ];

  const edit = (n: NoticeRow) => { setForm({ id: n.id, title: n.title, body: n.body, category: n.category, file_url: n.file_url ?? '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = (id: string) => { if (!window.confirm('নোটিশটি মুছে ফেলবেন?')) return; onDelete(id); if (chosenId === id) { setChosenId(null); setTouched(false); } };

  return <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, cls }) => <div key={label} className={`flex items-center gap-3 rounded-2xl p-4 ${cls}`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-background text-primary"><Icon className="size-5" /></span>
        <div><p className="text-xl font-bold leading-none">{value.toLocaleString('bn-BD')}</p><p className="mt-1 text-xs font-semibold opacity-80">{label}</p></div>
      </div>)}
    </div>

    <div className="rounded-2xl border border-border bg-secondary p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[['', 'সব বিভাগ', rows.length] as const, ...CATEGORIES.map((c) => [c, c, rows.filter((n) => n.category === c).length] as const)].map(([v, l, c]) => <button key={l} type="button" onClick={() => setCat(v)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${cat === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-primary'}`}>{l}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${cat === v ? 'bg-gold text-primary' : 'bg-secondary'}`}>{c.toLocaleString('bn-BD')}</span></button>)}
        </div>
        <label className="relative block lg:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="শিরোনাম বা বিষয় খুঁজুন" className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <div className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-elegant">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-primary">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">{form.id ? <Pencil className="size-4" /> : <Plus className="size-4" />}</span>
          {form.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ প্রকাশ'}
        </h2>
        <form onSubmit={async (e) => { e.preventDefault(); if (await onSave({ id: form.id || undefined, title: form.title, body: form.body, category: form.category, file_url: form.file_url || undefined })) setForm(emptyForm); }} className="space-y-3">
          <input required minLength={3} aria-label="শিরোনাম" placeholder="নোটিশের শিরোনাম" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
          <select aria-label="বিভাগ" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <textarea aria-label="বিস্তারিত" placeholder="নোটিশের বিস্তারিত বিবরণ" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={`${field} min-h-32`} />
          <input aria-label="ফাইলের লিংক" placeholder="সংযুক্ত ফাইলের লিংক (ঐচ্ছিক)" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className={field} />
          <div className="flex gap-2 pt-1">
            <Button type="submit" className="gap-1.5"><CheckCircle2 className="size-4" />{form.id ? 'হালনাগাদ করুন' : 'প্রকাশ করুন'}</Button>
            {form.id && <Button type="button" variant="secondary" onClick={() => setForm(emptyForm)}><X className="size-4" />বাতিল</Button>}
          </div>
        </form>
      </div>

      <div className="min-w-0 space-y-3">
        {chosen && <div className="rounded-2xl border border-border bg-card shadow-elegant">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary px-4 py-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"><Eye className="size-4 text-gold" />নির্বাচিত নোটিশের পূর্ণ রূপ</span>
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${catTone[chosen.category] ?? catTone['সাধারণ']}`}>{chosen.category}</span>
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="font-teacher text-lg font-bold leading-snug text-primary">{chosen.title}</h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" />প্রকাশিত: {when(chosen.published_at)}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7">{chosen.body}</p>
            {chosen.file_url && <a href={chosen.file_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-semibold text-primary hover:border-primary"><FileText className="size-4 text-gold" />সংযুক্ত ফাইল দেখুন</a>}
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={() => edit(chosen)}><Pencil className="size-3.5" />সম্পাদনা</Button>
              <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={() => remove(chosen.id)}><Trash2 className="size-3.5" />মুছে ফেলুন</Button>
            </div>
          </div>
        </div>}

        <div className="space-y-2.5">
          {shown.map((n) => <button key={n.id} type="button" onClick={() => { setChosenId(n.id); setTouched(true); }} className={`w-full rounded-2xl border p-3.5 text-start transition-colors ${chosen?.id === n.id ? 'border-primary bg-accent' : 'border-border bg-card hover:border-primary'}`}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Megaphone className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="truncate text-sm text-primary">{n.title}</strong>
                  <span className="shrink-0 text-[10.5px] text-muted-foreground">{whenShort(n.published_at)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{n.body}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${catTone[n.category] ?? catTone['সাধারণ']}`}>{n.category}</span>
                  {n.file_url && <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-muted-foreground"><Paperclip className="size-3" />ফাইল</span>}
                  <span className="ml-auto flex shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" aria-label="সম্পাদনা" className="size-7" onClick={() => edit(n)}><Pencil className="size-3.5" /></Button>
                    <Button variant="ghost" size="icon" aria-label="মুছুন" className="size-7 text-destructive" onClick={() => remove(n.id)}><Trash2 className="size-3.5" /></Button>
                  </span>
                </div>
              </div>
            </div>
          </button>)}
          {!shown.length && <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">এই বিভাগে কোনো নোটিশ পাওয়া যায়নি।</p>}
        </div>
      </div>
    </div>
  </div>;
}
