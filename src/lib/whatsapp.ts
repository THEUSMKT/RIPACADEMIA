import { business } from '../data/business';

/**
 * Intenções de contato. O código técnico (`intent`) vai para o analytics;
 * só a mensagem em português vai para a conversa.
 */
export type Intent =
  | 'free_pass'
  | 'plans'
  | 'musculacao'
  | 'cross_training'
  | 'wellhub'
  | 'totalpass'
  | 'comecar'
  | 'voltar'
  | 'evoluir';

const PREFIX = 'Olá! Vi o site da RIP Academia e';

export const messages: Record<Intent, string> = {
  free_pass: `${PREFIX} gostaria de agendar meu Free Pass. Como funciona?`,
  plans: `${PREFIX} gostaria de conhecer os planos e as opções de treino.`,
  musculacao: `${PREFIX} gostaria de saber mais sobre a musculação e os planos.`,
  cross_training: `${PREFIX} gostaria de saber sobre as turmas, os horários e as condições do CrossTraining.`,
  wellhub: 'Olá! Vi no site que a RIP Academia aceita Wellhub. Gostaria de consultar as condições de acesso com o meu benefício.',
  totalpass: 'Olá! Vi no site que a RIP Academia aceita TotalPass. Gostaria de consultar as condições de acesso com o meu benefício.',
  comecar: `${PREFIX} quero começar a treinar. Gostaria de agendar meu Free Pass e entender como funciona.`,
  voltar: `${PREFIX} quero voltar à rotina de treinos. Gostaria de agendar meu Free Pass e entender como funciona.`,
  evoluir: `${PREFIX} quero evoluir no meu treino. Gostaria de conhecer os planos e as opções de treino.`,
};

/** Monta https://wa.me/<número>?text=<mensagem codificada>. */
export function whatsappUrl(intent: Intent): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(messages[intent])}`;
}

/** Categoria analítica: qual evento além de `whatsapp_click` o clique representa. */
export function intentKind(intent: Intent): 'free_pass' | 'benefit' | 'other' {
  if (intent === 'free_pass' || intent === 'comecar' || intent === 'voltar') return 'free_pass';
  if (intent === 'wellhub' || intent === 'totalpass') return 'benefit';
  return 'other';
}
