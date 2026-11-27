import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { admissionNoticeBn } from '@/lib/admission-notice';
import { admissionNoticeEn } from '@/lib/admission-notice-en';
import { AdmissionBoxTitle, AdmissionCostBox } from '@/components/AdmissionCostBox';
import { FileText } from 'lucide-react';
import { admissionSchema, admissionDocumentSchema, type AdmissionDocument } from '@/lib/admission-schema';
import { submitAdmission } from '@/lib/platform.functions';
import { useLang } from '@/lib/i18n';
import { AdmissionProgramPicker } from '@/components/AdmissionProgramPicker';
import { AdmissionChoice } from '@/components/AdmissionChoice';
import campusLeft from '@/assets/campus-left.jpg';
import campusRight from '@/assets/campus-right.jpg';

const initial = { student_name: '', student_name_en: '', previous_school: '', residential_experience: '', birth_date: '', guardian_name: '', phone: '', mother_name: '', mother_phone: '', program: '', guardian_note: '' };
const labels = {
  student_name: ['শিক্ষার্থীর পূর্ণ নাম (বাংলায়)', "Student’s Full Name (in Bengali)"],
  student_name_en: ['শিক্ষার্থীর পূর্ণ নাম (ইংরেজিতে)', "Student’s Full Name (in English)"],
  birth_date: ['জন্ম তারিখ', 'Date of Birth'],
  guardian_name: ['বাবার পূর্ণ নাম', "Father’s Full Name"],
  phone: ['বাবার মোবাইল নম্বর', "Father’s Mobile Number"],
  mother_name: ['মায়ের পূর্ণ নাম', "Mother’s Full Name"],
  mother_phone: ['মায়ের মোবাইল নম্বর', "Mother’s Mobile Number"],
} as const;
const inputClass = 'mt-2 w-full min-w-0 rounded-xl border border-border bg-background px-4 py-3.5 text-base text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary';

