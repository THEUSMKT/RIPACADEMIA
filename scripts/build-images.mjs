/**
 * Pipeline de imagens da RIP Academia.
 *
 * Lê as matrizes do pacote (RipAcademia-Base-ClaudeCode/), que NÃO são publicadas,
 * e gera somente as variantes do site em public/assets/ (AVIF + WebP em larguras
 * responsivas, logo recortada, favicon e imagem Open Graph). Também grava
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

/** Larguras-alvo; a largura natural (após recorte) é sempre incluída e nunca ampliada. */
const WIDTHS = [480, 720];

/**
 * Fotos publicadas. `crop` em pixels da matriz (recorte planejado: nas fotos verticais
 * o conteúdo relevante fica no alto e a metade inferior é piso). `blur` desfoca áreas
 * sensíveis nas variantes, mantendo a matriz intacta.
 */
const PHOTOS = [
  // Hero: corredor central; corta o piso inferior.
  { id: 'corredor-central', src: 'imagens-tratadas/ambiente/04-corredor-central.png', crop: { top: 0, height: 1260 } },
  // Estrutura
  { id: 'visao-geral-entrada', src: 'imagens-tratadas/ambiente/03-visao-geral-entrada.png', crop: { top: 0, height: 1400 } },
  { id: 'escada-e-aparelhos', src: 'imagens-tratadas/ambiente/05-escada-e-aparelhos.png', crop: { top: 0, height: 1844 } },
  // Modalidades
  { id: 'aluno-aparelho-vermelho', src: 'imagens-tratadas/treinos/09-aluno-no-aparelho-vermelho.png', crop: { top: 120, height: 1480 } },
  { id: 'exercicios-no-chao', src: 'imagens-tratadas/funcional/19-exercicios-no-chao.png', crop: { top: 260, height: 1420 } },
  // Free Pass, história e fechamento
  { id: 'aperto-de-maos', src: 'imagens-tratadas/conexao/22-aperto-de-maos.png', crop: { top: 160, height: 1400 } },
  { id: 'foto-de-grupo', src: 'imagens-tratadas/equipe/06-foto-de-grupo.png', crop: { top: 200, height: 1300 } },
  { id: 'acompanhamento-no-aparelho', src: 'imagens-tratadas/treinos/07-acompanhamento-no-aparelho.png', crop: { top: 0, height: 1500 } },
  // Localização: corta céu e a placa do carro (canto inferior esquerdo) e desfoca o reflexo da placa com preço à direita.
  {
    id: 'fachada-vista-da-rua',
    src: 'imagens-tratadas/fachada/01-fachada-vista-da-rua.png',
    crop: { top: 190, height: 1000 },
    blur: [{ left: 790, top: 570, width: 220, height: 230 }],
  },
  // Galeria
  { id: 'fachada-vista-aerea', src: 'imagens-tratadas/fachada/02-fachada-vista-aerea.png' },
  { id: 'colocacao-de-anilha', src: 'imagens-tratadas/treinos/12-colocacao-de-anilha.png' },
  { id: 'toque-de-punhos', src: 'imagens-tratadas/conexao/21-toque-de-punhos.png' },
  { id: 'aluno-na-esteira', src: 'imagens-tratadas/treinos/08-aluno-na-esteira.png' },
  { id: 'aparelho-inclinado-pegada', src: 'imagens-tratadas/treinos/11-aparelho-inclinado-pegada.png' },
  { id: 'treino-integrado', src: 'imagens-tratadas/funcional/17-treino-integrado.png' },
];

/** Logo: retângulo inteiramente dentro do círculo preto (fundo preto puro), sem a margem cinza. */
const LOGO = { src: 'marca/logo-rip-original.jpeg', crop: { left: 160, top: 400, width: 790, height: 360 } };
/** Favicon: só o símbolo, recortado do original e centralizado em quadrado preto. */
const SYMBOL = { left: 420, top: 415, width: 270, height: 160 };

async function photo(entry) {
  const file = path.join(pkg, entry.src);
  const meta = await sharp(file).metadata();
  let base = sharp(file);
  const crop = entry.crop
    ? { left: 0, top: entry.crop.top, width: meta.width, height: Math.min(entry.crop.height, meta.height - entry.crop.top) }
    : { left: 0, top: 0, width: meta.width, height: meta.height };

  // Desfoque localizado com borda suavizada (máscara elíptica desfocada), em coordenadas da matriz.
  if (entry.blur?.length) {
    const shapes = entry.blur
      .map((b) => `<ellipse cx="${b.left + b.width / 2}" cy="${b.top + b.height / 2}" rx="${b.width / 2}" ry="${b.height / 2}" fill="#fff"/>`)
      .join('');
    const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}"><defs><filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs><rect width="100%" height="100%" fill="#000"/><g filter="url(#f)">${shapes}</g></svg>`;
    const alpha = await sharp(Buffer.from(maskSvg)).resize(meta.width, meta.height).extractChannel(0).toBuffer();
    // Etapas separadas: o sharp não garante a ordem blur → joinChannel numa mesma pipeline.
    const blurredRgb = await sharp(file).removeAlpha().blur(26).png().toBuffer();
    const blurred = await sharp(blurredRgb).joinChannel(alpha).png().toBuffer();
    base = sharp(await sharp(file).composite([{ input: blurred }]).png().toBuffer());
  }
  const cropped = await base.extract(crop).png().toBuffer();
  const natural = crop.width;
  const widths = [...new Set([...WIDTHS.filter((w) => w < natural), natural])];
  const variants = { avif: [], webp: [] };
  for (const w of widths) {
    const h = Math.round((crop.height * w) / natural);
    const resized = sharp(cropped).resize(w, h);
    const avifName = `${entry.id}-${w}.avif`;
    const webpName = `${entry.id}-${w}.webp`;
    await resized.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(outImages, avifName));
    await resized.clone().webp({ quality: 74 }).toFile(path.join(outImages, webpName));
    variants.avif.push({ w, file: `assets/images/${avifName}` });
    variants.webp.push({ w, file: `assets/images/${webpName}` });
  }
  return { id: entry.id, source: entry.src, width: crop.width, height: crop.height, variants };
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
