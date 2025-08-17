import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Heart, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/hooks/use-premium";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface SentimentoAudio {
  id: string;
  sentimento: string;
  frequencia_hz: number;
  audio_url: string;
  mensagem_texto: string;
}

export function SentipassoAudioSystem() {
  const { user } = useAuth();
  const { hasAccess } = usePremium();
  const [sentimentos, setSentimentos] = useState<SentimentoAudio[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentimento, setCurrentSentimento] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    fetchSentimentos();
    return () => {
      cleanup();
    };
  }, []);

  const fetchSentimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('sentimento_audios')
        .select('*')
        .order('sentimento');
      
      if (error) throw error;
      setSentimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar sentimentos:', error);
      toast.error("Erro ao carregar os sentimentos");
    } finally {
      setLoading(false);
    }
  };

  const cleanup = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const generateOrGetAudio = async (sentimento: string): Promise<string> => {
    setGeneratingAudio(sentimento);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-sentimento-audio', {
        body: { sentimento }
      });

      if (error) throw error;
      
      if (data?.cached) {
        toast.success("Áudio carregado do cache");
      } else {
        toast.success("Novo áudio gerado com sucesso");
        // Update local state with new URL
        setSentimentos(prev => prev.map(s => 
          s.sentimento === sentimento 
            ? { ...s, audio_url: data.audioUrl }
            : s
        ));
      }

      return data.audioUrl;
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      toast.error("Erro ao gerar áudio do sentimento");
      throw error;
    } finally {
      setGeneratingAudio(null);
    }
  };

  const playFrequency = async (hz: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Stop existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }

      // Create new oscillator
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(hz, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      console.log(`Tocando frequência ${hz}Hz`);
    } catch (error) {
      console.error('Erro ao tocar frequência:', error);
    }
  };

  const stopFrequency = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const startSentipassoSession = async (sentimentoData: SentimentoAudio) => {
    if (!user || !hasAccess) {
      toast.error("Acesso necessário para usar o SentiPassos");
      return;
    }

    try {
      cleanup();

      let audioUrl = sentimentoData.audio_url;
      
      // Generate audio if not exists
      if (!audioUrl) {
        audioUrl = await generateOrGetAudio(sentimentoData.sentimento);
      }

      const audio = new Audio(audioUrl);
      audio.crossOrigin = "anonymous";
      
      setCurrentAudio(audio);
      setCurrentSentimento(sentimentoData.sentimento);
      setIsPlaying(true);

      // Play initial message
      await audio.play();
      toast.success(`Iniciando sessão: ${sentimentoData.sentimento}`, {
        description: "Mensagem inicial + frequências a cada 3 minutos"
      });

      // Set up the timing system
      let messageCount = 0;
      timerRef.current = setInterval(async () => {
        messageCount++;
        
        if (messageCount % 3 === 0) { // Every 3 minutes (180 seconds)
          // Stop frequency and play message
          stopFrequency();
          
          // Restart audio from beginning
          audio.currentTime = 0;
          await audio.play();
          console.log(`Reproduzindo mensagem ${sentimentoData.sentimento} novamente`);
          
          // After message ends, restart frequency
          audio.onended = () => {
            playFrequency(sentimentoData.frequencia_hz);
          };
        } else {
          // Play frequency in intervals
          playFrequency(sentimentoData.frequencia_hz);
        }
      }, 60000); // Check every minute

      // Start initial frequency after audio message
      audio.onended = () => {
        playFrequency(sentimentoData.frequencia_hz);
      };

    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      toast.error("Erro ao iniciar a sessão SentiPassos");
      setIsPlaying(false);
      setCurrentSentimento(null);
    }
  };

  const stopSession = () => {
    cleanup();
    setIsPlaying(false);
    setCurrentSentimento(null);
    toast.info("Sessão SentiPassos finalizada");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Carregando sistema SentiPassos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Sistema SentiPassos Inteligente
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Mensagens de áudio + frequências específicas para cada sentimento
          </p>
        </CardHeader>
        <CardContent>
          {isPlaying && currentSentimento && (
            <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-purple-700 dark:text-purple-300">
                  Sessão ativa: {currentSentimento}
                </span>
                <Button onClick={stopSession} variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Parar
                </Button>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Mensagem a cada 3 min + frequência contínua
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sentimentos.map((sentimento) => (
          <Card key={sentimento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg capitalize">
                  {sentimento.sentimento}
                </CardTitle>
                <Badge variant="secondary">
                  {sentimento.frequencia_hz}Hz
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {sentimento.mensagem_texto}
              </p>
              
              <Button
                onClick={() => startSentipassoSession(sentimento)}
                disabled={isPlaying || generatingAudio === sentimento.sentimento}
                className="w-full"
                variant={currentSentimento === sentimento.sentimento ? "secondary" : "default"}
              >
                {generatingAudio === sentimento.sentimento ? (
                  "Gerando áudio..."
                ) : currentSentimento === sentimento.sentimento ? (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Ativo
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar Sessão
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}