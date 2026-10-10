import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const fileSchema = z.object({ name: z.string().min(1).max(150), type: z.string().regex(/^(image\/(jpeg|png|webp)|application\/pdf)$/), data: z.string().min(10).max(4_500_000) });
const admissionSchema = z.object({ student_name: z.string().trim().min(2).max(120), birth_date: z.string().optional(), program: z.string().min(2).max(100), guardian_name: z.string().trim().min(2).max(120), phone: z.string().regex(/^01[0-9]{9}$/), address: z.string().trim().min(5).max(500), previous_school: z.string().max(150).optional(), notes: z.string().max(1000).optional(), documents: z.array(fileSchema.extend({ label: z.string().max(80) })).max(4).optional() });

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
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { documents, ...fields } = data;
  const { data: row, error } = await supabaseAdmin.from('admissions').insert({ ...fields, birth_date: fields.birth_date || null, previous_school: fields.previous_school ?? null, notes: fields.notes ?? null }).select('id,reference').single();
  if (error || !row) throw new Error('আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
  if (documents?.length) {
    const saved: { label: string; name: string; path: string }[] = [];
    for (const doc of documents) {
      const bytes = decode(doc.data);
      if (bytes.byteLength > 3 * 1024 * 1024) continue;
      const path = `${row.reference}/${Date.now()}-${safeName(doc.name)}`;
      const { error: upErr } = await supabaseAdmin.storage.from('admission-docs').upload(path, bytes, { contentType: doc.type, upsert: false });
      if (!upErr) saved.push({ label: doc.label, name: doc.name, path });
    }
    if (saved.length) await supabaseAdmin.from('admissions').update({ documents: saved }).eq('id', row.id);
  }
  return { reference: row.reference };
});

export const trackAdmission = createServerFn({ method: 'POST' }).validator((data) => z.object({ reference: z.string().trim().max(30), phone: z.string().regex(/^01[0-9]{9}$/) }).parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: row } = await supabaseAdmin.from('admissions').select('student_name,program,status,created_at').eq('reference', data.reference.toUpperCase()).eq('phone', data.phone).maybeSingle();
  return row;
});

export const submitContact = createServerFn({ method: 'POST' }).validator((data) => z.object({ name: z.string().trim().min(2).max(120), phone: z.string().regex(/^01[0-9]{9}$/), email: z.string().email().max(150).optional().or(z.literal('')), subject: z.string().trim().min(2).max(120), message: z.string().trim().min(5).max(2000) }).parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.from('contact_messages').insert({ ...data, email: data.email || null });
  if (error) throw new Error('বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।');
  return { ok: true };
});

export const DELIVERY_ZONES = { inside: { label: 'ঢাকা সিটির ভিতরে', charge: 70 }, outside: { label: 'ঢাকা সিটির বাইরে', charge: 130 } } as const;
const orderSchema = z.object({ customer_name: z.string().trim().min(2).max(120), phone: z.string().regex(/^01[0-9]{9}$/), address: z.string().trim().min(8).max(500), payment_method: z.enum(['ক্যাশ অন ডেলিভারি', 'বিকাশ', 'নগদ']), payment_reference: z.string().trim().max(100).optional(), delivery_zone: z.enum(['inside', 'outside']).optional(), items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30) });
export const submitOrder = createServerFn({ method: 'POST' }).validator((data) => orderSchema.parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  if (data.payment_method !== 'ক্যাশ অন ডেলিভারি' && (!data.payment_reference || data.payment_reference.length < 5)) throw new Error('পেমেন্টের ট্রানজেকশন আইডি প্রয়োজন।');
  const ids = data.items.map((x) => x.id);
  const { data: books, error: bookError } = await supabaseAdmin.from('books').select('id,title,price,active').in('id', ids);
  if (bookError || !books || data.items.some((item) => !books.some((book) => book.id === item.id && book.active))) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।');
  const items = data.items.map((item) => { const book = books.find((b) => b.id === item.id); if (!book) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।'); return { id: book.id, title: book.title, price: Number(book.price), quantity: item.quantity }; });
  const zone = data.delivery_zone ? DELIVERY_ZONES[data.delivery_zone] : null;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (zone?.charge ?? 0);
  const address = zone ? `[${zone.label} · ডেলিভারি ৳${zone.charge}] ${data.address}` : data.address;
  const { data: row, error } = await supabaseAdmin.from('orders').insert({ customer_name: data.customer_name, phone: data.phone, address, items, total, payment_method: data.payment_method, payment_reference: data.payment_method === 'ক্যাশ অন ডেলিভারি' ? null : data.payment_reference ?? null }).select('reference').single();
  if (error) throw new Error('অর্ডার জমা দেওয়া যায়নি।');
  return row;
});

export const trackOrder = createServerFn({ method: 'POST' }).validator((data) => z.object({ reference: z.string().trim().max(30), phone: z.string().regex(/^01[0-9]{9}$/) }).parse(data)).handler(async ({ data }) => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
   const { data: row, error } = await supabaseAdmin.from('orders').select('reference,customer_name,phone,address,items,status,created_at,total,payment_method,payment_reference,payment_status,paid_amount,approved_at,courier_name,tracking_number,delivery_note,history,updated_at').eq('reference', data.reference.toUpperCase()).eq('phone', data.phone).maybeSingle();
   if (error) throw new Error('অর্ডারের তথ্য পাওয়া যায়নি।');
  return row;
});

