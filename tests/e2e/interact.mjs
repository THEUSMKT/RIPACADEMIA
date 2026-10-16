// Testes de interação, do arco Predictive Arc 2 (abertura do hero) e do carrossel no build de produção.
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const results = [];
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);

const browser = await chromium.launch({ executablePath: BROWSER, args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'] });

// Conta frames de requestAnimationFrame (para provar que o loop para) e contextos WebGL criados.
const rafCounter = () => {
  window.__raf = 0;
  window.__gl = { webgl: 0, webgl2: 0 };
  const orig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => orig((t) => { window.__raf++; cb(t); });
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const ctx = getContext.call(this, type, ...rest);
    if (ctx && type in window.__gl) window.__gl[type]++;
    return ctx;
  };
};
const scrollToId = (page, id, block = 'start') =>
  page.evaluate(([id, block]) => document.getElementById(id).scrollIntoView({ behavior: 'instant', block }), [id, block]);
const arcMode = (page) => page.evaluate(() => document.querySelector('[data-arc-host]').dataset.arc);
const rafPerSecond = async (page) => {
  const a = await page.evaluate(() => window.__raf);
  await page.waitForTimeout(1000);
  return (await page.evaluate(() => window.__raf)) - a;
};
const scrollWholePage = async (page) => {
  const H = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(800);
};

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

// Sem controle manual de pausa e sem resto da Ribbon Glow.
const noOldMotion = (page) =>
  page.evaluate(() => ({
    toggles: document.querySelectorAll('[data-motion-toggle], .motion-toggle, [aria-label*="movimento" i]').length,
    wave: document.querySelectorAll('[data-wave], [data-wave-host], .wave').length,
    ribbon: performance.getEntriesByType('resource').some((r) => /ribbon|wave-controller/i.test(r.name)),
    // Os canvas temporários das partículas de surgimento das fotos (.img-fx__canvas) não contam.
    canvasOutsideHero: [...document.querySelectorAll('canvas:not(.img-fx__canvas)')].filter((c) => !c.closest('[data-arc-host]')).length,
  }));

// Encerramento: mensagem dentro da área da foto.
const finalLayout = (page) =>
  page.evaluate(() => {
    const photo = document.querySelector('.final__photo img').getBoundingClientRect();
    const content = document.querySelector('.final__content').getBoundingClientRect();
    return {
      inside: content.top >= photo.top - 1 && content.bottom <= photo.bottom + 1 && content.left >= photo.left - 1 && content.right <= photo.right + 1,
      contentTopPct: Math.round((100 * (content.top - photo.top)) / photo.height),
      title: document.getElementById('final-title').textContent.replace(/\s+/g, ' ').trim(),
      accent: document.querySelector('#final-title .accent')?.textContent.trim(),
      lede: document.querySelector('.final__lede').textContent.trim(),
      cta: document.querySelector('.final__content a')?.getAttribute('href') ?? '',
      ctaText: document.querySelector('.final__content a')?.textContent.trim(),
      visible: [...document.querySelectorAll('.final__step')].every((el) => getComputedStyle(el).opacity === '1'),
    };
  });

// ---------- Desktop: abertura, ciclo de vida, carrossel, seções ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Abertura com logo e arco
  ok('desktop: arco ativo na abertura', (await arcMode(page)) === 'live');
  const gl = await page.evaluate(() => window.__gl);
  ok('um único contexto WebGL (o do arco), nenhum WebGL2', gl.webgl === 1 && gl.webgl2 === 0, JSON.stringify(gl));
  const logo = await page.evaluate(() => {
    const img = document.querySelector('.hero__logo');
    const r = img.getBoundingClientRect();
    return { w: r.width, ratio: r.width / r.height, natural: img.naturalWidth / img.naturalHeight, alt: img.alt, blend: getComputedStyle(img).mixBlendMode, top: r.top, bottom: r.bottom };
  });
  ok('logo grande, inteira e na primeira tela', logo.w >= 500 && Math.abs(logo.ratio / logo.natural - 1) < 0.01 && logo.bottom < 900, `${Math.round(logo.w)} px`);
  ok('logo sem caixa opaca sobre o arco (lighten) e com texto alternativo', logo.blend === 'lighten' && logo.alt.includes('RIP Academia'));
  const old = await noOldMotion(page);
  ok('sem botão de pausa, sem Ribbon Glow e sem canvas fora do hero', old.toggles === 0 && old.wave === 0 && !old.ribbon && old.canvasOutsideHero === 0, JSON.stringify(old));

  let n = await rafPerSecond(page);
  ok('desktop: loop rodando com a abertura visível', n > 20, `${n} rAF/s`);
  await scrollToId(page, 'modalidades');
  await page.waitForTimeout(1500);
  n = await rafPerSecond(page);
  ok('loop suspenso com a abertura fora da tela', n === 0, `${n} rAF/s`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  n = await rafPerSecond(page);
  ok('loop retomado ao voltar ao topo', n > 20, `${n} rAF/s`);

  // Aba oculta (emulada)
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);
  n = await rafPerSecond(page);
  ok('aba oculta suspende o loop', n === 0, `${n} rAF/s`);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);
  n = await rafPerSecond(page);
  ok('volta da aba retoma sem duplicar loop', n > 20 && n < 75 && (await page.evaluate(() => window.__gl.webgl)) === 1, `${n} rAF/s`);

  // Resize: o canvas acompanha a abertura, sem novo renderer
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1200);
  const small = await page.evaluate(() => { const c = document.querySelector('[data-arc-canvas]'); return { w: c.width, cw: c.clientWidth, mode: document.querySelector('[data-arc-host]').dataset.arc }; });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1200);
  const big = await page.evaluate(() => document.querySelector('[data-arc-canvas]').clientWidth);
  ok('resize: canvas acompanha a largura e o renderer continua o mesmo', small.cw === 390 && big === 1440 && small.mode === 'live' && (await page.evaluate(() => window.__gl.webgl)) === 1, JSON.stringify(small));

  // Âncora respeita o header
  await page.click('.site-nav__link[href="#localizacao"]');
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => document.getElementById('localizacao-title').getBoundingClientRect().top);
  ok('âncora não fica sob o header', top >= 72, `título a ${Math.round(top)}px`);

  // CTA do WhatsApp (sem enviar)
  const href = await page.getAttribute('.hero__cta', 'href');
  ok('CTA do hero aponta para wa.me com mensagem', href.startsWith('https://wa.me/5551999850575?text=Ol%C3%A1!'), href.slice(0, 60));
  ok('CTA abre em nova aba com proteção', (await page.getAttribute('.hero__cta', 'target')) === '_blank' && (await page.getAttribute('.hero__cta', 'rel')).includes('noopener'));

  // Carrossel da estrutura: botões, indicadores, teclado e arraste com mouse
  await page.evaluate(() => document.querySelector('[data-carousel]').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(1200);
  const current = () => page.evaluate(() => [...document.querySelectorAll('[data-carousel-dot]')].findIndex((d) => d.getAttribute('aria-current') === 'true'));
  ok('carrossel: controles visíveis e "anterior" desativado no início', (await page.locator('[data-carousel-controls]').isVisible()) && (await page.locator('[data-carousel-prev]').isDisabled()));
  await page.click('[data-carousel-next]');
  await page.waitForTimeout(900);
  ok('carrossel: "próxima" leva ao slide 2', (await current()) === 1);
  await page.click('[data-carousel-dot="0"]');
  await page.waitForTimeout(900);
  ok('carrossel: indicador leva ao slide 1', (await current()) === 0);
  await page.focus('[data-carousel-track]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  ok('carrossel: seta do teclado avança', (await current()) === 1);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(900);
  const box = await page.locator('[data-carousel-track]').boundingBox();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height / 2, { steps: 8 });
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(1000);
  ok('carrossel: arraste com mouse troca de slide', (await current()) === 1);
  const car = await page.evaluate(() => {
    const frames = [...document.querySelectorAll('.carousel__frame')].map((f) => f.getBoundingClientRect());
    const ph = getComputedStyle(document.querySelector('.carousel__phrase'));
    return {
      sameSize: frames.every((f) => Math.abs(f.width - frames[0].width) < 1 && Math.abs(f.height - frames[0].height) < 1),
      phrases: [...document.querySelectorAll('.carousel__phrase')].map((p) => p.textContent.trim()),
      font: ph.fontFamily.split(',')[0],
      weight: Number(ph.fontWeight),
      hScroll: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  ok('carrossel: slides do mesmo tamanho, sem rolagem horizontal da página', car.sameSize && !car.hScroll);
  ok(
    'carrossel: frases exatas, Inter com peso entre 500 e 600',
    car.phrases[0] === 'Estrutura pensada para o seu melhor desempenho.' && car.phrases[1] === 'O espaço ideal para a sua evolução.' && /Inter/.test(car.font) && car.weight >= 500 && car.weight <= 600,
    `${car.font} ${car.weight}`,
  );

  // História sem foto
  const hist = await page.evaluate(() => {
    const s = document.getElementById('historia');
    return { imgs: s.querySelectorAll('img, figure').length, caption: s.textContent.includes('Registro da academia'), cta: !!s.querySelector('a[href*="wa.me"]'), year: s.querySelector('.history__year')?.textContent.trim() };
  });
  ok('história: sem foto nem legenda, com ano, texto e CTA', hist.imgs === 0 && !hist.caption && hist.cta && hist.year === '2000', JSON.stringify(hist));

  // Convite sem onda: título, foto e entrada preservados
  await scrollToId(page, 'convite');
  await page.waitForTimeout(1800);
  const title = await page.evaluate(() => {
    const h = document.getElementById('convite-title');
    return {
      sr: h.querySelector('.sr-only')?.textContent,
      hidden: h.querySelector('.invite__words')?.getAttribute('aria-hidden'),
      visible: [...h.querySelectorAll('.invite__word')].every((w) => getComputedStyle(w).opacity === '1'),
      canvas: document.querySelectorAll('#convite canvas').length,
      photo: !!document.querySelector('#convite img'),
    };
  });
  ok('convite: título lido uma vez, palavras reveladas, foto presente', title.sr === 'Venha fazer parte desse time!' && title.hidden === 'true' && title.visible && title.photo, JSON.stringify(title));
  ok('convite: sem animação de fundo', title.canvas === 0);

  // Encerramento: mensagem sobre a foto
  await page.evaluate(() => document.getElementById('final-title').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(1500);
  const fin = await finalLayout(page);
  ok('encerramento: título, apoio e CTA dentro da área da foto', fin.inside, JSON.stringify(fin));
  ok(
    'encerramento: textos exatos e CTA de Free Pass funcional',
    fin.title === 'Sua melhor versão começa com o primeiro passo.' && fin.accent === 'primeiro passo.' && fin.lede === 'Venha conhecer a RIP e dê o seu primeiro passo.' && fin.ctaText.startsWith('Agendar meu Free Pass') && fin.cta.startsWith('https://wa.me/5551999850575?text='),
    fin.title,
  );
  ok('encerramento: entrada animada concluída', fin.visible);

  // Imagens inteiras no desktop
  await scrollWholePage(page);
  const cropped = await imagesUncropped(page);
  ok('desktop: nenhuma imagem recortada', cropped.length === 0, cropped.join(' | '));
  ok('galeria antiga removida, sem links para ela', (await page.locator('#galeria, [data-gallery-index], [data-lightbox], a[href*="galeria"]').count()) === 0);

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

// ---------- Surgimento das fotos: fade-in com partículas vermelhas ----------
for (const [w, h, mobile] of [[1440, 900, false], [390, 844, true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const start = await page.evaluate(() => {
    const visibleAtLoad = [...document.querySelectorAll('main picture > img')].filter((img) => {
      const r = img.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    });
    return {
      on: document.documentElement.classList.contains('img-fx'),
      marked: document.querySelectorAll('[data-img-fx]').length,
      total: document.querySelectorAll('main picture > img').length,
      visibleAtLoadShown: visibleAtLoad.every((img) => getComputedStyle(img).opacity === '1'),
    };
  });
  ok(`[${w}] fotos fora da tela marcadas para surgir; as já visíveis não piscam`, start.on && start.marked >= start.total - 1 && start.visibleAtLoadShown, JSON.stringify(start));

  const sel = '.modality__frame';
  await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ behavior: 'instant', block: 'center' }), sel);
  await page.waitForTimeout(350);
  const mid = await page.evaluate((sel) => {
    const host = document.querySelector(sel);
    return { canvas: !!host.querySelector('.img-fx__canvas'), opacity: Number(getComputedStyle(host.querySelector('img')).opacity) };
  }, sel);
  ok(`[${w}] durante o surgimento: partículas sobre a foto e foto em fade`, mid.canvas && mid.opacity > 0 && mid.opacity < 1, JSON.stringify(mid));
  await page.waitForTimeout(1600);
  const end = await page.evaluate((sel) => {
    const host = document.querySelector(sel);
    return { canvas: !!host.querySelector('.img-fx__canvas'), opacity: getComputedStyle(host.querySelector('img')).opacity, revealed: host.classList.contains('is-revealed') };
  }, sel);
  ok(`[${w}] ao fim: foto inteira e partículas removidas`, !end.canvas && end.opacity === '1' && end.revealed, JSON.stringify(end));

  // Carrossel: a segunda foto só surge quando o slide entra na tela.
  await page.evaluate(() => document.querySelector('[data-carousel]').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(1800);
  const before = await page.evaluate(() => [...document.querySelectorAll('.carousel__frame')].map((f) => f.classList.contains('is-revealed')));
  await page.click('[data-carousel-next]');
  await page.waitForTimeout(2200);
  const after = await page.evaluate(() => [...document.querySelectorAll('.carousel__frame')].map((f) => f.classList.contains('is-revealed')));
  // No celular aparece só a borda do segundo slide (< 20 %): ele surge ao trocar. No desktop a borda já é maior.
  ok(`[${w}] carrossel: a segunda foto surge quando o slide aparece`, before[0] && (!mobile || !before[1]) && after[1], `${JSON.stringify(before)} → ${JSON.stringify(after)}`);

  ok(`[${w}] surgimento sem erros de console`, errors.length === 0, errors.join(' | '));
  await ctx.close();
}

// ---------- Mobile: arco animado, menu, barra, carrossel, encerramento ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('mobile: arco animado na abertura', (await arcMode(page)) === 'live');
  const n = await rafPerSecond(page);
  ok('mobile: loop de animação rodando', n > 20, `${n} rAF/s`);
  const old = await noOldMotion(page);
  ok('mobile: sem botão de pausa nem área clicável remanescente', old.toggles === 0 && old.wave === 0, JSON.stringify(old));
  const first = await page.evaluate(() => {
    const logo = document.querySelector('.hero__logo').getBoundingClientRect();
    const h1 = document.getElementById('hero-title').getBoundingClientRect();
    return { logoBottom: logo.bottom, logoW: logo.width, h1Top: h1.top };
  });
  ok('mobile: logo inteira e título do hero na primeira tela', first.logoBottom < 844 - 72 && first.h1Top < 844 - 72 && first.logoW >= 280, JSON.stringify(first));
  ok('mobile: barra persistente visível (CTA na primeira tela)', await page.locator('[data-mobile-bar]').isVisible());

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

  // Carrossel: uma foto principal por vez e a borda da próxima
  await page.evaluate(() => document.querySelector('[data-carousel]').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(1200);
  const car = await page.evaluate(() => {
    const track = document.querySelector('[data-carousel-track]').getBoundingClientRect();
    const s = [...document.querySelectorAll('.carousel__slide')].map((el) => el.getBoundingClientRect());
    return { share: s[0].width / track.width, nextVisible: s[1].left < track.right, phrase: getComputedStyle(document.querySelector('.carousel__phrase')).opacity };
  });
  ok('mobile: carrossel com uma foto principal e indicação da próxima', car.share > 0.75 && car.share < 0.92 && car.nextVisible, JSON.stringify(car));
  ok('mobile: frase do slide revelada', car.phrase === '1');
  await page.tap('[data-carousel-next]');
  await page.waitForTimeout(900);
  ok('mobile: toque em "próxima" troca de slide', await page.evaluate(() => document.querySelector('[data-carousel-dot="1"]').getAttribute('aria-current') === 'true'));

  // Encerramento: texto dentro da foto, abaixo do rosto
  await page.evaluate(() => document.getElementById('final-title').scrollIntoView({ behavior: 'instant', block: 'center' }));
  await page.waitForTimeout(1500);
  const fin = await finalLayout(page);
  ok('mobile: mensagem do encerramento dentro da foto, abaixo do rosto', fin.inside && fin.contentTopPct >= 30, JSON.stringify({ inside: fin.inside, topo: `${fin.contentTopPct}%` }));

  // Barra não cobre o fim da página
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const last = await page.evaluate(() => {
    const el = document.querySelector('.footer__bottom p').getBoundingClientRect();
    const bar = document.querySelector('[data-mobile-bar]').getBoundingClientRect();
    return { textBottom: el.bottom, barTop: bar.top };
  });
  ok('barra não cobre o rodapé', last.textBottom <= last.barTop, JSON.stringify(last));

  await scrollWholePage(page);
  const croppedM = await imagesUncropped(page);
  ok('mobile: nenhuma imagem recortada', croppedM.length === 0, croppedM.join(' | '));
  ok('mobile: sem rolagem horizontal', !(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
  await ctx.close();
}

// ---------- Movimento reduzido ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(rafCounter);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('reduced-motion: arco em quadro parado', (await arcMode(page)) === 'still');
  const n = await rafPerSecond(page);
  ok('reduced-motion: sem loop', n === 0, `${n}`);
  ok('reduced-motion: logo visível', await page.locator('.hero__logo').isVisible());
  ok(
    'reduced-motion: fotos sem efeito de surgimento (visíveis direto, sem partículas)',
    await page.evaluate(() => !document.documentElement.classList.contains('img-fx') && !document.querySelector('.img-fx__canvas') && [...document.querySelectorAll('main picture > img')].every((i) => getComputedStyle(i).opacity === '1')),
  );
  ok('reduced-motion: conteúdo revelado sem animação', await page.evaluate(() => getComputedStyle(document.querySelector('.structure__copy')).opacity === '1'));
  ok(
    'reduced-motion: convite, frases do carrossel e encerramento no estado final',
    await page.evaluate(() => [...document.querySelectorAll('.invite__word, .carousel__phrase, .final__step')].every((el) => getComputedStyle(el).opacity === '1')),
  );
  await ctx.close();
}

// ---------- Sem WebGL ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/.test(type) ? null : orig.call(this, type, ...rest); };
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  ok('sem WebGL: arco estático em CSS', (await arcMode(page)) === 'static');
  ok('sem WebGL: arco estático visível e logo visível', await page.evaluate(() => getComputedStyle(document.querySelector('.arc__static')).opacity === '1') && (await page.locator('.hero__logo').isVisible()));
  ok('sem WebGL: CTA presente e sem erro visível', (await page.locator('.hero__cta').isVisible()) && errors.length === 0, errors.join('|'));
  await ctx.close();
}

// ---------- Sem JavaScript ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  ok('sem JS: logo e CTA do hero visíveis', (await page.locator('.hero__logo').isVisible()) && (await page.locator('.hero__cta').isVisible()));
  ok('sem JS: seções visíveis (sem depender de reveal)', await page.evaluate(() => getComputedStyle(document.querySelector('.structure__copy')).opacity === '1'));
  ok('sem JS: horários na página', (await page.textContent('#localizacao')).includes('5h30 às 22h'));
  ok('sem JS: todas as fotos visíveis', await page.evaluate(() => [...document.querySelectorAll('main picture > img')].every((i) => getComputedStyle(i).opacity === '1')));
  ok(
    'sem JS: título do convite, frases do carrossel e encerramento visíveis',
    await page.evaluate(() => [...document.querySelectorAll('.invite__word, .carousel__phrase, .final__step')].every((el) => getComputedStyle(el).opacity === '1')),
  );
  ok('sem JS: controles do carrossel ocultos (a rolagem nativa continua)', !(await page.locator('[data-carousel-controls]').isVisible()));
  ok('sem JS: barra persistente com link real', (await page.getAttribute('[data-mobile-bar] a', 'href')).startsWith('https://wa.me/'));
  await ctx.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.filter((r) => r.startsWith('PASS')).length}/${results.length} PASS`);
