/** Prefixa um caminho de /public com o `base` configurado (ex.: /RIPACADEMIA/). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}

/** URL absoluta do site publicado (site + base), usada em canonical, OG e sitemap. */
export function absoluteUrl(path = ''): string {
  return new URL(withBase(path), import.meta.env.SITE).href;
}
