import { useMemo, useState } from 'react';
import { Inbox, MailOpen, CheckCircle2, Clock3, Phone, Mail, MessageCircle, Trash2, Search, User, CalendarDays, ArrowLeft, Tag } from 'lucide-react';

export type MessageRow = { id: string; name: string; phone: string; email: string | null; subject: string; message: string; status: string; created_at: string };
const STATUSES = ['নতুন', 'উত্তর দেওয়া হয়েছে', 'সম্পন্ন'] as const;

const ago = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
function fictionalMessages(): MessageRow[] {
  const rows: [string, string, string | null, string, string, string, number][] = [
    ['মোঃ রফিকুল ইসলাম', '01XXXXX4521', 'rafiq.islam@example.com', 'ভর্তির শেষ তারিখ জানতে চাই', 'আসসালামু আলাইকুম। আমার ছেলের বয়স ৯ বছর। হিফজ বিভাগে ভর্তির শেষ তারিখ কবে এবং ভর্তি পরীক্ষা হবে কিনা জানালে উপকৃত হব।', 'নতুন', 2],
    ['নাসরিন আক্তার', '01XXXXX7810', null, 'আবাসিক সাক্ষাতের নিয়ম', 'ভর্তির পর প্রথম কত দিন পর সন্তানের সাথে দেখা করা যাবে? আর ফোনে কথা বলার নির্দিষ্ট সময় আছে কি?', 'নতুন', 5],
    ['আব্দুল্লাহ আল মামুন', '01XXXXX3365', 'mamun.edu@example.com', 'Magic English বইয়ের ডেলিভারি', 'আমি গতকাল Magic English বইটি অর্ডার করেছি। ময়মনসিংহ সদরে ডেলিভারি পেতে কত দিন লাগবে?', 'উত্তর দেওয়া হয়েছে', 20],
    ['হাফেজা সুমাইয়া', '01XXXXX9042', null, 'মাসিক খরচের বিস্তারিত', 'মাসিক ১২,৫০০ টাকার মধ্যে খাবার, আবাসন ও পড়াশোনার খরচ কীভাবে ভাগ করা আছে জানতে চাই।', 'নতুন', 28],
    ['কামরুল হাসান', '01XXXXX1187', 'kamrul.h@example.com', 'ক্যাম্পাস পরিদর্শন', 'শুক্রবার সকালে পরিবারসহ ক্যাম্পাস দেখতে আসতে চাই। কোন সময় আসলে ভালো হয়?', 'সম্পন্ন', 52],
    ['ফারহানা ইয়াসমিন', '01XXXXX6674', null, 'মেয়েদের বিভাগ আছে কি?', 'আপনাদের প্রতিষ্ঠানে মেয়েদের জন্য আলাদা আবাসিক ব্যবস্থা আছে কিনা জানাবেন।', 'উত্তর দেওয়া হয়েছে', 76],
    ['মাওলানা ইউসুফ আলী', '01XXXXX2209', 'yusuf.ali@example.com', 'শিক্ষক নিয়োগ সংক্রান্ত', 'আমি দাওরায়ে হাদিস সম্পন্ন করেছি এবং ৮ বছরের শিক্ষকতার অভিজ্ঞতা আছে। শিক্ষক নিয়োগের কোনো সুযোগ থাকলে জানাবেন।', 'নতুন', 101],
    ['শাহীনুর রহমান', '01XXXXX5530', null, 'অসুস্থতার সময় চিকিৎসা', 'শিক্ষার্থী অসুস্থ হলে কী ব্যবস্থা নেওয়া হয়? আইসোলেশন ওয়ার্ডে কি সার্বক্ষণিক দেখাশোনা থাকে?', 'সম্পন্ন', 150],
  ];
  return rows.map(([name, phone, email, subject, message, status, h], i) => ({ id: `layout-msg-${i + 1}`, name, phone, email, subject, message, status, created_at: ago(h) }));
}

