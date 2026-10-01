import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const admissionSchema = z.object({ student_name:z.string().trim().min(2).max(120), birth_date:z.string().optional(), program:z.string().min(2).max(100), guardian_name:z.string().trim().min(2).max(120), phone:z.string().regex(/^01[0-9]{9}$/), address:z.string().trim().min(5).max(500), previous_school:z.string().max(150).optional(), notes:z.string().max(1000).optional() });
export const submitAdmission = createServerFn({method:'POST'}).inputValidator((data)=>admissionSchema.parse(data)).handler(async ({data})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:row,error}=await supabaseAdmin.from('admissions').insert({...data,birth_date:data.birth_date || null}).select('reference').single();
 if(error) throw new Error('আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।'); return row;
});
export const trackAdmission = createServerFn({method:'POST'}).inputValidator((data)=>z.object({reference:z.string().trim().max(30),phone:z.string().regex(/^01[0-9]{9}$/)}).parse(data)).handler(async ({data})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:row}=await supabaseAdmin.from('admissions').select('student_name,program,status,created_at').eq('reference',data.reference.toUpperCase()).eq('phone',data.phone).maybeSingle(); return row;
});
const orderSchema=z.object({customer_name:z.string().trim().min(2).max(120),phone:z.string().regex(/^01[0-9]{9}$/),address:z.string().trim().min(8).max(500), items:z.array(z.object({id:z.string().uuid(),quantity:z.number().int().min(1).max(20)})).min(1).max(30)});
export const submitOrder=createServerFn({method:'POST'}).inputValidator((data)=>orderSchema.parse(data)).handler(async ({data})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const ids=data.items.map(x=>x.id); const {data:books,error:bookError}=await supabaseAdmin.from('books').select('id,title,price,active').in('id',ids);
 if(bookError || !books || data.items.some(item=>!books.some(book=>book.id===item.id && book.active))) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।');
 const items=data.items.map(item=>{const book=books.find(book=>book.id===item.id); if(!book) throw new Error('বইয়ের তথ্য পাওয়া যায়নি।'); return {id:book.id,title:book.title,price:Number(book.price),quantity:item.quantity};});
 const total=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
 const {data:row,error}=await supabaseAdmin.from('orders').insert({customer_name:data.customer_name,phone:data.phone,address:data.address,items,total,payment_method:'ক্যাশ অন ডেলিভারি'}).select('reference').single();
 if(error) throw new Error('অর্ডার জমা দেওয়া যায়নি।'); return row;
});
async function verifyAdmin(token:string){
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:{user},error}=await supabaseAdmin.auth.getUser(token);
 if(error||!user) throw new Error('লগইন প্রয়োজন।');
 const {data:role}=await supabaseAdmin.from('user_roles').select('role').eq('user_id',user.id).eq('role','admin').maybeSingle();
 if(!role) throw new Error('অ্যাডমিন অনুমতি নেই।');
 return supabaseAdmin;
}
export const getAdminData=createServerFn({method:'POST'}).inputValidator((data)=>z.object({token:z.string().min(10)}).parse(data)).handler(async ({data})=>{
 const db=await verifyAdmin(data.token);
 const [admissions,orders,books,notices]=await Promise.all([
 db.from('admissions').select('*').order('created_at',{ascending:false}),db.from('orders').select('*').order('created_at',{ascending:false}),db.from('books').select('*').order('created_at',{ascending:false}),db.from('notices').select('*').order('published_at',{ascending:false})]);
 return {admissions:admissions.data??[],orders:orders.data??[],books:books.data??[],notices:notices.data??[]};
});
const editSchema=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('admission'),id:z.string().uuid(),status:z.enum(['নতুন','যাচাই চলছে','অনুমোদিত','বাতিল'])}),
 z.object({kind:z.literal('order'),id:z.string().uuid(),status:z.enum(['নতুন','প্রক্রিয়াধীন','পাঠানো হয়েছে','সম্পন্ন','বাতিল'])}),
 z.object({kind:z.literal('notice'),id:z.string().uuid().optional(),title:z.string().min(3).max(200),body:z.string().max(5000),category:z.string().min(1).max(50),file_url:z.string().url().optional()}),
 z.object({kind:z.literal('book'),id:z.string().uuid().optional(),title:z.string().min(2).max(200),description:z.string().max(3000),price:z.number().nonnegative(),cover_url:z.string().url().optional(),active:z.boolean()})
]);
export const adminSave=createServerFn({method:'POST'}).inputValidator((data)=>z.object({token:z.string().min(10),change:editSchema}).parse(data)).handler(async ({data})=>{
 const db=await verifyAdmin(data.token); const change=data.change;
 let result;
 if(change.kind==='admission') result=await db.from('admissions').update({status:change.status}).eq('id',change.id);
 else if(change.kind==='order') result=await db.from('orders').update({status:change.status}).eq('id',change.id);
 else if(change.kind==='notice'){const payload={title:change.title,body:change.body,category:change.category,file_url:change.file_url||null}; result=change.id?await db.from('notices').update(payload).eq('id',change.id):await db.from('notices').insert(payload);}
 else {const payload={title:change.title,description:change.description,price:change.price,cover_url:change.cover_url||null,active:change.active}; result=change.id?await db.from('books').update(payload).eq('id',change.id):await db.from('books').insert(payload);}
 if(result.error) throw new Error('পরিবর্তন সংরক্ষণ করা যায়নি।'); return {ok:true};
});
