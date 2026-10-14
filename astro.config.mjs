// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Endereço de publicação — único ponto de configuração.
 * Padrão: GitHub Pages do repositório (https://theusmkt.github.io/RIPACADEMIA/).
 * Com domínio próprio: SITE_URL=https://www.exemplo.com.br BASE_PATH=/ npm run build
 */
const site = process.env.SITE_URL || 'https://theusmkt.github.io';
const base = process.env.BASE_PATH || '/RIPACADEMIA';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
