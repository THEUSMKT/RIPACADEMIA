/**
 * Ribbon Glow — adaptação para a RIP Academia.
 *
 * Baseado em "Ribbon Glow 2 — Originkit" (RipAcademia-Base-ClaudeCode/animacoes/RibbonGlow-referencia.tsx),
 * fornecido pelo usuário. Shaders de campo e acabamento preservados; mudanças documentadas no README:
 *  - módulo TypeScript nativo (sem React), carregado sob demanda (desktop e mobile) pelo controlador
 *    src/scripts/wave-controller.ts, que gerencia uma instância por seção (hero e convite);
 *  - sem minWidth 1200 / minHeight 800: o canvas segue o tamanho real do hero;
 *  - loop só existe entre start() e stop() (visibilidade, aba oculta, pausa e movimento reduzido ficam no controlador);
 *  - limite de DPR e de quadros por segundo configuráveis; LAYERS vira parâmetro de geração do shader;
 *  - ponteiro lido no elemento host (a seção), nunca na janela inteira, e só se `pointer` for verdadeiro;
 *  - deslocamento `offset` para posicionar a faixa na composição; offset e size ajustáveis depois da criação
 *    (setPlacement), para mudar a composição entre telas largas e estreitas sem recriar o renderer;
 *  - falhas (WebGL2 ausente, compilação, framebuffer incompleto, perda de contexto) devolvem null / chamam onFail
 *    sem mensagens para o visitante, liberando o que já tinha sido criado.
 */

const TWIST = 1.25;
const DRAG = 0.18;

const VERT_SRC = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`;

const fieldSrc = (layers: number) => `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uSize;
uniform float uAngle;
uniform vec2 uMouse;
uniform float uOn;
uniform float uReach;
uniform vec2 uVel;
uniform vec2 uOffset;
out vec4 o;

const float TAU = 6.28318530718;
const float LAYERS = ${layers.toFixed(1)};
const float TWIST = ${TWIST.toFixed(3)};
const float DRAG = ${DRAG.toFixed(3)};
const float GAIN = 0.62;
const vec2 CENTRE = vec2(-0.62, 0.24);
const float TILT = 0.6;
const float ZOOM = 1.05;
const float THETA = 2.13;
const float SHEAR = 0.963;
const float SHRINK = 0.953;
const vec2 WARP_FREQ = vec2(0.42, 2.4);
const vec2 WARP_AMP = vec2(0.13, 0.027);
const vec2 ASPECT = vec2(2.1, 0.17);
const float OFFSET = 0.36;
const float GLOW = 0.0021;
const float SOFT = 0.0019;
const float FALLOFF = 0.37;
const float PHASE = 12.0;
const float CYCLE = 0.16;
const float HUE_TRAVEL = 2.0;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

