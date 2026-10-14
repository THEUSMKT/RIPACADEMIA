// Contraste do texto sobre imagens e efeitos: frases do carrossel (sobre as fotos da estrutura),
// mensagem do encerramento (sobre a foto) e texto do hero. Para cada bloco, compara a cor do texto
// com o pixel MAIS CLARO do fundo sob ele (pior caso), com o texto escondido.
import { chromium } from 'playwright-core';
import sharp from 'sharp';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/contrast.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const w = Number(process.env.W || 1440);
const h = w < 768 ? 844 : 900;
const browser = await chromium.launch({ executablePath: BROWSER, args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'] });
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

// [nome do bloco, como rolar até ele, seletores de texto, elementos de texto a esconder]
const groups = [
  ['hero', () => window.scrollTo({ top: 0, behavior: 'instant' }), ['.hero__eyebrow', '.hero__title', '.hero__lede', '.hero__micro', '.hero__facts strong', '.hero__facts span'], '.hero__copy'],
  ['carrossel', () => document.querySelector('[data-carousel]').scrollIntoView({ behavior: 'instant', block: 'center' }), ['.carousel__slide:first-child .carousel__phrase'], '.carousel__phrase'],
  ['encerramento', () => document.getElementById('final-title').scrollIntoView({ behavior: 'instant', block: 'center' }), ['#final-title .final__step:not(.accent)', '#final-title .accent', '.final__lede'], '.final__content > *'],
];
const page = await (await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })).newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const rows = [];
for (const [name, scroll, sel, hide] of groups) {
  await page.evaluate(scroll);
  await page.waitForTimeout(800);
  const boxes = await page.evaluate((sel) => sel.flatMap((s) => [...document.querySelectorAll(s)].map((el) => {
    const r = el.getBoundingClientRect();
    return { s, x: r.x, y: r.y, w: r.width, h: r.height, color: getComputedStyle(el).color };
  })), sel);
  // A barra fixa do celular é escondida junto: ela não fica atrás do texto, só sobrepõe a captura.
  const tag = await page.addStyleTag({ content: `${hide},[data-mobile-bar]{visibility:hidden!important}` });
  await page.waitForTimeout(200); // garante que o estilo que esconde o texto já foi pintado
  const { data, info } = await sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true });
  await tag.evaluate((t) => t.remove());
  for (const b of boxes) {
    let maxL = 0;
    for (let y = Math.max(0, Math.floor(b.y)); y < Math.min(info.height, b.y + b.h); y++)
      for (let x = Math.max(0, Math.floor(b.x)); x < Math.min(info.width, b.x + b.w); x++) {
        const i = (y * info.width + x) * info.channels;
        maxL = Math.max(maxL, L(data[i], data[i + 1], data[i + 2]));
      }
    const [r, g, bb] = b.color.match(/\d+/g).map(Number);
    const lt = L(r, g, bb);
    const ratio = (Math.max(lt, maxL) + 0.05) / (Math.min(lt, maxL) + 0.05);
    const key = `${name}: ${b.s}`;
    const prev = rows.find((x) => x.bloco === key);
    if (!prev) rows.push({ bloco: key, contraste: +ratio.toFixed(2), fundoMaisClaro: +maxL.toFixed(4), cor: b.color });
    else if (ratio < prev.contraste) Object.assign(prev, { contraste: +ratio.toFixed(2), fundoMaisClaro: +maxL.toFixed(4) });
  }
}
console.log('largura', w);
console.table(rows);
await browser.close();
