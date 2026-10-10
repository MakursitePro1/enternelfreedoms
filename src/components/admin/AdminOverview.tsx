import { useMemo, useState } from 'react';
import { ArrowUpRight, Banknote, BookOpen, GraduationCap, ShoppingBag, MessageSquare, Users, Images, Megaphone, RefreshCw, Clock3, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import type { getAdminData } from '@/lib/platform.functions';
import type { AdminTab } from '@/lib/admin-pages';
import type { ContentKind } from '@/lib/institution-content';

type Data = Awaited<ReturnType<typeof getAdminData>>;
const number = (n: number) => n.toLocaleString('bn-BD');
const money = (n: number) => `৳ ${number(n)}`;
const date = (d: string) => new Date(d).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

export function AdminOverview({ data, go, refresh }: { data: Data; go: (tab: AdminTab, kind?: ContentKind) => void; refresh: () => Promise<void> }) {
  const [days, setDays] = useState('30');
  const [refreshing, setRefreshing] = useState(false);
  const summary = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - Number(days) + 1);
    const recent = (created: string) => new Date(created) >= start;
    const admissions = data.admissions.filter((a) => recent(a.created_at));
    const orders = data.orders.filter((o) => recent(o.created_at));
    const messages = data.messages.filter((m) => recent(m.created_at));
    const completed = data.orders.filter((o) => o.status === 'সম্পন্ন');
    const chart = Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const inMonth = (s: string) => { const d = new Date(s); return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth(); };
      return { month: month.toLocaleDateString('bn-BD', { month: 'short' }), admissions: data.admissions.filter((a) => inMonth(a.created_at)).length, orders: data.orders.filter((o) => inMonth(o.created_at)).length };
    });
    return { admissions, orders, messages, completed, chart, completedTotal: completed.reduce((sum, o) => sum + Number(o.total), 0), periodTotal: orders.filter((o) => o.status === 'সম্পন্ন').reduce((sum, o) => sum + Number(o.total), 0) };
  }, [data, days]);
  const pending = { admissions: data.admissions.filter((a) => a.status === 'নতুন').length, orders: data.orders.filter((o) => o.status === 'নতুন').length, messages: data.messages.filter((m) => m.status === 'নতুন').length };
  const metrics = [
    { label: 'মোট ভর্তি আবেদন', value: number(data.admissions.length), detail: `নির্বাচিত সময়ে ${number(summary.admissions.length)}টি আবেদন`, icon: GraduationCap, tab: 'admissions' as const },
    { label: 'মোট বইয়ের অর্ডার', value: number(data.orders.length), detail: `নির্বাচিত সময়ে ${number(summary.orders.length)}টি অর্ডার`, icon: ShoppingBag, tab: 'orders' as const },
    { label: 'সম্পন্ন অর্ডারের মূল্য', value: money(summary.completedTotal), detail: `নির্বাচিত সময়ে ${money(summary.periodTotal)}`, icon: Banknote, tab: 'orders' as const },
    { label: 'যোগাযোগ বার্তা', value: number(data.messages.length), detail: `নির্বাচিত সময়ে ${number(summary.messages.length)}টি বার্তা`, icon: MessageSquare, tab: 'messages' as const },
  ];
  const publication = [
    { label: 'সক্রিয় বই', count: data.books.filter((b) => b.active).length, total: data.books.length, icon: BookOpen, tab: 'books' as const },
    { label: 'প্রকাশিত শিক্ষক', count: data.content.filter((c) => c.kind === 'teacher' && c.published).length, total: data.content.filter((c) => c.kind === 'teacher').length, icon: Users, tab: 'content' as const, kind: 'teacher' as const },
    { label: 'গ্যালারি ছবি', count: data.content.filter((c) => c.kind === 'gallery' && c.published).length, total: data.content.filter((c) => c.kind === 'gallery').length, icon: Images, tab: 'content' as const, kind: 'gallery' as const },
    { label: 'নোটিশ', count: data.notices.length, total: data.notices.length, icon: Megaphone, tab: 'notices' as const },
  ];
  const sectionTitle = 'font-display text-lg font-bold text-primary';
  return <div className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className={sectionTitle}>কার্যক্রমের হিসাব</h2><p className="mt-1 text-xs text-muted-foreground">সর্বমোট তথ্য ও নির্বাচিত সময়ের কার্যক্রম</p></div>
      <div className="flex items-center gap-2">
        <select aria-label="হিসাবের সময়সীমা" value={days} onChange={(e) => setDays(e.target.value)} className="h-10 border border-border bg-background px-3 text-sm font-semibold text-primary"><option value="7">গত ৭ দিন</option><option value="30">গত ৩০ দিন</option><option value="90">গত ৯০ দিন</option></select>
        <Button variant="outline" size="icon" aria-label="হিসাব হালনাগাদ করুন" title="হিসাব হালনাগাদ করুন" disabled={refreshing} onClick={async () => { setRefreshing(true); try { await refresh(); } finally { setRefreshing(false); } }} className="size-10"><RefreshCw className={refreshing ? 'animate-spin' : ''} /></Button>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => <article key={m.label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-lg bg-gold-soft text-gold-deep"><m.icon className="size-5" /></span><Button variant="ghost" size="icon" title={m.label} aria-label={`${m.label} দেখুন`} onClick={() => go(m.tab)} className="size-8 text-muted-foreground"><ArrowUpRight /></Button></div>
        <p className="mt-4 text-sm font-semibold text-muted-foreground">{m.label}</p><p className="mt-1 break-words font-brand text-2xl font-bold text-primary sm:text-3xl">{m.value}</p><p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">{m.detail}</p>
      </article>)}
    </div>

    <section aria-label="অপেক্ষমাণ কাজ" className="border-y border-border py-5">
      <div className="mb-4 flex items-center gap-2"><Clock3 className="size-5 text-gold-deep" /><h2 className={sectionTitle}>তোমার মনোযোগ প্রয়োজন</h2><span className="rounded-full bg-primary px-2.5 text-sm font-bold text-primary-foreground">{number(pending.admissions + pending.orders + pending.messages)}</span></div>
      <div className="grid gap-3 sm:grid-cols-3">{([
        ['admissions', 'নতুন ভর্তি আবেদন', pending.admissions, GraduationCap], ['orders', 'নতুন অর্ডার', pending.orders, ShoppingBag], ['messages', 'উত্তরের অপেক্ষায় বার্তা', pending.messages, MessageSquare],
      ] as const).map(([tab, label, count, Icon]) => <Button key={tab} variant="outline" onClick={() => go(tab)} className="h-auto min-h-16 justify-start whitespace-normal border-border bg-card px-4 py-3 text-start hover:bg-accent"><Icon className="text-gold-deep" /><span className="min-w-0 flex-1 text-sm">{label}</span><span className="text-xl font-bold">{number(count)}</span><ArrowUpRight className="text-muted-foreground" /></Button>)}</div>
    </section>

    <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
      <section className="min-w-0"><h2 className={sectionTitle}>গত ছয় মাসের কার্যক্রম</h2><div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-chart-1" />ভর্তি আবেদন</span><span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-chart-4" />বইয়ের অর্ডার</span></div>
        <div className="mt-5 h-64 w-full min-w-0"><ResponsiveContainer width="100%" height="100%"><BarChart data={summary.chart} margin={{ top: 12, right: 0, bottom: 0, left: -25 }}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tickFormatter={number} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip cursor={false} formatter={(value: number, name: string) => [number(value), name === 'admissions' ? 'ভর্তি আবেদন' : 'বইয়ের অর্ডার']} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: 8, color: 'var(--foreground)' }} /><Bar dataKey="admissions" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} /><Bar dataKey="orders" fill="var(--chart-4)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>
      </section>
      <section className="min-w-0"><h2 className={sectionTitle}>আবেদন ও অর্ডারের অবস্থা</h2><div className="mt-4 space-y-5">{[
        { label: 'ভর্তি আবেদন', rows: data.admissions, statuses: ['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল'], tab: 'admissions' as const },
        { label: 'বইয়ের অর্ডার', rows: data.orders, statuses: ['নতুন', 'প্রক্রিয়াধীন', 'পাঠানো হয়েছে', 'সম্পন্ন', 'বাতিল'], tab: 'orders' as const },
      ].map((group) => <div key={group.label}><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold text-primary">{group.label}</h3><Button variant="link" size="sm" onClick={() => go(group.tab)} className="h-auto px-0">সব দেখুন <ArrowUpRight /></Button></div><div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">{group.statuses.map((status) => { const count = group.rows.filter((r) => r.status === status).length; return <div key={status}><div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{status}</span><span className="font-bold text-primary">{number(count)}</span></div><progress aria-label={`${group.label}: ${status}`} value={count} max={Math.max(1, group.rows.length)} className="admin-progress block h-1.5 w-full overflow-hidden rounded-full" /></div>; })}</div></div>)}</div></section>
    </div>

    <section className="border-y border-border py-6"><h2 className={sectionTitle}>ওয়েবসাইটের প্রকাশনা</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{publication.map((p) => <Button key={p.label} variant="outline" onClick={() => go(p.tab, p.kind)} className="h-auto justify-start whitespace-normal bg-card p-4 text-start"><p.icon className="text-gold-deep" /><span className="min-w-0 flex-1"><span className="block text-sm">{p.label}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">মোট {number(p.total)}টি</span></span><span className="text-2xl font-bold text-primary">{number(p.count)}</span></Button>)}</div></section>

    <div className="grid gap-8 xl:grid-cols-2">{[
      { title: 'সাম্প্রতিক ভর্তি আবেদন', tab: 'admissions' as const, empty: 'এখনো কোনো আবেদন নেই।', rows: data.admissions.slice(0, 5).map((a) => ({ id: a.id, title: a.student_name, detail: `${a.reference} · ${a.program}`, status: a.status, date: a.created_at })) },
      { title: 'সাম্প্রতিক বইয়ের অর্ডার', tab: 'orders' as const, empty: 'এখনো কোনো অর্ডার নেই।', rows: data.orders.slice(0, 5).map((o) => ({ id: o.id, title: o.customer_name, detail: `${o.reference} · ${money(Number(o.total))}`, status: o.status, date: o.created_at })) },
    ].map((group) => <section key={group.title} className="min-w-0"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className={sectionTitle}>{group.title}</h2><Button variant="link" size="sm" onClick={() => go(group.tab)} className="px-0">সব দেখুন <ArrowUpRight /></Button></div><div className="mt-2 divide-y divide-border">{group.rows.map((r) => <div key={r.id} className="flex items-start gap-3 py-4"><span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-primary"><FileIcon tab={group.tab} /></span><div className="min-w-0 flex-1"><h3 className="break-words text-sm font-bold text-primary">{r.title}</h3><p className="mt-1 break-words text-xs text-muted-foreground">{r.detail}</p></div><div className="shrink-0 text-end"><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${r.status === 'বাতিল' ? 'bg-secondary text-destructive' : r.status === 'নতুন' ? 'bg-gold-soft text-gold-deep' : 'bg-accent text-primary'}`}>{r.status}</span><p className="mt-2 text-[10px] text-muted-foreground">{date(r.date)}</p></div></div>)}{!group.rows.length && <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><CheckCircle2 className="size-4" />{group.empty}</div>}</div></section>)}</div>
  </div>;
}

function FileIcon({ tab }: { tab: AdminTab }) { return tab === 'admissions' ? <GraduationCap className="size-4" /> : <ShoppingBag className="size-4" />; }