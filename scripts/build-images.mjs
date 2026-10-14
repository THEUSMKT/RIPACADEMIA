/**
 * Pipeline de imagens da RIP Academia.
 *
 * Lê as matrizes dos pacotes (RipAcademia-Base-ClaudeCode/ e RipAcademia-Edicoes-ClaudeCode/),
 * que NÃO são publicadas, e gera somente as variantes do site em public/assets/ (AVIF + WebP em
 * larguras responsivas, sem recorte; logo, favicon e imagem Open Graph). Também grava
 * src/data/images.json com dimensões e caminhos para srcset.
 *
 * Uso: npm run images   (gera de novo tudo; as matrizes ficam intactas)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = path.join(root, 'RipAcademia-Base-ClaudeCode');
const outImages = path.join(root, 'public', 'assets', 'images');
const outBrand = path.join(root, 'public', 'assets', 'brand');
const manifestPath = path.join(root, 'src', 'data', 'images.json');

/** Larguras-alvo; a largura natural é sempre incluída e nunca ampliada. */
const WIDTHS = [480, 720];

/**
 * Fotos e artes publicadas. Regra do site: nenhuma imagem é recortada. As variantes mudam só
 * formato, compressão e largura (proporcional), sempre com a composição inteira do arquivo-fonte.
 * `src` é relativo à raiz do repositório.
 */
const BASE = 'RipAcademia-Base-ClaudeCode/imagens-tratadas';
const EDIT = 'RipAcademia-Edicoes-ClaudeCode';
const PHOTOS = [
  // Hero: fachada (ajuste 2)
  { id: 'fachada-rip', src: `${EDIT}/imagens/01-fachada-rip.jpg` },
  // Estrutura: par de fotos (ajuste 3)
  { id: 'estrutura-vista-geral', src: `${EDIT}/imagens/02-estrutura-vista-geral.jpg` },
  { id: 'estrutura-escada', src: `${EDIT}/imagens/03-estrutura-escada.jpg` },
  // Modalidades (CrossTraining: ajuste 4)
  { id: 'aluno-aparelho-vermelho', src: `${BASE}/treinos/09-aluno-no-aparelho-vermelho.png` },
  { id: 'crosstraining', src: `${EDIT}/imagens/04-crosstraining.jpg` },
  // Free Pass e história
  { id: 'aperto-de-maos', src: `${BASE}/conexao/22-aperto-de-maos.png` },
  { id: 'foto-de-grupo', src: `${BASE}/equipe/06-foto-de-grupo.png` },
  // Benefícios: artes com o endereço corrigido por scripts/corrigir-endereco-artes.py (ajuste 5)
  { id: 'arte-wellhub', src: `${EDIT}/imagens-corrigidas/05-wellhub-endereco-av-feitoria.png` },
  { id: 'arte-totalpass', src: `${EDIT}/imagens-corrigidas/06-totalpass-endereco-av-feitoria.png` },
  // Convite (ajuste 6) e encerramento (ajuste 7)
  { id: 'convite-time', src: `${EDIT}/imagens/07-convite-time.jpg` },
  { id: 'encerramento-primeiro-passo', src: `${EDIT}/imagens/08-encerramento-primeiro-passo.jpg` },
];

/** Logo: retângulo inteiramente dentro do círculo preto (fundo preto puro), sem a margem cinza. */
const LOGO = { src: 'marca/logo-rip-original.jpeg', crop: { left: 160, top: 400, width: 790, height: 360 } };
/** Favicon: só o símbolo, recortado do original e centralizado em quadrado preto. */
const SYMBOL = { left: 420, top: 415, width: 270, height: 160 };

