import { z } from 'zod';
import { isAdmissionProgram } from './admission-programs';

export const admissionDocumentSchema = z.object({
  label: z.enum(['শিক্ষার্থীর ছবি', 'জন্মনিবন্ধন']),
  name: z.string().trim().min(1).max(150),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  data: z.string().max(4_200_000).regex(/^data:(image\/(jpeg|png|webp)|application\/pdf);base64,[A-Za-z0-9+/]+={0,2}$/),
});
const person = z.string().trim().min(2, 'পূর্ণ নাম লিখুন।').max(120);
const phone = z.string().trim().regex(/^01[0-9]{9}$/, '১১ সংখ্যার সঠিক মোবাইল নম্বর দিন।');
export const admissionSchema = z.object({
  student_name: z.string().trim().min(2, 'শিক্ষার্থীর পূর্ণ নাম বাংলায় লিখুন।').max(120).regex(/^[\u0980-\u09FF\s.()\-]+$/, 'শিক্ষার্থীর পূর্ণ নাম বাংলা অক্ষরে লিখুন।'),
  student_name_en: z.string().trim().min(2, 'শিক্ষার্থীর পূর্ণ নাম ইংরেজিতে লিখুন।').max(120).regex(/^[A-Za-z\s.'()\-]+$/, 'শিক্ষার্থীর পূর্ণ নাম ইংরেজি অক্ষরে লিখুন।'),
  previous_school: z.string().trim().max(200, 'প্রতিষ্ঠানের নাম ২০০ অক্ষরের মধ্যে লিখুন।').optional().default(''),
  residential_experience: z.enum(['yes', 'no'], { errorMap: () => ({ message: 'আবাসিকে পড়াশোনা করার অভ্যাস আছে কিনা নির্বাচন করুন।' }) }),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'জন্ম তারিখ দিন।').refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
  }, 'সঠিক জন্ম তারিখ দিন।'),
  guardian_name: person,
  phone,
  mother_name: person,
  mother_phone: phone,
  guardian_note: z.string().trim().max(1000, 'মন্তব্য ১০০০ অক্ষরের মধ্যে লিখুন।').optional().default(''),
  program: z.string().trim().refine(isAdmissionProgram, 'শ্রেণি / বিভাগ নির্বাচন করুন।'),
  agreed: z.literal(true, { errorMap: () => ({ message: 'ভর্তির শর্তাবলিতে সম্মতি দিন।' }) }),
  documents: z.array(admissionDocumentSchema).min(1).max(2).superRefine((docs, ctx) => {
    const photo = docs.find((doc) => doc.label === 'শিক্ষার্থীর ছবি');
    if (!photo || !photo.type.startsWith('image/')) ctx.addIssue({ code: 'custom', message: 'শিক্ষার্থীর ছবি আবশ্যক।' });
    if (new Set(docs.map((doc) => doc.label)).size !== docs.length) ctx.addIssue({ code: 'custom', message: 'একই কাগজ একাধিকবার দেওয়া যাবে না।' });
    for (const doc of docs) {
      if (!doc.data.startsWith(`data:${doc.type};base64,`)) ctx.addIssue({ code: 'custom', message: 'ফাইলের ধরন সঠিক নয়।' });
    }
  }),
});
export type AdmissionDocument = z.infer<typeof admissionDocumentSchema>;