import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function AdmissionBirthDate({ value, onChange, lang }: { value: string; onChange: (value: string) => void; lang: string }) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;
  const locale = lang === 'en' ? enUS : bn;
  const title = lang === 'en' ? 'Date of Birth' : 'জন্ম তারিখ';
  return <div className="min-w-0">
    <label id="birth-date-label" className="text-sm font-semibold text-foreground">{title} *</label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button type="button" variant="outline" aria-label={title} aria-labelledby="birth-date-label" className="mt-2 h-14 w-full justify-between rounded-xl border-input bg-background px-4 font-normal text-foreground">
        <span className="flex min-w-0 items-center gap-3"><CalendarDays className="size-5 shrink-0 text-primary" /><span className="truncate">{selected ? selected.toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : lang === 'en' ? 'Select date of birth' : 'জন্ম তারিখ নির্বাচন করুন'}</span></span><ChevronDown className="size-4 shrink-0 text-primary" />
      </Button></PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] rounded-xl border-primary p-2">
        <Calendar mode="single" captionLayout="dropdown" locale={locale} startMonth={new Date(1900, 0)} endMonth={new Date()} defaultMonth={selected ?? new Date(2015, 0)} selected={selected} disabled={{ after: new Date() }} onSelect={(date) => { if (date) { onChange(format(date, 'yyyy-MM-dd')); setOpen(false); } }} className="pointer-events-auto" />
      </PopoverContent>
    </Popover>
  </div>;
}