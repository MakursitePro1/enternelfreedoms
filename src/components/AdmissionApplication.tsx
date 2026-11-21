import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { admissionNoticeBn } from '@/lib/admission-notice';
import { admissionNoticeEn } from '@/lib/admission-notice-en';
import { admissionSchema, admissionDocumentSchema, type AdmissionDocument } from '@/lib/admission-schema';
import { submitAdmission } from '@/lib/platform.functions';
import { useLang } from '@/lib/i18n';
import { programs } from '@/lib/content';
import { AdmissionNotice } from '@/components/AdmissionNotice';

const initial = { student_name: '', birth_date: '', guardian_name: '', phone: '', mother_name: '', mother_phone: '', program: '' };
const labels = {
  student_name: ['শিক্ষার্থীর পূর্ণ নাম', "Student’s Full Name"],
  birth_date: ['জন্ম তারিখ', 'Date of Birth'],
  guardian_name: ['বাবার পূর্ণ নাম', "Father’s Full Name"],
  phone: ['বাবার মোবাইল নম্বর', "Father’s Mobile Number"],
  mother_name: ['মায়ের পূর্ণ নাম', "Mother’s Full Name"],
  mother_phone: ['মায়ের মোবাইল নম্বর', "Mother’s Mobile Number"],
} as const;
const inputClass = 'mt-2 w-full min-w-0 rounded-xl border border-border bg-background px-4 py-3.5 text-base text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary';

