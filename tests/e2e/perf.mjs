// Compara a home com o arco Predictive Arc 2 animado x parado (reduced-motion), mesmo navegador e máquina.
// Mede LCP, CLS, long tasks, desenhos WebGL por segundo, intervalos entre frames e latência de clique.
import { chromium } from 'playwright-core';
// Navegador local (Chromium/Edge/Chrome). Ex.: BROWSER_PATH="/usr/bin/google-chrome" node tests/e2e/interact.mjs
const BROWSER = process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.SITE_PREVIEW_URL || 'http://127.0.0.1:4321/RIPACADEMIA/';
const browser = await chromium.launch({
  executablePath: BROWSER,
  args: ['--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const init = () => {
  window.__perf = { lcp: 0, cls: 0, long: [], draws: 0 };
  new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__perf.lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__perf.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__perf.long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true });
  const p = WebGLRenderingContext.prototype;
  const d = p.drawArrays;
  p.drawArrays = function (...a) { window.__perf.draws++; return d.apply(this, a); };
};
async function run(label, reducedMotion) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
    await ctx.addInitScript(init);
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // renderer já iniciado
    const d0 = await page.evaluate(() => window.__perf.draws);
    // Intervalos de frame por 3 s
    const frames = await page.evaluate(() => new Promise((res) => {
      const ts = []; const t0 = performance.now();
      const f = (t) => { ts.push(t); if (t - t0 < 3000) requestAnimationFrame(f); else res(ts); };
      requestAnimationFrame(f);
    }));
    const d1 = await page.evaluate(() => window.__perf.draws);
    const gaps = frames.slice(1).map((t, k) => t - frames[k]).sort((a, b) => a - b);
    // Latência de clique: do pointerdown até o próximo frame pintado, no botão "Conhecer a estrutura"
    const click = await page.evaluate(() => new Promise((res) => {
      const btn = document.querySelector('.hero__actions .btn--ghost');
      btn.addEventListener('click', (e) => { e.preventDefault(); const t = e.timeStamp; requestAnimationFrame(() => setTimeout(() => res(performance.now() - t), 0)); }, { once: true });
      btn.click();
    }));
    const perf = await page.evaluate(() => window.__perf);
    rows.push({
      lcp: Math.round(perf.lcp),
      cls: +perf.cls.toFixed(4),
      longTasks: perf.long.length,
      longMax: perf.long.length ? Math.max(...perf.long) : 0,
      drawsPerSec: Math.round((d1 - d0) / 3), // 1 drawArrays por quadro
      frameP50: +gaps[Math.floor(gaps.length * 0.5)].toFixed(1),
      frameP95: +gaps[Math.floor(gaps.length * 0.95)].toFixed(1),
      clickToPaint: +click.toFixed(1),
    });
    await ctx.close();
  }
  console.log(`\n${label}`);
  console.table(rows);
}
await run('Arco ANIMADO (desktop 1440)', 'no-preference');
await run('Arco PARADO (prefers-reduced-motion: um quadro só)', 'reduce');
await browser.close();
