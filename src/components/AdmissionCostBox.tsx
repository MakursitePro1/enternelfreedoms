import type { ReactNode } from 'react';
import { MessageCircle, Wallet } from 'lucide-react';
import { admissionCostsBn, admissionCostsEn } from '@/lib/admission-costs';

export function AdmissionCostBox({ lang }: { lang: string }) {
  const c = lang === 'en' ? admissionCostsEn : admissionCostsBn;
  const digits = lang === 'en' ? (n: number) => String(n) : (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)] ?? d);
  return (
    <section data-no-translate className="mt-8 overflow-hidden rounded-lg border border-border bg-card text-foreground [overflow-wrap:anywhere]">
      <AdmissionBoxTitle icon={<Wallet className="size-6" />} title={c.title} subtitle={c.org} />
      <div className="p-5 sm:p-10">
        <p className="text-base leading-8 sm:text-lg sm:leading-9">{c.intro}</p>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {c.services.map((s, i) => (
            <li key={s.title} className="flex gap-3 rounded-lg border border-border bg-secondary p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{digits(i + 1)}</span>
              <div className="min-w-0"><h3 className="font-display text-lg font-bold text-primary">{s.title}</h3><p className="mt-1 text-sm leading-7 sm:text-base">{s.body}</p></div>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-lg border-l-4 border-gold bg-secondary p-4 font-semibold leading-8">{c.founderNote}</p>
        <div className="mt-8 overflow-hidden rounded-lg border-2 border-primary">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-primary text-primary-foreground"><tr><th className="p-3 sm:px-5">{c.tableHead[0]}</th><th className="p-3 text-right sm:px-5">{c.tableHead[1]}</th></tr></thead>
            <tbody>{c.rows.map(([k, v]) => <tr key={k} className="border-t border-border even:bg-secondary"><td className="p-3 sm:px-5">{k}</td><td className="whitespace-nowrap p-3 text-right font-semibold sm:px-5">{v}</td></tr>)}</tbody>
            <tfoot><tr className="bg-gold text-primary"><td className="p-3 font-bold sm:px-5">{c.total[0]}</td><td className="whitespace-nowrap p-3 text-right text-lg font-bold sm:px-5">{c.total[1]}</td></tr></tfoot>
          </table>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <p className="rounded-lg border-2 border-primary p-4 text-center font-display text-lg font-bold text-primary">{c.doubleBed}</p>
          <p className="rounded-lg border-2 border-gold p-4 text-center font-display text-lg font-bold text-primary">{c.singleBed}</p>
        </div>
        <p className="mt-4 leading-8">{c.singleBedNote}</p>
        <p className="mt-4 rounded-lg border border-destructive/40 bg-secondary p-4 leading-8">{c.special}</p>
        <div className="mt-8 rounded-lg bg-primary p-5 text-primary-foreground sm:p-7">
          <h3 className="font-display text-xl font-bold text-gold">{c.questionTitle}</h3>
          <p className="mt-3 leading-8">{c.question}</p>
        </div>
        <div className="mt-6 space-y-3 leading-8">{c.closing.map((p) => <p key={p}>{p}</p>)}</div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="font-display text-xl font-bold text-primary">{c.org}</p>
          <p className="mt-1 text-muted-foreground">{c.tagline}</p>
          <p className="mt-5 leading-8">{c.whatsappLabel}</p>
          <a href="https://wa.me/8801711022734" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90"><MessageCircle className="size-5" />{c.whatsapp}</a>
        </div>
      </div>
    </section>
  );
}

export function AdmissionBoxTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-4 border-b-4 border-gold bg-primary px-5 py-5 text-primary-foreground sm:px-10">
      <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-gold text-gold">{icon}</span>
      <div className="min-w-0"><h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-gold">{subtitle}</p>}</div>
    </div>
  );
}
