import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { ShieldCheck, Search, CheckCircle2, Clock, XCircle, FileSearch } from 'lucide-react';
import { Site } from '@/components/Site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLang } from '@/lib/i18n';
import { pageSeo } from '@/lib/seo-pages';
import { trackAdmission } from '@/lib/platform.functions';
import { admissionPrograms } from '@/lib/admission-programs';

const programLabel = (p: string, lang: string) => (lang === 'en' ? admissionPrograms.find(([b]) => b === p)?.[1] ?? p : p);

export const Route = createFileRoute('/admission-status')({
  head: (ctx) => pageSeo(ctx, '/admission-status'),
  component: AdmissionStatus,
});

const stages = ['নতুন', 'যাচাই চলছে', 'অনুমোদিত'] as const;
const stageEn: Record<string, string> = { 'নতুন': 'Received', 'যাচাই চলছে': 'Under review', 'অনুমোদিত': 'Approved', 'বাতিল': 'Not approved' };
const stageBn: Record<string, string> = { 'নতুন': 'আবেদন গৃহীত', 'যাচাই চলছে': 'যাচাই চলছে', 'অনুমোদিত': 'অনুমোদিত', 'বাতিল': 'অনুমোদিত হয়নি' };

type Result = Awaited<ReturnType<typeof trackAdmission>>;

function AdmissionStatus() {
  const { lang } = useLang();
  const c = (bn: string, en: string) => (lang === 'en' ? en : bn);
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | undefined>(undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setResult(undefined);
    const ref = reference.trim().toUpperCase();
    const ph = phone.replace(/[^0-9]/g, '');
    if (!/^EF-[A-Z0-9]{6,20}$/.test(ref)) return setError(c('সঠিক আবেদন নম্বর লিখুন (যেমন EF-XXXXXXXXXX)।', 'Enter a valid application ID (e.g. EF-XXXXXXXXXX).'));
    if (!/^01[0-9]{9}$/.test(ph)) return setError(c('আবেদনে দেওয়া ১১ সংখ্যার মোবাইল নম্বর লিখুন।', 'Enter the 11-digit mobile number used in the application.'));
    setLoading(true);
    try { setResult(await trackAdmission({ data: { reference: ref, phone: ph } })); }
    catch { setError(c('এখন তথ্য আনা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।', 'Could not check right now. Please try again later.')); }
    finally { setLoading(false); }
  }

  const current = result ? stages.indexOf(result.status as (typeof stages)[number]) : -1;
  const rejected = result?.status === 'বাতিল';

  return (
    <Site>
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold bg-secondary px-4 py-1.5 text-sm font-semibold text-primary"><ShieldCheck className="size-4" />{c('নিরাপদ অনুসন্ধান', 'Secure lookup')}</span>
            <h1 className="mt-4 font-display text-3xl font-bold text-primary sm:text-4xl">{c('ভর্তি আবেদনের অবস্থা', 'Admission Application Status')}</h1>
            <p className="mt-3 text-muted-foreground">{c('আবেদন নম্বর ও আবেদনে দেওয়া বাবার মোবাইল নম্বর দিয়ে সন্তানের আবেদনের বর্তমান অবস্থা দেখুন।', "Enter the application ID and the father's mobile number given in the application to see the current status.")}</p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5 shadow-elegant sm:p-8">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">{c('আবেদন নম্বর', 'Application ID')}</span>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="EF-XXXXXXXXXX" maxLength={30} autoComplete="off" className="h-12 uppercase" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">{c('মোবাইল নম্বর', 'Mobile number')}</span>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" inputMode="numeric" maxLength={14} className="h-12" /></label>
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="h-12 w-full text-base"><Search className="size-5" />{loading ? c('খোঁজা হচ্ছে…', 'Checking…') : c('অবস্থা দেখুন', 'Check status')}</Button>
            <p className="text-center text-xs text-muted-foreground">{c('নিরাপত্তার জন্য দুটি তথ্যই মিললে কেবল সীমিত তথ্য দেখানো হয়।', 'For safety, only limited details are shown when both match.')}</p>
          </form>

          {result === null && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card p-5"><FileSearch className="size-6 shrink-0 text-muted-foreground" /><p>{c('এই আবেদন নম্বর ও মোবাইল নম্বরে কোনো আবেদন পাওয়া যায়নি। তথ্য আবার মিলিয়ে দেখুন।', 'No application matched this ID and mobile number. Please check and try again.')}</p></div>
          )}

          {result && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-elegant sm:p-8">
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div><dt className="text-muted-foreground">{c('শিক্ষার্থী', 'Student')}</dt><dd data-no-translate className="font-semibold">{result.student_name}</dd></div>
                <div><dt className="text-muted-foreground">{c('শ্রেণি/বিভাগ', 'Class/Department')}</dt><dd className="font-semibold">{programLabel(result.program, lang)}</dd></div>
                <div><dt className="text-muted-foreground">{c('আবেদনের তারিখ', 'Applied on')}</dt><dd className="font-semibold">{new Date(result.created_at).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD')}</dd></div>
              </dl>
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">{c('বর্তমান অবস্থা', 'Current status')}</p>
                <p className={`mt-1 text-2xl font-bold ${rejected ? 'text-destructive' : 'text-primary'}`}>{(lang === 'en' ? stageEn : stageBn)[result.status] ?? result.status}</p>
                {!rejected ? (
                  <ol className="mt-5 grid grid-cols-3 gap-2">
                    {stages.map((s, i) => { const done = i <= current; const Icon = i < current || (i === current && i === 2) ? CheckCircle2 : Clock; return (
                      <li key={s} className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center text-xs sm:text-sm ${done ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'}`}><Icon className="size-5" />{(lang === 'en' ? stageEn : stageBn)[s]}</li>
                    ); })}
                  </ol>
                ) : (
                  <p className="mt-4 flex items-start gap-2 text-sm"><XCircle className="size-5 shrink-0 text-destructive" />{c('বিস্তারিত জানতে প্রতিষ্ঠানের সাথে যোগাযোগ করুন।', 'Please contact the institute for details.')}</p>
                )}
                <Link to="/contact" className="mt-5 inline-block text-sm font-semibold text-primary underline underline-offset-4">{c('প্রশ্ন থাকলে যোগাযোগ করুন', 'Questions? Contact us')}</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </Site>
  );
}
