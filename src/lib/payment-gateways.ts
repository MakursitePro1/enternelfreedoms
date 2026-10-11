import bkash from '@/assets/payments/bkash.svg.asset.json';
import nagad from '@/assets/payments/nagad.svg.asset.json';
import rocket from '@/assets/payments/rocket.svg.asset.json';
import upay from '@/assets/payments/upay.svg.asset.json';
import ssl from '@/assets/payments/sslcommerz.png.asset.json';
import aamar from '@/assets/payments/aamarpay.png.asset.json';
import shurjo from '@/assets/payments/shurjopay.png.asset.json';
import port from '@/assets/payments/portwallet.png.asset.json';

export const PAYMENT_PROVIDERS = [
  { id: 'sslcommerz', name: 'SSLCOMMERZ', label: 'এসএসএলকমার্জ', logo: ssl.url, kind: 'automatic', website: 'https://sslcommerz.com', credentials: ['SSLCOMMERZ_STORE_ID', 'SSLCOMMERZ_STORE_PASSWORD'] },
  { id: 'aamarpay', name: 'aamarPay', label: 'আমারপে', logo: aamar.url, kind: 'automatic', website: 'https://aamarpay.com', credentials: ['AAMARPAY_STORE_ID', 'AAMARPAY_SIGNATURE_KEY'] },
  { id: 'bkash', name: 'bKash', label: 'বিকাশ', logo: bkash.url, kind: 'wallet', website: 'https://www.bkash.com', credentials: [] },
  { id: 'nagad', name: 'Nagad', label: 'নগদ', logo: nagad.url, kind: 'wallet', website: 'https://nagad.com.bd', credentials: [] },
  { id: 'rocket', name: 'Rocket', label: 'রকেট', logo: rocket.url, kind: 'wallet', website: 'https://www.dutchbanglabank.com/rocket/rocket.html', credentials: [] },
  { id: 'upay', name: 'upay', label: 'উপায়', logo: upay.url, kind: 'wallet', website: 'https://www.upaybd.com', credentials: [] },
  { id: 'shurjopay', name: 'shurjoPay', label: 'সূর্যপে', logo: shurjo.url, kind: 'onboarding', website: 'https://shurjopay.com.bd', credentials: [] },
  { id: 'portwallet', name: 'PortWallet / PortPos', label: 'পোর্টওয়ালেট', logo: port.url, kind: 'onboarding', website: 'https://portpos.com', credentials: [] },
  { id: 'cod', name: 'Cash on delivery', label: 'ক্যাশ অন ডেলিভারি', logo: '', kind: 'cod', website: '', credentials: [] },
] as const;
export type PaymentGatewayId = typeof PAYMENT_PROVIDERS[number]['id'];
export type GatewayConfig = { id: string; enabled: boolean; mode: 'sandbox' | 'live' | 'manual'; account_number: string; merchant_id: string; ready: boolean; credentialsReady: boolean };
export function providerFor(id: string) { return PAYMENT_PROVIDERS.find((p) => p.id === id); }
export function methodFor(id: string) { const p = providerFor(id); return p?.kind === 'automatic' ? p.name : p?.label ?? ''; }
export function availableGateways(configs: GatewayConfig[]) { return configs.filter((g) => g.enabled && g.ready && providerFor(g.id)?.kind !== 'onboarding'); }