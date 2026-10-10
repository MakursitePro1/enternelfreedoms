import type { Json } from '@/integrations/supabase/types';
export const orderStages = ['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'প্রক্রিয়াধীন', 'পাঠানো হয়েছে', 'সম্পন্ন'] as const;
export type OrderStatus = typeof orderStages[number] | 'বাতিল';
export const paymentStatuses = ['অপরিশোধিত', 'যাচাই অপেক্ষায়', 'পরিশোধিত', 'পেমেন্ট বাতিল', 'ফেরত দেওয়া হয়েছে'] as const;
export type PaymentStatus = typeof paymentStatuses[number];
export type OrderRecord = { id?: string; reference: string; customer_name: string; phone: string; address: string; items: Json; total: number; status: string; payment_method: string; payment_reference: string | null; payment_status: string; paid_amount: number; approved_at: string | null; courier_name: string | null; tracking_number: string | null; delivery_note: string | null; history: Json; created_at: string; updated_at: string };
export const money = (n: number) => `৳ ${Number(n).toLocaleString('bn-BD')}`;
export function orderItems(items: Json) { return (Array.isArray(items) ? items : []).flatMap((i) => i && typeof i === 'object' && !Array.isArray(i) && typeof i['title'] === 'string' && typeof i['price'] === 'number' && typeof i['quantity'] === 'number' ? [{ title: i['title'], price: i['price'], quantity: i['quantity'], id: typeof i['id'] === 'string' ? i['id'] : '' }] : []); }
export function nextStages(status: string): OrderStatus[] { const index = orderStages.findIndex((s) => s === status); const next = index >= 0 ? orderStages[index + 1] : undefined; return next ? [next, 'বাতিল'] : []; }
export function fictionalOrders(): OrderRecord[] {
 const names = ['আব্দুল্লাহ আল মামুন', 'মুহাম্মদ রায়হান', 'আহমাদ হাসান', 'ইয়াসিন আরাফাত', 'মাহমুদুল হাসান', 'সাইফুল ইসলাম', 'মুহাম্মদ নাঈম', 'আবু বকর সিদ্দিক', 'ইব্রাহিম খলিল', 'ওমর ফারুক', 'তানভীর আহমেদ', 'আবদুর রহমান', 'মেহেদী হাসান', 'রাশেদুল ইসলাম', 'মুহাম্মদ ইউসুফ', 'আনিসুর রহমান', 'মোস্তাফিজুর রহমান', 'আশরাফুল আলম'];
 const addresses = ['কলেজ রোড, গফরগাঁও, ময়মনসিংহ', 'সেক্টর ৭, উত্তরা, ঢাকা', 'পৌরসভা রোড, ভালুকা, ময়মনসিংহ', 'স্টেশন রোড, টঙ্গী, গাজীপুর', 'চরপাড়া, সদর, ময়মনসিংহ', 'মধ্যপাড়া, ত্রিশাল, ময়মনসিংহ'];
 const stages: OrderStatus[] = [...orderStages, 'বাতিল'];
 return names.map((customer_name, i) => {
  const status = stages[i % stages.length] ?? 'নতুন';
  const stage = status === 'বাতিল' ? 1 : orderStages.findIndex((s) => s === status);
  const payment_method = ['ক্যাশ অন ডেলিভারি', 'বিকাশ', 'নগদ'][i % 3] ?? 'ক্যাশ অন ডেলিভারি';
  const wallet = payment_method !== 'ক্যাশ অন ডেলিভারি', quantity = i % 4 === 2 ? 2 : i % 4 === 3 ? 3 : 1;
  const total = 1050 * quantity + (i % 3 === 0 ? 70 : 130);
  const paid = status !== 'বাতিল' && (stage >= 2 && wallet || stage === 5);
  const payment_status: PaymentStatus = status === 'বাতিল' && wallet ? 'পেমেন্ট বাতিল' : paid ? 'পরিশোধিত' : wallet ? 'যাচাই অপেক্ষায়' : 'অপরিশোধিত';
  const time = (step: number) => new Date(Date.UTC(2026, 9, 1 + i % 4, 8 + step)).toISOString();
  const history: Json[] = orderStages.slice(0, stage + 1).map((s, step) => ({ status: s, payment_status: paid && (wallet ? step >= 2 : step === 5) ? 'পরিশোধিত' : wallet ? 'যাচাই অপেক্ষায়' : 'অপরিশোধিত', at: time(step), note: ['অর্ডার গ্রহণ করা হয়েছে।', 'ক্রেতার তথ্য ও পেমেন্ট যাচাই চলছে।', 'অর্ডার অনুমোদন করা হয়েছে।', 'বই প্যাকেট প্রস্তুত করা হচ্ছে।', 'কুরিয়ারে বই হস্তান্তর করা হয়েছে।', 'বই পৌঁছেছে এবং মূল্য গ্রহণ নিশ্চিত হয়েছে।'][step] ?? '' }));
  if (status === 'বাতিল') history.push({ status, payment_status, at: time(2), note: 'ক্রেতার অনুরোধে অর্ডার বাতিল করা হয়েছে।' });
  return { id: `layout-${i}`, reference: `BK-V${String(10001 + i)}`, customer_name, phone: `01XXXXX${String(1000 + i)}`, address: addresses[i % addresses.length] ?? '', items: [{ id: 'fictional-magic-english', title: 'Magic English — Spoken & Written', price: 1050, quantity }], total, status, payment_method, payment_reference: wallet ? `TRX-V${String(730001 + i)}` : null, payment_status, paid_amount: paid ? total : 0, approved_at: status !== 'বাতিল' && stage >= 2 ? time(2) : null, courier_name: stage >= 4 ? 'কুরিয়ার সার্ভিস' : null, tracking_number: stage >= 4 ? `PARCEL-V${10001 + i}` : null, delivery_note: status === 'বাতিল' ? 'ক্রেতার অনুরোধে অর্ডার বাতিল।' : stage >= 4 ? 'ডেলিভারির আগে ফোন করে ঠিকানা নিশ্চিত করবে।' : stage >= 2 ? 'অনুমোদন সম্পন্ন; বই পাঠানোর প্রস্তুতি চলছে।' : 'পেমেন্ট ও ঠিকানা যাচাইয়ের পর পরবর্তী ধাপ জানানো হবে।', history, created_at: time(0), updated_at: time(status === 'বাতিল' ? 2 : stage) };
 });
}
