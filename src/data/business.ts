/**
 * Configuração central da RIP Academia.
 *
 * Fonte: RipAcademia-Base-ClaudeCode/CONFIGURACAO-NEGOCIO.json (transcrição de IMG_8508,
 * IMG_8515 e IMG_8516). As artes antigas (Rua Otto Daudt, abertura às 6h, sábado até 15h)
 * NÃO são fonte de dados deste site.
 *
 * Para corrigir horário, endereço, telefone ou mensagens, altere somente este arquivo.
 * Campos `null` estão pendentes de confirmação (ver README → Pendências de produção).
 */

const env = import.meta.env;
const envOrNull = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const business = {
  name: 'RIP Academia',
  tagline: 'Seja sua melhor versão',
  brandSince: 2000,

  whatsappDisplay: '(51) 99985-0575',
  /** Somente dígitos: código do país + DDD + número. */
  whatsappNumber: '5551999850575',
  phoneE164: '+5551999850575',

  instagramUrl: 'https://www.instagram.com/rip_academia/',
  instagramHandle: '@rip_academia',

  address: {
    streetAddress: 'Av. Feitoria, 3740',
    neighborhood: 'Feitoria',
    addressLocality: 'São Leopoldo',
    addressRegion: 'RS',
    addressCountry: 'BR',
    /** CEP não informado nos materiais recebidos. */
    postalCode: null as string | null,
  },

  /** Horários atuais (IMG_8516.jpeg). A tabela, o FAQ e o JSON-LD leem daqui. */
  hours: [
    { label: 'Segunda a sexta', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Weekday[], opens: '05:30', closes: '22:00' },
    { label: 'Sábado', days: ['Saturday'] as Weekday[], opens: '09:00', closes: '16:00' },
  ],
  /** Domingo e feriados não constam na referência atual. */
  unspecifiedHours: { label: 'Domingo e feriados', value: 'Consulte a equipe' },

  modalities: ['Musculação', 'CrossTraining'],
  benefits: ['Wellhub', 'TotalPass'] as const,

  freePass: {
    cta: 'Agendar meu Free Pass',
    /** Duração e condições não informadas: o site não promete prazos nem acesso ilimitado. */
    duration: null as string | null,
    conditions: null as string | null,
  },

  /** URL oficial confirmada da unidade no Google Maps (ainda não fornecida). */
  mapsOfficialUrl: envOrNull(env.PUBLIC_MAPS_URL),
  /** Coordenadas não confirmadas: não inventar. */
  coordinates: null as { lat: number; lng: number } | null,

  /**
   * Mensuração. Tudo desligado enquanto não houver ID.
   * Ative definindo as variáveis no ambiente de build (ver README → Mensuração).
   */
  analytics: {
    ga4MeasurementId: envOrNull(env.PUBLIC_GA4_ID),
    gtmContainerId: envOrNull(env.PUBLIC_GTM_ID),
    metaPixelId: envOrNull(env.PUBLIC_META_PIXEL_ID),
    /** Registra eventos no console em vez de enviá-los (útil para validar sem IDs). */
    debug: env.PUBLIC_ANALYTICS_DEBUG === 'true',
  },

  /** Avaliações autênticas (texto, autoria, fonte e link). Vazio = componente desativado. */
  reviews: [] as { text: string; author: string; source: string; url: string }[],
} as const;

/** "05:30" → "5h30"; "22:00" → "22h". */
export function formatHour(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

export function formatRange(opens: string, closes: string): string {
  return `${formatHour(opens)} às ${formatHour(closes)}`;
}

export const fullAddress = `${business.address.streetAddress} — ${business.address.neighborhood}, ${business.address.addressLocality}/${business.address.addressRegion}`;

export const mapsUrl =
  business.mapsOfficialUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name}, ${business.address.streetAddress}, ${business.address.neighborhood}, ${business.address.addressLocality} - ${business.address.addressRegion}`,
  )}`;

export const hasAnyTracker = Boolean(
  business.analytics.ga4MeasurementId || business.analytics.gtmContainerId || business.analytics.metaPixelId,
);
