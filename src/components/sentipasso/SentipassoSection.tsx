
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Heart } from "lucide-react";
import { FeedbackDialog } from './FeedbackDialog';
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { TrialExpiredDialog } from "@/components/TrialExpiredDialog";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAudio } from "@/lib/audio-context";

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
  const { playSentipassoAudio } = useAudio();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedWalk, setSelectedWalk] = useState<RitualWalk | null>(null);
  const [ritualWalks, setRitualWalks] = useState<RitualWalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrialExpiredDialog, setShowTrialExpiredDialog] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null);

  useEffect(() => {
    fetchWalks();
  }, []);

  const fetchWalks = async () => {
    try {
      const { data, error } = await supabase
        .from('sentimento_audios')
        .select('*')
        .order('sentimento');
      
      if (error) throw error;
      
      // Map the sentiment data to ritual walks format
      const mappedWalks = data?.map(item => ({
        id: item.id,
        walk_id: item.sentimento,
        name: `Caminhada do ${item.sentimento.charAt(0).toUpperCase() + item.sentimento.slice(1)}`,
        duration_minutes: 10,
        ritual_preparation: `Prepare-se para uma caminhada de ${item.sentimento}. ${item.mensagem_texto}`,
        activation_phrase: `Eu sou capaz de sentir e transformar meu ${item.sentimento}`,
        audio_url: item.audio_url,
        script_content: item.mensagem_texto
      })) || [];
      
      setRitualWalks(mappedWalks);
    } catch (error) {
      console.error('Erro ao carregar caminhadas:', error);
      toast.error("Erro ao carregar as caminhadas");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayWalk = async (walk: RitualWalk) => {
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
    setGeneratingAudio(walk.id);
    
    try {
      // Check if we have a pre-generated audio URL
      if (walk.audio_url) {
        // Get the frequency from sentimento_audios table
        const { data: sentimentData } = await supabase
          .from('sentimento_audios')
          .select('frequencia_hz')
          .eq('sentimento', walk.walk_id)
          .single();

        // Create a sentipasso frequency object compatible with the audio player
        const sentipassoFrequency = {
          id: walk.id,
          name: walk.name,
          hz: 0, // No frequency for sentipasso itself
          purpose: "Caminhada Ritual",
          description: walk.ritual_preparation,
          category: "sentipasso" as any,
          premium: true,
          trending: false,
          audioUrl: walk.audio_url,
          duration: walk.duration_minutes * 60, // Convert to seconds
          activationPhrase: walk.activation_phrase,
          frequencia: sentimentData?.frequencia_hz || 0 // Background frequency to play
        };

        // Use the audio context to play the sentipasso audio
        await playSentipassoAudio(sentipassoFrequency);
        
        toast.success(`Iniciando: ${walk.name}`, {
          description: `Áudio ElevenLabs com Sofia + frequência ${sentimentData?.frequencia_hz || 0}Hz de fundo`
        });
        return;
      }

      // Fallback to browser speech synthesis
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
            description: "Síntese de voz do navegador - Escute com atenção e deixe-se guiar pela caminhada"
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
        throw new Error('Síntese de voz não suportada pelo navegador');
      }
      
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      toast.error("Erro ao reproduzir a caminhada", {
        description: "Não foi possível reproduzir o áudio por nenhum método disponível"
      });
    } finally {
      setGeneratingAudio(null);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {ritualWalks.map((walk) => (
            <Card key={walk.id} className="group hover:shadow-md transition-all duration-300 border-purple-100 dark:border-purple-800/30 hover-scale">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-1">
                  <CardTitle className="text-base font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
                    {walk.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                    <Clock className="h-3 w-3" />
                    {walk.duration_minutes}min
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium text-xs text-purple-700 dark:text-purple-300 mb-1">
                    Frase de Ativação:
                  </h4>
                  <p className="text-xs font-medium text-purple-800 dark:text-purple-200 italic leading-tight">
                    "{walk.activation_phrase}"
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-xs text-muted-foreground mb-2">
                    Preparação:
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {walk.ritual_preparation}
                  </p>
                </div>

                <Button 
                  onClick={() => handlePlayWalk(walk)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-sm"
                  size="sm"
                  disabled={generatingAudio === walk.id}
                >
                  <Play className="h-3 w-3 mr-2" />
                  {generatingAudio === walk.id ? "Gerando..." : "Ouvir e Caminhar"}
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
