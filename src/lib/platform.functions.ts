import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getRequest } from '@tanstack/react-start/server';
import { availableGateways, methodFor, type PaymentGatewayId } from '@/lib/payment-gateways';
import type { Database } from '@/integrations/supabase/types';
import { mediaUrlSchema, requireAdminQuerySuccess } from './admin-validation';
import { admissionSchema } from './admission-schema';

// Works on any host (Lovable, Vercel): only the public project address/key are needed; access is enforced by database rules.
function dbClient(token?: string) {
  const url = process.env['SUPABASE_URL'] || import.meta.env['VITE_SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'] || import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('সার্ভার সংযোগ পাওয়া যায়নি।');
  return createClient<Database>(url, key, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch: (input, init) => { const h = new Headers(init?.headers); if (h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization'); h.set('apikey', key); return fetch(input, { ...init, headers: h }); },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}
function newRef(prefix: string) { return prefix + crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase(); }

const fileSchema = z.object({ name: z.string().min(1).max(150), type: z.string().regex(/^(image\/(jpeg|png|webp)|application\/pdf)$/), data: z.string().min(10).max(4_500_000) });

function decode(data: string) {
  const base64 = data.includes(',') ? data.split(',')[1] : data;
  const bin = atob(base64 ?? '');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function safeName(name: string) {
  return name.replace(/[^\w.-]+/g, '_').slice(-80);
}

export const submitAdmission = createServerFn({ method: 'POST' }).validator((data) => admissionSchema.parse(data)).handler(async ({ data }) => {
  const db = dbClient();
  const { documents, mother_name, mother_phone, agreed, guardian_note, previous_school, residential_experience, ...fields } = data;
  const reference = newRef('EF-');
  const saved: { label: string; name: string; path: string }[] = [];
  try {
  for (const doc of documents) {
    const bytes = decode(doc.data);
    if (bytes.byteLength > 3 * 1024 * 1024) throw new Error('প্রতিটি ফাইল ৩ MB-এর মধ্যে হতে হবে।');
    const valid = doc.type === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : doc.type === 'image/png' ? bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10'
      : doc.type === 'image/webp' ? new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP'
      : new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';
    if (!valid) throw new Error('ফাইলের ধরন সঠিক নয়।');
    const path = `${reference}/${Date.now()}-${safeName(doc.name)}`;
    const { error: upErr } = await db.storage.from('admission-docs').upload(path, bytes, { contentType: doc.type, upsert: false });
    if (upErr) throw new Error('কাগজপত্র আপলোড হয়নি। আবার চেষ্টা করুন।');
    saved.push({ label: doc.label, name: doc.name, path });
  }
  const notes = `মায়ের পূর্ণ নাম: ${mother_name}\nমায়ের মোবাইল নম্বর: ${mother_phone}\nভর্তির নোটিশ ও সকল শর্তাবলিতে সম্মতি: ${agreed ? 'হ্যাঁ' : 'না'}${guardian_note ? `\nঅভিভাবকের মন্তব্য / নোট: ${guardian_note}` : ''}`;
  const { error } = await db.from('admissions').insert({ ...fields, reference, documents: saved, address: '', previous_school: previous_school || null, residential_experience: residential_experience === 'yes', notes });
  if (error) throw new Error('আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
  return { reference };
  } catch (error) {
    if (saved.length) await db.storage.from('admission-docs').remove(saved.map((doc) => doc.path));
    throw error;
  }
});

export const trackAdmission = createServerFn({ method: 'POST' }).validator((data) => z.object({ reference: z.string().trim().max(30), phone: z.string().regex(/^01[0-9]{9}$/) }).parse(data)).handler(async ({ data }) => {
  const { data: row } = await dbClient().rpc('public_track_admission', { _reference: data.reference, _phone: data.phone });
  return (row ?? null) as { student_name: string; program: string; status: string; created_at: string } | null;
});

export const submitContact = createServerFn({ method: 'POST' }).validator((data) => z.object({ name: z.string().trim().min(2).max(120), phone: z.string().regex(/^01[0-9]{9}$/), email: z.string().email().max(150).optional().or(z.literal('')), subject: z.string().trim().min(2).max(120), message: z.string().trim().min(5).max(2000) }).parse(data)).handler(async ({ data }) => {
  const { error } = await dbClient().from('contact_messages').insert({ ...data, email: data.email || null });
  if (error) throw new Error('বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।');
  return { ok: true };
});

export const DELIVERY_ZONES = { inside: { label: 'ঢাকা সিটির ভিতরে', charge: 70 }, outside: { label: 'ঢাকা সিটির বাইরে', charge: 130 } } as const;
const orderSchema = z.object({ customer_name: z.string().trim().min(2).max(120), phone: z.string().regex(/^01[0-9]{9}$/), address: z.string().trim().min(8).max(500), payment_method: z.string().max(60), gateway_id: z.enum(['cod','bkash','nagad','rocket','upay','sslcommerz','aamarpay']).optional(), payment_reference: z.string().trim().max(100).optional(), delivery_zone: z.enum(['inside', 'outside']).optional(), items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30) });
export const submitOrder = createServerFn({ method: 'POST' }).validator((data) => orderSchema.parse(data)).handler(async ({ data }) => {
  const db = dbClient();
  const { readGateways, initiatePayment } = await import('@/lib/payments.server');
  const gateways = await readGateways({ sslcommerz: Boolean(process.env['SSLCOMMERZ_STORE_ID'] && process.env['SSLCOMMERZ_STORE_PASSWORD']), aamarpay: Boolean(process.env['AAMARPAY_STORE_ID'] && process.env['AAMARPAY_SIGNATURE_KEY']) }, { url: process.env['SUPABASE_URL'] || import.meta.env['VITE_SUPABASE_URL'], key: process.env['SUPABASE_PUBLISHABLE_KEY'] || import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] });
  const legacyId = data.payment_method === 'ক্যাশ অন ডেলিভারি' ? 'cod' : data.payment_method === 'বিকাশ' ? 'bkash' : data.payment_method === 'নগদ' ? 'nagad' : '';
  const gatewayId = data.gateway_id ?? legacyId;
  const gateway = availableGateways(gateways).find((g) => g.id === gatewayId);
  if (!gateway) throw new Error('এই পেমেন্ট পদ্ধতি এখন চালু নেই। অন্য পদ্ধতি নির্বাচন করুন।');
  const automatic = gateway.id === 'sslcommerz' || gateway.id === 'aamarpay';
  if (automatic && gateway.mode !== 'live') throw new Error('এই গেটওয়ে এখন টেস্ট অবস্থায়; প্রকৃত অর্ডারে ব্যবহার করা যাবে না।');
  if (!automatic && gateway.id !== 'cod' && (!data.payment_reference || data.payment_reference.length < 5)) throw new Error('পেমেন্টের ট্রানজেকশন আইডি প্রয়োজন।');
  const ids = data.items.map((x) => x.id);
  const { data: books, error: bookError } = await db.from('books').select('id,title,price,active').in('id', ids);
  if (bookError || !books || data.items.some((item) => !books.some((book) => book.id === item.id && book.active))) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।');
  const items = data.items.map((item) => { const book = books.find((b) => b.id === item.id); if (!book) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।'); return { id: book.id, title: book.title, price: Number(book.price), quantity: item.quantity }; });
  const zone = data.delivery_zone ? DELIVERY_ZONES[data.delivery_zone] : null;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (zone?.charge ?? 0);
  const address = zone ? `[${zone.label} · ডেলিভারি ৳${zone.charge}] ${data.address}` : data.address;
  const reference = newRef('BK-');
  const transaction = `PAY-${crypto.randomUUID().replaceAll('-','').slice(0,24)}`;
  let redirectUrl: string | null = null;
  if (automatic) {
    const credentials = gateway.id === 'sslcommerz' ? { id: process.env['SSLCOMMERZ_STORE_ID'], secret: process.env['SSLCOMMERZ_STORE_PASSWORD'] } : { id: process.env['AAMARPAY_STORE_ID'], secret: process.env['AAMARPAY_SIGNATURE_KEY'] };
    redirectUrl = await initiatePayment(gateway.id as 'sslcommerz' | 'aamarpay', 'live', credentials, transaction, total, data, new URL(getRequest().url).origin);
  }
  // Price, active books and configured payment method have all been independently validated above.
  // Manual orders (COD / wallet transaction ID) use only the public connection, so they work on any host (Vercel too); database rules keep them as new, unpaid, admin-reviewed orders.
  const orderDb = automatic ? (await import('@/integrations/supabase/client.server')).supabaseAdmin : db;
  const { error } = await orderDb.from('orders').insert({ reference, customer_name: data.customer_name, phone: data.phone, address, items, total, payment_method: methodFor(gateway.id as PaymentGatewayId), payment_reference: gateway.id === 'cod' ? null : automatic ? transaction : data.payment_reference ?? null });
  if (error) throw new Error('অর্ডার জমা দেওয়া যায়নি।');
  if (automatic) {
    const { error: attemptError } = await orderDb.from('payment_attempts').insert({ order_reference: reference, gateway: gateway.id, transaction_id: transaction, mode: 'live', amount: total });
    if (attemptError) { await orderDb.from('orders').update({ status: 'বাতিল' }).eq('reference',reference); throw new Error('পেমেন্ট শুরু করা যায়নি। আবার চেষ্টা করুন।'); }
  }
  return { reference, redirectUrl };
});

export const trackOrder = createServerFn({ method: 'POST' }).validator((data) => z.object({ reference: z.string().trim().max(30), phone: z.string().regex(/^01[0-9]{9}$/) }).parse(data)).handler(async ({ data }) => {
  const { data: row, error } = await dbClient().rpc('public_track_order', { _reference: data.reference, _phone: data.phone });
  if (error) throw new Error('অর্ডারের তথ্য পাওয়া যায়নি।');
  return (row ?? null) as unknown as Database['public']['Tables']['orders']['Row'] | null;
});

async function verifyAdmin(token: string) {
  const db = dbClient(token);
  const { data: { user }, error } = await db.auth.getUser(token);
  if (error || !user) throw new Error('লগইন প্রয়োজন।');
  const { data: role } = await db.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  if (!role) throw new Error('অ্যাডমিন অনুমতি নেই।');
  return db;
}

export const getAdminData = createServerFn({ method: 'POST' }).validator((data) => z.object({ token: z.string().min(10) }).parse(data)).handler(async ({ data }) => {
  const db = await verifyAdmin(data.token);
  const [admissions, orders, books, notices, content, messages, settings] = await Promise.all([
    db.from('admissions').select('*').order('created_at', { ascending: false }),
    db.from('orders').select('*').order('created_at', { ascending: false }),
    db.from('books').select('*').order('created_at', { ascending: false }),
    db.from('notices').select('*').order('published_at', { ascending: false }),
    db.from('institution_content').select('*').order('sort_order', { ascending: true }),
    db.from('contact_messages').select('*').order('created_at', { ascending: false }),
    db.from('site_settings').select('key,value'),
  ]);
  requireAdminQuerySuccess([admissions, orders, books, notices, content, messages, settings]);
  return { admissions: admissions.data ?? [], orders: orders.data ?? [], books: books.data ?? [], notices: notices.data ?? [], content: content.data ?? [], messages: messages.data ?? [], settings: settings.data ?? [] };
});

const contentKindEnum = z.enum(['teacher', 'achievement', 'event', 'gallery', 'testimonial', 'facility', 'meal', 'program', 'stat', 'video', 'safety', 'fee', 'faq', 'news']);
const editSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('admission'), id: z.string().uuid(), status: z.enum(['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল']) }),
  z.object({ kind: z.literal('admission_trash'), id: z.string().uuid(), trashed: z.boolean() }),
  z.object({ kind: z.literal('order'), id: z.string().uuid(), status: z.enum(['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'প্রক্রিয়াধীন', 'পাঠানো হয়েছে', 'সম্পন্ন', 'বাতিল']), payment_status: z.enum(['অপরিশোধিত', 'যাচাই অপেক্ষায়', 'পরিশোধিত', 'পেমেন্ট বাতিল', 'ফেরত দেওয়া হয়েছে']).optional(), paid_amount: z.number().nonnegative().optional(), courier_name: z.string().trim().max(100).optional(), tracking_number: z.string().trim().max(100).optional(), delivery_note: z.string().trim().max(1000).optional() }),
  z.object({ kind: z.literal('message'), id: z.string().uuid(), status: z.enum(['নতুন', 'উত্তর দেওয়া হয়েছে', 'সম্পন্ন']) }),
  z.object({ kind: z.literal('notice'), id: z.string().uuid().optional(), title: z.string().min(3).max(200), body: z.string().max(5000), category: z.string().min(1).max(50), file_url: mediaUrlSchema.optional() }),
  z.object({ kind: z.literal('book'), id: z.string().uuid().optional(), title: z.string().min(2).max(200), description: z.string().max(3000), details: z.string().max(5000).optional(), author: z.string().max(150).optional(), pages: z.number().int().min(0).max(5000).optional(), price: z.number().nonnegative(), cover_url: mediaUrlSchema.optional(), active: z.boolean() }),
  z.object({ kind: z.literal('content'), id: z.string().uuid().optional(), content_kind: contentKindEnum, title: z.string().trim().min(2).max(200), body: z.string().max(5000), image_url: mediaUrlSchema.optional(), detail: z.string().max(500).optional(), category: z.string().max(100).optional(), published: z.boolean(), sort_order: z.number().int().min(0).max(10000) }),
  z.object({ kind: z.literal('settings'), values: z.record(z.string().max(60), z.string().max(1500)) }),
  z.object({ kind: z.literal('delete'), target: z.enum(['notice', 'book', 'content', 'message']), id: z.string().uuid() }),
]);

export type AdminChange = z.infer<typeof editSchema>;
export const adminSave = createServerFn({ method: 'POST' }).validator((data) => z.object({ token: z.string().min(10), change: editSchema }).parse(data)).handler(async ({ data }) => {
  const db = await verifyAdmin(data.token);
  const change = data.change;
  let result: { error: unknown; data?: unknown };
  let targeted = false;
  if (change.kind === 'delete') {
    const table = change.target === 'notice' ? 'notices' : change.target === 'book' ? 'books' : change.target === 'message' ? 'contact_messages' : 'institution_content';
    targeted = true;
    result = await db.from(table).delete().eq('id', change.id).select('id');
  } else if (change.kind === 'admission') result = await db.from('admissions').update({ status: change.status }).eq('id', change.id).select('id');
  else if (change.kind === 'admission_trash') result = await db.from('admissions').update({ deleted_at: change.trashed ? new Date().toISOString() : null }).eq('id', change.id).select('id');
   else if (change.kind === 'order') { const fields = { status: change.status, ...(change.payment_status !== undefined ? { payment_status: change.payment_status } : {}), ...(change.paid_amount !== undefined ? { paid_amount: change.paid_amount } : {}), ...(change.courier_name !== undefined ? { courier_name: change.courier_name } : {}), ...(change.tracking_number !== undefined ? { tracking_number: change.tracking_number } : {}), ...(change.delivery_note !== undefined ? { delivery_note: change.delivery_note } : {}) }; result = await db.from('orders').update(fields).eq('id', change.id).select('id'); }
  else if (change.kind === 'message') result = await db.from('contact_messages').update({ status: change.status }).eq('id', change.id).select('id');
  else if (change.kind === 'notice') { const payload = { title: change.title, body: change.body, category: change.category, file_url: change.file_url || null }; result = change.id ? await db.from('notices').update(payload).eq('id', change.id).select('id') : await db.from('notices').insert(payload); }
  else if (change.kind === 'book') {
    const payload = { title: change.title, description: change.description, details: change.details || null, author: change.author || null, pages: change.pages ?? null, price: change.price, cover_url: change.cover_url || null, active: change.active };
    if (change.id) { const current = await db.from('books').select('slug').eq('id', change.id).single(); if (current.error) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।'); result = await db.from('books').update({ ...payload, ...(current.data.slug?.startsWith('demo-') ? { slug: null } : {}) }).eq('id', change.id).select('id'); }
    else result = await db.from('books').insert(payload);
  } else if (change.kind === 'settings') {
    const rows = Object.entries(change.values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    result = await db.from('site_settings').upsert(rows, { onConflict: 'key' });
  } else {
    const payload = { kind: change.content_kind, title: change.title, body: change.body, image_url: change.image_url || null, detail: change.detail || null, category: change.category || null, published: change.published, sort_order: change.sort_order };
    // Keep teacher identity markers stable when names and profile fields change.
    result = change.id ? await db.from('institution_content').update(change.content_kind === 'teacher' ? payload : { ...payload, slug: null }).eq('id', change.id).select('id') : await db.from('institution_content').insert(payload);
  }
  targeted = targeted || ('id' in change && Boolean(change.id));
  if (targeted && Array.isArray(result.data) && result.data.length === 0) throw new Error('তথ্যটি আর পাওয়া যাচ্ছে না। তালিকা হালনাগাদ করুন।');
  if (result.error) throw new Error('পরিবর্তন সংরক্ষণ করা যায়নি।');
  return { ok: true };
});

export const adminUpload = createServerFn({ method: 'POST' }).validator((data) => z.object({ token: z.string().min(10), file: fileSchema }).parse(data)).handler(async ({ data }) => {
  const db = await verifyAdmin(data.token);
  const bytes = decode(data.file.data);
  if (bytes.byteLength > 3 * 1024 * 1024) throw new Error('ফাইল ৩ MB-এর বেশি।');
  const path = `uploads/${Date.now()}-${safeName(data.file.name)}`;
  const { error } = await db.storage.from('site-media').upload(path, bytes, { contentType: data.file.type });
  if (error) throw new Error('ছবি আপলোড করা যায়নি।');
  const { data: signed, error: signErr } = await db.storage.from('site-media').createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !signed) throw new Error('ছবির লিংক তৈরি করা যায়নি।');
  return { url: signed.signedUrl };
});

export const adminDocumentLink = createServerFn({ method: 'POST' }).validator((data) => z.object({ token: z.string().min(10), path: z.string().min(3).max(300) }).parse(data)).handler(async ({ data }) => {
  const db = await verifyAdmin(data.token);
  const { data: signed, error } = await db.storage.from('admission-docs').createSignedUrl(data.path, 60 * 30);
  if (error || !signed) throw new Error('ফাইল খোলা যায়নি।');
  return { url: signed.signedUrl };
});
