import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/public/payments/$gateway')({
  server: { handlers: { GET: ({ request, params }) => callback(request, params.gateway), POST: ({ request, params }) => callback(request, params.gateway) } },
});

async function callback(request: Request, gateway: string) {
  if (!['sslcommerz','aamarpay'].includes(gateway)) return new Response('Not found', { status: 404 });
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > 16000) return new Response('Too large', { status: 413 });
  const query = new URL(request.url).searchParams;
  const body = request.method === 'POST' ? await request.text() : '';
  if (body.length > 16000) return new Response('Too large', { status: 413 });
  const fields = request.method === 'POST' ? new URLSearchParams(body) : query;
  const transaction = fields.get(gateway === 'sslcommerz' ? 'tran_id' : 'mer_txnid') ?? '';
  const validation = fields.get('val_id') ?? '';
  if (!/^PAY-[a-f0-9]{24}$/.test(transaction) || validation.length > 200) return new Response('Invalid payment reference', { status: 400 });
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    // Look up only payment-attempt metadata. No write or customer data is exposed before independent provider verification.
    const { data: attempt } = await supabaseAdmin.from('payment_attempts').select('gateway,mode,amount,status').eq('transaction_id',transaction).eq('gateway',gateway).maybeSingle();
    if (!attempt || attempt.mode !== 'live') return new Response('Payment not found', { status: 404 });
    const credentials = gateway === 'sslcommerz'
      ? { id: process.env['SSLCOMMERZ_STORE_ID'], secret: process.env['SSLCOMMERZ_STORE_PASSWORD'] }
      : { id: process.env['AAMARPAY_STORE_ID'], secret: process.env['AAMARPAY_SIGNATURE_KEY'] };
    const { verifyPayment } = await import('@/lib/payments.server');
    const verified = await verifyPayment(gateway, attempt.mode, credentials, transaction, validation);
    if (!verified || !Number.isFinite(verified.amount) || verified.amount !== Number(attempt.amount)) return new Response('Payment verification failed', { status: 400 });
    const { data: confirmed, error } = await supabaseAdmin.rpc('confirm_gateway_payment', { _transaction_id: transaction, _provider_reference: verified.providerReference, _amount: verified.amount });
    if (error || !confirmed) return new Response('Payment not confirmed', { status: 409 });
    // Contains neither phone nor order reference. Buyers look up private details using their saved reference and phone.
    return Response.redirect(new URL('/books?payment=verified',request.url).href,303);
  } catch { return new Response('Payment verification unavailable; please retry', { status: 503 }); }
}