export function AdmissionApplication() {
  const { lang, t } = useLang();
  const [view, setView] = useState<'notice' | 'form' | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState(initial);
  const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);
  async function copyReference() { try { await navigator.clipboard.writeText(reference); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } }
  const send = useServerFn(submitAdmission);
  const copy = (bn: string, en: string) => lang === 'en' ? en : bn;

  async function upload(label: AdmissionDocument['label'], file?: File) {
    if (!file) return;
    setError('');
    if (file.size > 3 * 1024 * 1024) { setError(copy('প্রতিটি ফাইল ৩ MB-এর মধ্যে হতে হবে।', 'Each file must be no larger than 3 MB.')); return; }
    if (!/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(file.type) || (label === 'শিক্ষার্থীর ছবি' && !file.type.startsWith('image/'))) { setError(copy('সঠিক ছবি বা PDF ফাইল দিন।', 'Choose a valid image or PDF file.')); return; }
    setUploading(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('ফাইল পড়া যায়নি।'));
        reader.readAsDataURL(file);
      });
      const doc = admissionDocumentSchema.parse({ label, name: file.name, type: file.type, data });
      setDocuments((previous) => [...previous.filter((item) => item.label !== label), doc]);
    } catch { setError(copy('ফাইল পড়া যায়নি। আবার দিন।', 'Unable to read the file. Please try again.')); }
    finally { setUploading(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = admissionSchema.safeParse({ ...form, agreed, documents });
    if (!result.success) { setError(t(result.error.issues[0]?.message ?? 'সকল তথ্য পূরণ করুন।')); return; }
    setBusy(true); setError('');
    try { const saved = await send({ data: result.data }); setReference(saved.reference); }
    catch (err) { setError(t(err instanceof Error ? err.message : 'আবেদন জমা দেওয়া যায়নি।')); }
    finally { setBusy(false); }
  }
  function field(name: keyof typeof labels) {
    const label = labels[name];
    const type = name.endsWith('phone') || name === 'phone' ? 'tel' : 'text';
    const isBirth = name === 'birth_date';
    return <label key={name} className="block min-w-0 text-sm font-semibold text-foreground">{copy(label[0], label[1])} *
      <input aria-label={copy(label[0], label[1])} required type={type} inputMode={isBirth ? 'numeric' : undefined} placeholder={isBirth ? '2015-01-01' : undefined} maxLength={type === 'tel' ? 11 : isBirth ? 10 : 120} pattern={type === 'tel' ? '01[0-9]{9}' : isBirth ? '\\d{4}-\\d{2}-\\d{2}' : undefined} value={form[name]} onChange={(event) => setForm((previous) => ({ ...previous, [name]: event.target.value }))} className={inputClass} />
    </label>;
  }
  function docField(label: AdmissionDocument['label']) {
            const doc = documents.find((item) => item.label === label);
            const name = label === 'শিক্ষার্থীর ছবি' ? copy('শিক্ষার্থীর ছবি', 'Student’s Photograph') : copy('জন্ম নিবন্ধনের কপি (ঐচ্ছিক)', 'Birth Registration Certificate (Optional)');
            return <div key={label} className="min-w-0 rounded-lg border border-dashed border-border p-4">
              <p className="text-sm font-semibold text-foreground">{name}{label === 'শিক্ষার্থীর ছবি' ? ' *' : ''}</p>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary"><Upload className="size-4 shrink-0" />{copy('ফাইল নির্বাচন করুন', 'Choose File')}<input aria-label={name} disabled={uploading || busy} type="file" accept={label === 'শিক্ষার্থীর ছবি' ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,application/pdf'} className="sr-only" onChange={(event) => { void upload(label, event.target.files?.[0]); event.target.value = ''; }} /></label>
              {doc && <div className="mt-3 flex min-w-0 items-center justify-between gap-2"><span data-no-translate className="truncate text-xs text-muted-foreground">{doc.name}</span><Button type="button" size="icon" variant="ghost" aria-label={copy('ফাইল সরান', 'Remove File')} onClick={() => setDocuments((previous) => previous.filter((item) => item.label !== label))}><X className="size-4" /></Button></div>}
            </div>;
  }
  function openView(next: 'notice' | 'form' | null) {
    setView(next);
    setError('');
    document.getElementById('apply')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  return <section id="apply" aria-label={copy('অনলাইন ভর্তি', 'Online Admission')} className="relative isolate scroll-mt-28 overflow-hidden px-3 py-6 font-teacher sm:px-5 sm:py-8">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><img src={campusLeft} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover object-left" /><img src={campusRight} alt="" className="absolute inset-y-0 right-0 h-full w-1/2 object-cover object-right" /><div className="absolute inset-0 bg-background/40" /></div>
    <h1 className="sr-only">{copy('অনলাইন ভর্তি', 'Online Admission')}</h1>
    <div className="mx-auto w-full max-w-7xl">
      {view === null && !reference && <AdmissionChoice copy={copy} onOpen={openView} />}
      {(view !== null || reference) && <div className="mb-4"><Button type="button" variant="outline" disabled={busy} onClick={() => { setReference(''); openView(null); }}><ArrowLeft className="size-4" />{copy('পেছনে', 'Back')}</Button></div>}
      {reference ? <div role="status" className="rounded-[1.25rem] border border-border bg-card px-5 py-12 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h2 className="mt-5 font-display text-2xl font-bold text-primary">{copy('আবেদন সফলভাবে জমা হয়েছে!', 'Application Submitted Successfully!')}</h2>
        <p className="mt-3 text-muted-foreground">{copy('তোমার ভর্তি আবেদন গ্রহণ করা হয়েছে।', 'Your admission application has been received.')}</p>
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl border-2 border-gold bg-card px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
          <p data-no-translate className="select-all break-all font-display text-2xl font-bold text-primary sm:text-3xl">{reference}</p>
          <Button type="button" onClick={() => void copyReference()} className="shrink-0">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? copy('কপি হয়েছে', 'Copied') : copy('কপি করুন', 'Copy')}</Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{copy('ভবিষ্যতে যোগাযোগের জন্য আবেদন নম্বরটি সংরক্ষণ করুন।', 'Please keep your application ID for future reference.')}</p>
      </div> : view === 'notice' ? <>
        <div className="overflow-hidden rounded-lg border border-border bg-secondary"><AdmissionBoxTitle icon={<FileText className="size-6" />} title={copy('ভর্তি ও প্রতিষ্ঠান সম্পর্কিত বিস্তারিত তথ্য', 'Admission and Institution Details')} subtitle="Eternal Freedom Institute Al Islamia" /><div data-no-translate className="whitespace-pre-wrap p-5 text-base leading-9 text-foreground [overflow-wrap:anywhere] sm:p-10 sm:text-lg sm:leading-10">{(lang === 'en' ? admissionNoticeEn : admissionNoticeBn).split(/(https?:\/\/[^\s]+)/g).map((part, i) => /^https?:\/\//.test(part) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all font-semibold text-primary underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">{part}</a> : part)}</div></div>
        <AdmissionCostBox lang={lang} />
        <div className="mt-5 flex justify-end"><Button type="button" size="lg" onClick={() => openView('form')} className="h-14 w-full gap-3 bg-gold px-7 text-base font-bold text-primary hover:bg-gold-light sm:w-auto">{copy('এপ্লাই এডমিশন', 'Apply Admission')}<ArrowRight className="size-5 shrink-0" /></Button></div>
      </> : view === 'form' ? <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
        <h2 className="mb-6 font-display text-2xl font-bold text-primary">{copy('শিক্ষার্থীর তথ্য', 'Student Details')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {field('student_name')}
          {field('student_name_en')}
          {docField('শিক্ষার্থীর ছবি')}
          {field('birth_date')}
          {field('guardian_name')}
          {field('phone')}
          {field('mother_name')}
          {field('mother_phone')}
          {docField('জন্মনিবন্ধন')}
          <label className="block min-w-0 text-sm font-semibold text-foreground">{copy('পূর্ববর্তী প্রতিষ্ঠানের নাম (ঐচ্ছিক)', 'Previous Institution Name (Optional)')}
            <input aria-label={copy('পূর্ববর্তী প্রতিষ্ঠানের নাম (ঐচ্ছিক)', 'Previous Institution Name (Optional)')} type="text" maxLength={200} value={form.previous_school} onChange={(event) => setForm((previous) => ({ ...previous, previous_school: event.target.value }))} placeholder={copy('আগে কোথাও পড়ালেখা করলে প্রতিষ্ঠানের নাম লিখুন', 'If previously studied, write the institution name')} className={inputClass} />
          </label>
          <fieldset className="min-w-0 sm:col-span-2 xl:col-span-1">
            <legend className="text-sm font-semibold text-foreground">{copy('আবাসিকে পড়াশোনা করার অভ্যাস আছে?', 'Has experience studying in a residential setting?')} *</legend>
            <div role="radiogroup" aria-label={copy('আবাসিকে পড়াশোনা করার অভ্যাস আছে?', 'Has experience studying in a residential setting?')} className="mt-2 grid grid-cols-2 gap-3">{(['yes', 'no'] as const).map((value) => { const active = form.residential_experience === value; const text = value === 'yes' ? copy('হ্যাঁ', 'Yes') : copy('না', 'No'); return <button key={value} type="button" role="radio" aria-checked={active} onClick={() => setForm((previous) => ({ ...previous, residential_experience: value }))} className={`flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl border-2 px-4 text-base font-bold transition-colors ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:border-primary'}`}><span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-gold bg-gold text-primary' : 'border-border'}`}>{active && <Check className="size-3" />}</span>{text}</button>; })}</div>
          </fieldset>
          <AdmissionProgramPicker value={form.program} copy={copy} onChange={(program) => setForm((previous) => ({ ...previous, program }))} />
          <label className="block min-w-0 text-sm font-semibold text-foreground sm:col-span-2 xl:col-span-3">{copy('অভিভাবকের মন্তব্য / নোট (ঐচ্ছিক)', 'Guardian’s Comments / Notes (Optional)')}
            <textarea aria-label={copy('অভিভাবকের মন্তব্য / নোট (ঐচ্ছিক)', 'Guardian’s Comments / Notes (Optional)')} rows={4} maxLength={1000} value={form.guardian_note} onChange={(event) => setForm((previous) => ({ ...previous, guardian_note: event.target.value }))} placeholder={copy('কোনো মন্তব্য বা বিশেষ তথ্য থাকলে এখানে লিখুন', 'Write any comments or special information here')} className={`${inputClass} resize-y`} />
          </label>
        </div>
        {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-secondary p-4">
          <Checkbox id="admission-agreement" checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} className="mt-1 shrink-0" />
          <label htmlFor="admission-agreement" className="min-w-0 cursor-pointer text-sm leading-7 text-foreground">{copy('আমি সম্পূর্ণ নোটিশটি পড়েছি এবং ভর্তি ও প্রতিষ্ঠানের সকল শর্তাবলিতে সম্মত আছি।', 'I have read the complete notice and agree to all admission and institution terms and conditions.')}</label>
        </div>
        <div className="mt-6 flex justify-end"><Button type="submit" disabled={busy || uploading || !agreed} className="w-full sm:w-auto">{busy ? copy('জমা হচ্ছে...', 'Submitting...') : copy('আবেদন জমা দিন', 'Submit Application')}<ArrowRight className="size-4" /></Button></div>
      </form> : null}
    </div>
  </section>;
}
