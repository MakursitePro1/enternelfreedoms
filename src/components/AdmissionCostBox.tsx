import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';
import { admissionCostsBn, admissionCostsEn, admissionCostsTitle } from '@/lib/admission-costs';

export function AdmissionCostBox({ lang }: { lang: string }) {
  const en = lang === 'en';
  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-secondary">
      <AdmissionBoxTitle icon={<Wallet className="size-6" />} title={en ? admissionCostsTitle.en : admissionCostsTitle.bn} subtitle="Eternal Freedom Institute Al Islamia" />
      <div data-no-translate className="whitespace-pre-wrap p-5 text-base leading-9 text-foreground [overflow-wrap:anywhere] sm:p-10 sm:text-lg sm:leading-10">{en ? admissionCostsEn : admissionCostsBn}</div>
    </div>
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
