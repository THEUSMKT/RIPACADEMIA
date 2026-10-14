// Testes de interação e do ciclo de vida do Ribbon Glow no build de produção.
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const EDGE = BROWSER;
const results = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

const browser = await chromium.launch({ executablePath: EDGE, args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'] });

// Conta frames de requestAnimationFrame para provar que o loop para, e contextos WebGL2 criados.
const rafCounter = () => {
  window.__raf = 0;
  window.__gl = 0;
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => orig((t) => { window.__raf++; cb(t); });
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = getContext.call(this, type, ...rest);
    if (type === 'webgl2' && ctx) window.__gl++;
    return ctx;
  };
};
const scrollToId = (page, id) => page.evaluate((id) => document.getElementById(id).scrollIntoView({ behavior: 'instant', block: 'start' }), id);
const waveOf = (page, sel) => page.evaluate((sel) => document.querySelector(sel).dataset.wave, sel);

// Nenhuma imagem recortada: sem object-fit: cover, proporção exibida = proporção do arquivo (ou contain), sem clip-path.
const imagesUncropped = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('main img')].flatMap((img) => {
      const cs = getComputedStyle(img);
      const r = img.getBoundingClientRect();
      const natural = img.naturalWidth / img.naturalHeight;
      const shown = r.width / r.height;
      const clipped = [img, ...(function* up(el) { while ((el = el.parentElement)) yield el; })(img)].some(
        (el) => getComputedStyle(el).clipPath !== 'none' && !el.matches('section'),
      );
      const ok = cs.objectFit !== 'cover' && (cs.objectFit === 'contain' || Math.abs(shown / natural - 1) < 0.01) && !clipped;
      return ok ? [] : [`${img.currentSrc.split('/').pop()} fit=${cs.objectFit} ${shown.toFixed(3)}≠${natural.toFixed(3)} clip=${clipped}`];
    }),
  );

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
  const wave = () => waveOf(page, '[data-hero]');
  ok('desktop: renderer ativo', (await wave()) === 'live');
  ok('convite ainda sem renderer (criado só ao aparecer)', (await waveOf(page, '#convite')) === 'static' && (await page.evaluate(() => window.__gl)) === 1);
  let a = await count(); await page.waitForTimeout(1000); let b = await count();
  ok('desktop: loop rodando com hero visível', b - a > 20, `${b - a} rAF/s`);

  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  ok('um canvas por seção com onda (hero e convite)', canvases === 2, String(canvases));

  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(600);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('loop suspenso com hero fora da tela', b - a === 0, `${b - a} rAF/s`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('loop retomado ao voltar ao hero', b - a > 20, `${b - a} rAF/s`);

  // Pausa pelo visitante
  const btn = page.locator('[data-hero] [data-motion-toggle]');
  ok('botão de pausa visível no desktop', await btn.isVisible());
  await btn.click();
  await page.waitForTimeout(300);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('pausar suspende o loop', b - a === 0, `${b - a} rAF/s; label=${await btn.getAttribute('aria-label')}`);
  ok('aria-pressed=true quando pausado', (await btn.getAttribute('aria-pressed')) === 'true');
  ok('controle de pausa: 48 × 48 px', await btn.evaluate((b) => { const r = b.getBoundingClientRect(); return r.width >= 48 && r.height >= 48; }));
  ok('aria-label "Retomar movimento" quando pausado', (await btn.getAttribute('aria-label')) === 'Retomar movimento');
  await btn.click();
  await page.waitForTimeout(300);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('retomar volta a desenhar sem duplicar loop', b - a > 20 && b - a < 75, `${b - a} rAF/s`);
  ok('ainda um renderer após retomar', (await page.evaluate(() => window.__gl)) === 1);

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

  // Convite: onda criada ao aparecer, título com entrada palavra a palavra e leitura única
  await scrollToId(page, 'convite');
  await page.waitForTimeout(1800);
  ok('convite: renderer ativo ao aparecer', (await waveOf(page, '#convite')) === 'live');
  ok('convite: dois renderers no total, sem duplicar', (await page.evaluate(() => window.__gl)) === 2);
  a = await count(); await page.waitForTimeout(1000); b = await count();
  ok('convite: loop rodando e o do hero parado (um loop só)', b - a > 20 && b - a < 75, `${b - a} rAF/s`);
  ok('convite: controle de pausa visível', await page.locator('#convite [data-motion-toggle]').isVisible());
  const title = await page.evaluate(() => {
    const h = document.getElementById('convite-title');
    const words = [...h.querySelectorAll('.invite__word')];
    return {
      sr: h.querySelector('.sr-only')?.textContent,
      hidden: h.querySelector('.invite__words')?.getAttribute('aria-hidden'),
      visible: words.every((w) => getComputedStyle(w).opacity === '1'),
      red: getComputedStyle(h.querySelector('.invite__accent')).color,
    };
  });
  ok('convite: título acessível lido uma vez', title.sr === 'Venha fazer parte desse time!' && title.hidden === 'true', JSON.stringify(title));
  ok('convite: palavras reveladas e "desse time!" em vermelho', title.visible && title.red === 'rgb(242, 10, 22)', title.red);
  ok('galeria antiga removida', (await page.locator('#galeria, [data-gallery-index], [data-lightbox]').count()) === 0);
  ok('nenhum link para a galeria', (await page.locator('a[href*="galeria"]').count()) === 0);

  // Imagens inteiras no desktop
  const cropped = await imagesUncropped(page);
  ok('desktop: nenhuma imagem recortada', cropped.length === 0, cropped.join(' | '));

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
  ok('mobile: onda ativa no hero (renderer)', (await waveOf(page, '[data-hero]')) === 'live');
  const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(1000); const b = await page.evaluate(() => window.__raf);
  ok('mobile: loop de animação rodando', b - a > 20, `${b - a} rAF/s`);
  ok('mobile: botão de pausa visível', await page.locator('[data-hero] [data-motion-toggle]').isVisible());
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
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const last = await page.evaluate(() => {
    const el = document.querySelector('.footer__bottom p').getBoundingClientRect();
    const bar = document.querySelector('[data-mobile-bar]').getBoundingClientRect();
    return { textBottom: el.bottom, barTop: bar.top };
  });
  ok('barra não cobre o rodapé', last.textBottom <= last.barTop, JSON.stringify(last));

  // Estrutura: duas fotos lado a lado, mesmo tamanho, alinhadas, com as frases no topo
  await scrollToId(page, 'estrutura');
  await page.evaluate(() => document.querySelector('.structure__photos').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(1500);
  const pair = await page.evaluate(() =>
    [...document.querySelectorAll('.structure__card')].map((c) => {
      const r = c.querySelector('.frame').getBoundingClientRect();
      const p = c.querySelector('.structure__phrase');
      const pr = p.getBoundingClientRect();
      return { x: r.x, top: r.top, bottom: r.bottom, w: r.width, h: r.height, phrase: p.textContent.trim(), op: getComputedStyle(p).opacity, inside: pr.top >= r.top - 1 && pr.bottom <= r.bottom };
    }),
  );
  ok('mobile: par da estrutura lado a lado', pair.length === 2 && pair[1].x > pair[0].x + pair[0].w - 1, JSON.stringify(pair.map((p) => Math.round(p.x))));
  ok('mobile: fotos da estrutura do mesmo tamanho e alinhadas', Math.abs(pair[0].w - pair[1].w) < 1 && Math.abs(pair[0].h - pair[1].h) < 1 && Math.abs(pair[0].top - pair[1].top) < 1 && Math.abs(pair[0].bottom - pair[1].bottom) < 1);
  ok(
    'mobile: frases no topo de cada foto e visíveis',
    pair[0].phrase === 'Estrutura pensada para o seu melhor desempenho.' && pair[1].phrase === 'O espaço ideal para a sua evolução.' && pair.every((p) => p.op === '1' && p.inside),
    pair.map((p) => `${p.phrase} op=${p.op}`).join(' | '),
  );

  // Imagens inteiras no mobile (rola a página para carregar todas)
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 600) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(80); }
  await page.waitForTimeout(800);
  const croppedM = await imagesUncropped(page);
  ok('mobile: nenhuma imagem recortada', croppedM.length === 0, croppedM.join(' | '));
  await ctx.close();
}

