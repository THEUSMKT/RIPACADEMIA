/**
 * Fotografias e artes publicadas: texto alternativo de cada uma.
 * Os arquivos são gerados por scripts/build-images.mjs, sempre com a composição inteira (sem recorte).
 * Os textos descrevem o que aparece, sem atribuir identidade, função ou qualificação às pessoas.
 */
export type PhotoId =
  | 'fachada-rip'
  | 'estrutura-vista-geral'
  | 'estrutura-escada'
  | 'aluno-aparelho-vermelho'
  | 'crosstraining'
  | 'aperto-de-maos'
  | 'foto-de-grupo'
  | 'arte-wellhub'
  | 'arte-totalpass'
  | 'convite-time'
  | 'encerramento-primeiro-passo';

export const photoMeta: Record<PhotoId, { alt: string }> = {
  'fachada-rip': {
    alt: 'Fachada da RIP Academia vista da calçada, com a placa RIP ACADEMIA no alto, paredes de vidro e a porta de entrada de vidro.',
  },
  'estrutura-vista-geral': {
    alt: 'Salão de musculação visto em direção à entrada, com aparelhos vermelhos e pretos e luzes vermelhas em forma de V no teto.',
  },
  'estrutura-escada': {
    alt: 'Escada metálica com contorno de luz vermelha subindo ao mezanino, com aparelhos, anilhas e halteres no salão.',
  },
  'aluno-aparelho-vermelho': {
    alt: 'Aluno de moletom e boné pretos treinando em um aparelho vermelho com anilhas.',
  },
  crosstraining: {
    alt: 'Dois alunos fazendo exercícios no chão da área de treino, um com bola medicinal e outro com peso.',
  },
  'aperto-de-maos': {
    alt: 'Aperto de mãos entre duas pessoas, com suportes de halteres e aparelhos ao fundo.',
  },
  'foto-de-grupo': {
    alt: 'Foto de grupo de pessoas reunidas dentro da RIP Academia.',
  },
  // As artes recebem o texto completo (com os dados da configuração central) no componente de benefícios.
  'arte-wellhub': {
    alt: 'Arte da RIP Academia: Aceitamos Wellhub.',
  },
  'arte-totalpass': {
    alt: 'Arte da RIP Academia: Aceitamos TotalPass.',
  },
  'convite-time': {
    alt: 'Dois punhos se cumprimentando, um com manga vermelha e outro com manga preta, com aparelhos e halteres ao fundo.',
  },
  'encerramento-primeiro-passo': {
    alt: 'Aluno de boné vermelho e camiseta branca treinando na esteira, com a escada iluminada em vermelho ao fundo.',
  },
};