async function verifyAdmin(token: string) {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw new Error('লগইন প্রয়োজন।');
  const { data: role } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  if (!role) throw new Error('অ্যাডমিন অনুমতি নেই।');
  return supabaseAdmin;
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
  return { admissions: admissions.data ?? [], orders: orders.data ?? [], books: books.data ?? [], notices: notices.data ?? [], content: content.data ?? [], messages: messages.data ?? [], settings: settings.data ?? [] };
});

const contentKindEnum = z.enum(['teacher', 'achievement', 'event', 'gallery', 'testimonial', 'facility', 'meal', 'program', 'stat', 'video', 'safety', 'fee', 'faq', 'news']);
const editSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('admission'), id: z.string().uuid(), status: z.enum(['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'বাতিল']) }),
  z.object({ kind: z.literal('admission_trash'), id: z.string().uuid(), trashed: z.boolean() }),
  z.object({ kind: z.literal('order'), id: z.string().uuid(), status: z.enum(['নতুন', 'যাচাই চলছে', 'অনুমোদিত', 'প্রক্রিয়াধীন', 'পাঠানো হয়েছে', 'সম্পন্ন', 'বাতিল']), payment_status: z.enum(['অপরিশোধিত', 'যাচাই অপেক্ষায়', 'পরিশোধিত', 'পেমেন্ট বাতিল', 'ফেরত দেওয়া হয়েছে']).optional(), paid_amount: z.number().nonnegative().optional(), courier_name: z.string().trim().max(100).optional(), tracking_number: z.string().trim().max(100).optional(), delivery_note: z.string().trim().max(1000).optional() }),
  z.object({ kind: z.literal('message'), id: z.string().uuid(), status: z.enum(['নতুন', 'উত্তর দেওয়া হয়েছে', 'সম্পন্ন']) }),
  z.object({ kind: z.literal('notice'), id: z.string().uuid().optional(), title: z.string().min(3).max(200), body: z.string().max(5000), category: z.string().min(1).max(50), file_url: z.string().url().optional() }),
  z.object({ kind: z.literal('book'), id: z.string().uuid().optional(), title: z.string().min(2).max(200), description: z.string().max(3000), details: z.string().max(5000).optional(), author: z.string().max(150).optional(), pages: z.number().int().min(0).max(5000).optional(), price: z.number().nonnegative(), cover_url: z.string().url().optional(), active: z.boolean() }),
  z.object({ kind: z.literal('content'), id: z.string().uuid().optional(), content_kind: contentKindEnum, title: z.string().trim().min(2).max(200), body: z.string().max(5000), image_url: z.string().url().optional(), detail: z.string().max(500).optional(), category: z.string().max(100).optional(), published: z.boolean(), sort_order: z.number().int().min(0).max(10000) }),
  z.object({ kind: z.literal('settings'), values: z.record(z.string().max(60), z.string().max(500)) }),
  z.object({ kind: z.literal('delete'), target: z.enum(['notice', 'book', 'content', 'message']), id: z.string().uuid() }),
]);

export type AdminChange = z.infer<typeof editSchema>;
export const adminSave = createServerFn({ method: 'POST' }).validator((data) => z.object({ token: z.string().min(10), change: editSchema }).parse(data)).handler(async ({ data }) => {
  const db = await verifyAdmin(data.token);
  const change = data.change;
  let result: { error: unknown };
  if (change.kind === 'delete') {
    const table = change.target === 'notice' ? 'notices' : change.target === 'book' ? 'books' : change.target === 'message' ? 'contact_messages' : 'institution_content';
    result = await db.from(table).delete().eq('id', change.id);
  } else if (change.kind === 'admission') result = await db.from('admissions').update({ status: change.status }).eq('id', change.id);
  else if (change.kind === 'admission_trash') result = await db.from('admissions').update({ deleted_at: change.trashed ? new Date().toISOString() : null }).eq('id', change.id);
   else if (change.kind === 'order') { const fields = { status: change.status, ...(change.payment_status !== undefined ? { payment_status: change.payment_status } : {}), ...(change.paid_amount !== undefined ? { paid_amount: change.paid_amount } : {}), ...(change.courier_name !== undefined ? { courier_name: change.courier_name } : {}), ...(change.tracking_number !== undefined ? { tracking_number: change.tracking_number } : {}), ...(change.delivery_note !== undefined ? { delivery_note: change.delivery_note } : {}) }; result = await db.from('orders').update(fields).eq('id', change.id); }
  else if (change.kind === 'message') result = await db.from('contact_messages').update({ status: change.status }).eq('id', change.id);
  else if (change.kind === 'notice') { const payload = { title: change.title, body: change.body, category: change.category, file_url: change.file_url || null }; result = change.id ? await db.from('notices').update(payload).eq('id', change.id) : await db.from('notices').insert(payload); }
  else if (change.kind === 'book') {
    const payload = { title: change.title, description: change.description, details: change.details || null, author: change.author || null, pages: change.pages ?? null, price: change.price, cover_url: change.cover_url || null, active: change.active };
    if (change.id) { await db.from('books').update({ slug: null }).eq('id', change.id).like('slug', 'demo-%'); result = await db.from('books').update(payload).eq('id', change.id); }
    else result = await db.from('books').insert(payload);
  } else if (change.kind === 'settings') {
    const rows = Object.entries(change.values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    result = await db.from('site_settings').upsert(rows, { onConflict: 'key' });
  } else {
    const payload = { kind: change.content_kind, title: change.title, body: change.body, image_url: change.image_url || null, detail: change.detail || null, category: change.category || null, published: change.published, sort_order: change.sort_order };
    // Editing a demo row turns it into real content, so the "নমুনা" badge disappears.
    result = change.id ? await db.from('institution_content').update({ ...payload, slug: null }).eq('id', change.id) : await db.from('institution_content').insert(payload);
  }
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
