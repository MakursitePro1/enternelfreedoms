import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { AdminPageContext } from './AdminPage';
import { AdminOverview } from './AdminOverview';
import { AdminAdmissions } from './AdminAdmissions';
import { AdminOrders } from './AdminOrders';
import type { AdminPageKey, AdminTab } from '@/lib/admin-pages';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { LayoutDashboard, GraduationCap, ShoppingBag, MessageSquare, Megaphone, BookOpen, Layers, Settings, LogOut, Upload, Trash2, Pencil, FileText, Plus, RefreshCw, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { adminSave, adminUpload, adminDocumentLink, getAdminData, type AdminChange } from '@/lib/platform.functions';
import { contentKinds, type ContentKind } from '@/lib/institution-content';
import { settingFields } from '@/lib/site-settings';
import { Button } from '@/components/ui/button';
import logoAsset from '@/assets/institute-logo.jpeg.asset.json';
import { AdminAuth, ALIVE_KEY, REMEMBER_KEY } from '@/components/admin/AdminAuth';
import { Menu, X, Search, ExternalLink, Users, Images, Video, Trophy, CalendarDays, MessageCircleHeart, Building2, Utensils, BarChart3, ShieldCheck, Banknote, HelpCircle, BookMarked, Newspaper } from 'lucide-react';

type Data = Awaited<ReturnType<typeof getAdminData>>;
type Tab = AdminTab;
const tabs: [Tab, string, typeof LayoutDashboard][] = [['overview', 'সারসংক্ষেপ', LayoutDashboard], ['admissions', 'ভর্তি আবেদন', GraduationCap], ['orders', 'বইয়ের অর্ডার', ShoppingBag], ['messages', 'বার্তা', MessageSquare], ['notices', 'নোটিশ', Megaphone], ['books', 'বই', BookOpen], ['content', 'ওয়েবসাইটের তথ্য', Layers], ['settings', 'সেটিংস', Settings]];
const emptyNotice = { id: '', title: '', body: '', category: 'সাধারণ', file_url: '' };
const emptyBook = { id: '', title: '', description: '', details: '', author: '', pages: '', price: '', cover_url: '', active: true };
const emptyContent = { id: '', title: '', body: '', image_url: '', detail: '', category: '', published: true, sort_order: 0 };
const field = 'min-w-0 w-full bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring';

function Card({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={`min-w-0 rounded-2xl bg-background p-5 shadow-elegant ${className}`}>{children}</div>; }

export function AdminWorkspace() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const segments = pathname.split('/').filter(Boolean);
  const page = segments[1] ?? 'overview';
  const admissionId = page === 'admissions' ? segments[2] : undefined;
  const contentPage = contentKinds.find((item) => item.key === page);
  const tab: Tab = contentPage ? 'content' : (['overview', 'admissions', 'orders', 'messages', 'notices', 'books', 'settings'].includes(page) ? page as Tab : 'overview');
  const kind: ContentKind = contentPage?.key ?? 'teacher';
  const [session, setSession] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);
  const [trashed, setTrashed] = useState<Data['admissions']>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [notice, setNotice] = useState(emptyNotice);
  const [book, setBook] = useState(emptyBook);
  const [content, setContent] = useState(emptyContent);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fetchAdmin = useServerFn(getAdminData), save = useServerFn(adminSave), upload = useServerFn(adminUpload), docLink = useServerFn(adminDocumentLink);

  async function token() { const { data } = await supabase.auth.getSession(); if (!data.session) throw new Error('লগইন প্রয়োজন।'); return data.session.access_token; }
  async function refresh() {
    try { const d = await fetchAdmin({ data: { token: await token() } }); setTrashed(d.admissions.filter((a) => a.deleted_at)); setData({ ...d, admissions: d.admissions.filter((a) => !a.deleted_at) }); setSettings(Object.fromEntries(d.settings.map((s) => [s.key, s.value]))); setError(''); }
    catch { setData(null); setError('এই অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই। অনুমোদিত অ্যাকাউন্ট দিয়ে প্রবেশ করুন।'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => { if (data.session && localStorage.getItem(REMEMBER_KEY) === '0' && !sessionStorage.getItem(ALIVE_KEY)) { await supabase.auth.signOut(); setSession(false); setLoading(false); return; } setSession(!!data.session); if (data.session) refresh(); else setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setSession(!!s); if (!s) setData(null); });
    return () => sub.subscription.unsubscribe();
  }, []);
  function flash(m: string) { setMessage(m); setError(''); window.setTimeout(() => setMessage(''), 3000); }
  async function run(change: AdminChange, ok: string) {
    try { await save({ data: { token: await token(), change } }); flash(ok); await refresh(); return true; }
    catch { setError('সংরক্ষণ করা যায়নি। তথ্য যাচাই করুন।'); return false; }
  }
  async function pickImage(file: File | undefined, set: (url: string) => void) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 3 * 1024 * 1024) { setError('৩ MB-এর মধ্যে JPG/PNG/WEBP ছবি দিন।'); return; }
    setUploading(true);
    try { const dataUrl = await new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(file); }); const { url } = await upload({ data: { token: await token(), file: { name: file.name, type: file.type, data: dataUrl } } }); set(url); flash('ছবি আপলোড হয়েছে।'); }
    catch { setError('ছবি আপলোড করা যায়নি।'); } finally { setUploading(false); }
  }
  async function openDoc(path: string) { try { const { url } = await docLink({ data: { token: await token(), path } }); window.open(url, '_blank', 'noopener'); } catch { setError('ফাইল খোলা যায়নি।'); } }
  const kindItems = useMemo(() => (data?.content ?? []).filter((c) => c.kind === kind), [data, kind]);
  const counts = data ? { admissions: data.admissions.filter((a) => a.status === 'নতুন').length, orders: data.orders.filter((o) => o.status === 'নতুন').length, messages: data.messages.filter((m) => m.status === 'নতুন').length, notices: data.notices.length } : null;

  useEffect(() => { setQ(''); setMenuOpen(false); setContent(emptyContent); setMessage(''); setError(''); }, [page]);
  const kindInfo = contentPage ?? contentKinds[0];
  if (!kindInfo) return null;

  const ImageInput = ({ value, onChange, label = 'ছবির লিংক' }: { value: string; onChange: (v: string) => void; label?: string }) => (
    <div className="sm:col-span-2"><div className="flex gap-2"><input aria-label={label} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={field} /><label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"><Upload className="size-4" />{uploading ? '...' : 'আপলোড'}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pickImage(e.target.files?.[0], onChange)} /></label></div>{value && <img src={value} alt="" className="mt-2 h-20 rounded-lg object-cover" />}</div>
  );

  if (!session) return <AdminAuth onSignedIn={() => { setSession(true); setLoading(true); refresh(); }} />;

  const match = (row: object) => !q.trim() || JSON.stringify(row).toLowerCase().includes(q.trim().toLowerCase());
  const badge: Partial<Record<Tab, number>> = counts ? { admissions: counts.admissions, orders: counts.orders, messages: counts.messages } : {};
  const contentIcons: Record<ContentKind, typeof LayoutDashboard> = { teacher: Users, event: CalendarDays, gallery: Images, video: Video, testimonial: MessageCircleHeart, achievement: Trophy, facility: Building2, meal: Utensils, stat: BarChart3, safety: ShieldCheck, fee: Banknote, faq: HelpCircle, program: BookMarked, news: Newspaper };
  const heroes: Record<Tab, [string, string]> = {
    overview: ['স্বাগতম, অ্যাডমিন', 'ওয়েবসাইটের সব কার্যক্রমের এক নজরে সারসংক্ষেপ।'],
    admissions: admissionId ? ['ভর্তি আবেদনের বিস্তারিত', 'শিক্ষার্থী, অভিভাবক ও জমা দেওয়া কাগজপত্র।'] : ['ভর্তি আবেদন ব্যবস্থাপনা', 'নতুন আবেদন যাচাই, কাগজপত্র দেখা ও অবস্থা হালনাগাদ করুন।'],
    orders: ['বইয়ের অর্ডার', 'অর্ডার, পেমেন্ট ট্রানজেকশন ও ডেলিভারির অবস্থা পরিচালনা করুন।'],
    messages: ['যোগাযোগ বার্তা', 'দর্শকদের পাঠানো প্রশ্ন ও বার্তার উত্তর দিন।'],
    notices: ['নোটিশ বোর্ড', 'নতুন নোটিশ প্রকাশ, সম্পাদনা ও মুছে ফেলুন।'],
    books: ['বইয়ের দোকান', 'বই যোগ, দাম, প্রচ্ছদ ও বিস্তারিত পরিচালনা করুন।'],
    content: [kindInfo.label, `ওয়েবসাইটে দেখানো ${kindInfo.label} যোগ, সম্পাদনা ও লুকান।`],
    settings: ['ওয়েবসাইট সেটিংস', 'ফোন, ইমেইল, ঠিকানা, পেমেন্ট নম্বর ও সামাজিক লিংক।'],
  };
  const go = (t: Tab, k?: ContentKind) => {
    if (t === 'overview') void navigate({ to: '/Eternelfreeadmingo' });
    else void navigate({ to: '/Eternelfreeadmingo/$page', params: { page: (t === 'content' ? k ?? 'teacher' : t) as AdminPageKey } });
    setContent(emptyContent); setMessage(''); setError(''); setQ(''); setMenuOpen(false);
  };

  const navBtn = (active: boolean) => `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors ${active ? 'bg-gold font-bold text-primary' : 'text-primary-foreground hover:bg-primary-raised'}`;
  const logout = async () => { await supabase.auth.signOut(); sessionStorage.removeItem(ALIVE_KEY); setSession(false); };
  const BannerIcon = tab === 'content' ? contentIcons[kind] : tabs.find(([key]) => key === tab)?.[2] ?? LayoutDashboard;
  const hasForm = ['notices', 'books', 'content', 'settings'].includes(tab);
  const bannerAction = tab === 'overview' ? 'ভর্তি আবেদন দেখুন' : tab === 'settings' ? 'তথ্য সম্পাদনা করুন' : hasForm ? 'তথ্য যোগ করুন' : 'তালিকা দেখুন';
  const focusPageContent = () => {
    if (tab === 'overview' || admissionId) { go('admissions'); return; }
    const section = document.getElementById('admin-page-content');
    if (!section) return;
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    section.querySelector<HTMLElement>(hasForm ? 'form input, form textarea' : 'select, input')?.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-screen bg-secondary">
      {menuOpen && <button type="button" aria-label="মেনু বন্ধ করুন" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-secondary lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-primary text-primary-foreground shadow-elegant transition-transform lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 border-b border-primary-raised p-4">
          <img src={logoAsset.url} alt="Eternal Freedom লোগো" className="size-11 shrink-0 rounded-full bg-background object-contain p-0.5" />
          <div className="min-w-0 flex-1"><div className="font-brand font-bold">Eternal Freedom</div><div className="text-[11px] text-gold">অ্যাডমিন প্যানেল</div></div>
          <button type="button" aria-label="বন্ধ" onClick={() => setMenuOpen(false)} className="lg:hidden"><X className="size-5" /></button>
        </div>
        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto p-3">
          <div><p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gold">প্রধান</p>
            {tabs.filter(([k]) => ['overview', 'admissions', 'orders', 'messages'].includes(k)).map(([k, l, Icon]) => <button key={k} type="button" onClick={() => go(k)} className={navBtn(tab === k)}><Icon className="size-4 shrink-0" /><span className="flex-1 text-start">{l}</span>{!!badge[k] && <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${tab === k ? 'bg-primary text-primary-foreground' : 'bg-gold text-primary'}`}>{(badge[k] ?? 0).toLocaleString('bn-BD')}</span>}</button>)}
          </div>
          <div><p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gold">প্রকাশনা</p>
            {tabs.filter(([k]) => ['notices', 'books'].includes(k)).map(([k, l, Icon]) => <button key={k} type="button" onClick={() => go(k)} className={navBtn(tab === k)}><Icon className="size-4 shrink-0" /><span className="flex-1 text-start">{l}</span></button>)}
          </div>
          <div><p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gold">ওয়েবসাইটের তথ্য</p>
            {contentKinds.map((k) => { const Icon = contentIcons[k.key]; return <button key={k.key} type="button" onClick={() => go('content', k.key)} className={navBtn(tab === 'content' && kind === k.key)}><Icon className="size-4 shrink-0" /><span className="flex-1 text-start">{k.label}</span></button>; })}
          </div>
          <div><p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gold">সিস্টেম</p>
            <button type="button" onClick={() => go('settings')} className={navBtn(tab === 'settings')}><Settings className="size-4 shrink-0" /><span className="flex-1 text-start">সেটিংস</span></button>
          </div>
        </nav>
        <div className="space-y-1 border-t border-primary-raised p-3">
          <a href="/" target="_blank" rel="noreferrer" className={navBtn(false)}><ExternalLink className="size-4" />ওয়েবসাইট দেখুন</a>
          <button type="button" onClick={logout} className={navBtn(false)}><LogOut className="size-4" />লগআউট</button>
        </div>
      </aside>
      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-3 py-2.5 sm:px-6">
          <button type="button" aria-label="মেনু খুলুন" onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground lg:hidden"><Menu className="size-5" /></button>
          <p className="min-w-0 flex-1 truncate font-display text-base font-bold text-primary">{heroes[tab][0]}</p>
          {(tab === 'orders' || tab === 'messages') && <label className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম, ফোন বা নম্বর খুঁজুন" className="h-10 w-64 rounded-xl border-2 border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>}
          <button type="button" onClick={logout} className="hidden items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-primary sm:flex"><LogOut className="size-4" />লগআউট</button>
        </header>
        <main className="min-w-0 p-3 sm:p-6 lg:p-8">
          <section aria-label="পাতার ব্যানার" className="mb-6 overflow-hidden rounded-lg border border-primary-raised bg-primary text-primary-foreground sm:mb-7">
            <div className={tab === 'admissions' ? "grid min-w-0 gap-3 border-b border-primary-raised px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5" : "flex flex-wrap items-center justify-between gap-3 border-b border-primary-raised px-5 py-3 sm:px-7"}>
              <p className={tab === 'admissions' ? "w-fit max-w-full rounded-md border border-primary-raised bg-primary-raised px-3 py-1.5 font-brand text-[11px] font-semibold leading-5 text-gold" : "font-brand text-xs font-semibold leading-5 text-gold"}>Eternal Freedom Institute Al Islamia</p>
              <p className="flex shrink-0 items-center gap-2 text-xs"><CalendarDays className="size-4 shrink-0 text-gold" />{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            {tab === 'admissions' ? <div className="grid min-w-0 items-center gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:items-center sm:gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-gold bg-primary-raised text-gold sm:size-12"><BannerIcon className="size-5 sm:size-6" /></div>
                <div className="min-w-0">
                  <h1 className="font-teacher text-xl font-bold leading-snug sm:text-2xl">{heroes[tab][0]}</h1>
                  <p className="mt-1.5 max-w-xl text-xs leading-6 sm:text-sm">{heroes[tab][1]}</p>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-2 gap-2 justify-self-end lg:shrink-0">
                <Button type="button" variant="secondary" disabled={!data} onClick={focusPageContent} className="h-10 gap-1.5 bg-gold px-3 text-xs text-primary hover:bg-gold-light sm:px-4 sm:text-sm"><ArrowRight className="size-4" />{bannerAction}</Button>
                <Button type="button" variant="outline" disabled={loading || !data} onClick={async () => { setLoading(true); await refresh(); }} className="h-10 gap-1.5 border-primary-foreground bg-primary px-3 text-xs text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground sm:px-4 sm:text-sm"><RefreshCw className="size-4" />তথ্য হালনাগাদ</Button>
              </div>
            </div> : <div className="flex items-start gap-4 px-5 py-6 sm:gap-5 sm:px-7 sm:py-7">
              <div className="hidden size-14 shrink-0 place-items-center rounded-lg border border-gold bg-primary-raised text-gold sm:grid"><BannerIcon className="size-7" /></div>
              <div className="min-w-0 flex-1">
                <h1 className="font-teacher text-2xl font-bold leading-snug sm:text-3xl">{tab === 'overview' ? 'সারসংক্ষেপ' : heroes[tab][0]}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7">{tab === 'overview' ? 'ভর্তি, অর্ডার ও প্রকাশনার সর্বশেষ হিসাব' : heroes[tab][1]}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" disabled={!data} onClick={focusPageContent} className="h-10 bg-gold px-4 text-primary hover:bg-gold-light">{hasForm ? <Pencil /> : <ArrowRight />}{bannerAction}</Button>
                  <Button type="button" variant="outline" disabled={loading || !data} onClick={async () => { setLoading(true); await refresh(); }} className="h-10 border-primary-foreground bg-primary px-4 text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground"><RefreshCw />তথ্য হালনাগাদ</Button>
                </div>
              </div>
            </div>}
          </section>
          {(tab === 'orders' || tab === 'messages') && <label className="relative mb-4 block sm:hidden"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম, ফোন বা নম্বর খুঁজুন" className="h-11 w-full rounded-xl border-2 border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>}
          {message && <p className="mb-4 rounded-lg bg-accent p-3 text-sm text-primary">{message}</p>}
          {error && <p role="alert" className="mb-4 rounded-lg bg-secondary p-3 text-sm text-destructive">{error}</p>}
          {loading && <p>তথ্য আসছে...</p>}
          <div id="admin-page-content" className="scroll-mt-24">
          <AdminPageContext.Provider value={data && counts ? <>
            {tab === 'overview' && <AdminOverview data={data} go={go} refresh={refresh} />}

            {tab === 'admissions' && <AdminAdmissions admissionId={admissionId} admissions={data.admissions} trashed={trashed} query={q} setQuery={setQ} openDoc={openDoc} onStatusChange={(id, status) => run({ kind: 'admission', id, status }, 'অবস্থা হালনাগাদ হয়েছে।')} onTrash={(id, trashed) => run({ kind: 'admission_trash', id, trashed }, trashed ? 'আবেদন ডিলিট ফাইলে সরানো হয়েছে।' : 'আবেদন ফিরিয়ে আনা হয়েছে।')} />}

             {tab === 'orders' && <AdminOrders orders={data.orders} books={data.books} query={q} onSave={(change) => run(change, 'অর্ডারের তথ্য সংরক্ষিত হয়েছে।')} />}

            {tab === 'messages' && <div className="space-y-3">{data.messages.filter(match).map((m) => <Card key={m.id}><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><strong className="text-primary">{m.name}</strong> · {m.subject}<p className="text-sm text-muted-foreground">{m.phone}{m.email ? ` · ${m.email}` : ''} · {new Date(m.created_at).toLocaleString('bn-BD')}</p></div><div className="flex gap-2"><select aria-label="বার্তার অবস্থা" value={m.status} onChange={(e) => run({ kind: 'message', id: m.id, status: e.target.value as 'নতুন' }, 'হালনাগাদ হয়েছে।')} className="bg-secondary px-3 py-2 text-sm">{['নতুন', 'উত্তর দেওয়া হয়েছে', 'সম্পন্ন'].map((x) => <option key={x}>{x}</option>)}</select><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('বার্তাটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'message', id: m.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></div><p className="mt-3 whitespace-pre-line text-sm leading-7">{m.message}</p></Card>)}{!data.messages.length && <p>এখনো কোনো বার্তা নেই।</p>}</div>}

            {tab === 'notices' && <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"><Card><h2 className="mb-4 font-semibold text-primary">{notice.id ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ'}</h2><form onSubmit={async (e) => { e.preventDefault(); if (await run({ kind: 'notice', id: notice.id || undefined, title: notice.title, body: notice.body, category: notice.category, file_url: notice.file_url || undefined }, 'নোটিশ সংরক্ষণ হয়েছে।')) setNotice(emptyNotice); }} className="space-y-3"><input required minLength={3} aria-label="শিরোনাম" placeholder="শিরোনাম" value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} className={field} /><select aria-label="বিভাগ" value={notice.category} onChange={(e) => setNotice({ ...notice, category: e.target.value })} className={field}>{['সাধারণ', 'ভর্তি', 'পরীক্ষা', 'ছুটি', 'অভিভাবক সভা', 'গুরুত্বপূর্ণ'].map((c) => <option key={c}>{c}</option>)}</select><textarea aria-label="বিস্তারিত" placeholder="বিস্তারিত" value={notice.body} onChange={(e) => setNotice({ ...notice, body: e.target.value })} className={`${field} min-h-32`} /><input aria-label="ফাইলের লিংক" placeholder="সংযুক্ত ফাইলের লিংক (ঐচ্ছিক)" value={notice.file_url} onChange={(e) => setNotice({ ...notice, file_url: e.target.value })} className={field} /><div className="flex gap-2"><Button type="submit">সংরক্ষণ</Button>{notice.id && <Button type="button" variant="secondary" onClick={() => setNotice(emptyNotice)}>বাতিল</Button>}</div></form></Card><div className="space-y-3">{data.notices.map((n) => <Card key={n.id} className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="text-xs text-gold">{n.category} · {new Date(n.published_at).toLocaleDateString('bn-BD')}</span><h3 className="font-semibold text-primary">{n.title}</h3></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setNotice({ id: n.id, title: n.title, body: n.body, category: n.category, file_url: n.file_url ?? '' })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('নোটিশটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'notice', id: n.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}</div></div>}

            {tab === 'books' && <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"><Card><h2 className="mb-4 font-semibold text-primary">{book.id ? 'বই সম্পাদনা' : 'নতুন বই'}</h2><form onSubmit={async (e) => { e.preventDefault(); if (await run({ kind: 'book', id: book.id || undefined, title: book.title, description: book.description, details: book.details || undefined, author: book.author || undefined, pages: book.pages ? Number(book.pages) : undefined, price: Number(book.price), cover_url: book.cover_url || undefined, active: book.active }, 'বই সংরক্ষণ হয়েছে।')) setBook(emptyBook); }} className="grid gap-3 sm:grid-cols-2"><input required aria-label="বইয়ের নাম" placeholder="বইয়ের নাম" value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} className={`${field} sm:col-span-2`} /><input aria-label="লেখক" placeholder="লেখক" value={book.author} onChange={(e) => setBook({ ...book, author: e.target.value })} className={field} /><input aria-label="পৃষ্ঠা" type="number" min={0} placeholder="পৃষ্ঠা সংখ্যা" value={book.pages} onChange={(e) => setBook({ ...book, pages: e.target.value })} className={field} /><input required aria-label="মূল্য" type="number" min={0} placeholder="মূল্য (৳)" value={book.price} onChange={(e) => setBook({ ...book, price: e.target.value })} className={field} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={book.active} onChange={(e) => setBook({ ...book, active: e.target.checked })} />ওয়েবসাইটে দেখাবে</label><textarea aria-label="সংক্ষিপ্ত বিবরণ" placeholder="সংক্ষিপ্ত বিবরণ" value={book.description} onChange={(e) => setBook({ ...book, description: e.target.value })} className={`${field} min-h-20 sm:col-span-2`} /><textarea aria-label="বিস্তারিত" placeholder="বইয়ের বিস্তারিত" value={book.details} onChange={(e) => setBook({ ...book, details: e.target.value })} className={`${field} min-h-28 sm:col-span-2`} /><ImageInput label="প্রচ্ছদের ছবি" value={book.cover_url} onChange={(v) => setBook((b) => ({ ...b, cover_url: v }))} /><div className="flex gap-2 sm:col-span-2"><Button type="submit">সংরক্ষণ</Button>{book.id && <Button type="button" variant="secondary" onClick={() => setBook(emptyBook)}>বাতিল</Button>}</div></form></Card><div className="space-y-3">{data.books.map((b) => <Card key={b.id} className="flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{b.cover_url ? <img src={b.cover_url} alt="" className="h-14 w-10 rounded object-cover" /> : <div className="grid h-14 w-10 place-items-center rounded bg-secondary"><BookOpen className="size-4 text-gold" /></div>}<div className="min-w-0"><h3 className="truncate font-semibold text-primary">{b.title}</h3><p className="text-xs text-muted-foreground">৳ {Number(b.price).toLocaleString('bn-BD')} · {b.active ? 'প্রকাশিত' : 'লুকানো'}</p></div></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setBook({ id: b.id, title: b.title, description: b.description, details: b.details ?? '', author: b.author ?? '', pages: b.pages ? String(b.pages) : '', price: String(b.price), cover_url: b.cover_url ?? '', active: b.active })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('বইটি মুছে ফেলবেন?') && run({ kind: 'delete', target: 'book', id: b.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}</div></div>}

            {tab === 'content' && <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
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
                <div className="space-y-3">{kindItems.map((c) => <Card key={c.id} className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3">{c.image_url && <img src={c.image_url} alt="" className="size-12 rounded-lg object-cover" />}<div className="min-w-0"><h3 className="font-semibold text-primary">{c.title}</h3><p className="text-xs text-muted-foreground">{[c.detail, c.category].filter(Boolean).join(' · ')}{c.published ? '' : ' · লুকানো'}</p></div></div><div className="flex shrink-0"><Button variant="ghost" size="icon" aria-label="সম্পাদনা" onClick={() => setContent({ id: c.id, title: c.title, body: c.body, image_url: c.image_url ?? '', detail: c.detail ?? '', category: c.category ?? '', published: c.published, sort_order: c.sort_order })}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label="মুছুন" onClick={() => window.confirm('এই তথ্য মুছে ফেলবেন?') && run({ kind: 'delete', target: 'content', id: c.id }, 'মুছে ফেলা হয়েছে।')}><Trash2 className="size-4" /></Button></div></Card>)}{!kindItems.length && <p className="text-sm text-muted-foreground">এই বিভাগে এখনো কোনো তথ্য নেই।</p>}</div>
              </div>
            </div>}

            {tab === 'settings' && <Card className="max-w-3xl"><form onSubmit={async (e) => { e.preventDefault(); await run({ kind: 'settings', values: settings }, 'সেটিংস সংরক্ষণ হয়েছে। ওয়েবসাইট রিফ্রেশ করলে দেখা যাবে।'); }} className="grid gap-4 sm:grid-cols-2">{settingFields.map(([k, l]) => <label key={k} className="text-sm font-semibold text-primary">{l}<input value={settings[k] ?? ''} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} className={`${field} mt-1.5 font-normal`} /></label>)}<div className="sm:col-span-2"><Button type="submit">সেটিংস সংরক্ষণ</Button></div></form></Card>}
          </> : null}><Outlet /></AdminPageContext.Provider>
          </div>
        </main>
      </div>
    </div>
  );
}
