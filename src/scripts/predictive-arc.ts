/**
 * Predictive Arc 2 — adaptação para a RIP Academia (abertura do hero).
 *
 * Baseado em "Predictive Arc 2 — Originkit" (RipAcademia-Ajustes-Rodada-2/animacao/PredictiveArc2-referencia.tsx),
 * fornecido pelo usuário, exportado lá como PredictiveArcHorizon. O shader (arco de pequenos quadrados) é o
 * mesmo do original; mudanças de montagem e ciclo de vida:
 *  - módulo TypeScript nativo (sem React), importado sob demanda pelo hero;
 *  - sem minWidth 1200 / minHeight 800: o canvas segue a área real da abertura (ResizeObserver);
 *  - loop só entre start() e stop(); o controlador do hero para o loop fora da tela, com a aba oculta
 *    e com movimento reduzido (nesse caso desenha um único quadro estático com drawStill());
 *  - DPR e quadros por segundo limitados por opção (o original desenha todo quadro com DPR até 2);
 *  - ponteiro lido no elemento host (a abertura), só quando `pointer` é verdadeiro; o canvas não recebe eventos;
 *  - limpeza completa (programa, shaders, buffer, observer, listeners) e tratamento de falha de
 *    compilação, link e perda de contexto, sem mensagens no console do visitante.
 */

const VERT_SRC = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Shader do original, sem alterações.
const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uDpr, uCell, uDot, uHover;
uniform vec2  uPtr;
uniform float uA, uB, uC, uD;
uniform vec3  uBg, uBase, uAccent, uHigh;

