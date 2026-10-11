import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { PAYMENT_PROVIDERS } from './payment-gateways';

export const getPaymentGateways = createServerFn({ method: 'GET' }).handler(async () => {
  const { readGateways } = await import('./payments.server');
  const credentials = {
    sslcommerz: Boolean(process.env['SSLCOMMERZ_STORE_ID'] && process.env['SSLCOMMERZ_STORE_PASSWORD']),
    aamarpay: Boolean(process.env['AAMARPAY_STORE_ID'] && process.env['AAMARPAY_SIGNATURE_KEY']),
  };
  return readGateways(credentials);
});

export const savePaymentGateway = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.enum(['sslcommerz','aamarpay','bkash','nagad','rocket','upay','shurjopay','portwallet','cod']), enabled: z.boolean(), mode: z.enum(['sandbox','live','manual']), account_number: z.string().trim().max(16), merchant_id: z.string().trim().max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: role, error } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (error || !role) throw new Error('অ্যাডমিন অনুমতি প্রয়োজন।');
    const provider = PAYMENT_PROVIDERS.find((p) => p.id === data.id);
    if (!provider || (provider.kind === 'onboarding' && data.enabled)) throw new Error('এই সেবাদাতার সরাসরি সংযোগ এখনও প্রস্তুত নয়।');
    if (provider.kind === 'wallet' && (data.mode !== 'manual' || (data.enabled && !/^01\d{9,11}$/.test(data.account_number)))) throw new Error('সঠিক পেমেন্ট নম্বর দিন।');
    if (provider.kind === 'automatic' && data.mode === 'manual') throw new Error('টেস্ট অথবা লাইভ নির্বাচন করুন।');
    if (provider.kind === 'automatic' && data.enabled) {
      const configured = data.id === 'sslcommerz'
        ? Boolean(process.env['SSLCOMMERZ_STORE_ID'] && process.env['SSLCOMMERZ_STORE_PASSWORD'])
        : Boolean(process.env['AAMARPAY_STORE_ID'] && process.env['AAMARPAY_SIGNATURE_KEY']);
      if (!configured) throw new Error('অনুমোদিত মার্চেন্ট হিসাবের গোপন তথ্য আগে নিরাপদে সংযুক্ত করতে হবে।');
    }
    const { error: saveError } = await context.supabase.from('payment_gateways').upsert({ ...data, updated_at: new Date().toISOString() });
    if (saveError) throw new Error('পেমেন্ট সেটিংস সংরক্ষণ করা যায়নি।');
    return { ok: true };
  });

export const testPaymentGateway = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.enum(['sslcommerz','aamarpay']) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId).eq('role','admin').maybeSingle();
    if (!role) throw new Error('অ্যাডমিন অনুমতি প্রয়োজন।');
    const { testConnection } = await import('./payments.server');
    const credentials = data.id === 'sslcommerz'
      ? { id: process.env['SSLCOMMERZ_STORE_ID'], secret: process.env['SSLCOMMERZ_STORE_PASSWORD'] }
      : { id: process.env['AAMARPAY_STORE_ID'], secret: process.env['AAMARPAY_SIGNATURE_KEY'] };
    return testConnection(data.id, credentials, new URL(getRequest().url).origin);
  });