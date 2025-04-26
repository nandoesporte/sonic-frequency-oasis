
import type { FrequencyData } from "./audio-context";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Heart, Coffee, Zap, MoonStar, Music, Sparkles, Focus, Shield, Flower, AlertCircle, Pill, Stethoscope } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
}

// Re-export as a type to fix the TS1205 error
export type { FrequencyData };

export const categories: Category[] = [
  {
    id: "pain_relief",
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

// Define valid database categories based on the error message
type ValidDatabaseCategory = "healing" | "emotional" | "sleep" | "meditation" | 
  "pain_relief" | "cognitive" | "solfeggio" | "spiritual" | "physical";

// Map our UI categories to database categories
const categoryMapping: Record<string, ValidDatabaseCategory> = {
  "pain_relief": "pain_relief",
  "healing": "healing",
  "relaxation": "meditation", // Map to closest equivalent
  "emotional": "emotional",
  "immune": "physical", // Map to closest equivalent
  "detox": "physical", // Map to closest equivalent
  "wellness": "physical", // Map to closest equivalent
  "research": "cognitive" // Map to closest equivalent
};

export async function getFrequenciesByCategory(categoryId: string): Promise<FrequencyData[]> {
  // Map UI category to database category
  const dbCategory = categoryMapping[categoryId];
  
  if (!dbCategory) {
    console.error(`Invalid category: ${categoryId}`);
    return [];
  }
  
  const { data, error } = await supabase
    .from('frequencies')
    .select('*')
    .eq('category', dbCategory)
    .order('hz');

  if (error) {
    console.error('Error fetching frequencies:', error);
    return [];
  }

  return data.map(freq => ({
    id: freq.id,
    name: freq.name,
    hz: freq.hz,
    purpose: freq.purpose,
    description: freq.description,
    category: freq.category as string,
    premium: freq.is_premium
  }));
}

export async function getTrendingFrequencies(): Promise<FrequencyData[]> {
  const { data, error } = await supabase
    .from('frequencies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    console.error('Error fetching trending frequencies:', error);
    return [];
  }

  return data.map(freq => ({
    id: freq.id,
    name: freq.name,
    hz: freq.hz,
    purpose: freq.purpose,
    description: freq.description,
    category: freq.category,
    premium: freq.is_premium,
    trending: true
  }));
}

export async function getFrequencyById(id: string): Promise<FrequencyData | null> {
  const { data, error } = await supabase
    .from('frequencies')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching frequency:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    hz: data.hz,
    purpose: data.purpose,
    description: data.description,
    category: data.category,
    premium: data.is_premium
  };
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryCount(categoryId: string): number {
  // We can't count from a non-existent array, so return a placeholder value
  // This should be replaced with a proper count from the database in a future update
  return 0;
}
