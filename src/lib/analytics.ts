/**
 * Mensuração centralizada (somente no navegador).
 *
 * - Sem nenhum ID configurado: nada é carregado e nenhum aviso de consentimento aparece.
 *   Com PUBLIC_ANALYTICS_DEBUG=true os eventos são apenas escritos no console.
 * - Com algum ID: GA4/GTM/Pixel só carregam depois de "Aceitar" no aviso.
 * - Parâmetros nunca contêm nome, telefone ou mensagem do visitante.
 */
import { business, hasAnyTracker } from '../data/business';

export type EventName =
  | 'whatsapp_click'
  | 'free_pass_click'
  | 'benefit_contact_click'
  | 'directions_click'
  | 'faq_open';

type Params = Record<string, string>;

/** Conversões Meta: clique = intenção de contato (Contact), nunca Lead/Schedule/Purchase. */
const PIXEL_MAP: Partial<Record<EventName, string>> = {
  whatsapp_click: 'Contact',
  free_pass_click: 'Contact',
  benefit_contact_click: 'Contact',
  directions_click: 'FindLocation',
};

const CONSENT_KEY = 'rip-consent-v1';
export type Consent = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

const { ga4MeasurementId, gtmContainerId, metaPixelId, debug } = business.analytics;
let loaded = false;
/** Um clique de Pixel "Contact" por ação, mesmo quando a ação gera dois eventos do projeto. */
let lastPixelAt = 0;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* armazenamento indisponível: a escolha vale só nesta visita */
  }
  if (value === 'granted') loadTrackers();
}

export const trackersConfigured = hasAnyTracker;

function injectScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function loadTrackers() {
  if (loaded || !hasAnyTracker) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];

  if (gtmContainerId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmContainerId)}`);
  }
  if (ga4MeasurementId) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4MeasurementId);
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`);
  }
  if (metaPixelId) {
    const fbq = function (...args: unknown[]) {
      // Fila padrão do Pixel até o script carregar.
      fbq.callMethod ? (fbq.callMethod as (...a: unknown[]) => void)(...args) : fbq.queue!.push(args);
    } as NonNullable<Window['fbq']>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = fbq;
    window.fbq = window.fbq || fbq;
    window._fbq = window._fbq || window.fbq;
    injectScript('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', metaPixelId);
    window.fbq('track', 'PageView');
  }
}

export function track(event: EventName, params: Params = {}) {
  if (debug) console.info('[analytics]', event, params);
  if (!loaded) return;

  if (ga4MeasurementId && window.gtag) window.gtag('event', event, params);
  else if (gtmContainerId && window.dataLayer) window.dataLayer.push({ event, ...params });

  const pixelEvent = PIXEL_MAP[event];
  if (metaPixelId && window.fbq && pixelEvent) {
    const now = Date.now();
    if (pixelEvent === 'Contact' && now - lastPixelAt < 800) return;
    if (pixelEvent === 'Contact') lastPixelAt = now;
    window.fbq('track', pixelEvent);
  }
}

/** Inicializa a partir do consentimento salvo. */
export function initAnalytics() {
  if (hasAnyTracker && readConsent() === 'granted') loadTrackers();
}
