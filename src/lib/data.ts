import { FrequencyData } from "./audio-context";
import { Brain, Heart, Coffee, Zap, MoonStar, Music, Sparkles, Focus, Shield, Flower, AlertCircle, Pill, Stethoscope } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export const categories: Category[] = [
  {
    id: "pain-relief",
    name: "Alívio da Dor",
    description: "Frequências para diversos tipos de controle da dor",
    icon: Pill
  },
  {
    id: "healing",
    name: "Cura",
    description: "Frequências para cura e regeneração geral",
    icon: Heart
  },
  {
    id: "relaxation",
    name: "Relaxamento",
    description: "Frequências para alívio do estresse e relaxamento",
    icon: MoonStar
  },
  {
    id: "emotional",
    name: "Emocional",
    description: "Equilibre estados emocionais e humor",
    icon: Brain
  },
  {
    id: "immune",
    name: "Sistema Imunológico",
    description: "Suporte para função do sistema imunológico",
    icon: Shield
  },
  {
    id: "detox",
    name: "Desintoxicação",
    description: "Apoio aos processos naturais de desintoxicação",
    icon: Zap
  },
  {
    id: "wellness",
    name: "Bem-Estar Geral",
    description: "Frequências para saúde e bem-estar geral",
    icon: Stethoscope
  },
  {
    id: "research",
    name: "Pesquisa",
    description: "Frequências experimentais e de pesquisa",
    icon: Focus
  }
];

export const frequencies: FrequencyData[] = [
  {
    id: "1",
    name: "Cura Geral",
    hz: 7.83,
    purpose: "Ressonância Schumann",
    category: "healing",
    description: "Frequência natural da Terra para cura e bem-estar geral",
    trending: true
  },
  {
    id: "2",
    name: "Alívio da Dor",
    hz: 3.0,
    purpose: "Controle Geral da Dor",
    category: "pain-relief",
    description: "Frequência para alívio geral da dor",
  },
  {
    id: "3",
    name: "Relaxamento Profundo",
    hz: 396,
    purpose: "Liberação de Culpa e Medo",
    category: "relaxation",
    description: "Frequência Solfeggio antiga para relaxamento profundo",
    trending: true
  },
  {
    id: "4",
    name: "Equilíbrio Emocional",
    hz: 528,
    purpose: "Reparo do DNA",
    category: "emotional",
    description: "Conhecida como frequência 'Milagre' para cura emocional",
    premium: true
  },
  {
    id: "5",
    name: "Impulso Imunológico",
    hz: 5000,
    purpose: "Suporte Imunológico",
    category: "immune",
    description: "Estimula a função do sistema imunológico",
    premium: true
  },
  {
    id: "6",
    name: "Desintoxicação",
    hz: 10000,
    purpose: "Desintoxicação do Corpo",
    category: "detox",
    description: "Apoia os processos naturais de desintoxicação"
  },
  {
    id: "7",
    name: "Inflamação",
    hz: 3.6,
    purpose: "Reduzir Inflamação",
    category: "healing",
    description: "Frequência anti-inflamatória",
    trending: true
  },
  {
    id: "8",
    name: "Sono Delta",
    hz: 2.5,
    purpose: "Sono Profundo",
    category: "relaxation",
    description: "Promove sono profundo e restaurador"
  },
  {
    id: "9",
    name: "Alívio da Ansiedade",
    hz: 6.3,
    purpose: "Reduzir Ansiedade",
    category: "emotional",
    description: "Frequência calmante para alívio da ansiedade"
  },
  {
    id: "10",
    name: "Impulso de Energia",
    hz: 20,
    purpose: "Vitalidade",
    category: "wellness",
    description: "Aumenta a energia e a vitalidade",
    trending: true
  },
  {
    id: "11",
    name: "Clareza Mental",
    hz: 10.5,
    purpose: "Melhora do Foco",
    category: "wellness",
    description: "Melhora a clareza mental e o foco"
  },
  {
    id: "12",
    name: "Espiritual",
    hz: 963,
    purpose: "Conexão Espiritual",
    category: "research",
    description: "Frequência de consciência superior",
    premium: true
  },
  {
    id: "13",
    name: "Regeneração Celular",
    hz: 432,
    purpose: "Saúde Celular",
    category: "healing",
    description: "Apoia o reparo e a regeneração celular"
  },
  {
    id: "14",
    name: "Circulação",
    hz: 45,
    purpose: "Fluxo Sanguíneo",
    category: "wellness",
    description: "Melhora a circulação sanguínea"
  },
  {
    id: "15",
    name: "Alívio Articular",
    hz: 147.0,
    purpose: "Dor Articular",
    category: "pain-relief",
    description: "Frequência específica para alívio da dor articular",
    premium: true
  }
];

export function getFrequenciesByCategory(categoryId: string): FrequencyData[] {
  return frequencies.filter(freq => freq.category === categoryId);
}

export function getTrendingFrequencies(): FrequencyData[] {
  return frequencies.filter(freq => freq.trending);
}

export function getPremiumFrequencies(): FrequencyData[] {
  return frequencies.filter(freq => freq.premium);
}

export function getFrequencyById(id: string): FrequencyData | undefined {
  return frequencies.find(freq => freq.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryCount(categoryId: string): number {
  return frequencies.filter(freq => freq.category === categoryId).length;
}