const tone: Record<string, string> = {
  'নতুন': 'bg-gold text-primary',
  'উত্তর দেওয়া হয়েছে': 'bg-primary text-primary-foreground',
  'সম্পন্ন': 'bg-secondary text-primary border border-border',
};
const when = (d: string) => new Date(d).toLocaleString('bn-BD', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const initials = (n: string) => n.replace(/^(মোঃ|মাওলানা|হাফেজা)\s*/, '').trim().charAt(0);

export function AdminMessages({ messages, onStatus, onDelete }: { messages: MessageRow[]; onStatus: (id: string, status: string) => void; onDelete: (id: string) => void }) {
  const [layouts, setLayouts] = useState<MessageRow[]>(fictionalMessages);
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const [chosenId, setChosenId] = useState<string | null>(null);
  const rows = useMemo(() => [...messages, ...layouts].sort((a, b) => b.created_at.localeCompare(a.created_at)), [messages, layouts]);
  const shown = rows.filter((m) => (!filter || m.status === filter) && (!q.trim() || `${m.name} ${m.phone} ${m.subject} ${m.message} ${m.email ?? ''}`.toLowerCase().includes(q.trim().toLowerCase())));
  const chosen = rows.find((m) => m.id === chosenId) ?? null;
  const isLocal = (id: string) => layouts.some((m) => m.id === id);
  const setStatus = (id: string, status: string) => isLocal(id) ? setLayouts((l) => l.map((m) => m.id === id ? { ...m, status } : m)) : onStatus(id, status);
  const remove = (id: string) => { if (!window.confirm('বার্তাটি মুছে ফেলবেন?')) return; if (isLocal(id)) setLayouts((l) => l.filter((m) => m.id !== id)); else onDelete(id); setChosenId(null); };
  const count = (s: string) => rows.filter((m) => m.status === s).length;
  const stats = [
    { label: 'মোট বার্তা', value: rows.length, Icon: Inbox, cls: 'bg-primary text-primary-foreground' },
    { label: 'নতুন', value: count('নতুন'), Icon: Clock3, cls: 'bg-gold text-primary' },
    { label: 'উত্তর দেওয়া', value: count('উত্তর দেওয়া হয়েছে'), Icon: MailOpen, cls: 'bg-card text-primary border border-border' },
    { label: 'সম্পন্ন', value: count('সম্পন্ন'), Icon: CheckCircle2, cls: 'bg-card text-primary border border-border' },
  ];
  const wa = (p: string) => `https://wa.me/88${p.replace(/\D/g, '').replace(/^88/, '')}`;

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
          {[['', 'সব বার্তা', rows.length] as const, ...STATUSES.map((s) => [s, s, count(s)] as const)].map(([v, l, c]) => <button key={l} type="button" onClick={() => setFilter(v)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${filter === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-primary'}`}>{l}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === v ? 'bg-gold text-primary' : 'bg-secondary'}`}>{c.toLocaleString('bn-BD')}</span></button>)}
        </div>
        <label className="relative block lg:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম, ফোন বা বিষয় খুঁজুন" className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>
      </div>
    </div>

    <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className={`space-y-2.5 ${chosen ? 'hidden lg:block' : ''}`}>
        {shown.map((m) => <button key={m.id} type="button" onClick={() => setChosenId(m.id)} className={`w-full rounded-2xl border p-3.5 text-start transition-colors ${chosenId === m.id ? 'border-primary bg-accent' : 'border-border bg-card hover:border-primary'}`}>
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">{initials(m.name)}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2"><strong className="truncate text-sm text-primary">{m.name}</strong><span className="shrink-0 text-[10.5px] text-muted-foreground">{when(m.created_at)}</span></div>
              <p className="truncate text-xs font-semibold">{m.subject}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{m.message}</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold ${tone[m.status] ?? tone['নতুন']}`}>{m.status}</span>
            </div>
          </div>
        </button>)}
        {!shown.length && <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">কোনো বার্তা পাওয়া যায়নি।</div>}
      </div>

      <div className={`${chosen ? '' : 'hidden lg:block'}`}>
        {chosen ? <article className="overflow-hidden rounded-2xl border border-border bg-card lg:sticky lg:top-24">
          <header className="bg-primary p-4 text-primary-foreground sm:p-5">
            <button type="button" onClick={() => setChosenId(null)} className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-primary lg:hidden"><ArrowLeft className="size-3.5" />তালিকা</button>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold text-lg font-bold text-primary">{initials(chosen.name)}</span><div className="min-w-0"><h3 className="truncate text-lg font-bold">{chosen.name}</h3><p className="text-xs opacity-80">{new Date(chosen.created_at).toLocaleString('bn-BD')}</p></div></div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${chosen.status === 'উত্তর দেওয়া হয়েছে' ? 'bg-background text-primary' : tone[chosen.status]}`}>{chosen.status}</span>
            </div>
          </header>
          <div className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[[User, 'নাম', chosen.name], [Phone, 'ফোন', chosen.phone], [Mail, 'ইমেইল', chosen.email ?? 'দেওয়া হয়নি'], [CalendarDays, 'পাঠানোর সময়', when(chosen.created_at)]].map(([Icon, l, v]) => { const I = Icon as typeof User; return <div key={l as string} className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary p-3"><I className="size-4 shrink-0 text-gold-deep" /><div className="min-w-0"><p className="text-[10.5px] text-muted-foreground">{l as string}</p><p className="truncate text-sm font-semibold text-primary">{v as string}</p></div></div>; })}
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep"><Tag className="size-3.5" />{chosen.subject}</p>
              <p className="whitespace-pre-line text-sm leading-7">{chosen.message}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary p-3">
              <p className="mb-2 text-xs font-bold text-primary">উত্তর দিন</p>
              <div className="flex flex-wrap gap-2">
                <a href={wa(chosen.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><MessageCircle className="size-4" />WhatsApp</a>
                <a href={`tel:${chosen.phone}`} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-primary"><Phone className="size-4" />কল করুন</a>
                {chosen.email && <a href={`mailto:${chosen.email}?subject=${encodeURIComponent('Re: ' + chosen.subject)}`} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-primary"><Mail className="size-4" />ইমেইল</a>}
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 text-xs font-bold text-primary">বার্তার অবস্থা</p>
              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((s) => <button key={s} type="button" onClick={() => setStatus(chosen.id, s)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${chosen.status === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-primary'}`}>{s}</button>)}
                <button type="button" onClick={() => remove(chosen.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-destructive hover:border-destructive"><Trash2 className="size-4" />মুছুন</button>
              </div>
            </div>
          </div>
        </article> : <div className="grid h-full min-h-72 place-items-center rounded-2xl border border-dashed border-border bg-card p-8 text-center"><div><MailOpen className="mx-auto size-10 text-gold-deep" /><p className="mt-3 text-sm font-semibold text-primary">একটি বার্তা বেছে নিন</p><p className="text-xs text-muted-foreground">বাম পাশের তালিকা থেকে বার্তা খুললে বিস্তারিত এখানে দেখা যাবে।</p></div></div>}
      </div>
    </div>
  </div>;
}
