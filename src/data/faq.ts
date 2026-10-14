import { business, formatRange, fullAddress } from './business';

const hoursText = [
  ...business.hours.map((h) => `${h.label}: ${formatRange(h.opens, h.closes)}`),
  `${business.unspecifiedHours.label}: ${business.unspecifiedHours.value.toLowerCase()}`,
].join('; ');

/** Perguntas frequentes. Horários e endereço vêm da configuração central. */
export const faq: { id: string; question: string; answer: string }[] = [
  {
    id: 'free_pass',
    question: 'Como agendo meu Free Pass?',
    answer:
      'Clique no botão e converse com a equipe pelo WhatsApp para consultar condições e combinar um horário.',
  },
  {
    id: 'experiencia',
    question: 'Preciso ter experiência para conhecer a academia?',
    answer:
      'Você pode entrar em contato mesmo se estiver começando. A equipe explica as opções para o seu primeiro contato com a RIP.',
  },
  {
    id: 'beneficios',
    question: 'A RIP aceita Wellhub e TotalPass?',
    answer: 'A RIP aceita Wellhub e TotalPass. Consulte com a equipe os planos e as condições de acesso.',
  },
  {
    id: 'horarios',
    question: 'Quais são os horários?',
    answer: `${hoursText}.`,
  },
  {
    id: 'endereco',
    question: 'Onde fica?',
    answer: `${fullAddress}.`,
  },
  {
    id: 'valores',
    question: 'Quais são os valores dos planos?',
    answer: 'Converse com a equipe para conhecer os planos disponíveis e suas condições.',
  },
  {
    id: 'crosstraining',
    question: 'Como conheço as turmas de CrossTraining?',
    answer: 'Peça pelo WhatsApp as informações sobre turmas, horários e condições.',
  },
];
