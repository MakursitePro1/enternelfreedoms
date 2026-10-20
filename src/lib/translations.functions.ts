import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';
import { englishCatalogue } from './translation';

/** Never translate submitted/private text: accept only an exact published source. */
export const translatePublishedText = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ texts: z.array(z.string().min(1).max(6000)).max(20) }).parse(input))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'] || import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'] || import.meta.env['VITE_SUPABASE_URL'];
    if (!key || !url) return {};
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      } },
    });
    const [content, books, notices, settings] = await Promise.all([
      db.from('institution_content').select('title,body,detail,category').eq('published', true),
      db.from('books').select('title,description,author').eq('active', true),
      db.from('notices').select('title,body,category'),
      db.from('site_settings').select('value').in('key', ['address', 'office_hours', 'admission_badge']),
    ]);
    const allowed = new Set<string>();
    for (const rows of [content.data, books.data, notices.data, settings.data]) {
      for (const row of rows ?? []) for (const text of Object.values(row)) if (typeof text === 'string') {
        allowed.add(text);
        allowed.add(text.replace(/\s+/g, ' ').trim());
        for (const line of text.split('\n')) {
          allowed.add(line.trim());
          const labeled = line.match(/^\s*[^:：]{2,12}[:：]\s*(.+)$/);
          if (labeled?.[1]) allowed.add(labeled[1].trim());
        }
      }
    }
    const result: Record<string, string> = {};
    const texts = [...new Set(data.texts)].filter((text) => allowed.has(text));
    for (let offset = 0; offset < texts.length; offset += 4) {
      await Promise.all(texts.slice(offset, offset + 4).map(async (text) => {
        if (englishCatalogue[text]) { result[text] = englishCatalogue[text]; return; }
        try {
          const endpoint = new URL('https://clients5.google.com/translate_a/single');
          endpoint.search = new URLSearchParams({ client: 'gtx', sl: 'bn', tl: 'en', dt: 't', q: text }).toString();
          const response = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
          if (!response.ok) return;
          const payload: unknown = await response.json();
          if (!Array.isArray(payload) || !Array.isArray(payload[0])) return;
          const translated = payload[0].filter((part: unknown) => Array.isArray(part) && typeof part[0] === 'string').map((part: string[]) => part[0]).join('');
          if (translated && !/[\u0980-\u09ef]/.test(translated)) result[text] = translated;
        } catch { /* Keep the original content readable if the free provider is unavailable. */ }
      }));
    }
    return result;
  });