// ---------- Movimento reduzido ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('reduced-motion: fundo estático (hero e convite)', (await waveOf(page, '[data-hero]')) === 'static' && (await waveOf(page, '#convite')) === 'static');
  ok('reduced-motion: nenhum renderer criado', (await page.evaluate(() => window.__gl)) === 0);
  const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(1000); const b = await page.evaluate(() => window.__raf);
  ok('reduced-motion: sem loop', b - a === 0);
  ok('reduced-motion: conteúdo revelado sem animação', await page.evaluate(() => getComputedStyle(document.querySelector('.structure__copy')).opacity === '1'));
  ok(
    'reduced-motion: título do convite e frases já no estado final',
    await page.evaluate(() => [...document.querySelectorAll('.invite__word, .structure__phrase, .final__media, .final__copy')].every((el) => getComputedStyle(el).opacity === '1')),
  );
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
  ok('sem WebGL2: fallback estático', (await waveOf(page, '[data-hero]')) === 'static');
  ok('sem WebGL2: botão de pausa oculto', !(await page.locator('[data-hero] [data-motion-toggle]').isVisible()));
  await scrollToId(page, 'convite');
  await page.waitForTimeout(1200);
  ok('sem WebGL2: convite também estático e sem botão', (await waveOf(page, '#convite')) === 'static' && !(await page.locator('#convite [data-motion-toggle]').isVisible()));
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
  ok(
    'sem JS: título do convite, frases e encerramento visíveis',
    await page.evaluate(() => [...document.querySelectorAll('.invite__word, .structure__phrase, .final__media, .final__copy')].every((el) => getComputedStyle(el).opacity === '1')),
  );
  ok('sem JS: barra persistente com link real', (await page.getAttribute('[data-mobile-bar] a', 'href')).startsWith('https://wa.me/'));
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`);
