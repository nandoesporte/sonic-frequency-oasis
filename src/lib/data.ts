
import { Brain, Heart, Coffee, Zap, MoonStar, Music, Focus, Shield, Bell, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
}

// Define the type based on the Supabase database enum
export type ValidDatabaseCategory = Database["public"]["Enums"]["frequency_category"];

// Define the FrequencyData type
export type FrequencyData = {
  id: string;
  name: string;
  hz: number;
  purpose: string;
  description?: string;
  category: string;
  premium: boolean;
  trending?: boolean;
};

export const categories: Category[] = [
  {
    id: "sleep_meditation",
    name: "Sono e Meditação",
    description: "Frequências para sono profundo e práticas meditativas",
    icon: MoonStar
  },
  {
    id: "healing",
    name: "Cura e Regeneração",
    description: "Frequências para regeneração celular e cura física",
    icon: Heart
  },
  {
    id: "emotional",
    name: "Equilíbrio Emocional",
    description: "Harmonização de estados emocionais e traumas",
    icon: Brain
  },
  {
    id: "pain_relief",
    name: "Alívio da Dor",
    description: "Frequências específicas para diferentes tipos de dor",
    icon: Zap
  },
  {
    id: "cognitive",
    name: "Função Cognitiva",
    description: "Melhoria do foco, memória e aprendizado",
    icon: Focus
  },
  {
    id: "solfeggio",
    name: "Solfeggio",
    description: "Frequências sagradas para harmonização integral",
    icon: Music
  },
  {
    id: "spiritual",
    name: "Espiritual",
    description: "Despertar espiritual e expansão da consciência",
    icon: Bell
  },
  {
    id: "physical",
    name: "Saúde Física",
    description: "Suporte para funções corporais e imunidade",
    icon: Shield
  }
];

// Map our UI categories to database categories
const categoryMapping: Record<string, ValidDatabaseCategory> = {
  "sleep_meditation": "sleep",
  "healing": "healing",
  "emotional": "emotional",
  "pain_relief": "pain_relief",
  "cognitive": "cognitive",
  "solfeggio": "solfeggio",
  "spiritual": "spiritual",
  "physical": "physical"
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

export async function seedInitialFrequencies() {
  const frequencies = [
    {
      hz: 1.5,
      name: "Delta Profundo",
      purpose: "Sono profundo e regeneração celular",
      description: "Estímulo de ondas delta para sono profundo e regeneração celular",
      category: "sleep" as ValidDatabaseCategory
    },
    {
      hz: 3.5,
      name: "Alívio da Dor Crônica",
      purpose: "Redução da dor e alteração da consciência",
      description: "Alívio de dor crônica e estados de consciência alterada",
      category: "pain_relief" as ValidDatabaseCategory
    },
    {
      hz: 7.83,
      name: "Ressonância Schumann",
      purpose: "Equilíbrio mental e redução da ansiedade",
      description: "Frequência natural da Terra para equilíbrio e harmonia",
      category: "meditation" as ValidDatabaseCategory
    },
    {
      hz: 40,
      name: "Integração Gamma",
      purpose: "Melhoria cognitiva e consciência",
      description: "Integração sensorial e estímulo da consciência",
      category: "cognitive" as ValidDatabaseCategory
    },
    {
      hz: 174,
      name: "Solfeggio Fundamental",
      purpose: "Alívio da dor e relaxamento",
      description: "Primeira frequência Solfeggio para cura física",
      category: "solfeggio" as ValidDatabaseCategory
    },
    {
      hz: 432,
      name: "Frequência Natural",
      purpose: "Harmonização musical e emocional",
      description: "Frequência harmônica natural para equilíbrio",
      category: "spiritual" as ValidDatabaseCategory
    },
    {
      hz: 528,
      name: "Frequência do Amor",
      purpose: "Regeneração celular e harmonia",
      description: "Conhecida como frequência milagrosa do amor",
      category: "solfeggio" as ValidDatabaseCategory
    },
    {
      hz: 963,
      name: "Despertar Pineal",
      purpose: "Ativação espiritual",
      description: "Frequência mais alta de Solfeggio para consciência cósmica",
      category: "spiritual" as ValidDatabaseCategory
    },
    // Add more frequencies following the same pattern...
  ];

  for (const freq of frequencies) {
    const { error } = await supabase
      .from('frequencies')
      .insert([
        { 
          ...freq,
          is_premium: freq.hz >= 528 // Make higher frequencies premium
        }
      ]);
    
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error seeding frequency:', error);
    }
  }
}
