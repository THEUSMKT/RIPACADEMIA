import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/paths';

// Observação: em GitHub Pages de projeto (/RIPACADEMIA/), robots.txt não fica na raiz do domínio e os
// buscadores o ignoram. Ele passa a valer com domínio próprio (BASE_PATH=/). O sitemap é declarado mesmo assim.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
