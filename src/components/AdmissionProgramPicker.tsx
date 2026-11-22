import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generalAdmissionPrograms, madrasaAdmissionPrograms, kitabAdmissionPrograms } from '@/lib/admission-programs';

type Copy = (bn: string, en: string) => string;
function EducationIcon({ kind }: { kind: 'books' | 'mosque' | 'kitab' }) {
  return <svg viewBox="0 0 100 90" aria-hidden="true" className="size-14 shrink-0 sm:size-16">
    {kind === 'books' ? <>
      <path d="M8 62 49 43 92 60 51 83Z" fill="var(--primary-raised)" /><path d="m12 60 39 17 36-16v11L51 88 12 71Z" fill="var(--primary-foreground)" stroke="var(--primary)" strokeWidth="3" />
      <path d="m12 39 38-17 39 16v17L51 72 12 55Z" fill="var(--gold)" /><path d="m15 45 36 15 35-15v9L51 69 15 54Z" fill="var(--primary-foreground)" />
      <path d="M8 28 49 9 92 27 51 47Z" fill="var(--gold-light)" stroke="var(--gold-deep)" strokeWidth="2" /><path d="m10 29 41 18 39-18v12L51 60 10 42Z" fill="var(--primary-foreground)" stroke="var(--gold)" strokeWidth="3" />
    </> : <>
      {kind === 'kitab' && <><path d="m17 73 64-38 8 11-65 39Z" fill="var(--gold-deep)" /><path d="m18 37 67 37-8 11-65-39Z" fill="var(--gold)" /></>}
      <path d="m7 43 13-7 29 6 30-6 14 7-10 27-34-6-33 6Z" fill="var(--primary-raised)" stroke="var(--primary)" strokeWidth="2" />
      <path d="M17 33q20-8 32 3 12-11 32-3l8 27q-23-8-40 3-16-11-39-3Z" fill="var(--gold-light)" stroke="var(--gold-deep)" strokeWidth="2" />
      <path d="M22 32q16-5 27 5 11-10 27-5l5 22q-18-5-32 5-14-10-32-5Z" fill="var(--primary-foreground)" /><path d="M49 37v23" stroke="var(--gold-deep)" strokeWidth="2" />
      {kind === 'mosque' && <><path d="M31 33v-9q0-9 19-20 19 11 19 20v9Z" fill="var(--gold-light)" stroke="var(--gold-deep)" strokeWidth="2" /><path d="M53 2a7 7 0 1 1-8-10 6 6 0 0 0 8 10" fill="var(--gold)" transform="translate(0 8)" /></>}
    </>}
  </svg>;
}
export function AdmissionProgramPicker({ value, onChange, copy }: { value: string; onChange: (value: string) => void; copy: Copy }) {
  const option = (name: string, english: string, label = name, labelEn = english) => <label key={name} className={`flex min-h-14 min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-colors sm:text-base ${value === name ? 'border-primary bg-admission-selected text-primary ring-1 ring-primary' : 'border-input bg-card text-foreground hover:border-primary'}`}>
    <RadioGroupItem value={name} aria-label={copy(label, labelEn)} className="size-5 shrink-0 border-2 border-muted-foreground text-primary data-[state=checked]:border-primary" />
    <span className="min-w-0 leading-6">{copy(label, labelEn)}</span>
  </label>;
  const header = (title: string, english: string, subtitle: string, subtitleEn: string, kind: 'books' | 'mosque') => <div className="flex flex-col gap-3 border-b border-input bg-secondary sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3 rounded-tr-[4rem] bg-primary px-4 py-3 text-primary-foreground sm:min-w-[45%]"><EducationIcon kind={kind} /><h3 className="text-xl font-bold sm:text-2xl">{copy(title, english)}</h3></div>
    <p className="mx-4 mb-3 rounded-full bg-admission-selected px-4 py-2 text-center text-sm font-semibold text-primary sm:mb-0">{copy(subtitle, subtitleEn)}</p>
  </div>;
  return <fieldset className="min-w-0 sm:col-span-2 xl:col-span-3">
    <legend className="mb-3 text-sm font-semibold text-foreground">{copy('শ্রেণি / বিভাগ', 'Applying for Class / Department')} *</legend>
    <RadioGroup required name="program" value={value} onValueChange={onChange} aria-label={copy('শ্রেণি / বিভাগ', 'Applying for Class / Department')} className="gap-5">
      <section className="overflow-hidden rounded-3xl border border-primary">
        {header('জেনারেল শিক্ষা', 'General Education', 'নার্সারি থেকে ১০ম শ্রেণি পর্যন্ত', 'Nursery to Class 10', 'books')}
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-5 lg:grid-cols-5">{generalAdmissionPrograms.map(([name, en]) => option(name, en))}</div>
      </section>
      <section className="overflow-hidden rounded-3xl border border-primary">
        {header('মাদ্রাসা শিক্ষা', 'Madrasa Education', 'সমন্বিত ইসলামী শিক্ষা বিভাগ', 'Integrated Islamic Education', 'mosque')}
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-5 lg:grid-cols-5">{madrasaAdmissionPrograms.map(([name, en]) => option(name, en))}</div>
        <div className="mx-3 mb-3 grid items-center gap-3 rounded-2xl bg-admission-selected p-3 sm:mx-5 sm:mb-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="flex items-center gap-3"><EducationIcon kind="kitab" /><h3 className="text-lg font-bold leading-7 text-primary">{copy('কিতাব বিভাগ', 'Kitab Department')}<span className="block text-base">{copy('(মাদানী নেসাব)', '(Madani Nesab)')}</span></h3></div>
          <div className="grid gap-2 sm:grid-cols-3">{kitabAdmissionPrograms.map(([name, en, label, labelEn]) => option(name, en, label, labelEn))}</div>
        </div>
      </section>
    </RadioGroup>
  </fieldset>;
}