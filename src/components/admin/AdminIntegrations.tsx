import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Blocks, CheckCircle2, ExternalLink, PlugZap, Power, RotateCcw, Save, Search, ShieldCheck, Sparkles, TrendingUp, XCircle, ListTree,
} from 'lucide-react';
import { INTEGRATIONS, integKey, integOn, integVal, type Integration, type IntegrationValues } from '@/lib/integrations';

type Props = {
  settings: Record<string, string>;
  onSave: (values: Record<string, string>, ok: string) => Promise<boolean>;
};

type Draft = { on: boolean; fields: Record<string, string> };

const bn = (n: number) => n.toLocaleString('bn-BD');

function draftFor(integ: Integration, settings: IntegrationValues): Draft {
  return {
    on: integOn(settings, integ.id),
    fields: Object.fromEntries(integ.fields.map((f) => [f.key, integVal(settings, integ.id, f.key)])),
  };
}

/** True when the integration has everything it needs to go live. */
function ready(integ: Integration, d: Draft) {
  if (!integ.fields.length) return true;
  return integ.fields.filter((f) => !f.label.includes('ঐচ্ছিক')).every((f) => !!d.fields[f.key]?.trim());
}

function Logo({ integ, size = 'size-16 sm:size-20' }: { integ: Integration; size?: string }) {
  return (
    <div className={`grid ${size} shrink-0 place-items-center rounded-2xl`} style={{ backgroundColor: integ.color }}>
      <svg viewBox={integ.logo.viewBox} className="size-9 sm:size-11" aria-hidden="true">
        {integ.logo.paths.map((p, i) => <path key={i} d={p.d} fill={p.fill ?? '#ffffff'} />)}
      </svg>
    </div>
  );
}

