/**
 * Surgimento das fotos.
 *
 * Quando uma foto entra na tela pela primeira vez, ela aparece com fade-in e uma faixa de quadradinhos
 * vermelhos (as mesmas cores e a mesma grade do arco do hero) sobe por ela e se desfaz até a foto ficar
 * inteira. Cerca de 1,3 s, uma vez por foto. As partículas são desenhadas num canvas 2D temporário sobre
 * a foto, removido no fim; a foto em si não é recortada, ampliada nem alterada.
 *
 * Não há efeito (as fotos aparecem normalmente) com movimento reduzido, sem IntersectionObserver, sem
 * JavaScript ou para fotos que já estão na tela quando a página abre (para não piscarem).
 */

const DURATION = 1300;
const BASE: [number, number, number] = [249, 23, 0]; // #F91700, cor base do arco
const ACCENT: [number, number, number] = [172, 43, 43]; // #AC2B2B, cor de acento do arco
const LIFE = 0.17; // meia-vida de cada partícula, em fração da animação
const MAX_DPR = 1.5;

type Particle = { x: number; y: number; t: number };

// Curva suave nas duas pontas: a opacidade acompanha a subida das partículas.
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function play(host: HTMLElement, img: HTMLImageElement) {
  const w = host.clientWidth;
  const h = host.clientHeight;
  if (!w || !h) {
    finish(host, img);
    return;
  }
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const canvas = document.createElement('canvas');
  canvas.className = 'img-fx__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    finish(host, img);
    return;
  }
  host.appendChild(canvas);
  ctx.scale(dpr, dpr);

  // Grade como a do arco (menor lado ÷ 40), com quadrados entre 7 e 16 px. Cerca de 60 % das células
  // recebem uma partícula; cada uma acende quando a faixa passa por ela, de baixo para cima.
  const cell = Math.max(7, Math.min(16, Math.round(Math.min(w, h) / 40)));
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const particles: Particle[] = [];
  for (let r = 0; r < rows; r++) {
    const rise = 1 - (r + 0.5) / rows; // 0 na base, 1 no topo
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.6) continue;
      particles.push({ x: c * cell, y: r * cell, t: 0.06 + 0.5 * rise + 0.24 * Math.random() });
    }
  }

  const start = performance.now();
  const frame = (now: number) => {
    const p = clamp01((now - start) / DURATION);
    // A foto aparece por inteiro em 80 % do tempo; as últimas partículas se desfazem em seguida.
    img.style.opacity = String(smooth(clamp01((p - 0.04) / 0.76)));
    ctx.clearRect(0, 0, w, h);
    for (const pt of particles) {
      const i = 1 - Math.abs(p - pt.t) / LIFE;
      if (i <= 0) continue;
      // Como no arco: quanto mais intensa, maior e mais próxima da cor base.
      const size = cell * (0.25 + 0.6 * i);
      const k = 1 - i;
      ctx.fillStyle = `rgba(${Math.round(BASE[0] + (ACCENT[0] - BASE[0]) * k)}, ${Math.round(BASE[1] + (ACCENT[1] - BASE[1]) * k)}, ${Math.round(
        BASE[2] + (ACCENT[2] - BASE[2]) * k,
      )}, ${Math.min(1, i * 1.4).toFixed(3)})`;
      ctx.fillRect(pt.x + (cell - size) / 2, pt.y + (cell - size) / 2, size, size);
    }
    if (p < 1) requestAnimationFrame(frame);
    else {
      canvas.remove();
      finish(host, img);
    }
  };
  requestAnimationFrame(frame);
}

function finish(host: HTMLElement, img: HTMLImageElement) {
  img.style.opacity = '';
  host.classList.add('is-revealed');
}

export function initImageReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targets = Array.from(document.querySelectorAll<HTMLImageElement>('main picture > img')).flatMap((img) => {
    const host = img.parentElement?.parentElement;
    if (!host) return [];
    const r = host.getBoundingClientRect();
    // Já visível ao abrir a página: fica como está, sem esconder e reaparecer.
    if (r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0) return [];
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.setAttribute('data-img-fx', '');
    return [{ host, img }];
  });
  if (!targets.length) return;
  // A partir daqui, as fotos marcadas ficam transparentes até surgirem (todas estão fora da tela).
  document.documentElement.classList.add('img-fx');

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const t = targets.find((x) => x.host === entry.target);
        if (!t) continue;
        const { host, img } = t;
        const go = () => play(host, img);
        if (img.complete && img.naturalWidth) go();
        else {
          img.addEventListener('load', go, { once: true });
          // Se a foto não carregar, ela não fica escondida.
          img.addEventListener('error', () => finish(host, img), { once: true });
        }
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
  );
  targets.forEach((t) => io.observe(t.host));
}
