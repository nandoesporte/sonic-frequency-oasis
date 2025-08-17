import { useEffect, useState } from 'react';
import { Header } from "@/components/header";
import { FrequencyCard } from "@/components/frequency-card";
import { AudioPlayer } from "@/components/audio-player";
import { AudioProvider } from "@/lib/audio-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Heart, Waves, Sparkles, Volume2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { SentipassoSection } from "@/components/sentipasso/SentipassoSection";

interface SentiPassoAudio {
  id: string;
  name: string;
  duration_minutes: number;
  activation_phrase: string;
  ritual_preparation: string;
  audio_url: string | null;
  script_content: string | null;
  walk_id: string;
}

// Mock data baseado nas frequências de sentimentos
const mockSentiPassoData = [
  {
    id: 'paz-1',
    name: 'Caminhada da Paz Interior',
    hz: 528,
    purpose: 'Promove tranquilidade e serenidade',
    description: 'Uma caminhada meditativa que utiliza a frequência do amor para cultivar paz interior profunda.',
    category: 'wellness',
    premium: false,
    trending: false
  },
  {
    id: 'raiva-1', 
    name: 'Caminhada de Transformação da Raiva',
    hz: 396,
    purpose: 'Libera tensões e transforma energia',
    description: 'Caminhada terapêutica para processar e transformar sentimentos de raiva em energia positiva.',
    category: 'emotional',
    premium: true,
    trending: false
  },
  {
    id: 'tristeza-1',
    name: 'Caminhada de Superação da Tristeza', 
    hz: 639,
    purpose: 'Eleva o estado emocional',
    description: 'Uma jornada sonora para transformar tristeza em aceitação e renovação emocional.',
    category: 'healing',
    premium: true,
    trending: false
  },
  {
    id: 'alegria-1',
    name: 'Caminhada da Alegria Radiante',
    hz: 852,
    purpose: 'Desperta alegria genuína',
    description: 'Caminhada energizante que utiliza frequências elevadas para cultivar alegria duradoura.',
    category: 'wellness',
    premium: false,
    trending: true
  },
  {
    id: 'gratidao-1',
    name: 'Caminhada da Gratidão',
    hz: 741,
    purpose: 'Cultiva sentimento de gratidão',
    description: 'Uma experiência transformadora para desenvolver um coração grato e perspectiva positiva.',
    category: 'spiritual',
    premium: true,
    trending: false
  },
  {
    id: 'ansiedade-1',
    name: 'Caminhada para Ansiedade',
    hz: 285,
    purpose: 'Reduz ansiedade e estresse',
    description: 'Caminhada calmante com frequências específicas para aliviar ansiedade e restaurar equilíbrio.',
    category: 'healing',
    premium: true,
    trending: true
  }
];

const SentiPasso = () => {
  const [sentiPassoAudios, setSentiPassoAudios] = useState<SentiPassoAudio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentiPassoAudios();
  }, []);

  const fetchSentiPassoAudios = async () => {
    try {
      const { data, error } = await supabase
        .from('sentipasso_audios')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching sentipasso audios:', error);
        toast.error('Erro ao carregar áudios do SentiPasso');
      } else {
        setSentiPassoAudios(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar áudios do SentiPasso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AudioProvider>
      <div className="min-h-screen pb-24">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-purple-100/80 to-background dark:from-purple-900/20">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </Link>
                </Button>
              </div>
              
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Waves className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-primary">Senti</span>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Passos</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Caminhadas terapêuticas que combinam movimento consciente com frequências sonoras específicas 
                para transformar estados emocionais
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                  <Heart className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Bem-estar Emocional</h3>
                  <p className="text-sm text-muted-foreground">
                    Transforme emoções através do movimento e som
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                  <Volume2 className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Frequências Curativas</h3>
                  <p className="text-sm text-muted-foreground">
                    Áudios especializados para cada estado emocional
                  </p>
                </div>
                
                <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Transformação</h3>
                  <p className="text-sm text-muted-foreground">
                    Alcance novos níveis de consciência e equilíbrio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Escolha seu Estado</h3>
                <p className="text-muted-foreground">
                  Selecione a caminhada baseada no estado emocional que deseja trabalhar
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Prepare-se</h3>
                <p className="text-muted-foreground">
                  Realize o ritual de preparação sugerido para maximizar os benefícios
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Caminhe e Transforme</h3>
                <p className="text-muted-foreground">
                  Inicie sua caminhada consciente guiada pelas frequências terapêuticas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Caminhadas - Importando da página inicial */}
        <SentipassoSection />

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-purple-50/10">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-6">Comece sua Jornada de Transformação</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Descubra como as caminhadas terapêuticas podem transformar sua relação com as emoções
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/guide">
                  Guia de Uso
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/scientific">
                  Base Científica
                  <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
};

export default SentiPasso;