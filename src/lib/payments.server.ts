import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { PAYMENT_PROVIDERS, type GatewayConfig } from './payment-gateways';

type Credentials = { id: string | undefined; secret: string | undefined };
type Customer = { customer_name: string; phone: string; address: string };
export async function readGateways(credentials: { sslcommerz: boolean; aamarpay: boolean }, connection: { url: string; key: string }) {
  // The caller supplies server configuration; this helper never reads secrets at module scope.
  const { url, key } = connection;
  const db = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => { const headers = new Headers(init?.headers); if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input, { ...init, headers }); } } });
  const [{ data, error }, { data: settings }] = await Promise.all([db.from('payment_gateways').select('*'), db.from('site_settings').select('key,value').in('key',['bkash','nagad'])]);
  if (error) throw new Error('পেমেন্ট পদ্ধতি পাওয়া যায়নি।');
  return PAYMENT_PROVIDERS.map((p): GatewayConfig => {
    const stored = data?.find((row) => row.id === p.id);
    const legacy = settings?.find((row) => row.key === p.id)?.value ?? '';
    const account = (stored?.account_number ?? legacy).replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit))).replace(/[\s-]/g, '');
    const credentialsReady = p.id === 'sslcommerz' ? credentials.sslcommerz : p.id === 'aamarpay' ? credentials.aamarpay : false;
    const ready = p.kind === 'cod' || (p.kind === 'wallet' && /^01\d{9,11}$/.test(account) && !/^0170+$/.test(account)) || (p.kind === 'automatic' && credentialsReady);
    return { id: p.id, enabled: stored?.enabled ?? p.kind === 'cod', mode: (stored?.mode as GatewayConfig['mode']) ?? (p.kind === 'automatic' ? 'sandbox' : 'manual'), account_number: account, merchant_id: stored?.merchant_id ?? '', credentialsReady, ready };
  });
}

async function requestJson(url: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error('পেমেন্ট সেবাদাতার সঙ্গে সংযোগ করা যায়নি।');
  const json: unknown = await response.json();
  if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('পেমেন্ট সেবাদাতা সঠিক উত্তর দেয়নি।');
  return json as Record<string, unknown>;
}
export function trustedCheckoutUrl(raw: unknown, gateway: string): string {
  if (typeof raw !== 'string') throw new Error('পেমেন্ট লিংক পাওয়া যায়নি।');
  const url = new URL(raw);
  const domain = gateway === 'sslcommerz' ? 'sslcommerz.com' : 'aamarpay.com';
  if (url.protocol !== 'https:' || !(url.hostname === domain || url.hostname.endsWith(`.${domain}`))) throw new Error('পেমেন্ট লিংক নিরাপদ নয়।');
  return url.href;
}
export async function initiatePayment(gateway: 'sslcommerz' | 'aamarpay', mode: 'sandbox' | 'live', credentials: Credentials, transaction: string, amount: number, customer: Customer, origin: string) {
  if (!credentials.id || !credentials.secret) throw new Error('মার্চেন্ট সংযোগের তথ্য এখনও দেওয়া হয়নি।');
  const callback = `${origin}/api/public/payments/${gateway}`;
  if (gateway === 'sslcommerz') {
    const host = mode === 'sandbox' ? 'sandbox.sslcommerz.com' : 'securepay.sslcommerz.com';
    const body = new URLSearchParams({ store_id: credentials.id, store_passwd: credentials.secret, total_amount: amount.toFixed(2), currency: 'BDT', tran_id: transaction, success_url: callback, fail_url: callback, cancel_url: callback, ipn_url: callback, cus_name: customer.customer_name, cus_email: 'orders@eternelfreedom.invalid', cus_add1: customer.address, cus_city: 'Bangladesh', cus_country: 'Bangladesh', cus_phone: customer.phone, shipping_method: 'NO', num_of_item: '1', product_name: 'Books', product_category: 'Books', product_profile: 'physical-goods' });
    const result = await requestJson(`https://${host}/gwprocess/v4/api.php`, { method: 'POST', body });
    if (result['status'] !== 'SUCCESS') throw new Error('মার্চেন্ট সংযোগ যাচাই হয়নি।');
    return trustedCheckoutUrl(result['GatewayPageURL'], gateway);
  }
  const host = mode === 'sandbox' ? 'sandbox.aamarpay.com' : 'secure.aamarpay.com';
  const result = await requestJson(`https://${host}/jsonpost.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ store_id: credentials.id, signature_key: credentials.secret, tran_id: transaction, amount: amount.toFixed(2), currency: 'BDT', cus_name: customer.customer_name, cus_email: 'orders@eternelfreedom.invalid', cus_phone: customer.phone, cus_add1: customer.address, cus_city: 'Bangladesh', cus_country: 'Bangladesh', success_url: callback, fail_url: callback, cancel_url: callback, desc: 'Book purchase', type: 'json' }) });
  return trustedCheckoutUrl(result['payment_url'], gateway);
}
export async function testConnection(gateway: 'sslcommerz' | 'aamarpay', credentials: Credentials, origin: string) {
  const url = await initiatePayment(gateway, 'sandbox', credentials, `TEST-${crypto.randomUUID().replaceAll('-','').slice(0,20)}`, 1, { customer_name: 'Connection Test', phone: '01700000000', address: 'Connection verification' }, origin);
  return { url };
}

export async function verifyPayment(gateway: string, mode: string, credentials: Credentials, transaction: string, validationId: string) {
  if (!credentials.id || !credentials.secret) throw new Error('Payment credentials missing');
  if (gateway === 'sslcommerz') {
    if (!validationId) return null;
    const host = mode === 'sandbox' ? 'sandbox.sslcommerz.com' : 'securepay.sslcommerz.com';
    const params = new URLSearchParams({ val_id: validationId, store_id: credentials.id, store_passwd: credentials.secret, format: 'json' });
    const result = await requestJson(`https://${host}/validator/api/validationserverAPI.php?${params}`);
    if (!['VALID','VALIDATED'].includes(String(result['status'])) || result['tran_id'] !== transaction || result['currency'] !== 'BDT' || String(result['risk_level'] ?? '0') !== '0' || !result['bank_tran_id']) return null;
    return { amount: Number(result['amount']), providerReference: String(result['bank_tran_id']) };
  }
  if (gateway !== 'aamarpay') return null;
  const host = mode === 'sandbox' ? 'sandbox.aamarpay.com' : 'secure.aamarpay.com';
  const params = new URLSearchParams({ request_id: transaction, store_id: credentials.id, signature_key: credentials.secret, type: 'json' });
  const result = await requestJson(`https://${host}/api/v1/trxcheck/request.php?${params}`);
  if (String(result['pay_status']) !== 'Successful' || String(result['status_code']) !== '2' || result['mer_txnid'] !== transaction || result['currency'] !== 'BDT' || !result['pg_txnid']) return null;
  return { amount: Number(result['amount']), providerReference: String(result['pg_txnid']) };
}