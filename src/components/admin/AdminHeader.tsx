import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Banknote, BookOpen, ChevronRight, ExternalLink, GraduationCap, LayoutDashboard, LogOut, Menu, MessageSquare, Search, Settings, ShoppingBag, Users, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminPages, type AdminPageKey } from '@/lib/admin-pages';
import type { getAdminData } from '@/lib/platform.functions';

type Data = Awaited<ReturnType<typeof getAdminData>>;
type Result = { key: string; page: AdminPageKey; title: string; detail: string; terms: string; admissionId?: string };
const quickPages = [
  { page: 'overview', icon: LayoutDashboard }, { page: 'admissions', icon: GraduationCap },
  { page: 'orders', icon: ShoppingBag }, { page: 'messages', icon: MessageSquare },
  { page: 'payments', icon: Banknote }, { page: 'settings', icon: Settings },
] as const;
function iconFor(page: AdminPageKey) { return quickPages.find((item) => item.page === page)?.icon ?? (page === 'books' ? BookOpen : page === 'teacher' ? Users : FileText); }

export function AdminHeader({ title, page, data, onMenu, onNavigate, onLogout }: { title: string; page: string; data: Data | null; onMenu: () => void; onNavigate: (page: AdminPageKey, admissionId?: string) => void; onLogout: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { setOpen(false); setQuery(''); setActive(-1); }, [page]);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  const indexed = useMemo(() => {
    const pages: Result[] = Object.entries(adminPages).map(([key, label]) => ({ key: `page-${key}`, page: key as AdminPageKey, title: label, detail: 'মেনু পেজ', terms: `${label} ${key}` }));
    if (!data) return pages;
    const rows: Result[] = [
      ...data.admissions.map((row) => ({ key: row.id, page: 'admissions' as const, title: row.student_name, detail: `${row.reference} · ${row.program} · ${row.status}`, terms: `${row.student_name} ${row.guardian_name} ${row.reference} ${row.phone} ${row.program}`, admissionId: row.id })),
      ...data.orders.map((row) => ({ key: row.id, page: 'orders' as const, title: row.customer_name, detail: `${row.reference} · ${row.status}`, terms: `${row.customer_name} ${row.reference} ${row.phone} ${row.payment_reference ?? ''}` })),
      ...data.books.map((row) => ({ key: row.id, page: 'books' as const, title: row.title, detail: `${row.author ?? ''} · ৳ ${Number(row.price).toLocaleString('bn-BD')}`, terms: `${row.title} ${row.author ?? ''} ${row.description ?? ''}` })),
      ...data.notices.map((row) => ({ key: row.id, page: 'notices' as const, title: row.title, detail: row.body.slice(0, 120), terms: `${row.title} ${row.body} ${row.category}` })),
      ...data.messages.map((row) => ({ key: row.id, page: 'messages' as const, title: `${row.name} · ${row.subject}`, detail: row.message.slice(0, 120), terms: `${row.name} ${row.subject} ${row.message} ${row.phone}` })),
      ...data.content.filter((row) => row.kind in adminPages).map((row) => ({ key: row.id, page: row.kind as AdminPageKey, title: row.title, detail: (row.detail || row.body || '').slice(0, 120), terms: `${row.title} ${row.detail ?? ''} ${row.body ?? ''} ${row.category ?? ''}` })),
    ];
    return [...pages, ...rows];
  }, [data]);
  const term = query.trim().toLocaleLowerCase();
  const all = term ? indexed.filter((row) => row.terms.toLocaleLowerCase().includes(term)) : [];
  const results = all.slice(0, 24);
  const choose = (row: Result) => { setOpen(false); setQuery(''); onNavigate(row.page, row.admissionId); };
  return <header aria-label="অ্যাডমিন হেডার" className="sticky top-0 z-30 border-b border-border bg-background px-3 py-3 sm:px-6">
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="outline" size="icon" aria-label="মেনু খুলুন" onClick={onMenu} className="size-10 shrink-0 rounded-md border-border lg:hidden"><Menu className="size-5" /></Button>
        <div className="hidden size-10 shrink-0 items-center justify-center rounded-md bg-primary text-gold lg:flex"><LayoutDashboard className="size-5" /></div>
        <div className="min-w-0"><p className="font-brand text-[10px] font-semibold text-muted-foreground sm:text-xs">Eternal Freedom</p><p className="truncate font-teacher text-sm font-bold text-primary sm:text-base">{title}</p></div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button asChild variant="outline" size="icon" className="size-9 rounded-md" title="ওয়েবসাইট দেখুন" aria-label="ওয়েবসাইট দেখুন"><a href="/" target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a></Button>
        <Button variant="outline" size="icon" className="size-9 rounded-md text-destructive" title="লগআউট" aria-label="লগআউট" onClick={onLogout}><LogOut className="size-4" /></Button>
      </div>
    </div>
    <div className="mt-3 grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      <div ref={root} className="relative min-w-0">
        <div className={`flex h-11 min-w-0 items-center gap-2 rounded-md border bg-secondary px-3 ${open && term ? 'border-primary' : 'border-border'}`}>
          <Search className="size-4 shrink-0 text-primary" />
          <input ref={input} role="combobox" aria-label="পেজ ও কনটেন্ট খুঁজুন" aria-expanded={open && !!term} aria-controls="admin-search-results" aria-autocomplete="list" aria-activedescendant={active >= 0 ? `admin-result-${active}` : undefined} value={query} placeholder="পেজ, নাম, ফোন বা কনটেন্ট খুঁজুন…" className="h-full w-full min-w-0 bg-secondary text-sm text-foreground outline-none placeholder:text-muted-foreground" onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }} onKeyDown={(event) => {
            if (event.key === 'Escape') { setOpen(false); setActive(-1); }
            if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setOpen(true); setActive((value) => Math.min(value + 1, results.length - 1)); }
            if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
            if (event.key === 'Enter' && open) { event.preventDefault(); const result = results[active >= 0 ? active : 0]; if (result) choose(result); }
          }} />
          {query && <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label="অনুসন্ধান মুছুন" onClick={() => { setQuery(''); setActive(-1); input.current?.focus(); }}><X className="size-4" /></Button>}
        </div>
        {open && term && <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs text-muted-foreground"><span>অনুসন্ধানের ফল</span><span aria-live="polite">{all.length.toLocaleString('bn-BD')}টি</span></div>
          <div id="admin-search-results" role="listbox" aria-label="অনুসন্ধানের ফল" className="max-h-[min(55dvh,420px)] overflow-y-auto overscroll-contain">
            {!results.length && <p role="status" className="p-5 text-center text-sm text-muted-foreground">কোনো পেজ বা কনটেন্ট পাওয়া যায়নি।</p>}
            {results.map((row, index) => { const Icon = iconFor(row.page); return <Button key={row.key} id={`admin-result-${index}`} role="option" aria-selected={active === index} variant="ghost" onClick={() => choose(row)} className={`grid h-auto w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 whitespace-normal rounded-none border-b border-border p-3 text-start last:border-0 ${active === index ? 'bg-accent' : ''}`}>
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent text-primary"><Icon className="size-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-primary">{row.title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{row.detail}</span><span className="mt-1 block text-[10px] font-semibold text-gold-deep">{adminPages[row.page]}</span></span><ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
            </Button>; })}
          </div>
        </div>}
      </div>
      <nav aria-label="দ্রুত মেনু" className="grid grid-cols-6 gap-1.5">{quickPages.map(({ page: target, icon: Icon }) => <Button key={target} variant="outline" size="icon" title={adminPages[target]} aria-label={`${adminPages[target]} মেনু`} aria-current={page === target ? 'page' : undefined} onClick={() => onNavigate(target)} className={`h-9 w-full rounded-md xl:w-9 ${page === target ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-raised hover:text-primary-foreground' : 'border-border text-primary'}`}><Icon className="size-4" /></Button>)}</nav>
    </div>
  </header>;
}