export function AdmissionApplication() {
  const { lang, t } = useLang();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState(initial);
  const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
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
    const type = name === 'birth_date' ? 'date' : name.endsWith('phone') || name === 'phone' ? 'tel' : 'text';
    return <label key={name} className="block min-w-0 text-sm font-semibold text-foreground">{copy(label[0], label[1])} *
      <input aria-label={copy(label[0], label[1])} required type={type} maxLength={type === 'tel' ? 11 : 120} pattern={type === 'tel' ? '01[0-9]{9}' : undefined} value={form[name]} onChange={(event) => setForm((previous) => ({ ...previous, [name]: event.target.value }))} className={inputClass} />
    </label>;
  }
  return <section id="apply" className="scroll-mt-28 px-2.5 py-6 sm:px-5 sm:py-10">
    <div className="w-full font-teacher">
      {!reference && <ol className="mb-5 grid grid-cols-2 gap-3 sm:mb-6" aria-label={copy('ভর্তির ধাপ', 'Application steps')}>
        {[copy('নোটিশ ও সম্মতি', 'Notice & Agreement'), copy('শিক্ষার্থীর তথ্য', 'Student Details')].map((label, index) => <li key={index} className={`flex items-center gap-3 rounded-[1.1rem] border px-4 py-4 text-sm font-semibold sm:text-base ${step === index ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary text-muted-foreground'}`}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-primary">{index + 1}</span><span>{label}</span></li>)}
      </ol>}
      {reference ? <div role="status" className="rounded-lg border border-border px-5 py-12 text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h2 className="mt-5 font-display text-2xl font-bold text-primary">{copy('আবেদন সফলভাবে জমা হয়েছে!', 'Application Submitted Successfully!')}</h2>
        <p className="mt-3 text-muted-foreground">{copy('তোমার ভর্তি আবেদন গ্রহণ করা হয়েছে।', 'Your admission application has been received.')}</p>
        <p data-no-translate className="mt-6 select-all break-all text-3xl font-bold text-primary">{reference}</p>
        <p className="mt-4 text-sm text-muted-foreground">{copy('ভবিষ্যতে যোগাযোগের জন্য আবেদন নম্বরটি সংরক্ষণ করুন।', 'Please keep your application ID for future reference.')}</p>
      </div> : step === 0 ? <>
        <div className="relative overflow-hidden rounded-[1.25rem] bg-primary px-5 py-8 text-primary-foreground shadow-elegant sm:px-10 sm:py-12">
          <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-primary"><FileText className="size-3.5" />{copy('ভর্তি চলছে — সীমিত আসন', 'Admissions open — limited seats')}</span>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">{copy('ভর্তি ও প্রতিষ্ঠান সম্পর্কিত', 'Admission & Institution')}<br /><span className="text-gold-light">{copy('বিস্তারিত তথ্য', 'Complete Information')}</span></h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-primary-foreground/85 sm:text-base">{copy('আবেদন করার আগে নিচের সম্পূর্ণ নোটিশ মনোযোগ দিয়ে পড়ুন, তারপর সম্মতি দিয়ে পরবর্তী ধাপে যান।', 'Please read the complete notice below carefully, then agree and continue to the next step.')}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6"><AdmissionNotice text={lang === 'en' ? admissionNoticeEn : admissionNoticeBn} lang={lang} /></div>
        <div className="mt-6 flex items-start gap-4 rounded-[1.25rem] border-2 border-gold bg-card p-5 shadow-sm sm:p-7">
          <Checkbox id="admission-agreement" checked={agreed} onCheckedChange={(value) => setAgreed(value === true)} className="mt-1 shrink-0" />
          <label htmlFor="admission-agreement" className="cursor-pointer text-sm font-semibold leading-6 text-foreground">{copy('আমি সম্পূর্ণ নোটিশটি পড়েছি এবং ভর্তি ও প্রতিষ্ঠানের সকল শর্তাবলিতে সম্মত আছি।', 'I have read the complete notice and agree to all admission and institution terms and conditions.')}</label>
        </div>
        <div className="mt-5 flex justify-end"><Button size="lg" className="h-12 w-full px-8 text-base sm:w-auto" disabled={!agreed} onClick={() => { setStep(1); setError(''); document.getElementById('apply')?.scrollIntoView({ behavior: 'instant' }); }}>{copy('সম্মত — পরবর্তী ধাপ', 'Agree — Next Step')}<ArrowRight className="size-4" /></Button></div>
      </> : <form onSubmit={submit} className="rounded-[1.25rem] border border-border bg-card p-5 shadow-sm sm:p-10">
        <h2 className="mb-6 font-display text-2xl font-bold text-primary">{copy('শিক্ষার্থীর তথ্য', 'Student Details')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {field('student_name')}
          {field('birth_date')}
          {field('guardian_name')}
          {field('phone')}
          {field('mother_name')}
          {field('mother_phone')}
          <label className="block text-sm font-semibold text-foreground sm:col-span-2 xl:col-span-3">{copy('শ্রেণি / বিভাগ', 'Applying for Class / Department')} *<select required aria-label={copy('শ্রেণি / বিভাগ', 'Applying for Class / Department')} value={form.program} onChange={(event) => setForm({ ...form, program: event.target.value })} className={inputClass}><option value="">{copy('নির্বাচন করুন', 'Select')}</option>{programs.map((program) => <option key={program.slug} value={program.name}>{t(program.name)}</option>)}</select></label>
          {(['শিক্ষার্থীর ছবি', 'জন্মনিবন্ধন'] as const).map((label) => {
            const doc = documents.find((item) => item.label === label);
            const name = label === 'শিক্ষার্থীর ছবি' ? copy('শিক্ষার্থীর ছবি', 'Student’s Photograph') : copy('জন্ম নিবন্ধনের কপি (ঐচ্ছিক)', 'Birth Registration Certificate (Optional)');
            return <div key={label} className="min-w-0 rounded-lg border border-dashed border-border p-4">
              <p className="text-sm font-semibold text-foreground">{name}{label === 'শিক্ষার্থীর ছবি' && ' *'}</p>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary"><Upload className="size-4 shrink-0" />{copy('ফাইল নির্বাচন করুন', 'Choose File')}<input aria-label={name} disabled={uploading || busy} type="file" accept={label === 'শিক্ষার্থীর ছবি' ? 'image/jpeg,image/png,image/webp' : 'image/jpeg,image/png,image/webp,application/pdf'} className="sr-only" onChange={(event) => { void upload(label, event.target.files?.[0]); event.target.value = ''; }} /></label>
              {doc && <div className="mt-3 flex min-w-0 items-center justify-between gap-2"><span data-no-translate className="truncate text-xs text-muted-foreground">{doc.name}</span><Button type="button" size="icon" variant="ghost" aria-label={copy('ফাইল সরান', 'Remove File')} onClick={() => setDocuments((previous) => previous.filter((item) => item.label !== label))}><X className="size-4" /></Button></div>}
            </div>;
          })}
        </div>
        {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
        <div className="mt-7 flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" disabled={busy} onClick={() => setStep(0)}><ArrowLeft className="size-4" />{copy('পেছনে', 'Back')}</Button><Button type="submit" disabled={busy || uploading}>{busy ? copy('জমা হচ্ছে...', 'Submitting...') : copy('আবেদন জমা দিন', 'Submit Application')}<ArrowRight className="size-4" /></Button></div>
      </form>}
      {step === 0 && error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  </section>;
}