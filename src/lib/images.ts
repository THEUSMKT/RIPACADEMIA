import manifest from '../data/images.json';
import type { PhotoId } from '../data/photos';

type Size = { width: number; height: number };

/** Dimensões da imagem publicada (as variantes nunca são recortadas). */
export const photoSize = (id: PhotoId): Size => {
  const p = (manifest.photos as Record<string, Size>)[id];
  if (!p) throw new Error(`Foto não encontrada no manifesto: ${id}. Rode "npm run images".`);
  return { width: p.width, height: p.height };
};

/** Variável CSS --ratio (largura ÷ altura), usada por .frame--fit para limitar a altura sem recortar. */
export const ratioVar = (id: PhotoId) => {
  const { width, height } = photoSize(id);
  return `--ratio: ${(width / height).toFixed(4)}`;
};
