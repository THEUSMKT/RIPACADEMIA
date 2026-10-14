/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly PUBLIC_ANALYTICS_DEBUG?: string;
  readonly PUBLIC_MAPS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
