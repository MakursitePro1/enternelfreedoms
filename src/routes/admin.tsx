import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { LayoutDashboard, GraduationCap, ShoppingBag, MessageSquare, Megaphone, BookOpen, Layers, Settings, LogOut, Upload, Trash2, Pencil, FileText, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { adminSave, adminUpload, adminDocumentLink, getAdminData, type AdminChange } from '@/lib/platform.functions';
import { contentKinds, type ContentKind } from '@/lib/institution-content';
import { settingFields } from '@/lib/site-settings';
import { Site } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/admin')({
  head: () => ({ ...seo('অ্যাডমিন ড্যাশবোর্ড', 'Eternal Freedom Institute Al Islamia-এর অনুমোদিত প্রশাসনিক ব্যবস্থাপনা।'), meta: [...seo('অ্যাডমিন ড্যাশবোর্ড', 'Eternal Freedom Institute Al Islamia-এর অনুমোদিত প্রশাসনিক ব্যবস্থাপনা।').meta, { name: 'robots', content: 'noindex' }] }),
  component: Admin,
});

type Data = Awaited<ReturnType<typeof getAdminData>>;
type Tab = 'overview' | 'admissions' | 'orders' | 'messages' | 'notices' | 'books' | 'content' | 'settings';
const tabs: [Tab, string, typeof LayoutDashboard][] = [['overview', 'সারসংক্ষেপ', LayoutDashboard], ['admissions', 'ভর্তি আবেদন', GraduationCap], ['orders', 'বইয়ের অর্ডার', ShoppingBag], ['messages', 'বার্তা', MessageSquare], ['notices', 'নোটিশ', Megaphone], ['books', 'বই', BookOpen], ['content', 'ওয়েবসাইটের তথ্য', Layers], ['settings', 'সেটিংস', Settings]];
const emptyNotice = { id: '', title: '', body: '', category: 'সাধারণ', file_url: '' };
const emptyBook = { id: '', title: '', description: '', details: '', author: '', pages: '', price: '', cover_url: '', active: true };
const emptyContent = { id: '', title: '', body: '', image_url: '', detail: '', category: '', published: true, sort_order: 0 };
const field = 'w-full bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring';

