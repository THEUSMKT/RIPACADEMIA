import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/paths';

// Acompanha `site` + `base` do astro.config.mjs (GitHub Pages ou domínio próprio via SITE_URL/BASE_PATH).
export const GET: APIRoute = () => {
  const urls = ['', 'privacidade/'].map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