async function photo(entry) {
  const file = path.join(root, entry.src);
  const { width, height } = await sharp(file).metadata(); // arquivos sem rotação EXIF (orientação 1)
  const widths = [...new Set([...WIDTHS.filter((w) => w < width), width])];
  const variants = { avif: [], webp: [] };
  for (const w of widths) {
    const resized = sharp(file).resize(w, Math.round((height * w) / width));
    const avifName = `${entry.id}-${w}.avif`;
    const webpName = `${entry.id}-${w}.webp`;
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(outImages, avifName));
    await resized.clone().webp({ quality: 74 }).toFile(path.join(outImages, webpName));
    variants.avif.push({ w, file: `assets/images/${avifName}` });
    variants.webp.push({ w, file: `assets/images/${webpName}` });
  }
  return { id: entry.id, source: entry.src, width, height, variants };
}

async function brand() {
  const file = path.join(pkg, LOGO.src);
  const logo = sharp(file).extract(LOGO.crop);
  // Header: ~2x da exibição (≈180 px de largura). PNG preserva as cores sem artefatos no lettering.
  await logo.clone().resize(400).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(outBrand, 'logo-rip-400.png'));
  await logo.clone().resize(400).webp({ quality: 90 }).toFile(path.join(outBrand, 'logo-rip-400.webp'));
  await logo.clone().resize(790).webp({ quality: 90 }).toFile(path.join(outBrand, 'logo-rip-790.webp'));

  // Favicon a partir do símbolo original.
  const symbol = await sharp(file).extract(SYMBOL).toBuffer();
  const side = 300;
  const fav = sharp({ create: { width: side, height: side, channels: 3, background: '#000000' } })
    .composite([{ input: await sharp(symbol).resize(250).toBuffer(), gravity: 'center' }])
    .png();
  const favBuf = await fav.toBuffer();
  await sharp(favBuf).resize(32).png().toFile(path.join(outBrand, 'favicon-32.png'));
  await sharp(favBuf).resize(180).png().toFile(path.join(outBrand, 'apple-touch-icon.png'));
  await sharp(favBuf).resize(192).png().toFile(path.join(outBrand, 'icon-192.png'));

  // Open Graph 1200×630: fotografia real à direita, logo original à esquerda, sem ofertas.
  const ogPhoto = await sharp(path.join(pkg, 'imagens-tratadas/ambiente/04-corredor-central.png'))
    .extract({ left: 0, top: 0, width: 853, height: 1100 })
    .resize(600, 630, { fit: 'cover', position: 'top' })
    .toBuffer();
  const ogLogo = await sharp(file).extract(LOGO.crop).resize(520).toBuffer();
  const stripe = Buffer.from(
    '<svg width="1200" height="630"><path d="M600 0 L640 0 L600 630 L560 630 Z" fill="#000000"/><rect x="0" y="618" width="600" height="12" fill="#D90D18"/></svg>',
  );
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000000' } })
    .composite([
      { input: ogPhoto, left: 600, top: 0 },
      { input: ogLogo, left: 40, top: Math.round((630 - (520 * LOGO.crop.height) / LOGO.crop.width) / 2) },
      { input: stripe, left: 0, top: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outBrand, 'og-rip-academia.jpg'));

  return {
    logo: { width: LOGO.crop.width, height: LOGO.crop.height },
  };
}

// --only=id1,id2 (ou --only=brand) regenera só esses itens e preserva o restante do manifesto.
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? new Set(onlyArg.slice(7).split(',')) : null;
const previous = only && (await fs.readFile(manifestPath, 'utf8').then(JSON.parse).catch(() => null));

if (!only) await fs.rm(outImages, { recursive: true, force: true });
await fs.mkdir(outImages, { recursive: true });
await fs.mkdir(outBrand, { recursive: true });

const photos = {};
for (const entry of PHOTOS) {
  if (only && !only.has(entry.id) && previous?.photos?.[entry.id]) {
    photos[entry.id] = previous.photos[entry.id];
    continue;
  }
  photos[entry.id] = await photo(entry);
  process.stdout.write(`✓ ${entry.id}\n`);
}
const brandInfo = !only || only.has('brand') || !previous ? await brand() : previous.brand;
await fs.writeFile(manifestPath, JSON.stringify({ photos, brand: brandInfo }, null, 2) + '\n');
console.log(`Manifesto: ${path.relative(root, manifestPath)}`);