function Card({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={`rounded-2xl bg-background p-5 shadow-elegant ${className}`}>{children}</div>; }

function Admin() {
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [notice, setNotice] = useState(emptyNotice);
  const [book, setBook] = useState(emptyBook);
  const [kind, setKind] = useState<ContentKind>('teacher');
  const [content, setContent] = useState(emptyContent);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fetchAdmin = useServerFn(getAdminData), save = useServerFn(adminSave), upload = useServerFn(adminUpload), docLink = useServerFn(adminDocumentLink);

  async function token() { const { data } = await supabase.auth.getSession(); if (!data.session) throw new Error('লগইন প্রয়োজন।'); return data.session.access_token; }
  async function refresh() {
    try { const d = await fetchAdmin({ data: { token: await token() } }); setData(d); setSettings(Object.fromEntries(d.settings.map((s) => [s.key, s.value]))); setError(''); }
    catch { setData(null); setError('এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই। অনুমোদিত অ্যাকাউন্ট দিয়ে প্রবেশ করুন।'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(!!data.session); if (data.session) refresh(); else setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(!!s); if (!s) setData(null); });
    return () => sub.subscription.unsubscribe();
  }, []);
  function flash(m: string) { setMessage(m); setError(''); window.setTimeout(() => setMessage(''), 3000); }
  async function run(change: AdminChange, ok: string) {
    try { await save({ data: { token: await token(), change } }); flash(ok); await refresh(); return true; }
    catch { setError('সংরক্ষণ করা যায়নি। তথ্য যাচাই করুন।'); return false; }
  }
  async function login(e: FormEvent) {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    if (result.error) { setError(result.error.message); setLoading(false); return; }
    if (mode === 'signup' && !result.data.session) { setMessage('নিবন্ধন হয়েছে। ইমেইলে পাঠানো লিংক খুলে নিশ্চিত করুন, তারপর লগইন করুন।'); setLoading(false); return; }
    setSession(true); await refresh();
  }
  async function pickImage(file: File | undefined, set: (url: string) => void) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 3 * 1024 * 1024) { setError('৩ MB-এর মধ্যে JPG/PNG/WEBP ছবি দিন।'); return; }
    setUploading(true);
    try { const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); }); const { url } = await upload({ data: { token: await token(), file: { name: file.name, type: file.type, data: dataUrl } } }); set(url); flash('ছবি আপলোড হয়েছে।'); }
    catch { setError('ছবি আপলোড করা যায়নি।'); } finally { setUploading(false); }
  }
  async function openDoc(path: string) { try { const { url } = await docLink({ data: { token: await token(), path } }); window.open(url, '_blank', 'noopener'); } catch { setError('ফাইল খোলা যায়নি।'); } }
  const kindInfo = contentKinds.find((k) => k.key === kind)!;
  const kindItems = useMemo(() => (data?.content ?? []).filter((c) => c.kind === kind), [data, kind]);
  const counts = data ? { admissions: data.admissions.filter((a) => a.status === 'নতুন').length, orders: data.orders.filter((o) => o.status === 'নতুন').length, messages: data.messages.filter((m) => m.status === 'নতুন').length, notices: data.notices.length } : null;

  const ImageInput = ({ value, onChange, label = 'ছবির লিংক' }: { value: string; onChange: (v: string) => void; label?: string }) => (
    <div className="sm:col-span-2"><div className="flex gap-2"><input aria-label={label} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={field} /><label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"><Upload className="size-4" />{uploading ? '...' : 'আপলোড'}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0], onChange)} /></label></div>{value && <img src={value} alt="" className="mt-2 h-20 rounded-lg object-cover" />}</div>
  );

  if (!session) return (
    <Site>
      <section className="grid min-h-[70vh] place-items-center bg-secondary px-5 py-16">
        <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-elegant">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-2xl text-gold-light">۞</div>
          <h1 className="mt-4 text-center font-display text-2xl text-primary">{mode === 'login' ? 'অ্যাডমিন লগইন' : 'অ্যাডমিন অ্যাকাউন্ট তৈরি'}</h1>
          <form onSubmit={login} className="mt-6 space-y-4"><input type="email" required aria-label="ইমেইল" placeholder="ইমেইল" value={email} onChange={(e) => setEmail(e.target.value)} className={field} /><input type="password" required minLength={6} aria-label="পাসওয়ার্ড" placeholder="পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} className={field} /><Button disabled={loading} className="w-full" size="lg">{loading ? 'অপেক্ষা করুন...' : mode === 'login' ? 'প্রবেশ করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</Button></form>
          {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}{message && <p className="mt-3 text-sm text-primary">{message}</p>}
          <Button variant="link" className="mt-3 px-0" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>{mode === 'login' ? 'প্রথমবার? অ্যাকাউন্ট তৈরি করুন' : 'আগেই অ্যাকাউন্ট আছে? লগইন করুন'}</Button>
          <p className="mt-3 rounded-lg bg-secondary p-3 text-xs leading-5 text-muted-foreground">নিরাপত্তার জন্য নতুন অ্যাকাউন্টে অ্যাডমিন অনুমতি স্বয়ংক্রিয়ভাবে দেওয়া হয় না। অ্যাকাউন্ট তৈরির পর ওয়েবসাইট নির্মাতাকে জানালে অনুমতি চালু করে দেওয়া হবে।</p>
        </div>
      </section>
    </Site>
  );

  return (
    <div className="min-h-screen bg-secondary">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="bg-primary text-primary-foreground lg:sticky lg:top-0 lg:h-screen">
          <div className="flex items-center gap-3 p-5"><span className="grid size-10 place-items-center rounded-xl bg-gold text-xl text-primary">۞</span><div><div className="font-display">Eternal Freedom</div><div className="text-xs opacity-70">অ্যাডমিন প্যানেল</div></div></div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">{tabs.map(([k, l, Icon]) => <button key={k} type="button" onClick={() => { setTab(k); setMessage(''); setError(''); }} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${tab === k ? 'bg-gold font-semibold text-primary' : 'hover:bg-primary-foreground/10'}`}><Icon className="size-4" />{l}</button>)}</nav>
          <div className="hidden p-3 lg:block"><a href="/" className="block rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-primary-foreground/10">← ওয়েবসাইটে ফিরুন</a><button type="button" onClick={async () => { await supabase.auth.signOut(); setSession(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm opacity-80 hover:bg-primary-foreground/10"><LogOut className="size-4" />লগআউট</button></div>
        </aside>
        <main className="min-w-0 p-5 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-display text-2xl text-primary sm:text-3xl">{tabs.find((t) => t[0] === tab)?.[1]}</h1><Button variant="outline" size="sm" className="lg:hidden" onClick={async () => { await supabase.auth.signOut(); setSession(false); }}><LogOut className="size-4" />লগআউট</Button></div>
          {message && <p className="mb-4 rounded-lg bg-accent p-3 text-sm text-primary">{message}</p>}
          {error && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {loading && <p>তথ্য আসছে...</p>}
          {data && counts && <>
            {tab === 'overview' && <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{([['admissions', 'নতুন ভর্তি আবেদন', counts.admissions, GraduationCap], ['orders', 'নতুন বইয়ের অর্ডার', counts.orders, ShoppingBag], ['messages', 'নতুন বার্তা', counts.messages, MessageSquare], ['notices', 'প্রকাশিত নোটিশ', counts.notices, Megaphone]] as const).map(([k, l, n, Icon]) => <button key={k} type="button" onClick={() => setTab(k)} className="rounded-2xl bg-background p-6 text-start shadow-elegant premium-card"><Icon className="size-7 text-gold" /><div className="mt-4 font-display text-4xl font-bold text-primary">{n.toLocaleString('bn-BD')}</div><div className="text-sm text-muted-foreground">{l}</div></button>)}</div>
              <div className="grid gap-6 lg:grid-cols-2"><Card><h2 className="font-semibold text-primary">সাম্প্রতিক ভর্তি আবেদন</h2>{data.admissions.slice(0, 5).map((a) => <div key={a.id} className="flex justify-between border-b border-border py-3 text-sm last:border-0"><span>{a.student_name} · {a.program}</span><span className="text-gold">{a.status}</span></div>)}{!data.admissions.length && <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো আবেদন নেই।</p>}</Card><Card><h2 className="font-semibold text-primary">সাম্প্রতিক অর্ডার</h2>{data.orders.slice(0, 5).map((o) => <div key={o.id} className="flex justify-between border-b border-border py-3 text-sm last:border-0"><span>{o.customer_name} · ৳ {Number(o.total).toLocaleString('bn-BD')}</span><span className="text-gold">{o.status}</span></div>)}{!data.orders.length && <p className="mt-3 text-sm text-muted-foreground">এখনো কোনো অর্ডার নেই।</p>}</Card></div>
            </div>}

            {tab === 'admissions' && <div className="space-y-3">{data.admissions.map((a) => { const docs = Array.isArray(a.documents) ? (a.documents as { label: string; name: string; path: string }[]) : []; return <Card key={a.id} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"><div className="min-w-0"><strong className="text-primary">{a.student_name}</strong> · {a.program}<p className="mt-1 text-sm text-muted-foreground">{a.reference} · {a.guardian_name} · {a.phone} · {a.address}</p>{a.notes && <p className="mt-1 text-sm">{a.notes}</p>}{docs.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{docs.map((d) => <button key={d.path} type="button" onClick={() => openDoc(d.path)} className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent"><FileText className="size-3.5 text-gold" />{d.label}</button>)}</div>}<p className="mt-2 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString('bn-BD')}</p></div><select aria-label={`${a.student_name} এর অবস্থা`} value={a.status} onChange={(e) => run({ kind: 'admission', id: a.id, status: e.target.value as 'নতুন' }, 'অবস্থা হালনাগাদ হয়েছে।')} className="bg-secondary px-3 py-2">{['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল'].map((x) => <option key={x}>{x}</option>)}</select></Card>; })}{!data.admissions.length && <p>এখনো কোনো আবেদন নেই।</p>}</div>}

            {tab === 'orders' && <div className="space-y-3">{data.orders.map((o) => <Card key={o.id} className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div className="min-w-0"><strong className="text-primary">{o.customer_name}</strong> · {o.reference}<p className="mt-1 text-sm text-muted-foreground">{o.phone} · {o.address} · ৳ {Number(o.total).toLocaleString('bn-BD')} · {o.payment_method}{o.payment_reference ? ` · ট্রানজেকশন: ${o.payment_reference} (যাচাই করুন)` : ''}</p><p className="mt-1 text-sm">{Array.isArray(o.items) ? (o.items as { title: string; quantity: number }[]).map((i) => `${i.title} × ${i.quantity}`).join(', ') : ''}</p></div><select aria-label={`${o.customer_name} এর অর্ডারের অবস্থা`} value={o.status} onChange={(e) => run({ kind: 'order', id: o.id, status: e.target.value as 'নতুন' }, 'অর্ডারের অবস্থা হালনাগাদ হয়েছে।')} className="bg-secondary px-3 py-2">{['নতুন', 'প্রক্রিয়াধীন', 'পাঠানো হয়েছে', 'সম্পন্ন', 'বাতিল'].map((x) => <option key={x}>{x}</option>)}</select></Card>)}{!data.orders.length && <p>এখনো কোনো অর্ডার নেই।</p>}</div>}

            {tab === 'messages' && <div className="space-y-3">{data.messages.map((m) => <Card key={m.id}><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><strong className="text-primary">{m.name}</strong> · {m.subject}<p className="text-sm text-muted-foreground">{m.phone}{m.email ? ` · ${m.email}` : ''} · {new Date(m.created_at).toLocaleString('bn-BD')}</p></div><div className="flex gap-2"><select aria-label="বার্তার অবস্থা" value={m.status} onChange={(e) => run({ kind: 'message', id: m.id, status: e.target.value as 'নতুন' }, 'হালনাগাদ হয়েছে।')} className="bg-secondary px-3 py-2 text-sm">{['নতুন', 'উত্তর দেওয়া হয়েছে', 'সম্পন্ন'].map((x) => <option key={x}>{x}</option>)}</select><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('বার্তাটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'message', id: m.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></div><p className="mt-3 whitespace-pre-line text-sm leading-7">{m.message}</p></Card>)}{!data.messages.length && <p>এখনো কোনো বার্তা নেই।</p>}</div>}

            {tab === 'notices' && <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><Card><h2 className="mb-4 font-semibold text-primary">{notice.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ'}</h2><form onSubmit={async (e) => { e.preventDefault(); if (await run({ kind: 'notice', id: notice.id || undefined, title: notice.title, body: notice.body, category: notice.category, file_url: notice.file_url || undefined }, 'নোটিশ সংরক্ষণ হয়েছে।')) setNotice(emptyNotice); }} className="space-y-3"><input required minLength={3} aria-label="শিরোনাম" placeholder="শিরোনাম" value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} className={field} /><select aria-label="বিভাগ" value={notice.category} onChange={(e) => setNotice({ ...notice, category: e.target.value })} className={field}>{['সাধারণ', 'ভর্তি', 'পরীক্ষা', 'ছুটি', 'অভিভাবক সভা', 'গুরুত্বপূর্ণ'].map((c) => <option key={c}>{c}</option>)}</select><textarea aria-label="বিস্তারিত" placeholder="বিস্তারিত" value={notice.body} onChange={(e) => setNotice({ ...notice, body: e.target.value })} className={`${field} min-h-32`} /><input aria-label="ফাইলের লিংক" placeholder="সংযুক্ত ফাইলের লিংক (ঐচ্ছিক)" value={notice.file_url} onChange={(e) => setNotice({ ...notice, file_url: e.target.value })} className={field} /><div className="flex gap-2"><Button type="submit">সংরক্ষণ</Button>{notice.id && <Button type="button" variant="secondary" onClick={() => setNotice(emptyNotice)}>বাতিল</Button>}</div></form></Card><div className="space-y-3">{data.notices.map((n) => <Card key={n.id} className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="text-xs text-gold">{n.category} · {new Date(n.published_at).toLocaleDateString('bn-BD')}</span><h3 className="font-semibold text-primary">{n.title}</h3></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setNotice({ id: n.id, title: n.title, body: n.body, category: n.category, file_url: n.file_url ?? '' })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('নোটিশটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'notice', id: n.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}</div></div>}

            {tab === 'books' && <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><Card><h2 className="mb-4 font-semibold text-primary">{book.id ? 'বই সম্পাদনা' : 'নতুন বই'}</h2><form onSubmit={async (e) => { e.preventDefault(); if (await run({ kind: 'book', id: book.id || undefined, title: book.title, description: book.description, details: book.details || undefined, author: book.author || undefined, pages: book.pages ? Number(book.pages) : undefined, price: Number(book.price), cover_url: book.cover_url || undefined, active: book.active }, 'বই সংরক্ষণ হয়েছে।')) setBook(emptyBook); }} className="grid gap-3 sm:grid-cols-2"><input required aria-label="বইয়ের নাম" placeholder="বইয়ের নাম" value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} className={`${field} sm:col-span-2`} /><input aria-label="লেখক" placeholder="লেখক" value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} className={field} /><input aria-label="পৃষ্ঠা" type="number" min={0} placeholder="পৃষ্ঠা সংখ্যা" value={book.pages} onChange={(e) => setBook({ ...book, pages: e.target.value })} className={field} /><input required aria-label="মূল্য" type="number" min={0} placeholder="মূল্য (৳)" value={book.price} onChange={(e) => setBook({ ...book, price: e.target.value })} className={field} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={book.active} onChange={(e) => setBook({ ...book, active: e.target.checked })} />ওয়েবসাইটে দেখাবে</label><textarea aria-label="সংক্ষিপ্ত বিবরণ" placeholder="সংক্ষিপ্ত বিবরণ" value={book.description} onChange={(e) => setBook({ ...book, description: e.target.value })} className={`${field} min-h-20 sm:col-span-2`} /><textarea aria-label="বিস্তারিত" placeholder="বইয়ের বিস্তারিত" value={book.details} onChange={(e) => setBook({ ...book, details: e.target.value })} className={`${field} min-h-28 sm:col-span-2`} /><ImageInput label="প্রচ্ছদের ছবি" value={book.cover_url} onChange={(v) => setBook((b) => ({ ...b, cover_url: v }))} /><div className="flex gap-2 sm:col-span-2"><Button type="submit">সংরক্ষণ</Button>{book.id && <Button type="button" variant="secondary" onClick={() => setBook(emptyBook)}>বাতিল</Button>}</div></form></Card><div className="space-y-3">{data.books.map((b) => <Card key={b.id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{b.cover_url ? <img src={b.cover_url} alt="" className="h-14 w-10 rounded object-cover" /> : <div className="grid h-14 w-10 place-items-center rounded bg-secondary"><BookOpen className="size-4 text-gold" /></div>}<div className="min-w-0"><h3 className="truncate font-semibold text-primary">{b.title}</h3><p className="text-xs text-muted-foreground">৳ {Number(b.price).toLocaleString('bn-BD')} · {b.active ? 'প্রকাশিত' : 'লুকানো'}{b.slug?.startsWith('demo-') ? ' · নমুনা' : ''}</p></div></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setBook({ id: b.id, title: b.title, description: b.description, details: b.details ?? '', author: b.author ?? '', pages: b.pages ? String(b.pages) : '', price: String(b.price), cover_url: b.cover_url ?? '', active: b.active })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('বইটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'book', id: b.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}</div></div>}

            {tab === 'content' && <div className="space-y-6">
              <div className="flex flex-wrap gap-2">{contentKinds.map((k) => <button key={k.key} type="button" onClick={() => { setKind(k.key); setContent(emptyContent); }} className={`rounded-full px-4 py-2 text-sm ${kind === k.key ? 'bg-primary text-primary-foreground' : 'bg-background text-primary shadow-elegant'}`}>{k.label} ({(data.content.filter((c) => c.kind === k.key).length).toLocaleString('bn-BD')})</button>)}</div>
              <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
                <Card><h2 className="mb-4 flex items-center gap-2 font-semibold text-primary">{content.id ? <Pencil className="size-4" /> : <Plus className="size-4" />}{content.id ? `${kindInfo.label} সম্পাদনা` : `নতুন ${kindInfo.label}`}</h2>
                  <form onSubmit={async (e) => { e.preventDefault(); if (await run({ kind: 'content', id: content.id || undefined, content_kind: kind, title: content.title, body: content.body, image_url: content.image_url || undefined, detail: content.detail || undefined, category: content.category || undefined, published: content.published, sort_order: Number(content.sort_order) }, 'তথ্য সংরক্ষণ হয়েছে।')) setContent(emptyContent); }} className="grid gap-3 sm:grid-cols-2">
                    <input required minLength={2} aria-label={kindInfo.titleLabel} placeholder={kindInfo.titleLabel} value={content.title} onChange={(e) => setContent({ ...content, title: e.target.value })} className={`${field} sm:col-span-2`} />
                    {kindInfo.detailLabel !== '—' && <input aria-label={kindInfo.detailLabel} placeholder={kindInfo.detailLabel} value={content.detail} onChange={(e) => setContent({ ...content, detail: e.target.value })} className={field} />}
                    {kindInfo.categoryLabel !== '—' && <input aria-label={kindInfo.categoryLabel} placeholder={kindInfo.categoryLabel} value={content.category} onChange={(e) => setContent({ ...content, category: e.target.value })} className={field} />}
                    <textarea aria-label={kindInfo.bodyLabel} placeholder={kindInfo.bodyLabel} value={content.body} onChange={(e) => setContent({ ...content, body: e.target.value })} className={`${field} min-h-32 sm:col-span-2`} />
                    <ImageInput label={kind === 'video' ? 'YouTube ভিডিও লিংক' : 'ছবির লিংক'} value={content.image_url} onChange={(v) => setContent((c) => ({ ...c, image_url: v }))} />
                    <input aria-label="ক্রম" type="number" min={0} placeholder="ক্রম (ছোট সংখ্যা আগে)" value={content.sort_order} onChange={(e) => setContent({ ...content, sort_order: Number(e.target.value) })} className={field} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={content.published} onChange={(e) => setContent({ ...content, published: e.target.checked })} />ওয়েবসাইটে প্রকাশ করুন</label>
                    <div className="flex gap-2 sm:col-span-2"><Button type="submit">সংরক্ষণ</Button>{content.id && <Button type="button" variant="secondary" onClick={() => setContent(emptyContent)}>বাতিল</Button>}</div>
                  </form>
                </Card>
                <div className="space-y-3">{kindItems.map((c) => <Card key={c.id} className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3">{c.image_url && <img src={c.image_url} alt="" className="size-12 rounded-lg object-cover" />}<div className="min-w-0"><h3 className="font-semibold text-primary">{c.title}</h3><p className="text-xs text-muted-foreground">{[c.detail, c.category].filter(Boolean).join(' · ')}{c.published ? '' : ' · লুকানো'}{c.slug?.startsWith('demo-') ? ' · নমুনা' : ''}</p></div></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setContent({ id: c.id, title: c.title, body: c.body, image_url: c.image_url ?? '', detail: c.detail ?? '', category: c.category ?? '', published: c.published, sort_order: c.sort_order })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('এই তথ্য মুছে ফেলবেন?') && run({ kind: 'delete', target: 'content', id: c.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}{!kindItems.length && <p className="text-sm text-muted-foreground">এই বিভাগে এখনো কোনো তথ্য নেই।</p>}</div>
              </div>
            </div>}

            {tab === 'settings' && <Card className="max-w-3xl"><form onSubmit={async (e) => { e.preventDefault(); await run({ kind: 'settings', values: settings }, 'সেটিংস সংরক্ষণ হয়েছে। ওয়েবসাইট রিফ্রেশ করলে দেখা যাবে।'); }} className="grid gap-4 sm:grid-cols-2">{settingFields.map(([k, l]) => <label key={k} className="text-sm font-semibold text-primary">{l}<input value={settings[k] ?? ''} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} className={`${field} mt-1.5 font-normal`} /></label>)}<div className="sm:col-span-2"><Button type="submit">সেটিংস সংরক্ষণ</Button></div></form></Card>}
          </>}
        </main>
      </div>
    </div>
  );
}
