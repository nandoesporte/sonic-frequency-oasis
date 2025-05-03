
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
  description: string;
  category: string;
  premium: boolean;
  free?: boolean; // New property to mark free frequencies
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

// Map database categories back to UI categories
const reverseCategoryMapping: Record<ValidDatabaseCategory, string> = {
  "sleep": "sleep_meditation",
  "healing": "healing",
  "emotional": "emotional",
  "pain_relief": "pain_relief",
  "cognitive": "cognitive",
  "solfeggio": "solfeggio",
  "spiritual": "spiritual",
  "physical": "physical",
  "meditation": "sleep_meditation"
};

export async function getFrequenciesByCategory(categoryId: string): Promise<FrequencyData[]> {
  try {
    // Map UI category to database category
    const dbCategory = categoryMapping[categoryId];
    
    if (!dbCategory) {
      console.error(`Invalid category: ${categoryId}`);
      return [];
    }
    
    console.log(`Fetching frequencies for database category: ${dbCategory}`);
    
    // Enable .select('*') for anonymous access - no RLS restrictions should apply for reading frequencies
    const { data, error } = await supabase
      .from('frequencies')
      .select('*')
      .eq('category', dbCategory)
      .order('hz');

    if (error) {
      console.error('Error fetching frequencies:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No frequencies found for category: ${dbCategory}`);
      // If no frequencies found, seed some for this category
      await seedFrequenciesForCategory(dbCategory);
      
      // Try fetching again after seeding
      const { data: newData, error: newError } = await supabase
        .from('frequencies')
        .select('*')
        .eq('category', dbCategory)
        .order('hz');
      
      if (newError || !newData) {
        console.error('Error fetching frequencies after seeding:', newError);
        return [];
      }
      
      // We'll mark the first frequency in each category as free
      const processedData = markFirstFrequency(newData);
      
      return processedData.map(freq => ({
        id: freq.id,
        name: freq.name,
        hz: freq.hz,
        purpose: freq.purpose,
        description: freq.description || freq.purpose,
        category: reverseCategoryMapping[freq.category as ValidDatabaseCategory] || freq.category,
        premium: freq.is_premium,
        free: freq.is_free_sample
      }));
    }

    console.log(`Found ${data.length} frequencies for category ${dbCategory}`);
    
    // We'll mark the first frequency in each category as free
    const processedData = markFirstFrequency(data);
    
    return processedData.map(freq => ({
      id: freq.id,
      name: freq.name,
      hz: freq.hz,
      purpose: freq.purpose,
      description: freq.description || freq.purpose,
      category: reverseCategoryMapping[freq.category as ValidDatabaseCategory] || freq.category,
      premium: freq.is_premium,
      free: freq.is_free_sample
    }));
  } catch (error) {
    console.error('Error in getFrequenciesByCategory:', error);
    throw error;
  }
}

// Function to mark the first frequency in each category as free
function markFirstFrequency(frequencies: any[]) {
  if (!frequencies || frequencies.length === 0) {
    return [];
  }
  
  // Make a copy to avoid mutating the original
  const result = [...frequencies];
  
  // Find the first non-premium frequency, or just the first one if all are premium
  const freeIndex = result.findIndex(freq => !freq.is_premium);
  const indexToMark = freeIndex >= 0 ? freeIndex : 0;
  
  if (result[indexToMark]) {
    result[indexToMark] = {
      ...result[indexToMark],
      is_free_sample: true
    };
  }
  
  return result;
}

export async function getTrendingFrequencies(): Promise<FrequencyData[]> {
  try {
    // Use explicit select for anonymous access
    const { data, error } = await supabase
      .from('frequencies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (error) {
      console.error('Error fetching trending frequencies:', error);
      return [];
    }

    if (!data || data.length === 0) {
      // If no trending frequencies, seed some default frequencies
      await seedInitialFrequencies();
      
      // Try fetching again
      const { data: newData, error: newError } = await supabase
        .from('frequencies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (newError || !newData) {
        return [];
      }
      
      // Mark one trending frequency as free
      const processedData = markFirstFrequency(newData);
      
      return processedData.map(freq => ({
        id: freq.id,
        name: freq.name,
        hz: freq.hz,
        purpose: freq.purpose,
        description: freq.description || freq.purpose,
        category: reverseCategoryMapping[freq.category as ValidDatabaseCategory] || freq.category,
        premium: freq.is_premium,
        free: freq.is_free_sample,
        trending: true
      }));
    }

    // Mark one trending frequency as free
    const processedData = markFirstFrequency(data);
    
    return processedData.map(freq => ({
      id: freq.id,
      name: freq.name,
      hz: freq.hz,
      purpose: freq.purpose,
      description: freq.description || freq.purpose,
      category: reverseCategoryMapping[freq.category as ValidDatabaseCategory] || freq.category,
      premium: freq.is_premium,
      free: freq.is_free_sample,
      trending: true
    }));
  } catch (error) {
    console.error('Error fetching trending frequencies:', error);
    return [];
  }
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
    description: data.description || data.purpose,
    category: reverseCategoryMapping[data.category as ValidDatabaseCategory] || data.category,
    premium: data.is_premium
  };
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export async function getCategoryCount(categoryId: string): Promise<number> {
  const dbCategory = categoryMapping[categoryId];
  if (!dbCategory) return 0;
  
  const { count, error } = await supabase
    .from('frequencies')
    .select('*', { count: 'exact', head: true })
    .eq('category', dbCategory);
    
  if (error) {
    console.error('Error getting category count:', error);
    return 0;
  }
  
  if (count === 0) {
    // Seed frequencies for this category if count is 0
    await seedFrequenciesForCategory(dbCategory);
    
    // Get updated count
    const { count: newCount, error: newError } = await supabase
      .from('frequencies')
      .select('*', { count: 'exact', head: true })
      .eq('category', dbCategory);
    
    if (newError) {
      console.error('Error getting category count after seeding:', newError);
      return 0;
    }
    
    return newCount || 0;
  }
  
  return count || 0;
}

async function seedFrequenciesForCategory(category: ValidDatabaseCategory) {
  const frequenciesByCategory: Record<ValidDatabaseCategory, Array<Omit<FrequencyData, 'id' | 'category'>>> = {
    "sleep": [
      {
        hz: 1.5,
        name: "Delta Profundo",
        purpose: "Sono profundo e regeneração celular",
        description: "Estímulo de ondas delta para sono profundo e cicatrização",
        premium: false
      },
      {
        hz: 2.5,
        name: "Delta Superior",
        purpose: "Relaxamento profundo e sono reparador",
        description: "Facilita o sono REM e a recuperação mental",
        premium: false
      },
      {
        hz: 4.0,
        name: "Delta-Theta",
        purpose: "Meditação profunda e sono leve",
        description: "Transição entre sono profundo e sonho",
        premium: true
      }
    ],
    "healing": [
      {
        hz: 7.83,
        name: "Ressonância Schumann",
        purpose: "Harmonização com a frequência da Terra",
        description: "Promove conexão mente-corpo e bem-estar geral",
        premium: false
      },
      {
        hz: 8.0,
        name: "Alpha Inferior",
        purpose: "Cura e regeneração celular",
        description: "Estimula a produção de endorfinas e regeneração tecidual",
        premium: false
      },
      {
        hz: 10.5,
        name: "Alpha Superior",
        purpose: "Aceleração da cura e circulação",
        description: "Melhora o fluxo sanguíneo e acelera processos de cicatrização",
        premium: true
      }
    ],
    "emotional": [
      {
        hz: 5.5,
        name: "Theta Emocional",
        purpose: "Liberação de traumas emocionais",
        description: "Acesso ao subconsciente para processamento emocional",
        premium: false
      },
      {
        hz: 7.0,
        name: "Theta-Alpha",
        purpose: "Equilíbrio emocional e relaxamento",
        description: "Redução da ansiedade e harmonia emocional",
        premium: false
      },
      {
        hz: 9.0,
        name: "Alpha Emocional",
        purpose: "Estabilidade e positividade emocional",
        description: "Promove pensamentos positivos e reduz estresse",
        premium: true
      }
    ],
    "pain_relief": [
      {
        hz: 3.5,
        name: "Delta para Dor",
        purpose: "Alívio de dor crônica",
        description: "Redução da sensibilidade à dor e relaxamento profundo",
        premium: false
      },
      {
        hz: 6.0,
        name: "Theta para Dor",
        purpose: "Redução da percepção da dor",
        description: "Liberação de endorfinas naturais para analgesia",
        premium: false
      },
      {
        hz: 9.4,
        name: "Alpha para Dor",
        purpose: "Alívio da dor e inflamação",
        description: "Frequência específica para redução de processos inflamatórios",
        premium: true
      }
    ],
    "cognitive": [
      {
        hz: 12.5,
        name: "Beta Inferior",
        purpose: "Foco mental e concentração",
        description: "Estado de alerta relaxado ideal para estudo",
        premium: false
      },
      {
        hz: 15.0,
        name: "Beta Médio",
        purpose: "Pensamento crítico e resolução de problemas",
        description: "Estimula conexões neurais e raciocínio lógico",
        premium: false
      },
      {
        hz: 18.0,
        name: "Beta Superior",
        purpose: "Desempenho mental elevado",
        description: "Estado ideal para tarefas intelectuais complexas",
        premium: true
      }
    ],
    "solfeggio": [
      {
        hz: 396,
        name: "UT - Liberação",
        purpose: "Libertação do medo e culpa",
        description: "Primeira frequência Solfeggio para liberação de bloqueios emocionais",
        premium: false
      },
      {
        hz: 528,
        name: "MI - Transformação",
        purpose: "Reparo de DNA e milagres",
        description: "A frequência do amor para transformação e reparação celular",
        premium: false
      },
      {
        hz: 852,
        name: "LA - Intuição",
        purpose: "Despertar espiritual e intuição",
        description: "Ativa o terceiro olho e expande a consciência espiritual",
        premium: true
      }
    ],
    "spiritual": [
      {
        hz: 33,
        name: "Frequência Cristo",
        purpose: "Amor incondicional e compaixão",
        description: "Associada à expansão da consciência espiritual",
        premium: false
      },
      {
        hz: 432,
        name: "Harmonia Universal",
        purpose: "Sintonização com o universo",
        description: "Frequência natural para equilíbrio com as leis cósmicas",
        premium: false
      },
      {
        hz: 963,
        name: "Pineal Superior",
        purpose: "Despertar espiritual completo",
        description: "Frequência mais alta do Solfeggio para iluminação",
        premium: true
      }
    ],
    "physical": [
      {
        hz: 285,
        name: "Regeneração Tecidual",
        purpose: "Reparo de tecidos e órgãos",
        description: "Estimula a regeneração celular e cura física",
        premium: false
      },
      {
        hz: 5.8,
        name: "Theta Física",
        purpose: "Equilíbrio hormonal e sistema imunológico",
        description: "Harmonização das funções corporais e fortalecimento imunológico",
        premium: false
      },
      {
        hz: 136.1,
        name: "Recuperação Muscular",
        purpose: "Alívio de tensão e dor muscular",
        description: "Frequência específica para relaxamento e recuperação muscular",
        premium: true
      }
    ],
    "meditation": [
      {
        hz: 4.5,
        name: "Theta Meditativo",
        purpose: "Meditação profunda",
        description: "Estado ideal para meditação e visualização criativa",
        premium: false
      },
      {
        hz: 7.5,
        name: "Alpha Meditativo",
        purpose: "Relaxamento consciente",
        description: "Equilíbrio entre relaxamento e atenção plena",
        premium: false
      },
      {
        hz: 40.0,
        name: "Gamma Meditativo",
        purpose: "Percepção elevada e consciência expandida",
        description: "Estado mental observado em meditadores experientes",
        premium: true
      }
    ]
  };

  const frequencies = frequenciesByCategory[category] || [];
  
  if (frequencies.length === 0) {
    console.log(`No predefined frequencies for category: ${category}`);
    return;
  }
  
  for (const freq of frequencies) {
    const { error } = await supabase
      .from('frequencies')
      .insert([{ 
        ...freq,
        category: category,
        is_premium: freq.premium
      }]);
    
    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error seeding frequency:', error);
    } else {
      console.log(`Seeded frequency: ${freq.name} (${freq.hz} Hz)`);
    }
  }
}

export async function seedInitialFrequencies() {
  console.log("Starting initial frequency seeding...");
  
  // Seed at least one frequency for each category
  for (const category of Object.values(categoryMapping)) {
    await seedFrequenciesForCategory(category);
  }
  
  console.log("Finished seeding frequencies");
}

// Export additional helper functions
export async function getAllFrequencies(): Promise<FrequencyData[]> {
  const { data, error } = await supabase
    .from('frequencies')
    .select('*')
    .order('hz');

  if (error) {
    console.error('Error fetching all frequencies:', error);
    return [];
  }

  return data.map(freq => ({
    id: freq.id,
    name: freq.name,
    hz: freq.hz,
    purpose: freq.purpose,
    description: freq.description || freq.purpose,
    category: reverseCategoryMapping[freq.category as ValidDatabaseCategory] || freq.category,
    premium: freq.is_premium
  }));
}

