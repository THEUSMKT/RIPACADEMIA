// Build com IDs FICTÍCIOS de teste + debug. Requisições externas são abortadas (nada sai da máquina).
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const results = [];
const ok = (n, c, e = '') => results.push(`${c ? 'PASS' : 'FAIL'}  ${n}${e ? ' — ' + e : ''}`);
const browser = await chromium.launch({ executablePath: BROWSER });

for (const vp of [{ width: 390, height: 844, isMobile: true, hasTouch: true }, { width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
  const external = [];
  await ctx.route(/googletagmanager|facebook\.net|google-analytics|facebook\.com/, (r) => { external.push(r.request().url()); r.abort(); });
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => m.text().startsWith('[analytics]') && logs.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const tag = `[${vp.width}]`;
  ok(`${tag} aviso de consentimento visível`, await page.locator('#consent').isVisible());
  ok(`${tag} nenhum tracker antes da escolha`, external.length === 0, external.join(','));
  const b1 = await page.locator('[data-consent="denied"]').boundingBox();
  const b2 = await page.locator('[data-consent="granted"]').boundingBox();
  ok(`${tag} Aceitar e Recusar com o mesmo destaque`, Math.abs(b1.height - b2.height) < 1 && (await page.getAttribute('[data-consent="denied"]', 'class')) === (await page.getAttribute('[data-consent="granted"]', 'class')));
  const cta = await page.locator('.hero__cta').boundingBox();
  const banner = await page.locator('#consent').boundingBox();
  ok(`${tag} aviso não cobre o CTA do hero`, cta.y + cta.height <= banner.y, `cta=${Math.round(cta.y + cta.height)} banner=${Math.round(banner.y)}`);
  if (vp.isMobile) {
    const bar = await page.locator('[data-mobile-bar]').boundingBox();
    ok(`${tag} aviso não cobre a barra persistente`, banner.y + banner.height <= bar.y + 1, `banner=${Math.round(banner.y + banner.height)} bar=${Math.round(bar.y)}`);
  }

  if (vp.width === 1440) {
    // Recusar: nada carrega
    await page.click('[data-consent="denied"]');
    await page.waitForTimeout(500);
    ok(`${tag} recusar não carrega trackers`, external.length === 0);
    await page.reload({ waitUntil: 'networkidle' });
    ok(`${tag} escolha lembrada (aviso não volta)`, !(await page.locator('#consent').isVisible()));
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
  }
  // Aceitar: carrega e eventos disparam uma vez por ação
  await page.click('[data-consent="granted"]');
  await page.waitForTimeout(800);
  ok(`${tag} aceitar carrega GA4 e Pixel`, external.some((u) => u.includes('gtag/js')) && external.some((u) => u.includes('fbevents')), external.length + ' req');
  logs.length = 0;
  const fbq = [];
  await page.exposeFunction('__fbqLog', (a) => fbq.push(a));
  await page.evaluate(() => { const f = window.fbq; window.fbq = (...a) => { window.__fbqLog(JSON.stringify(a)); return f(...a); }; });
  // Evita abrir a aba do WhatsApp: cancela a navegação depois dos listeners
  await page.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('a')) e.preventDefault(); }));
  const sel = vp.isMobile ? '[data-mobile-bar] a' : '.hero__cta';
  await page.click(sel);
  ok(`${tag} clique Free Pass → whatsapp_click + free_pass_click`, logs.length === 2 && logs[0].includes('whatsapp_click') && logs[1].includes('free_pass_click'), logs.join(' | '));
  ok(`${tag} Pixel: um único Contact`, fbq.filter((x) => x.includes('Contact')).length === 1, fbq.join(' '));
  ok(`${tag} parâmetros sem dados pessoais`, !/Ol[aá]|5551|99985/.test(logs.join(' ')));
  logs.length = 0; fbq.length = 0;
  await page.click('[data-cta-id="beneficio_wellhub"]');
  ok(`${tag} benefício → whatsapp_click + benefit_contact_click`, logs.length === 2 && logs[1].includes('benefit_contact_click') && logs[1].includes('wellhub'), logs.join(' | '));
  logs.length = 0; fbq.length = 0;
  await page.click('[data-track="directions"]');
  ok(`${tag} Como chegar → directions_click / FindLocation`, logs.length === 1 && logs[0].includes('directions_click') && fbq.some((x) => x.includes('FindLocation')), logs.join(' | ') + ' ' + fbq.join(' '));
  ok(`${tag} nenhum Lead/Schedule/Purchase`, !/Lead|Schedule|Purchase|generate_lead/.test(fbq.join(' ') + logs.join(' ')));
  logs.length = 0;
  await page.locator('.faq__item summary').nth(2).click();
  ok(`${tag} FAQ → faq_open`, logs.length === 1 && logs[0].includes('beneficios'), logs.join(' | '));
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`);
