import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';
import { BookOpen, BookMarked, Eye, EyeOff, ImagePlus, Upload, Check, Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Save, Loader2, X, FileText, CheckCircle2, ExternalLink, LayoutGrid, List, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Database } from '@/integrations/supabase/types';
import type { AdminChange } from '@/lib/platform.functions';

type Book = Database['public']['Tables']['books']['Row'];
export const emptyBook = { id: '', title: '', description: '', details: '', author: '', pages: '', price: '', cover_url: '', active: true };
export type BookDraft = typeof emptyBook;
type Props = { books: Book[]; draft: BookDraft; setDraft: (value: BookDraft) => void; onSave: (change: AdminChange) => Promise<boolean>; onUpload: (file: File) => Promise<string> };
const input = 'w-full min-w-0 rounded-lg border border-field-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring';
const bookSchema = z.object({ title: z.string().trim().min(2, 'বইয়ের নাম অন্তত ২ অক্ষরের হতে হবে।').max(200), author: z.string().trim().max(150), price: z.number().finite().nonnegative('মূল্য শূন্যের কম হতে পারবে না।'), pages: z.number().int().min(0).max(5000).optional(), description: z.string().max(3000), details: z.string().max(5000), cover_url: z.string().url('সঠিক ছবির লিংক দিন।').optional() });
const money = (n: number) => `৳${n.toLocaleString('bn-BD')}`;
const num = (n: number) => n.toLocaleString('bn-BD');

function Cover({ url, title, large = false }: { url: string; title: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);
  return <div className={`grid shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-secondary ${large ? 'h-52 w-36 sm:h-60 sm:w-40' : 'h-28 w-20'}`}>
    {url && !failed ? <img src={url} alt={title || 'বইয়ের প্রচ্ছদ'} onError={() => setFailed(true)} className="h-full w-full object-contain" /> : <BookOpen className={`${large ? 'size-12' : 'size-7'} text-muted-foreground`} />}
  </div>;
}

