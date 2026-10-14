/**
 * Controlador do Ribbon Glow para todas as seções com onda (hero e convite).
 *
 * Cada seção marcada com [data-wave-host] tem o próprio canvas e o próprio renderer, criado só na
 * primeira vez em que a seção fica visível. Um renderer desenha apenas enquanto:
 *   - a página terminou de carregar (load + ocioso), para não competir com o conteúdo e o CTA;
 *   - a seção está na área visível (IntersectionObserver) e a aba está ativa;
 *   - não há preferência por movimento reduzido e o visitante não pausou o movimento.
 * Fora disso, o loop é parado (stop) e o último quadro fica congelado; start() nunca cria um segundo
 * loop nem um segundo renderer. Sem WebGL2 ou com falha, a seção mantém o fundo estático em SVG.
 *
 * O controle "Pausar movimento" ([data-motion-toggle]) vale para todas as ondas da página e é
 * lembrado no navegador.
 */
import type { RibbonGlowController, RibbonGlowOptions } from './ribbon-glow';

type Placement = { offset: [number, number]; size: number };

interface Instance {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  wide: Placement;
  narrow: Placement;
  ctrl: RibbonGlowController | null;
  loading: Promise<void> | null;
  failed: boolean;
  visible: boolean;
}

const PAUSE_KEY = 'rip-motion-paused';

const parseOffset = (value: string | undefined, fallback: [number, number]): [number, number] => {
  const parts = (value ?? '').split(',').map(Number);
  return parts.length === 2 && parts.every(Number.isFinite) ? [parts[0], parts[1]] : fallback;
};

export function initWaves() {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>('[data-wave-host]'));
  if (!hosts.length) return;

  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqNarrow = window.matchMedia('(max-width: 1023px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]'));

  let ready = false;
  let userPaused = false;
  try {
    userPaused = localStorage.getItem(PAUSE_KEY) === '1';
  } catch {
    /* sem armazenamento: a pausa vale só nesta visita */
  }

  const instances: Instance[] = hosts.flatMap((host) => {
    const canvas = host.querySelector<HTMLCanvasElement>('[data-wave-canvas]');
    if (!canvas) return [];
    const wave = canvas.closest<HTMLElement>('[data-wave]');
    return [
      {
        host,
        canvas,
        wide: { offset: parseOffset(wave?.dataset.offsetWide, [0.1, -0.26]), size: Number(wave?.dataset.sizeWide) || 100 },
        narrow: { offset: parseOffset(wave?.dataset.offsetNarrow, [0, 0]), size: Number(wave?.dataset.sizeNarrow) || 100 },
        ctrl: null,
        loading: null,
        failed: false,
        visible: false,
      },
    ];
  });

  // Composição por largura: em telas estreitas a faixa é menor e posicionada no alto da seção.
  const placementFor = (inst: Instance) => (mqNarrow.matches ? inst.narrow : inst.wide);
  const eligible = (inst: Instance) => !mqReduce.matches && !inst.failed;
  const shouldRun = (inst: Instance) => ready && eligible(inst) && !userPaused && inst.visible && !document.hidden;

  // Orçamento por tela: DPR menor em telas estreitas (o campo já é calculado em meia resolução).
  const options = (inst: Instance): RibbonGlowOptions => ({
    background: '#09090B',
    color1: '#F20A16',
    color2: '#8F1018',
    speed: 25,
    size: placementFor(inst).size,
    angle: -180,
    hover: 15,
    reach: 180,
    offset: placementFor(inst).offset,
    maxDpr: mqNarrow.matches ? 1 : 1.25,
    fps: 30,
    layers: 84,
    pointer: finePointer,
  });

  const setMode = () => {
    for (const inst of instances) {
      // 'live' mostra o canvas; 'static' mantém o fundo SVG. Pausado, o último quadro fica congelado.
      inst.host.dataset.wave = inst.ctrl && eligible(inst) ? 'live' : 'static';
    }
    for (const button of toggles) {
      const inst = instances.find((i) => i.host.contains(button));
      button.hidden = !(ready && inst && inst.ctrl && eligible(inst));
      button.setAttribute('aria-pressed', String(userPaused));
      button.setAttribute('aria-label', userPaused ? 'Retomar movimento' : 'Pausar movimento');
    }
  };

  const ensure = (inst: Instance) => {
    if (inst.ctrl || inst.failed) return Promise.resolve();
    const fail = () => {
      inst.failed = true;
      inst.ctrl = null;
      setMode();
    };
    inst.loading ??= import('./ribbon-glow')
      .then(async ({ createRibbonGlow }) => {
        inst.ctrl = await createRibbonGlow(inst.canvas, inst.host, options(inst), fail);
        if (!inst.ctrl) fail();
      })
      .catch(fail);
    return inst.loading;
  };

  const update = async (inst: Instance) => {
    if (shouldRun(inst)) {
      await ensure(inst);
      if (shouldRun(inst)) inst.ctrl?.start();
      else inst.ctrl?.stop();
    } else {
      inst.ctrl?.stop();
    }
    setMode();
  };
  const updateAll = () => instances.forEach(update);

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const inst = instances.find((i) => i.host === entry.target);
      if (!inst) continue;
      inst.visible = entry.isIntersecting;
      update(inst);
    }
  });
  instances.forEach((inst) => io.observe(inst.host));

  document.addEventListener('visibilitychange', updateAll);
  mqReduce.addEventListener('change', updateAll);
  mqNarrow.addEventListener('change', () => {
    for (const inst of instances) {
      const p = placementFor(inst);
      inst.ctrl?.setPlacement(p.offset, p.size);
    }
    updateAll();
  });

  for (const button of toggles) {
    button.addEventListener('click', () => {
      userPaused = !userPaused;
      try {
        localStorage.setItem(PAUSE_KEY, userPaused ? '1' : '0');
      } catch {
        /* ignora */
      }
      updateAll();
    });
  }

  // Inicializa depois do conteúdo, do CTA e da foto principal: evento load + ocioso.
  const boot = () => {
    ready = true;
    updateAll();
  };
  const idle = () =>
    typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(boot, { timeout: 2000 }) : setTimeout(boot, 600);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });

  setMode();
}
