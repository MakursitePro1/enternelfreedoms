import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Banknote, CreditCard, ExternalLink, Save, Search, ShieldCheck, PlugZap, FlaskConical, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PAYMENT_PROVIDERS, type GatewayConfig } from '@/lib/payment-gateways';
import { getPaymentGateways, savePaymentGateway, testPaymentGateway } from '@/lib/payments.functions';

export function AdminPayments() {
  const get = useServerFn(getPaymentGateways), save = useServerFn(savePaymentGateway), test = useServerFn(testPaymentGateway);
  const client = useQueryClient();
  const { data: gateways = [], isPending, isError } = useQuery({ queryKey: ['payment-gateways'], queryFn: () => get() });
  const [drafts, setDrafts] = useState<Record<string, GatewayConfig>>({});
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const patch = (g: GatewayConfig, change: Partial<GatewayConfig>) => setDrafts((d) => ({ ...d, [g.id]: { ...g, ...change } }));
  async function persist(g: GatewayConfig) {
    setBusy(g.id); setError(''); setMessage('');
    try { await save({ data: { id: g.id as typeof PAYMENT_PROVIDERS[number]['id'], enabled: g.enabled, mode: g.mode, account_number: g.account_number, merchant_id: g.merchant_id } }); await client.invalidateQueries({ queryKey: ['payment-gateways'] }); setDrafts((d) => { const next = { ...d }; delete next[g.id]; return next; }); setMessage('পেমেন্ট সেটিংস সংরক্ষিত হয়েছে।'); }
    catch (e) { setError(e instanceof Error ? e.message : 'সংরক্ষণ করা যায়নি।'); }
    finally { setBusy(''); }
  }
  async function check(id: 'sslcommerz' | 'aamarpay') {
    setBusy(id); setError(''); setMessage('');
    try { await test({ data: { id } }); setMessage('টেস্ট সংযোগ সফল; কোনো টাকা নেওয়া হয়নি।'); }
    catch(e) { setError(e instanceof Error ? e.message : 'সংযোগ পরীক্ষা ব্যর্থ হয়েছে।'); }
    finally { setBusy(''); }
  }
  const field = 'mt-1.5 h-10 w-full min-w-0 rounded-md border border-panel-dark-border bg-panel-dark-soft px-3 text-sm text-panel-dark-foreground outline-none focus:border-gold';
  return <div className="space-y-5">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[[CreditCard, PAYMENT_PROVIDERS.length, 'পেমেন্ট পদ্ধতি'], [PlugZap, gateways.filter((g) => g.enabled && g.ready).length, 'সক্রিয় পদ্ধতি'], [ShieldCheck, gateways.filter((g) => g.enabled && g.mode === 'live' && g.ready).length, 'স্বয়ংক্রিয় পেমেন্ট'], [Banknote, gateways.filter((g) => g.enabled && g.mode === 'manual').length, 'সরাসরি / ডেলিভারি']].map(([Icon, count, label]) => { const I = Icon as typeof CreditCard; return <div key={String(label)} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4"><I className="size-6 shrink-0 text-gold-deep" /><div><p className="font-display text-xl font-bold text-primary">{Number(count).toLocaleString('bn-BD')}</p><p className="text-xs text-muted-foreground">{String(label)}</p></div></div>; })}</div>
    <label className="flex items-center gap-3 border-y border-border bg-background px-4"><Search className="size-4 text-muted-foreground" /><input aria-label="পেমেন্ট গেটওয়ে খুঁজুন" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="পেমেন্ট গেটওয়ে খুঁজুন" className="h-12 w-full min-w-0 bg-background text-sm outline-none" /></label>
    {message && <p role="status" className="text-sm text-primary">{message}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {isPending && <p>পেমেন্ট সেটিংস আসছে…</p>}{isError && <p role="alert" className="text-destructive">পেমেন্ট সেটিংস পাওয়া যায়নি।</p>}
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{PAYMENT_PROVIDERS.filter((p) => `${p.name} ${p.label}`.toLowerCase().includes(search.toLowerCase())).map((p) => {
      const stored = gateways.find((g) => g.id === p.id); if (!stored) return null;
      const g = drafts[p.id] ?? stored;
      const automatic = p.kind === 'automatic', wallet = p.kind === 'wallet', onboarding = p.kind === 'onboarding';
      const active = stored.enabled && stored.ready;
      return <article key={p.id} aria-label={p.name} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-panel-dark-border bg-panel-dark text-panel-dark-foreground">
        <div className="flex items-center gap-3 border-b border-panel-dark-border p-4"><div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-background p-2">{p.logo ? <img src={p.logo} alt={`${p.name} লোগো`} className="max-h-12 w-full object-contain" /> : <Banknote className="size-9 text-primary" />}</div><div className="min-w-0"><h2 className="font-display text-base font-bold leading-6">{p.name}</h2><p className="text-xs text-gold">{p.label}</p></div></div>
        <div className="flex items-center justify-between gap-3 border-b border-panel-dark-border px-4 py-3"><span className={`text-xs font-semibold ${active ? 'text-gold' : 'text-panel-dark-muted'}`}>{active ? stored.mode === 'sandbox' ? 'টেস্ট চালু' : 'সক্রিয়' : onboarding ? 'মার্চেন্ট অনুমোদন প্রয়োজন' : 'বন্ধ'}</span><Switch aria-label={`${p.label} চালু করুন`} checked={g.enabled} disabled={onboarding || busy === p.id} onCheckedChange={(enabled) => patch(g,{ enabled })} /></div>
        <div className="flex-1 space-y-4 p-4">
          {automatic && <><div className="grid grid-cols-2 gap-2" role="group" aria-label={`${p.label} পরিবেশ`}>{(['sandbox','live'] as const).map((mode) => <Button key={mode} type="button" variant="outline" aria-pressed={g.mode === mode} onClick={() => patch(g,{ mode })} className={`h-9 border-panel-dark-border ${g.mode === mode ? 'bg-gold text-primary hover:bg-gold-light' : 'bg-panel-dark-soft text-panel-dark-foreground hover:bg-panel-dark-soft'}`}>{mode === 'sandbox' ? 'টেস্ট' : 'লাইভ'}</Button>)}</div><div className="flex items-center gap-2 text-xs text-panel-dark-muted"><LockKeyhole className="size-4 shrink-0 text-gold" />{stored.credentialsReady ? 'নিরাপদ মার্চেন্ট তথ্য সংযুক্ত' : 'নিরাপদ মার্চেন্ট তথ্য এখনও সংযুক্ত নয়'}</div><label className="block text-xs text-gold">মার্চেন্ট পরিচিতি (ঐচ্ছিক)<input aria-label={`${p.label} মার্চেন্ট পরিচিতি`} value={g.merchant_id} onChange={(e) => patch(g,{ merchant_id: e.target.value })} className={field} /></label></>}
          {wallet && <label className="block text-xs text-gold">পেমেন্ট গ্রহণের নম্বর<input aria-label={`${p.label} পেমেন্ট নম্বর`} type="tel" value={g.account_number} onChange={(e) => patch(g,{ account_number: e.target.value })} className={field} /></label>}
          {wallet && <p className="text-xs leading-6 text-panel-dark-muted">ট্রানজেকশন আইডি দিয়ে অর্ডার; টাকা পাওয়া অ্যাডমিন যাচাই করবেন। স্বয়ংক্রিয় পেমেন্ট এসএসএলকমার্জ বা আমারপের অনুমোদিত মাধ্যমে হবে।</p>}
          {automatic && <p className="text-xs leading-6 text-panel-dark-muted">মার্চেন্ট হিসাব সংযুক্ত হলে অনলাইন পেমেন্ট যাচাই হবে। টেস্ট পেমেন্ট প্রকৃত অর্ডারে যুক্ত হয় না। সেবাদাতার নিজস্ব চার্জ প্রযোজ্য।</p>}
          {onboarding && <p className="text-xs leading-6 text-panel-dark-muted">এই সেবাদাতার সরাসরি সংযোগ চালু করতে অনুমোদিত মার্চেন্ট তথ্য ও সংযোগের নথি প্রয়োজন।</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-panel-dark-border p-4"><Button disabled={onboarding || busy === p.id} onClick={() => void persist(g)} className="h-9 bg-gold px-3 text-xs text-primary hover:bg-gold-light"><Save className="size-4" />{busy === p.id ? 'অপেক্ষা করুন…' : 'সংরক্ষণ'}</Button>{automatic && <Button variant="outline" disabled={busy === p.id || !stored.credentialsReady} onClick={() => void check(p.id as 'sslcommerz' | 'aamarpay')} className="h-9 border-panel-dark-border bg-panel-dark-soft px-3 text-xs text-panel-dark-foreground hover:bg-panel-dark-soft"><FlaskConical className="size-4" />সংযোগ পরীক্ষা</Button>}{p.website && <Button asChild variant="ghost" size="icon" className="ms-auto h-9 w-9 text-gold hover:bg-panel-dark-soft" aria-label={`${p.label} ওয়েবসাইট`} title={`${p.label} ওয়েবসাইট`}><a href={p.website} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a></Button>}</div>
      </article>;
    })}</div>
  </div>;
}