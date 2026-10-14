import type { PhotoId } from './photos';

/** Galeria: fotos complementares, agrupadas por tema. Não repete hero, estrutura nem fechamento. */
export const galleryGroups: { title: string; items: PhotoId[] }[] = [
  { title: 'Treinos', items: ['aparelho-inclinado-pegada', 'aluno-na-esteira', 'treino-integrado'] },
  { title: 'Equipamentos e acolhimento', items: ['colocacao-de-anilha', 'toque-de-punhos'] },
  { title: 'Fachada', items: ['fachada-vista-aerea'] },
];