void main() {
  vec2 R = uRes;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;

  vec2 d = pos - uMouse;
  float w = uOn * exp(-dot(d, d) / (uReach * uReach));
  if (w > 1e-4) pos = uMouse + rot(w * TWIST) * d * (1.0 - 0.3 * min(w, 1.0)) - uVel * min(w, 1.0) * DRAG;

  pos -= uOffset;
  pos = rot(uAngle) * pos / uSize;
  float t = uTime * 0.49 + PHASE;
  float breath = (-sin(uTime * 0.735) + sin(uTime * 0.49 + 1.0)) * 0.25 + 0.5;
  vec2 u = rot(TILT) * ((pos - CENTRE) * (ZOOM - breath * 0.085));
  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  vec3 col = vec3(0.0);
  for (float i = 1.0; i <= LAYERS; i += 1.0) {
    u.x -= sin(u.y * WARP_FREQ.x + t + i * 0.007) * WARP_AMP.x;
    u.y -= sin(u.x * WARP_FREQ.y - t + i * 0.02) * WARP_AMP.y;
    u = fold * u * SHRINK;
    vec2 q = (u - vec2(OFFSET + breath * 0.1, 0.0)) * ASPECT;
    float g = GLOW / (dot(q, q) + SOFT) * (0.25 + breath * 0.4);
    float r = length(u);
    float k = sin(i * CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    col += g * mix(uC1, uC2, k) * (0.62 + 0.5 * k) * exp2(-r * FALLOFF);
  }
  vec3 x = max(col * GAIN, 0.0);
  col = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.85, 0.92, 0.98));
  col *= 1.0 - smoothstep(0.5, 1.6, length(pos)) * 0.07;
  o = vec4(col, 1.0);
}
`;

const FINISH_SRC = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBg;
uniform float uPaper;
out vec4 o;

float ign(vec2 p, float f) { p += 5.588238 * mod(f, 64.0); return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y)); }

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 L = max(texture(uField, frag / uRes).rgb, 0.0);

  vec3 dark = uBg + L * (1.0 - uBg);
  float strength = clamp(max(L.r, max(L.g, L.b)), 0.0, 1.0);
  vec3 paper = uBg * (1.0 - strength) + L * 0.96;
  vec3 col = mix(dark, paper, uPaper);
  col += (ign(frag, floor(uTime * 24.0)) - 0.5) / 255.0;
  o = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

type RGB = [number, number, number];

function hex(input: string): RGB {
  let h = input.trim().replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  return [n(0), n(2), n(4)];
}

const clampN = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export interface RibbonGlowOptions {
  background: string;
  color1: string;
  color2: string;
  /** 0–100, mesma escala do componente original (50 = velocidade de referência). */
  speed: number;
  /** 50–200 (%). */
  size: number;
  /** Graus, −180 a 180. */
  angle: number;
  /** 0–200 (%): intensidade da influência do ponteiro. */
  hover: number;
  /** Raio de influência do ponteiro, em px CSS. */
  reach: number;
  /** Deslocamento da faixa em unidades da altura (x para a direita, y para cima). */
  offset: [number, number];
  maxDpr: number;
  fps: number;
  layers: number;
  pointer: boolean;
}

export interface RibbonGlowController {
  start(): void;
  stop(): void;
  destroy(): void;
  /** Reposiciona e redimensiona a faixa (ex.: mudança de breakpoint); vale a partir do próximo quadro. */
  setPlacement(offset: [number, number], size: number): void;
}

/**
 * Cria o renderer. Resolve null (sem lançar e sem deixar recursos órfãos) quando
 * WebGL2, a compilação ou o framebuffer falham. `onFail` é chamado se o contexto
 * for perdido depois da criação. A compilação usa KHR_parallel_shader_compile quando
 * disponível, para não bloquear a thread principal enquanto os shaders são compilados.
 */
export async function createRibbonGlow(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts: RibbonGlowOptions,
  onFail: () => void,
): Promise<RibbonGlowController | null> {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
  } catch {
    gl = null;
  }
  if (!gl) return null;
  const g = gl;

  const programs: WebGLProgram[] = [];
  const parallel = g.getExtension('KHR_parallel_shader_compile') as { COMPLETION_STATUS_KHR: number } | null;

  // Inicia compilação e link sem consultar o status (consultar força a espera síncrona).
  const startLink = (frag: string): WebGLProgram | null => {
    const vs = g.createShader(g.VERTEX_SHADER);
    const fs = g.createShader(g.FRAGMENT_SHADER);
    const prog = g.createProgram();
    if (!vs || !fs || !prog) {
      if (vs) g.deleteShader(vs);
      if (fs) g.deleteShader(fs);
      if (prog) g.deleteProgram(prog);
      return null;
    }
    g.shaderSource(vs, VERT_SRC);
    g.shaderSource(fs, frag);
    g.compileShader(vs);
    g.compileShader(fs);
    g.attachShader(prog, vs);
    g.attachShader(prog, fs);
    g.linkProgram(prog);
    // Marcados para exclusão: são liberados junto com o programa.
    g.deleteShader(vs);
    g.deleteShader(fs);
    programs.push(prog);
    return prog;
  };

  const waitLinked = async (progs: WebGLProgram[]) => {
    if (parallel) {
      const deadline = performance.now() + 10000;
      while (!progs.every((p) => g.getProgramParameter(p, parallel.COMPLETION_STATUS_KHR))) {
        if (g.isContextLost() || performance.now() > deadline) return false;
        await new Promise((r) => setTimeout(r, 16));
      }
    }
    return progs.every((p) => g.getProgramParameter(p, g.LINK_STATUS));
  };

  let vao: WebGLVertexArrayObject | null = null;
  let fbo: WebGLFramebuffer | null = null;
  let tex: WebGLTexture | null = null;

  const releaseGl = () => {
    if (tex) g.deleteTexture(tex);
    if (fbo) g.deleteFramebuffer(fbo);
    if (vao) g.deleteVertexArray(vao);
    for (const p of programs) g.deleteProgram(p);
    tex = null;
    fbo = null;
    vao = null;
    programs.length = 0;
  };

  const field = startLink(fieldSrc(Math.round(clampN(opts.layers, 8, 84))));
  const finish = field ? startLink(FINISH_SRC) : null;
  if (!field || !finish || !(await waitLinked([field, finish]))) {
    if (!g.isContextLost()) releaseGl();
    return null;
  }

  const loc = (prog: WebGLProgram, names: string[]) =>
    Object.fromEntries(names.map((n) => [n, g.getUniformLocation(prog, n)])) as Record<string, WebGLUniformLocation | null>;
  const uf = loc(field, ['uRes', 'uTime', 'uC1', 'uC2', 'uSize', 'uAngle', 'uMouse', 'uOn', 'uReach', 'uVel', 'uOffset']);
  const un = loc(finish, ['uField', 'uRes', 'uTime', 'uBg', 'uPaper']);

  vao = g.createVertexArray();
  g.bindVertexArray(vao);
  fbo = g.createFramebuffer();

  // Campo em textura de meia resolução (como no original); tenta half-float e recua para RGBA8.
  let half = !!g.getExtension('EXT_color_buffer_float');
  let fw = 0;
  let fh = 0;
  const resizeField = (nw: number, nh: number): boolean => {
    if (nw === fw && nh === fh && tex) return true;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (tex) g.deleteTexture(tex);
      tex = g.createTexture();
      g.bindTexture(g.TEXTURE_2D, tex);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, half ? g.RGBA16F : g.RGBA8, nw, nh, 0, g.RGBA, half ? g.HALF_FLOAT : g.UNSIGNED_BYTE, null);
      g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
      const ok = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
      g.bindFramebuffer(g.FRAMEBUFFER, null);
      if (ok) {
        fw = nw;
        fh = nh;
        return true;
      }
      if (!half) break;
      half = false;
    }
    return false;
  };

  // Tamanho: observado no canvas, aplicado no próximo quadro (sem medir o layout a cada frame).
  let cssW = canvas.clientWidth || 1;
  let cssH = canvas.clientHeight || 1;
  let sizeDirty = true;
  const ro = new ResizeObserver((entries) => {
    const box = entries[0]?.contentRect;
    if (!box) return;
    cssW = Math.max(1, box.width);
    cssH = Math.max(1, box.height);
    sizeDirty = true;
  });
  ro.observe(canvas);

  const applySize = (): boolean => {
    const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr);
    const bw = Math.max(1, Math.round(cssW * dpr));
    const bh = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    sizeDirty = false;
    return resizeField(Math.max(1, Math.round(bw / 2)), Math.max(1, Math.round(bh / 2)));
  };

  if (!applySize()) {
    ro.disconnect();
    releaseGl();
    return null;
  }

  // Ponteiro: somente no hero e somente quando habilitado (desktop com hover real).
  const ptr = { tx: 0, ty: 0, inside: false };
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ptr.tx = e.clientX - r.left;
    ptr.ty = e.clientY - r.top;
    ptr.inside = true;
  };
  const onLeave = () => {
    ptr.inside = false;
  };
  if (opts.pointer) {
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave, { passive: true });
  }

  const c1 = hex(opts.color1);
  const c2 = hex(opts.color2);
  const bg = hex(opts.background);
  const bgLum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];
  const speed = clampN(opts.speed, 0, 100) / 50;
  let size = clampN(opts.size, 50, 200) / 100;
  const angle = (clampN(opts.angle, -180, 180) * Math.PI) / 180;
  const hover = clampN(opts.hover, 0, 200) / 100;
  const reach = clampN(opts.reach, 10, 800);
  const frameInterval = 1000 / Math.max(1, opts.fps);
  let offset: [number, number] = [opts.offset[0], opts.offset[1]];

  let mx = 0;
  let my = 0;
  let vx = 0;
  let vy = 0;
  let on = 0;
  let raf = 0;
  let running = false;
  let last = -1;
  let clock = 0;
  let dead = false;

  const draw = (dt: number) => {
    if (sizeDirty && !applySize()) {
      fail();
      return;
    }
    const cw = cssW;
    const ch = cssH;
    clock = (clock + dt * speed) % 3600;

    const present = opts.pointer && ptr.inside ? 1 : 0;
    if (present && on < 0.02) {
      mx = ptr.tx;
      my = ptr.ty;
    }
    on += (present - on) * (1 - Math.exp(-dt * 5));
    const k = 1 - Math.exp(-dt * 16);
    const nx = mx + (ptr.tx - mx) * k;
    const ny = my + (ptr.ty - my) * k;
    if (dt > 0) {
      const kv = 1 - Math.exp(-dt * 8);
      vx += ((nx - mx) / dt - vx) * kv;
      vy += ((ny - my) / dt - vy) * kv;
    }
    mx = nx;
    my = ny;
    const vLen = Math.hypot(vx, vy) / ch;
    const vCap = vLen > 3 ? 3 / vLen : 1;

    g.bindFramebuffer(g.FRAMEBUFFER, fbo);
    g.viewport(0, 0, fw, fh);
    g.useProgram(field);
    g.uniform2f(uf.uRes, fw, fh);
    g.uniform1f(uf.uTime, clock);
    g.uniform3f(uf.uC1, c1[0], c1[1], c1[2]);
    g.uniform3f(uf.uC2, c2[0], c2[1], c2[2]);
    g.uniform1f(uf.uSize, size);
    g.uniform1f(uf.uAngle, angle);
    g.uniform2f(uf.uMouse, (mx - cw / 2) / ch, (ch / 2 - my) / ch);
    g.uniform1f(uf.uOn, on * hover);
    g.uniform1f(uf.uReach, reach / ch);
    g.uniform2f(uf.uVel, (vx / ch) * vCap, (-vy / ch) * vCap);
    g.uniform2f(uf.uOffset, offset[0], offset[1]);
    g.drawArrays(g.TRIANGLES, 0, 3);

    g.bindFramebuffer(g.FRAMEBUFFER, null);
    g.viewport(0, 0, canvas.width, canvas.height);
    g.useProgram(finish);
    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, tex);
    g.uniform1i(un.uField, 0);
    g.uniform2f(un.uRes, canvas.width, canvas.height);
    g.uniform1f(un.uTime, clock);
    g.uniform3f(un.uBg, bg[0], bg[1], bg[2]);
    g.uniform1f(un.uPaper, clampN((bgLum - 0.35) / 0.3, 0, 1));
    g.drawArrays(g.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (last >= 0 && now - last < frameInterval - 1) return; // limite de FPS
    const dt = last < 0 ? 0 : clampN((now - last) / 1000, 0, 0.1);
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
    running = true;
    last = -1; // retoma sem salto de tempo
    raf = requestAnimationFrame(frame);
  };

  const destroy = () => {
    if (dead) return;
    dead = true;
    stop();
    ro.disconnect();
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    canvas.removeEventListener('webglcontextlost', onLost);
    if (!g.isContextLost()) releaseGl();
  };

  function fail() {
    destroy();
    onFail();
  }

  const onLost = (e: Event) => {
    e.preventDefault();
    fail();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  const setPlacement = (o: [number, number], s: number) => {
    offset = [o[0], o[1]];
    size = clampN(s, 50, 200) / 100;
  };

  return { start, stop, destroy, setPlacement };
}
