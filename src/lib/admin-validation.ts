import { z } from 'zod';

// Bundled media uses root-relative paths; external media must use HTTP(S).
export const mediaUrlSchema = z.string().trim().refine((value) => {
  if (/^\/(?!\/)/.test(value) && !value.includes('\\')) return true;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol); }
  catch { return false; }
}, 'সঠিক ছবির লিংক দিন।');

export function requireAdminQuerySuccess(results: { error: unknown }[]) {
  if (results.some((result) => result.error)) throw new Error('তথ্য আনা যায়নি। আবার চেষ্টা করুন।');
}