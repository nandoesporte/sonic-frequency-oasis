
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Heart } from "lucide-react";
import { FeedbackDialog } from './FeedbackDialog';
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/use-premium";
import { TrialExpiredDialog } from "@/components/TrialExpiredDialog";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface RitualWalk {
  id: string;
  walk_id: string;
  name: string;
  duration_minutes: number;
  ritual_preparation: string;
  activation_phrase: string;
  audio_url?: string;
  script_content?: string;
}

export function SentipassoSection() {
  const { user } = useAuth();
  const { hasAccess, isInTrialPeriod, trialDaysLeft } = usePremium();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedWalk, setSelectedWalk] = useState<RitualWalk | null>(null);
  const [ritualWalks, setRitualWalks] = useState<RitualWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrialExpiredDialog, setShowTrialExpiredDialog] = useState(false);

  useEffect(() => {
    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    try {
      const { data, error } = await supabase
        .from('sentipasso_audios')
        .select('*')
        .order('duration_minutes');
      
      if (error) throw error;
      
      setRitualWalks(data || []);
    } catch (error) {
      console.error('Erro ao carregar caminhadas:', error);
      toast.error("Erro ao carregar as caminhadas");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayWalk = (walk: RitualWalk) => {
    if (!user) {
      toast.info("Faça login para continuar", {
        description: "É necessário estar logado para acessar as caminhadas rituais"
      });
      return;
    }

    if (!hasAccess) {
      if (isInTrialPeriod) {
        toast.info("Período de Teste", {
          description: `Você tem ${trialDaysLeft} dias restantes no seu teste gratuito`
        });
      } else {
        setShowTrialExpiredDialog(true);
        return;
      }
    }

    setSelectedWalk(walk);
    
    // Use the browser's speech synthesis API to read the script
    if (walk.script_content && 'speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(walk.script_content);
      
      // Configure speech synthesis
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8; // Slightly slower for meditation
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      
      // Get available voices and try to use a Portuguese voice
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );
      
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
      
      utterance.onstart = () => {
        toast.success(`Iniciando: ${walk.name}`, {
          description: "Escute com atenção e deixe-se guiar pela caminhada"
        });
      };
      
      utterance.onend = () => {
        toast.info("Caminhada concluída", {
          description: "Como você se sente agora? Considere enviar seu feedback"
        });
      };
      
      utterance.onerror = (event) => {
        console.error('Erro na síntese de voz:', event);
        toast.error("Erro ao reproduzir o áudio", {
          description: "Verifique se seu navegador suporta síntese de voz"
        });
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Síntese de voz não suportada", {
        description: "Seu navegador não suporta a funcionalidade de texto para fala"
      });
    }
  };

  const handleFeedback = () => {
    if (!user) {
      toast.info("Faça login para continuar", {
        description: "É necessário estar logado para enviar feedback"
      });
      return;
    }
    setFeedbackOpen(true);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50/30 to-background dark:from-purple-900/10">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Carregando caminhadas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50/30 to-background dark:from-purple-900/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Heart className="h-4 w-4 mr-2 text-purple-500" />
            Novo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sentipasso – Caminhadas Rituais com Emoção
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme sua caminhada em um ritual de cura e autoconhecimento. 
            Cada trilha foi criada para trabalhar uma emoção específica através do movimento consciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {ritualWalks.map((walk) => (
            <Card key={walk.id} className="group hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-800/30">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {walk.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {walk.duration_minutes} min
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">
                    Ritual de Preparação:
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {walk.ritual_preparation}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-1">
                    Frase de Ativação:
                  </h4>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200 italic">
                    "{walk.activation_phrase}"
                  </p>
                </div>

                <Button 
                  onClick={() => handlePlayWalk(walk)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Ouvir e Caminhar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={handleFeedback}
            variant="outline" 
            size="lg"
            className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Heart className="h-4 w-4 mr-2" />
            Enviar como me senti
          </Button>
        </div>

        <FeedbackDialog 
          open={feedbackOpen} 
          onOpenChange={setFeedbackOpen}
          selectedWalk={selectedWalk?.name}
        />

        <TrialExpiredDialog 
          open={showTrialExpiredDialog}
          onOpenChange={setShowTrialExpiredDialog}
        />
      </div>
    </section>
  );
}
