// Contraste do texto do hero no pior quadro da animação (fundo mais claro sob cada bloco de texto).
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
import sharp from 'sharp';
const w = Number(process.env.W || 1440);
const frames = Number(process.env.FRAMES || 16);
const browser = await chromium.launch({
  executablePath: BROWSER,
  args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const page = await (await browser.newContext({ viewport: { width: w, height: 900 } })).newPage();
await page.goto(process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
const mode = await page.evaluate(() => document.querySelector('[data-hero]').dataset.wave);
const sel = ['.hero__eyebrow', '.hero__title', '.hero__lede', '.hero__micro', '.hero__facts strong', '.hero__facts span', '.hero__actions .btn--ghost'];
const boxes = await page.evaluate((sel) => sel.flatMap((s) => [...document.querySelectorAll(s)].map((el) => {
  const r = el.getBoundingClientRect();
  const c = getComputedStyle(el).color;
  return { s, x: r.x, y: r.y, w: r.width, h: r.height, color: c };
})), sel);
await page.addStyleTag({ content: '.hero__copy{visibility:hidden!important}' });
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const worst = {};
for (let f = 0; f < frames; f++) {
  await page.waitForTimeout(1500);
  const buf = await page.screenshot();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  for (const b of boxes) {
    let maxL = 0;
    for (let y = Math.max(0, Math.floor(b.y)); y < Math.min(info.height, b.y + b.h); y++)
      for (let x = Math.max(0, Math.floor(b.x)); x < Math.min(info.width, b.x + b.w); x++) {
        const i = (y * info.width + x) * info.channels;
        const l = L(data[i], data[i + 1], data[i + 2]);
        if (l > maxL) maxL = l;
      }
    const [r, g, bb] = b.color.match(/\d+/g).map(Number);
    const lt = L(r, g, bb);
    const ratio = (Math.max(lt, maxL) + 0.05) / (Math.min(lt, maxL) + 0.05);
    const k = b.s;
    if (!worst[k] || ratio < worst[k].ratio) worst[k] = { ratio: +ratio.toFixed(2), bgMaxL: +maxL.toFixed(4), color: b.color };
  }
}
console.log('mode', mode, 'width', w, 'frames', frames);
console.table(worst);
await browser.close();