export function AdminIntegrations({ settings, onSave }: Props) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() => Object.fromEntries(INTEGRATIONS.map((i) => [i.id, draftFor(i, settings)])));
  const [savingId, setSavingId] = useState('');

  useEffect(() => { setDrafts(Object.fromEntries(INTEGRATIONS.map((i) => [i.id, draftFor(i, settings)]))); }, [settings]);

  const cards = useMemo(() => INTEGRATIONS.map((integ) => {
    const d = drafts[integ.id] ?? draftFor(integ, settings);
    const saved = draftFor(integ, settings);
    return { integ, draft: d, saved, dirty: JSON.stringify(d) !== JSON.stringify(saved), ready: ready(integ, d) };
  }), [drafts, settings]);

  const active = cards.filter((c) => c.draft.on && c.ready).length;
  const tracking = cards.filter((c) => c.draft.on && c.ready && (c.integ.kind === 'analytics' || c.integ.kind === 'tag')).length;
  const verified = cards.filter((c) => c.draft.on && c.ready && c.integ.kind === 'verify').length;
  const filtered = cards.filter((c) => !query || c.integ.name.toLowerCase().includes(query.toLowerCase()) || c.integ.bn.includes(query));

  async function persist(card: (typeof cards)[number]) {
    const { integ, draft } = card;
    setSavingId(integ.id);
    const values: Record<string, string> = { [integKey(integ.id, 'on')]: draft.on ? '1' : '' };
    for (const f of integ.fields) values[integKey(integ.id, f.key)] = draft.fields[f.key]?.trim() ?? '';
    const done = await onSave(values, `${integ.bn} ${draft.on ? 'সক্রিয় হয়েছে' : 'বন্ধ হয়েছে'} — ওয়েবসাইট রিফ্রেশ করলে কার্যকর।`);
    if (done) await queryClient.invalidateQueries({ queryKey: ['integrations'] });
    setSavingId('');
  }

  async function reset(card: (typeof cards)[number]) {
    const { integ } = card;
    setSavingId(integ.id);
    const values: Record<string, string> = { [integKey(integ.id, 'on')]: '' };
    for (const f of integ.fields) values[integKey(integ.id, f.key)] = '';
    const done = await onSave(values, `${integ.bn} মূল অবস্থায় ফিরেছে।`);
    if (done) await queryClient.invalidateQueries({ queryKey: ['integrations'] });
    setSavingId('');
  }

  const label = 'text-[11px] font-bold uppercase tracking-wide text-gold';
  const input = 'mt-1.5 w-full min-w-0 rounded-xl border border-panel-dark-border bg-panel-dark-soft px-3.5 py-2.5 text-sm text-panel-dark-foreground outline-none placeholder:text-panel-dark-muted focus:border-gold';

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {([
          [Blocks, bn(INTEGRATIONS.length), 'মোট প্লাটফর্ম'],
          [PlugZap, bn(active), 'সক্রিয় ইন্টিগ্রেশন'],
          [TrendingUp, bn(tracking), 'ট্র্যাকিং চালু'],
          [ShieldCheck, bn(verified), 'ভেরিফিকেশন সম্পন্ন'],
        ] as const).map(([I, value, text]) => (
          <div key={text} className="rounded-2xl border border-border bg-background p-4 shadow-elegant sm:p-5">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-gold"><I className="size-5" /></div>
            <p className="mt-3 font-display text-xl font-bold text-primary sm:text-2xl">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-[13px]">{text}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 shadow-elegant">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="প্লাটফর্ম খুঁজুন (যেমন: Google, Pixel)" className="h-12 w-full min-w-0 bg-transparent text-sm text-foreground outline-none" />
      </div>

      {/* Integration cards */}
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((card) => {
          const { integ, draft, dirty, ready: isReady } = card;
          const live = draft.on && isReady;
          const saving = savingId === integ.id;
          return (
            <section key={integ.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-panel-dark-border bg-panel-dark shadow-elegant">
              {/* Card head */}
              <div className="flex items-start gap-4 border-b border-panel-dark-border p-4 sm:p-5">
                <Logo integ={integ} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold text-panel-dark-foreground sm:text-lg">{integ.name}</p>
                  <p className="mt-0.5 text-xs text-gold">{integ.bn}</p>
                  <p className="mt-1.5 text-[11.5px] leading-5 text-panel-dark-muted">{integ.desc}</p>
                </div>
              </div>

              {/* Status + toggle */}
              <div className="flex items-center gap-3 border-b border-panel-dark-border px-4 py-3 sm:px-5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${live ? 'bg-gold text-primary' : 'bg-panel-dark-soft text-panel-dark-muted'}`}>
                  {live ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                  {live ? 'সক্রিয়' : draft.on ? 'তথ্য অসম্পূর্ণ' : 'বন্ধ'}
                </span>
                <button type="button" onClick={() => setDrafts((d) => ({ ...d, [integ.id]: { ...draft, on: !draft.on } }))} className="ml-auto flex items-center gap-2.5 rounded-xl bg-panel-dark-soft px-3 py-2">
                  <Power className={`size-4 ${draft.on ? 'text-gold' : 'text-panel-dark-muted'}`} />
                  <span className="text-xs font-semibold text-panel-dark-foreground">{draft.on ? 'চালু' : 'বন্ধ'}</span>
                  <span className={`relative h-5 w-9 rounded-full ${draft.on ? 'bg-gold' : 'bg-panel-dark-border'}`}>
                    <span className={`absolute top-0.5 size-4 rounded-full bg-primary transition-all ${draft.on ? 'left-[18px]' : 'left-0.5'}`} />
                  </span>
                </button>
              </div>

              {/* Fields / index tools */}
              <div className="flex-1 space-y-3 p-4 sm:p-5">
                {integ.fields.map((f) => (
                  <label key={f.key} className="block">
                    <span className={label}>{f.label}</span>
                    <input value={draft.fields[f.key] ?? ''} onChange={(e) => setDrafts((d) => ({ ...d, [integ.id]: { ...draft, fields: { ...draft.fields, [f.key]: e.target.value } } }))} placeholder={f.placeholder} dir="ltr" className={input} />
                    <span className="mt-1 block text-[11px] leading-4 text-panel-dark-muted">{f.hint}</span>
                  </label>
                ))}
                {integ.kind === 'index' && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-panel-dark-border bg-panel-dark-soft p-3 text-xs font-semibold text-panel-dark-foreground hover:border-gold">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold text-primary"><ListTree className="size-4" /></span>সাইটম্যাপ জমা দিন<ExternalLink className="ms-auto size-3.5" />
                    </a>
                    <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl border border-panel-dark-border bg-panel-dark-soft p-3 text-xs font-semibold text-panel-dark-foreground hover:border-gold">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold text-primary"><Sparkles className="size-4" /></span>সাইটম্যাপ দেখুন<ExternalLink className="ms-auto size-3.5" />
                    </a>
                    <p className="text-[11px] leading-5 text-panel-dark-muted sm:col-span-2">Search Console-এ <span dir="ltr" className="text-gold">sitemap.xml</span> জমা দিলে গুগল সব পেজ স্বয়ংক্রিয়ভাবে ইনডেক্স করবে।</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 border-t border-panel-dark-border p-4 sm:px-5">
                <button type="button" disabled={saving || (draft.on && !isReady)} onClick={() => void persist(card)} className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-primary disabled:opacity-50 sm:text-sm">
                  <Save className="size-4" />{saving ? 'সংরক্ষণ হচ্ছে…' : 'সংরক্ষণ ও প্রকাশ'}
                </button>
                <button type="button" disabled={saving} onClick={() => void reset(card)} className="inline-flex items-center gap-2 rounded-xl border border-panel-dark-border px-3.5 py-2.5 text-xs font-semibold text-panel-dark-foreground disabled:opacity-40 sm:text-sm">
                  <RotateCcw className="size-4" />রিসেট
                </button>
                <a href={integ.helpUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-panel-dark-muted hover:text-gold">
                  {integ.helpLabel}<ExternalLink className="size-3" />
                </a>
                {dirty && <span className="inline-flex items-center gap-1 rounded-full bg-panel-dark-soft px-2.5 py-1 text-[10.5px] font-semibold text-gold"><Sparkles className="size-3" />অসংরক্ষিত</span>}
              </div>
            </section>
          );
        })}
      </div>
      {!filtered.length && <p className="rounded-2xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">এই নামে কোনো প্লাটফর্ম নেই।</p>}
    </div>
  );
}
