/**
 * Fotografias publicadas: texto alternativo e enquadramento (object-position) de cada uma.
 * Os arquivos são gerados por scripts/build-images.mjs a partir de imagens-tratadas/.
 * Os textos descrevem o que aparece, sem atribuir identidade, função ou qualificação às pessoas.
 */
export type PhotoId =
  | 'corredor-central'
  | 'visao-geral-entrada'
  | 'escada-e-aparelhos'
  | 'aluno-aparelho-vermelho'
  | 'exercicios-no-chao'
  | 'aperto-de-maos'
  | 'foto-de-grupo'
  | 'acompanhamento-no-aparelho'
  | 'fachada-vista-da-rua'
  | 'fachada-vista-aerea'
  | 'colocacao-de-anilha'
  | 'toque-de-punhos'
  | 'aluno-na-esteira'
  | 'aparelho-inclinado-pegada'
  | 'treino-integrado';

export const photoMeta: Record<PhotoId, { alt: string; position: string }> = {
  'corredor-central': {
    alt: 'Corredor central do salão da RIP Academia, com aparelhos vermelhos e pretos dos dois lados, mezanino e escada ao fundo e luzes vermelhas no teto.',
    position: '50% 30%',
  },
  'visao-geral-entrada': {
    alt: 'Vista do alto do salão de musculação em direção à entrada, com fileiras de aparelhos vermelhos.',
    position: '50% 35%',
  },
  'escada-e-aparelhos': {
    alt: 'Salão com escada metálica, aparelhos e alunos treinando.',
    position: '50% 55%',
  },
  'aluno-aparelho-vermelho': {
    alt: 'Aluno de moletom e boné pretos treinando em um aparelho vermelho com anilhas.',
    position: '50% 30%',
  },
  'exercicios-no-chao': {
    alt: 'Dois alunos fazendo exercícios no chão, um com bola medicinal e outro com peso.',
    position: '45% 55%',
  },
  'aperto-de-maos': {
    alt: 'Aperto de mãos entre duas pessoas, com suportes de halteres e aparelhos ao fundo.',
    position: '50% 40%',
  },
  'foto-de-grupo': {
    alt: 'Foto de grupo de pessoas reunidas dentro da RIP Academia.',
    position: '50% 45%',
  },
  'acompanhamento-no-aparelho': {
    alt: 'Pessoa com camiseta da RIP Academia acompanhando um aluno em um aparelho inclinado.',
    position: '50% 35%',
  },
  'fachada-vista-da-rua': {
    alt: 'Fachada da RIP Academia vista da rua, com letreiro, vidros espelhados e a porta de entrada.',
    position: '50% 40%',
  },
  'fachada-vista-aerea': {
    alt: 'Vista aérea do prédio da RIP Academia e da rua em frente, com carros estacionados.',
    position: '50% 50%',
  },
  'colocacao-de-anilha': {
    alt: 'Detalhe de uma mão colocando uma anilha em um aparelho vermelho.',
    position: '50% 55%',
  },
  'toque-de-punhos': {
    alt: 'Toque de punhos entre duas pessoas, com suportes de halteres ao fundo.',
    position: '50% 45%',
  },
  'aluno-na-esteira': {
    alt: 'Aluno caminhando na esteira, com a escada ao fundo.',
    position: '50% 30%',
  },
  'aparelho-inclinado-pegada': {
    alt: 'Aluno de camiseta amarela segurando as alças de um aparelho inclinado.',
    position: '50% 45%',
  },
  'treino-integrado': {
    alt: 'Alunos em um treino com bola e cones na área de treino funcional.',
    position: '50% 50%',
  },
};