export function AdminBooks({ books, draft, setDraft, onSave, onUpload }: Props) {
  const [tab, setTab] = useState<'info' | 'cover' | 'review'>('info');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState<'upload' | 'save' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initial = useRef(JSON.stringify(draft));
  const dirty = JSON.stringify(draft) !== initial.current || !!file;
  const cover = preview || draft.cover_url;
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => setPage(1), [query, filter, sort]);
  const filtered = useMemo(() => books.filter((b) => (filter === 'all' || (filter === 'active' ? b.active : filter === 'hidden' ? !b.active : !b.cover_url)) && `${b.title} ${b.author ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === 'price-low' ? Number(a.price) - Number(b.price) : sort === 'price-high' ? Number(b.price) - Number(a.price) : sort === 'name' ? a.title.localeCompare(b.title, 'bn') : b.created_at.localeCompare(a.created_at)), [books, filter, sort, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pages);
  const rows = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  const set = (key: keyof BookDraft, value: string | boolean) => { setDraft({ ...draft, [key]: value }); setError(''); setSuccess(''); };
  const reset = (next = emptyBook) => {
    if (dirty && !window.confirm('সংরক্ষণ না করা পরিবর্তন বাদ দেবেন?')) return;
    setDraft(next); initial.current = JSON.stringify(next); setFile(null); setTab('info'); setError(''); setSuccess('');
    formRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  function chooseFile(next?: File) {
    if (!next || busy) return;
    if (!/^image\/(jpeg|png|webp)$/.test(next.type) || next.size > 3 * 1024 * 1024) { setError('৩ MB-এর মধ্যে JPG, PNG অথবা WEBP ছবি দিন।'); return; }
    setFile(next); setError(''); setSuccess('');
  }
  async function uploadCover() {
    if (!file) return draft.cover_url;
    const url = await onUpload(file);
    setDraft({ ...draft, cover_url: url }); setFile(null); return url;
  }
  async function submit() {
    if (busy) return;
    setError(''); setSuccess('');
    if (!draft.price.trim()) { setError('বইয়ের মূল্য দিন।'); setTab('info'); return; }
    const parsed = bookSchema.safeParse({ ...draft, price: Number(draft.price), pages: draft.pages.trim() ? Number(draft.pages) : undefined, cover_url: draft.cover_url.trim() || undefined });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'তথ্য যাচাই করুন।'); setTab('info'); return; }
    setBusy('save');
    try {
      const url = await uploadCover();
      const ok = await onSave({ kind: 'book', id: draft.id || undefined, ...parsed.data, details: parsed.data.details || undefined, author: parsed.data.author || undefined, cover_url: url || undefined, active: draft.active });
      if (ok) { setDraft(emptyBook); initial.current = JSON.stringify(emptyBook); setFile(null); setTab('info'); setSuccess('বইয়ের তথ্য সংরক্ষিত হয়েছে।'); }
      else setError('বই সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
    } catch { setError('প্রচ্ছদ আপলোড করা যায়নি। আবার চেষ্টা করুন।'); }
    finally { setBusy(null); }
  }
  const stats = [{ label: 'মোট বই', count: books.length, Icon: BookMarked }, { label: 'প্রকাশিত', count: books.filter((b) => b.active).length, Icon: Eye }, { label: 'লুকানো', count: books.filter((b) => !b.active).length, Icon: EyeOff }, { label: 'প্রচ্ছদ যুক্ত', count: books.filter((b) => b.cover_url).length, Icon: ImagePlus }];

  return <div className="space-y-6 font-teacher">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{stats.map(({ label, count, Icon }) => <div key={label} className="flex items-center gap-3 rounded-lg border border-field-border bg-card p-3 sm:p-4"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><Icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-brand text-2xl font-bold text-primary">{num(count)}</p></div></div>)}</div>
    <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.2fr)]">
      <form ref={formRef} aria-label="বই প্রকাশের ফর্ম" onSubmit={(e) => { e.preventDefault(); void submit(); }} className="admin-book-editor min-w-0 scroll-mt-24 overflow-hidden rounded-lg border border-panel-green-border bg-panel-green text-panel-green-foreground">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-panel-green-border px-4 py-5 sm:px-5"><div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md border border-panel-green-border bg-panel-green-soft"><BookOpen className="size-5 text-gold" /></span><h2 className="text-base font-bold">{draft.id ? 'বই সম্পাদনা' : 'নতুন বই প্রকাশ'}</h2></div>{draft.id && <span className="rounded-md border border-panel-green-border px-2 py-1 text-[10px] text-gold">সম্পাদনা চলছে</span>}</div>
        <div role="tablist" aria-label="বইয়ের তথ্য" className="grid grid-cols-3 border-b border-border">{([{ key: 'info', label: 'বইয়ের তথ্য', Icon: FileText }, { key: 'cover', label: 'প্রচ্ছদ', Icon: ImagePlus }, { key: 'review', label: 'প্রিভিউ', Icon: Eye }] as const).map(({ key, label, Icon }) => <Button key={key} role="tab" aria-selected={tab === key} type="button" variant="ghost" disabled={!!busy} onClick={() => setTab(key)} className={`h-12 rounded-none px-2 text-xs ${tab === key ? 'border-b-2 border-primary bg-secondary text-primary' : 'text-muted-foreground'}`}><Icon />{label}</Button>)}</div>
        <fieldset disabled={!!busy} className="min-w-0 space-y-4 p-4 sm:p-5">
          {error && <p role="alert" className="rounded-md border border-destructive bg-background p-3 text-xs text-destructive">{error}</p>}
          {success && <p role="status" className="flex items-center gap-2 text-xs text-primary"><CheckCircle2 className="size-4" />{success}</p>}
          {tab === 'info' && <div className="space-y-4">
            <label className="block text-xs font-semibold">বইয়ের নাম <span className="text-destructive">*</span><input aria-label="বইয়ের নাম" maxLength={200} value={draft.title} onChange={(e) => set('title', e.target.value)} placeholder="বইয়ের পূর্ণ নাম" className={`${input} mt-1.5`} /></label>
            <label className="block text-xs font-semibold">লেখক<input aria-label="লেখক" maxLength={150} value={draft.author} onChange={(e) => set('author', e.target.value)} placeholder="লেখকের নাম" className={`${input} mt-1.5`} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="text-xs font-semibold">মূল্য (৳) <span className="text-destructive">*</span><input aria-label="মূল্য" type="number" min="0" step="0.01" value={draft.price} onChange={(e) => set('price', e.target.value)} placeholder="০" className={`${input} mt-1.5`} /></label><label className="text-xs font-semibold">পৃষ্ঠা সংখ্যা<input aria-label="পৃষ্ঠা সংখ্যা" type="number" min="0" max="5000" step="1" value={draft.pages} onChange={(e) => set('pages', e.target.value)} placeholder="০" className={`${input} mt-1.5`} /></label></div>
            <label className="block text-xs font-semibold">সংক্ষিপ্ত বিবরণ<textarea aria-label="সংক্ষিপ্ত বিবরণ" maxLength={3000} rows={3} value={draft.description} onChange={(e) => set('description', e.target.value)} className={`${input} mt-1.5 resize-y`} /><span className="mt-1 block text-right text-[10px] font-normal text-muted-foreground">{num(draft.description.length)} / ৩,০০০</span></label>
            <label className="block text-xs font-semibold">বইয়ের বিস্তারিত<textarea aria-label="বইয়ের বিস্তারিত" maxLength={5000} rows={5} value={draft.details} onChange={(e) => set('details', e.target.value)} className={`${input} mt-1.5 resize-y`} /><span className="mt-1 block text-right text-[10px] font-normal text-muted-foreground">{num(draft.details.length)} / ৫,০০০</span></label>
          </div>}
          {tab === 'cover' && <div className="space-y-4">
            <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files[0]); }} className={`flex min-h-64 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-4 ${dragging ? 'border-primary bg-accent' : 'border-field-border bg-secondary'}`}>
              {cover ? <Cover large url={cover} title={draft.title} /> : <div className="grid size-16 place-items-center rounded-lg border border-field-border bg-card text-primary"><ImagePlus className="size-8" /></div>}
              <div className="flex flex-wrap justify-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}><ImagePlus />{cover ? 'ছবি পরিবর্তন' : 'ছবি নির্বাচন'}</Button>{cover && <Button type="button" variant="ghost" size="sm" aria-label="প্রচ্ছদ সরান" title="প্রচ্ছদ সরান" onClick={() => { setFile(null); set('cover_url', ''); }}><Trash2 /></Button>}</div>
              <p className="text-center text-[11px] text-muted-foreground">JPG · PNG · WEBP / সর্বোচ্চ ৩ MB</p>
            </div>
            <input ref={fileInput} type="file" aria-label="প্রচ্ছদ নির্বাচন" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { chooseFile(e.target.files?.[0]); e.target.value = ''; }} />
            {file && <div className="flex min-w-0 items-center gap-2 rounded-md border border-field-border p-3"><ImagePlus className="size-4 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-xs">{file.name}</p><p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · নির্বাচিত</p></div><Button type="button" size="sm" onClick={async () => { setBusy('upload'); setError(''); try { await uploadCover(); setSuccess('প্রচ্ছদ আপলোড হয়েছে।'); } catch { setError('প্রচ্ছদ আপলোড করা যায়নি। আবার চেষ্টা করুন।'); } finally { setBusy(null); } }}><Upload />আপলোড</Button></div>}
            <label className="block text-xs font-semibold">প্রচ্ছদের লিংক<input type="url" aria-label="প্রচ্ছদের লিংক" maxLength={4000} value={draft.cover_url} onChange={(e) => { setFile(null); set('cover_url', e.target.value); }} placeholder="https://" className={`${input} mt-1.5`} /></label>
          </div>}
          {tab === 'review' && <div className="space-y-5">
            <div className="flex justify-center"><Cover large url={cover} title={draft.title} /></div>
            <div className="text-center"><h3 className="break-words text-lg font-bold text-primary">{draft.title || 'বইয়ের নাম'}</h3>{draft.author && <p className="mt-1 text-xs text-muted-foreground">{draft.author}</p>}<p className="mt-2 font-brand text-2xl font-bold text-primary">{money(Number(draft.price) || 0)}</p>{draft.pages && <p className="text-xs text-muted-foreground">{num(Number(draft.pages))} পৃষ্ঠা</p>}</div>
            {draft.description && <div><h4 className="mb-1 text-xs font-bold">সংক্ষিপ্ত বিবরণ</h4><p className="whitespace-pre-wrap break-words text-xs leading-6 text-muted-foreground">{draft.description}</p></div>}
            {draft.details && <div><h4 className="mb-1 text-xs font-bold">বইয়ের বিস্তারিত</h4><p className="whitespace-pre-wrap break-words text-xs leading-6 text-muted-foreground">{draft.details}</p></div>}
            <div className="space-y-2 border-t border-border pt-3">{[{ label: 'বইয়ের নাম', ok: draft.title.trim().length >= 2 }, { label: 'মূল্য', ok: !!draft.price.trim() && Number(draft.price) >= 0 }, { label: 'প্রচ্ছদ', ok: !!cover }].map((item) => <div key={item.label} className="flex items-center justify-between text-xs"><span>{item.label}</span>{item.ok ? <Check className="size-4 text-primary" /> : <span className="text-muted-foreground">{item.label === 'প্রচ্ছদ' ? 'যুক্ত নেই' : 'অসম্পূর্ণ'}</span>}</div>)}</div>
          </div>}
          <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-border pt-4"><span className="flex items-center gap-2 text-xs font-semibold">{draft.active ? <Eye className="size-4 text-primary" /> : <EyeOff className="size-4 text-muted-foreground" />}ওয়েবসাইটে প্রকাশ করুন</span><input aria-label="ওয়েবসাইটে প্রকাশ করুন" type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)} className="size-4 accent-primary" /></label>
        </fieldset>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-secondary p-4"><Button type="button" variant="ghost" size="sm" disabled={!!busy} onClick={() => reset()}><X />{draft.id ? 'বাতিল' : 'পরিষ্কার'}</Button><Button type="submit" disabled={!!busy} className="h-10 bg-primary px-4 text-xs hover:bg-primary-raised">{busy ? <Loader2 className="animate-spin" /> : <Save />}{busy === 'upload' ? 'আপলোড হচ্ছে…' : busy === 'save' ? 'সংরক্ষণ হচ্ছে…' : draft.id ? 'পরিবর্তন সংরক্ষণ' : 'বই সংরক্ষণ'}</Button></div>
      </form>

      <section aria-label="বইয়ের তালিকা" className="min-w-0 space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div className="min-w-0"><h2 className="text-lg font-bold text-primary">বইয়ের সংগ্রহ</h2><p className="mt-1 text-xs text-muted-foreground">{num(filtered.length)}টি বই</p></div><Button type="button" size="sm" disabled={!!busy} onClick={() => reset()} className="shrink-0 bg-primary hover:bg-primary-raised"><Plus />নতুন বই</Button></div>
        <div className="space-y-3 border-y border-field-border py-4">
          <div className="flex flex-wrap gap-1.5">{[{ key: 'all', label: 'সব বই', count: books.length }, { key: 'active', label: 'প্রকাশিত', count: books.filter((b) => b.active).length }, { key: 'hidden', label: 'লুকানো', count: books.filter((b) => !b.active).length }, { key: 'no-cover', label: 'প্রচ্ছদ নেই', count: books.filter((b) => !b.cover_url).length }].map((item) => <Button key={item.key} type="button" size="sm" variant={filter === item.key ? 'default' : 'outline'} onClick={() => setFilter(item.key)} className={`h-8 px-2.5 text-[11px] ${filter === item.key ? 'bg-primary hover:bg-primary-raised' : 'border-field-border'}`}>{item.label}<span>{num(item.count)}</span></Button>)}</div>
          <div className="flex flex-wrap items-center gap-2"><label className="relative min-w-40 flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label="বই খুঁজুন" value={query} maxLength={200} onChange={(e) => setQuery(e.target.value)} placeholder="বই বা লেখকের নাম" className={`${input} pl-9`} /></label><select aria-label="বই সাজান" value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 max-w-full rounded-lg border border-field-border bg-card px-2 text-xs"><option value="newest">সর্বশেষ আগে</option><option value="name">নাম অনুযায়ী</option><option value="price-low">কম দাম আগে</option><option value="price-high">বেশি দাম আগে</option></select><div className="flex rounded-md border border-field-border">{([{ key: 'grid', Icon: LayoutGrid, label: 'কার্ড বিন্যাস' }, { key: 'list', Icon: List, label: 'তালিকা বিন্যাস' }] as const).map(({ key, Icon, label }) => <Button key={key} type="button" variant="ghost" size="icon" aria-label={label} title={label} aria-pressed={view === key} onClick={() => setView(key)} className={`size-9 rounded-md ${view === key ? 'bg-accent text-primary' : 'text-muted-foreground'}`}><Icon /></Button>)}</div></div>
        </div>
        <div className={`grid min-w-0 gap-4 ${view === 'grid' ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>{rows.map((b) => <article key={b.id} className={`group relative min-w-0 overflow-hidden rounded-lg border-2 bg-card transition-colors hover:border-primary focus-within:border-primary ${draft.id === b.id ? 'border-primary' : 'border-border'}`}>
          <Button type="button" variant="ghost" disabled={!!busy} aria-label={`${b.title} সম্পাদনা করুন`} onClick={() => reset({ id: b.id, title: b.title, author: b.author ?? '', description: b.description, details: b.details ?? '', pages: b.pages == null ? '' : String(b.pages), price: String(b.price), cover_url: b.cover_url ?? '', active: b.active })} className="absolute inset-0 z-10 h-full w-full rounded-lg hover:bg-transparent focus-visible:ring-inset" />
          <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-3 py-2"><span className={`flex items-center gap-1.5 text-[10px] font-semibold ${b.active ? 'text-primary' : 'text-muted-foreground'}`}>{b.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}{b.active ? 'প্রকাশিত' : 'লুকানো'}</span><span className="text-[10px] text-muted-foreground">{new Date(b.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}</span></div>
          <div className={`min-w-0 ${view === 'grid' ? '' : 'grid grid-cols-[auto_minmax(0,1fr)] items-center'}`}><div className={`flex items-center justify-center bg-secondary ${view === 'grid' ? 'h-52 border-b border-border p-4 sm:h-56' : 'p-3'}`}><Cover url={b.cover_url ?? ''} title={b.title} large={view === 'grid'} /></div><div className="min-w-0 p-4"><h3 className="line-clamp-2 min-h-12 break-words text-sm font-bold leading-6 text-primary">{b.title}</h3><p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{b.author || 'লেখক যুক্ত নেই'}</p><div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2"><p className="font-brand text-xl font-bold text-primary">{money(Number(b.price))}</p><div className="text-right text-[10px] text-muted-foreground">{b.pages != null && <span>{num(b.pages)} পৃষ্ঠা</span>}{!b.cover_url && <span className="flex items-center gap-1"><ImageOff className="size-3" />প্রচ্ছদ নেই</span>}</div></div></div></div>
          <div className="relative z-20 flex items-center justify-between gap-2 border-t border-border bg-card px-3 py-2"><Button type="button" size="sm" variant="secondary" disabled={!!busy} onClick={() => reset({ id: b.id, title: b.title, author: b.author ?? '', description: b.description, details: b.details ?? '', pages: b.pages == null ? '' : String(b.pages), price: String(b.price), cover_url: b.cover_url ?? '', active: b.active })} className="h-8 px-2.5 text-[11px]"><Pencil />সম্পাদনা</Button><div className="flex gap-1">{b.active && <Button asChild variant="ghost" size="icon" className="size-8" title="বইয়ের পেজ দেখুন"><Link to="/books/$id" params={{ id: b.id }} target="_blank" aria-label={`${b.title} দেখুন`}><ExternalLink /></Link></Button>}<Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" disabled={!!busy} title="বই মুছুন" aria-label={`${b.title} মুছুন`} onClick={async () => { if (!window.confirm('বইটি স্থায়ীভাবে মুছে ফেলবেন?')) return; setBusy('save'); try { const ok = await onSave({ kind: 'delete', target: 'book', id: b.id }); if (ok && draft.id === b.id) { setDraft(emptyBook); initial.current = JSON.stringify(emptyBook); setFile(null); } } finally { setBusy(null); } }}><Trash2 /></Button></div></div>
        </article>)}</div>
        {!rows.length && <div className="py-14 text-center"><BookOpen className="mx-auto mb-3 size-9 text-muted-foreground" /><p className="text-sm font-semibold">কোনো বই পাওয়া যায়নি।</p></div>}
        {pages > 1 && <nav aria-label="বইয়ের পৃষ্ঠা" className="flex items-center justify-between border-t border-field-border pt-4"><Button type="button" variant="outline" size="icon" aria-label="আগের পৃষ্ঠা" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><span className="text-xs text-muted-foreground">পৃষ্ঠা {num(currentPage)} / {num(pages)}</span><Button type="button" variant="outline" size="icon" aria-label="পরের পৃষ্ঠা" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></nav>}
      </section>
    </div>
  </div>;
}