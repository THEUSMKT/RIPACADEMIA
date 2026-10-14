// Testes de interação e do ciclo de vida do Ribbon Glow no build de produção.
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const EDGE = BROWSER;
const results = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

const browser = await chromium.launch({ executablePath: EDGE, args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'] });

// Conta frames de requestAnimationFrame para provar que o loop para.
const rafCounter = () => {
  window.__raf = 0;
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => orig((t) => { window.__raf++; cb(t); });
};

// ---------- Desktop: renderer, pausa, visibilidade ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const count = () => page.evaluate(() => window.__raf);
  const wave = () => page.evaluate(() => document.querySelector('[data-hero]').dataset.wave);
  ok('desktop: renderer ativo', (await wave()) === 'live');
  let a = await count(); await page.waitForTimeout(1000); let b = await count();
  ok('desktop: loop rodando com hero visível', b - a > 20, `${b - a} rAF/s`);

  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  ok('uma única instância de canvas', canvases === 1, String(canvases));

  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(600);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('loop suspenso com hero fora da tela', b - a === 0, `${b - a} rAF/s`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('loop retomado ao voltar ao hero', b - a > 20, `${b - a} rAF/s`);

  // Pausa pelo visitante
  const btn = page.locator('[data-motion-toggle]');
  ok('botão de pausa visível no desktop', await btn.isVisible());
  await btn.click();
  await page.waitForTimeout(300);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('pausar suspende o loop', b - a === 0, `${b - a} rAF/s; label=${await btn.getAttribute('aria-label')}`);
  ok('aria-pressed=true quando pausado', (await btn.getAttribute('aria-pressed')) === 'true');
  ok('aria-label "Retomar movimento" quando pausado', (await btn.getAttribute('aria-label')) === 'Retomar movimento');
  await btn.click();
  await page.waitForTimeout(300);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('retomar volta a desenhar sem duplicar loop', b - a > 20 && b - a < 75, `${b - a} rAF/s`);
  ok('ainda uma instância após retomar', (await page.evaluate(() => document.querySelectorAll('canvas').length)) === 1);

  // Aba oculta (emulada)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(300);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('aba oculta suspende o loop', b - a === 0, `${b - a} rAF/s`);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // Âncora respeita o header
  await page.click('.site-nav__link[href="#localizacao"]');
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => document.getElementById('localizacao-title').getBoundingClientRect().top);
  ok('âncora não fica sob o header', top >= 72, `título a ${Math.round(top)}px`);

  // Clique no CTA do WhatsApp (sem enviar): verifica destino e que não houve navegação na aba atual
  const href = await page.getAttribute('.hero__cta', 'href');
  ok('CTA do hero aponta para wa.me com mensagem', href.startsWith('https://wa.me/5551999850575?text=Ol%C3%A1!'), href.slice(0, 60));
  ok('CTA abre em nova aba com proteção', (await page.getAttribute('.hero__cta', 'target')) === '_blank' && (await page.getAttribute('.hero__cta', 'rel')).includes('noopener'));

  // Lightbox com teclado
  await page.evaluate(() => window.scrollTo(0, document.getElementById('galeria').offsetTop));
  await page.waitForTimeout(500);
  const first = page.locator('[data-gallery-index="0"]');
  await first.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  ok('lightbox abre com Enter', await page.evaluate(() => document.querySelector('[data-lightbox]').open));
  ok('foco vai para dentro do dialog', await page.evaluate(() => document.querySelector('[data-lightbox]').contains(document.activeElement)));
  const c1 = await page.textContent('[data-lightbox-count]');
  await page.keyboard.press('ArrowRight');
  const c2 = await page.textContent('[data-lightbox-count]');
  ok('seta direita navega', c1 !== c2, `${c1} → ${c2}`);
  await page.click('[data-lightbox-prev]');
  ok('botão anterior navega', (await page.textContent('[data-lightbox-count]')) === c1);
  // Tab fica no dialog
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  const inside = await page.evaluate(() => document.querySelector('[data-lightbox]').contains(document.activeElement) || document.activeElement === document.body);
  ok('Tab não sai para o conteúdo de fundo', inside);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('Escape fecha', !(await page.evaluate(() => document.querySelector('[data-lightbox]').open)));
  ok('foco volta ao acionador', await page.evaluate(() => document.activeElement?.getAttribute('data-gallery-index') === '0'));
  const natural = await page.evaluate(() => { const i = document.querySelector('[data-lightbox-img]'); return { w: i.width, nw: i.naturalWidth }; });
  ok('lightbox não amplia além do natural', natural.nw <= 1135, JSON.stringify(natural));

  // FAQ
  const sum = page.locator('.faq__item summary').first();
  await sum.focus();
  await page.keyboard.press('Enter');
  ok('FAQ expande com teclado', await page.evaluate(() => document.querySelector('.faq__item').open));
  await page.keyboard.press('Enter');
  ok('FAQ recolhe com teclado', !(await page.evaluate(() => document.querySelector('.faq__item').open)));

  ok('sem erros de console no desktop', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ---------- Mobile: menu, barra, fallback estático ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('mobile: fundo estático (sem renderer)', (await page.evaluate(() => document.querySelector('[data-hero]').dataset.wave)) === 'static');
  const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(1000); const b = await page.evaluate(() => window.__raf);
  ok('mobile: nenhum loop de animação', b - a === 0, `${b - a}`);
  ok('mobile: módulo WebGL não carregado', !(await page.evaluate(() => performance.getEntriesByType('resource').some((r) => r.name.includes('ribbon-glow')))));
  ok('mobile: botão de pausa oculto', !(await page.locator('[data-motion-toggle]').isVisible()));
  ok('mobile: barra persistente visível', await page.locator('[data-mobile-bar]').isVisible());
  const heroCta = await page.locator('.hero__cta').boundingBox();
  ok('mobile: CTA do hero na primeira tela, acima da barra', heroCta.y + heroCta.height < 844 - 72, `bottom=${Math.round(heroCta.y + heroCta.height)}`);

  const toggle = page.locator('[data-menu-toggle]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  ok('menu abre com teclado', (await toggle.getAttribute('aria-expanded')) === 'true');
  ok('foco vai ao primeiro link do menu', await page.evaluate(() => document.activeElement?.classList.contains('site-nav__link')));
  ok('barra de conversão continua visível com menu aberto', await page.locator('[data-mobile-bar]').isVisible());
  await page.keyboard.press('Escape');
  ok('Escape fecha o menu', (await toggle.getAttribute('aria-expanded')) === 'false');
  ok('foco volta ao botão do menu', await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-toggle')));
  await toggle.click();
  await page.click('.site-nav__link[href="#modalidades"]');
  await page.waitForTimeout(800);
  ok('menu fecha após escolher link', (await toggle.getAttribute('aria-expanded')) === 'false');

  // Barra não cobre o fim da página
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const last = await page.evaluate(() => {
    const el = document.querySelector('.footer__bottom p').getBoundingClientRect();
    const bar = document.querySelector('[data-mobile-bar]').getBoundingClientRect();
    return { textBottom: el.bottom, barTop: bar.top };
  });
  ok('barra não cobre o rodapé', last.textBottom <= last.barTop, JSON.stringify(last));

  // Lightbox oculta a barra
  await page.evaluate(() => document.querySelector('[data-gallery-index="1"]').scrollIntoView());
  await page.tap('[data-gallery-index="1"]');
  await page.waitForTimeout(300);
  ok('barra oculta com dialog aberto', !(await page.locator('[data-mobile-bar]').isVisible()));
  await page.tap('[data-lightbox-close]');
  ok('barra volta após fechar dialog', await page.locator('[data-mobile-bar]').isVisible());
  await ctx.close();
}

// ---------- Movimento reduzido ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('reduced-motion: fundo estático', (await page.evaluate(() => document.querySelector('[data-hero]').dataset.wave)) === 'static');
  const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(1000); const b = await page.evaluate(() => window.__raf);
  ok('reduced-motion: sem loop', b - a === 0);
  ok('reduced-motion: conteúdo revelado sem animação', await page.evaluate(() => getComputedStyle(document.querySelector('.structure__copy')).opacity === '1'));
  await ctx.close();
}

// ---------- Sem WebGL2 ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return type === 'webgl2' ? null : orig.call(this, type, ...rest); };
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('sem WebGL2: fallback estático', (await page.evaluate(() => document.querySelector('[data-hero]').dataset.wave)) === 'static');
  ok('sem WebGL2: botão de pausa oculto', !(await page.locator('[data-motion-toggle]').isVisible()));
  ok('sem WebGL2: CTA presente e sem erro visível', (await page.locator('.hero__cta').isVisible()) && errors.length === 0, errors.join('|'));
  await ctx.close();
}

// ---------- Sem JavaScript ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  ok('sem JS: CTA do hero visível', await page.locator('.hero__cta').isVisible());
  ok('sem JS: seções visíveis (sem depender de reveal)', await page.evaluate(() => getComputedStyle(document.querySelector('.structure__copy')).opacity === '1'));
  ok('sem JS: horários na página', (await page.textContent('#localizacao')).includes('5h30 às 22h'));
  ok('sem JS: barra persistente com link real', (await page.getAttribute('[data-mobile-bar] a', 'href')).startsWith('https://wa.me/'));
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`);
