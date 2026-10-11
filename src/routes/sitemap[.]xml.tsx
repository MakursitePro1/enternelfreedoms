import { createFileRoute } from '@tanstack/react-router';
import { SITE_URL } from '@/lib/seo';

const pages: [string, string, number][] = [
  ['/', 'daily', 1.0],
  ['/about', 'monthly', 0.8],
  ['/academics', 'weekly', 0.9],
  ['/admission', 'weekly', 0.9],
  ['/residential', 'monthly', 0.8],
  ['/campus', 'monthly', 0.8],
  ['/teachers', 'weekly', 0.8],
  ['/books', 'weekly', 0.9],
  ['/notices', 'daily', 0.7],
  ['/activities', 'weekly', 0.7],
  ['/gallery', 'monthly', 0.6],
  ['/faq', 'monthly', 0.7],
  ['/contact', 'monthly', 0.7],
];

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([path, freq, pri]) => `  <url><loc>${SITE_URL}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`).join('\n')}
</urlset>`;
        return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
      },
    },
  },
});