void main(){
  float cs = max(uCell, 2.0);
  vec2 ci = floor(gl_FragCoord.xy / cs);
  vec2 cc = (ci + 0.5) * cs;

  float x = cc.x / uDpr;
  float y = (uRes.y - cc.y) / uDpr;
  float w = uRes.x / uDpr;
  float h = uRes.y / uDpr;
  float t = uTime;

  float i = 0.0;
  float R = w * uB;

  float rot = -clamp((uPtr.x - w * 0.5) / w, -0.5, 0.5) * 0.9 * uHover;
  vec2 c = vec2(w * 0.5, h * (1.0 - uA) + R);
  vec2 q = vec2(x, y) - c;
  float cr = cos(rot);
  float sr = sin(rot);
  q = vec2(cr * q.x - sr * q.y, sr * q.x + cr * q.y);
  float r = length(q);
  float dist = r - R;
  float normX = q.x / (w * 0.75);
  float th = (140.0 + (1.0 - min(abs(normX), 1.0)) * 80.0) * uC;
  float thS = dist > 0.0 ? th : th * 0.45;
  float ad = abs(dist);
  if (ad < thS && q.y < 0.0) {
    i = 1.0 - ad / thS;
    float waveX = sin(x * 0.015 + t);
    float waveR = cos(r * 0.02 - t * 1.6);
    i = i * 0.7 + waveX * waveR * 0.3 * i;
    i *= max(0.0, 1.0 - pow(min(abs(normX), 1.0), uD));
  }

  vec3 col = uBg;
  if (i > 0.02) {
    float side = uDot * i * uDpr;
    vec2 d = abs(gl_FragCoord.xy - cc);
    float cov = 1.0 - smoothstep(side * 0.5 - 1.0, side * 0.5 + 1.0, max(d.x, d.y));

    vec3 ink = mix(uBase, uAccent, clamp(pow(i, 1.1), 0.0, 1.0));
    ink = mix(ink, uHigh, smoothstep(0.72, 1.0, i));
    col = mix(uBg, ink, cov * clamp(i * 1.6, 0.0, 1.0));
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];

const hex = (input: string): RGB => {
  let h = input.trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
};
const clampN = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** Mesmas props e escalas do componente original. */
export interface PredictiveArcOptions {
  background: string;
  baseColor: string;
  accentColor: string;
  highlight: string;
  /** 40–320: quadrados ao longo do menor lado. */
  density: number;
  /** 20–400 (%). */
  dotSize: number;
  /** 0–100 (50 = velocidade de referência). */
  speed: number;
  /** 0–200 (%): giro do arco pelo ponteiro. */
  hover: number;
  horizon: { rise: number; radius: number; thickness: number; falloff: number };
  /** Limites de orçamento desta adaptação. */
  maxDpr: number;
  fps: number;
  pointer: boolean;
}

/** Preset vermelho aprovado (final do arquivo de referência), não os defaults azuis da função base. */
export const RIP_ARC_PRESET: Omit<PredictiveArcOptions, 'maxDpr' | 'fps' | 'pointer'> = {
  background: '#000000',
  baseColor: '#F91700',
  accentColor: '#AC2B2B',
  highlight: '#000000',
  density: 40,
  dotSize: 100,
  speed: 50,
  hover: 100,
  horizon: { rise: 45, radius: 90, thickness: 100, falloff: 250 },
};

export interface PredictiveArcController {
  start(): void;
  stop(): void;
  /** Desenha um único quadro (movimento reduzido); o tempo fica parado. */
  drawStill(): void;
  destroy(): void;
}

/**
 * Cria o renderer. Resolve null (sem lançar e sem deixar recursos órfãos) quando WebGL, a compilação
 * ou o link falham. `onFail` é chamado se o contexto for perdido depois da criação.
 */
export function createPredictiveArc(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts: PredictiveArcOptions,
  onFail: () => void,
): PredictiveArcController | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const g = gl;

  const shaders: WebGLShader[] = [];
  let prog: WebGLProgram | null = null;
  let buf: WebGLBuffer | null = null;

  const release = () => {
    if (g.isContextLost()) return;
    if (buf) g.deleteBuffer(buf);
    if (prog) g.deleteProgram(prog);
    for (const s of shaders) g.deleteShader(s);
    buf = null;
    prog = null;
    shaders.length = 0;
  };

  const compile = (type: number, src: string) => {
    const sh = g.createShader(type);
    if (!sh) return null;
    shaders.push(sh);
    g.shaderSource(sh, src);
    g.compileShader(sh);
    return g.getShaderParameter(sh, g.COMPILE_STATUS) ? sh : null;
  };

  const vs = compile(g.VERTEX_SHADER, VERT_SRC);
  const fs = vs && compile(g.FRAGMENT_SHADER, FRAG_SRC);
  prog = fs ? g.createProgram() : null;
  if (!vs || !fs || !prog) {
    release();
    return null;
  }
  g.attachShader(prog, vs);
  g.attachShader(prog, fs);
  g.linkProgram(prog);
  if (!g.getProgramParameter(prog, g.LINK_STATUS)) {
    release();
    return null;
  }
  g.useProgram(prog);

  buf = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, buf);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
  const aPos = g.getAttribLocation(prog, 'a_pos');
  g.enableVertexAttribArray(aPos);
  g.vertexAttribPointer(aPos, 2, g.FLOAT, false, 0, 0);

  const p = prog;
  const u = Object.fromEntries(
    ['uRes', 'uTime', 'uDpr', 'uCell', 'uDot', 'uHover', 'uPtr', 'uA', 'uB', 'uC', 'uD', 'uBg', 'uBase', 'uAccent', 'uHigh'].map((n) => [
      n,
      g.getUniformLocation(p, n),
    ]),
  ) as Record<string, WebGLUniformLocation | null>;

  // Valores na escala do original.
  const density = Math.round(clampN(opts.density, 40, 320));
  const dotSize = clampN(opts.dotSize, 20, 400) / 100;
  const speed = clampN(opts.speed, 0, 100) / 50;
  const hover = clampN(opts.hover, 0, 200) / 100;
  const rise = clampN(opts.horizon.rise, 0, 100) / 100;
  const radius = clampN(opts.horizon.radius, 20, 300) / 100;
  const thickness = clampN(opts.horizon.thickness, 20, 400) / 100;
  const falloff = clampN(opts.horizon.falloff, 50, 600) / 100;
  const [bg, base, accent, high] = [opts.background, opts.baseColor, opts.accentColor, opts.highlight].map(hex);
  const frameInterval = 1000 / Math.max(1, opts.fps);

  // Cores e parâmetros fixos: enviados uma vez.
  g.uniform1f(u.uA, rise);
  g.uniform1f(u.uB, radius);
  g.uniform1f(u.uC, thickness);
  g.uniform1f(u.uD, falloff);
  g.uniform1f(u.uHover, hover);
  g.uniform3f(u.uBg, bg[0], bg[1], bg[2]);
  g.uniform3f(u.uBase, base[0], base[1], base[2]);
  g.uniform3f(u.uAccent, accent[0], accent[1], accent[2]);
  g.uniform3f(u.uHigh, high[0], high[1], high[2]);

  // Tamanho observado (sem medir o layout a cada quadro).
  let cssW = canvas.clientWidth || 1;
  let cssH = canvas.clientHeight || 1;
  const ro = new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (!box) return;
    cssW = Math.max(1, box.width);
    cssH = Math.max(1, box.height);
    if (!running && still) draw(0); // movimento reduzido: redesenha o quadro estático no novo tamanho
  });
  ro.observe(canvas);

  // Ponteiro: complemento, só com mouse/trackpad; nunca bloqueia cliques nem rolagem.
  const ptr = { tx: 0.5, x: 0.5 };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    if (r.width > 0) ptr.tx = clampN((e.clientX - r.left) / r.width, 0, 1);
  };
  const onLeave = () => {
    ptr.tx = 0.5;
  };
  if (opts.pointer) {
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });
  }

  let raf = 0;
  let running = false;
  let still = false;
  let dead = false;
  let last = -1;
  let clock = 0;

  function draw(dt: number) {
    if (dead || g.isContextLost()) return;
    clock = (clock + dt * 0.9 * speed) % 6283;
    ptr.x += (ptr.tx - ptr.x) * (1 - Math.exp(-dt * 6));

    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    const bw = Math.max(1, Math.round(cssW * dpr));
    const bh = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    g.viewport(0, 0, bw, bh);
    const pitchCss = Math.min(bw, bh) / dpr / density;
    g.uniform2f(u.uRes, bw, bh);
    g.uniform1f(u.uTime, clock);
    g.uniform1f(u.uDpr, dpr);
    g.uniform1f(u.uCell, Math.max(2, pitchCss * dpr));
    g.uniform1f(u.uDot, pitchCss * 1.2 * dotSize);
    g.uniform2f(u.uPtr, ptr.x * (bw / dpr), 0.5 * (bh / dpr));
    g.drawArrays(g.TRIANGLES, 0, 3);
  }

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (last >= 0 && now - last < frameInterval - 1) return; // limite de quadros por segundo
    const dt = last < 0 ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    draw(dt);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const start = () => {
    if (running || dead) return;
    still = false;
    running = true;
    last = -1; // retoma sem salto de tempo
    raf = requestAnimationFrame(frame);
  };

  const drawStill = () => {
    stop();
    still = true;
    draw(0);
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    destroy();
    onFail();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  function destroy() {
    if (dead) return;
    stop();
    dead = true;
    ro.disconnect();
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    canvas.removeEventListener('webglcontextlost', onLost);
    release();
  }

  return { start, stop, drawStill, destroy };
}
