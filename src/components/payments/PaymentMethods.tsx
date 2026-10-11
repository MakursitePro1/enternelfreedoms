import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPaymentGateways } from '@/lib/payments.functions';
import { availableGateways, providerFor } from '@/lib/payment-gateways';

export function usePaymentMethods() {
  const fetchGateways = useServerFn(getPaymentGateways);
  const query = useQuery({ queryKey: ['payment-gateways'], queryFn: () => fetchGateways(), refetchOnWindowFocus: true, refetchInterval: 15000 });
  const methods = availableGateways(query.data ?? []).filter((g) => g.mode !== 'sandbox');
  return { methods, loading: query.isPending, error: query.isError };
}

export function PaymentMethods({ selected, onSelect, reference, onReference, total }: { selected: string; onSelect: (id: string) => void; reference: string; onReference: (value: string) => void; total: number }) {
  const { methods, loading, error } = usePaymentMethods();
  const gateway = methods.find((g) => g.id === selected);
  const provider = providerFor(selected);
  const manual = provider?.kind === 'wallet';
  return <div className="space-y-3">
    <div role="group" aria-label="পেমেন্ট পদ্ধতি" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {methods.map((g) => { const p = providerFor(g.id); return <Button key={g.id} type="button" variant="outline" aria-pressed={selected === g.id} onClick={() => onSelect(g.id)} className={`h-auto min-h-20 flex-col gap-1.5 whitespace-normal rounded-lg px-2 py-2 text-xs ${selected === g.id ? 'border-primary bg-accent text-primary' : 'border-border text-muted-foreground'}`}>{p?.logo ? <img src={p.logo} alt={p.name} className="h-7 w-20 object-contain" /> : <Banknote className="size-6" />}<span>{p?.label}</span></Button>; })}
    </div>
    {loading && <p className="text-sm text-muted-foreground">পেমেন্ট পদ্ধতি আসছে…</p>}
    {(error || (!loading && !methods.length)) && <p role="alert" className="text-sm text-destructive">এই মুহূর্তে পেমেন্ট পদ্ধতি পাওয়া যাচ্ছে না।</p>}
    {manual && gateway && <div className="rounded-lg bg-accent p-4 text-sm leading-7 text-primary"><ol className="list-decimal ps-5"><li>{provider.label} অ্যাপ থেকে নির্ধারিত হিসাবে টাকা পাঠান</li><li>নম্বর: <strong className="select-all">{gateway.account_number}</strong></li><li>পরিমাণ: <strong>৳ {total.toLocaleString('bn-BD')}</strong></li><li>প্রাপ্ত ট্রানজেকশন আইডি লিখুন</li></ol><input required aria-label="ট্রানজেকশন আইডি" value={reference} onChange={(e) => onReference(e.target.value)} placeholder="ট্রানজেকশন আইডি (TrxID)" className="mt-3 w-full rounded-lg border border-field-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary" /></div>}
  </div>;
}