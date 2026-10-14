/**
 * Verificações automáticas da pasta publicada (dist/), executadas no fim de `npm run build`.
 *  - nenhum arquivo de origem publicado (originais, PNG matrizes, IMG_*.jpeg, .tsx de referência, arte antiga);
 *  - nenhum dado antigo (Rua Otto Daudt, abertura às 6h, sábado até 15h) no HTML/JS publicado;
 *  - links de WhatsApp apontando para o número correto, com mensagem codificada;
 *  - nenhum href="#" usado como ação falsa;
 *  - todo recurso local referenciado no HTML existe (respeitando o base);
 *  - a animação antiga (Ribbon Glow) não volta ao bundle: o único efeito é o Predictive Arc 2 do hero.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const base = (process.env.BASE_PATH || '/RIPACADEMIA').replace(/\/$/, '');
const WA = '5551999850575';
const errors = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

if (!fs.existsSync(dist)) {
  console.error('dist/ não existe. Rode o build primeiro.');
  process.exit(1);
}
const files = walk(dist);
const rel = (f) => path.relative(dist, f).replace(/\\/g, '/');

// 1. Arquivos de origem
for (const f of files) {
  const r = rel(f);
  if (/\.(png|jpe?g)$/i.test(r) && !r.startsWith('assets/brand/')) errors.push(`Imagem de origem publicada: ${r}`);
  if (/IMG_\d+/i.test(r)) errors.push(`Referência IMG_* publicada: ${r}`);
  if (/\.tsx$/i.test(r)) errors.push(`TSX de referência publicado: ${r}`);
  if (/ribbon|wave-controller|WaveBackground|MotionToggle/i.test(r)) errors.push(`Resto da Ribbon Glow publicado: ${r}`);
  if (/arte-horarios|originais-referencia|referencias-atualizadas|imagens-tratadas|imagens-corrigidas|-fonte\.|RipAcademia-(Base|Edicoes|Ajustes)/i.test(r)) errors.push(`Material do pacote publicado: ${r}`);
}

// 2. Dados antigos e 3. links
const textFiles = files.filter((f) => /\.(html|js|css|xml|txt|json)$/i.test(f));
const oldData = [/Otto\s*Daudt/i, /\b6h\s*(às|as|-)\s*22h/i, /\b9h\s*(às|as|-)\s*15h/i, /\b06:00\b/, /\b15:00\b/];
let waLinks = 0;
for (const f of textFiles) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const re of oldData) if (re.test(txt)) errors.push(`Dado antigo (${re}) em ${rel(f)}`);
  if (/data-motion-toggle|data-wave-host|uOffset/.test(txt)) errors.push(`Resto da Ribbon Glow ou do botão de pausa em ${rel(f)}`);
  if (!f.endsWith('.html')) continue;

  for (const m of txt.matchAll(/href="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href === '#' || href.startsWith('javascript:')) errors.push(`href falso "${href}" em ${rel(f)}`);
    if (href.includes('wa.me') || href.includes('whatsapp')) {
      waLinks++;
      const u = new URL(href);
      if (u.hostname !== 'wa.me' || u.pathname !== `/${WA}`) errors.push(`WhatsApp com destino incorreto: ${href}`);
      const text = u.searchParams.get('text');
      if (!text || !text.startsWith('Olá!')) errors.push(`WhatsApp sem mensagem válida: ${href}`);
      if (/[ ()+]/.test(href.split('?')[0])) errors.push(`Número com caracteres inválidos: ${href}`);
      if (/free_pass|cross_training|cta_id|placement/.test(text ?? '')) errors.push(`Código técnico na mensagem: ${href}`);
    }
  }
  // 4. Recursos locais referenciados (src, href, srcset)
  const refs = [
    ...[...txt.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]),
    ...[...txt.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
  ];
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    if (!ref.startsWith(`${base}/`) && ref !== base && ref !== `${base}/`) {
      errors.push(`Caminho sem o base ${base}: ${ref} em ${rel(f)}`);
      continue;
    }
    const local = ref.slice(base.length).split('#')[0].split('?')[0];
    const target = path.join(dist, local);
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
    if (!ok) errors.push(`Recurso inexistente: ${ref} em ${rel(f)}`);
  }
}
if (waLinks === 0) errors.push('Nenhum link de WhatsApp encontrado.');

const unique = [...new Set(errors)];
if (unique.length) {
  console.error(`\n✗ verify-dist: ${unique.length} problema(s)\n` + unique.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
const size = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`✓ verify-dist: ${files.length} arquivos (${(size / 1024 / 1024).toFixed(2)} MB), ${waLinks} links de WhatsApp verificados, sem dados antigos nem arquivos de origem.`);
