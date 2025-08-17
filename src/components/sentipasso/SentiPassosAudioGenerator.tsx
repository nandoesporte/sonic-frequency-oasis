import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export function SentiPassosAudioGenerator() {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const generateAllAudios = async () => {
    if (!user) {
      toast.error("Faça login para continuar");
      return;
    }

    setGenerating(true);
    setResults(null);

    try {
      toast.info("Iniciando geração de áudios...", {
        description: "Isso pode levar alguns minutos"
      });

      const { data, error } = await supabase.functions.invoke('generate-all-sentimento-audios', {
        body: { action: 'generate_all' }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.summary?.success > 0) {
        toast.success(`Geração concluída!`, {
          description: `${data.summary.success} áudios gerados com sucesso`
        });
      }

      if (data.summary?.errors > 0) {
        toast.warning(`Alguns erros ocorreram`, {
          description: `${data.summary.errors} áudios falharam`
        });
      }

    } catch (error) {
      console.error('Erro ao gerar áudios:', error);
      toast.error("Erro ao gerar áudios", {
        description: "Verifique os logs para mais detalhes"
      });
    } finally {
      setGenerating(false);
    }
  };

  const regenerateWithElevenLabs = async () => {
    if (!user) {
      toast.error("Faça login para continuar");
      return;
    }

    setRegenerating(true);
    setResults(null);

    try {
      toast.info("Regenerando com ElevenLabs e scripts aprimorados...", {
        description: "Sofia será a nova voz dos rituais em português-BR"
      });

      const { data, error } = await supabase.functions.invoke('generate-all-sentimento-audios', {
        body: { action: 'regenerate_elevenlabs' }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.summary?.success > 0) {
        toast.success(`Regeneração com ElevenLabs concluída!`, {
          description: `${data.summary.success} áudios criados com a voz da Sofia`
        });
      }

      if (data.summary?.errors > 0) {
        toast.warning(`Alguns erros ocorreram`, {
          description: `${data.summary.errors} áudios falharam`
        });
      }

    } catch (error) {
      console.error('Erro ao regenerar áudios:', error);
      toast.error("Erro ao regenerar áudios", {
        description: "Verifique os logs para mais detalhes"
      });
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-purple-500" />
          Gerador de Áudios SentiPassos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Gera áudios dos sentimentos com OpenAI ou ElevenLabs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={generateAllAudios}
            disabled={generating || regenerating}
            className="w-full"
            size="lg"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Gerar com OpenAI
              </>
            )}
          </Button>

          <Button 
            onClick={regenerateWithElevenLabs}
            disabled={generating || regenerating}
            className="w-full"
            size="lg"
            variant="secondary"
          >
            {regenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Regenerando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerar com ElevenLabs
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>OpenAI:</strong> Usa os scripts existentes</p>
          <p><strong>ElevenLabs:</strong> Scripts aprimorados em português-BR com Sofia</p>
        </div>

        {results && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <div className="text-lg font-bold text-green-600">
                  {results.summary?.success || 0}
                </div>
                <div className="text-xs text-green-600">Sucessos</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <div className="text-lg font-bold text-red-600">
                  {results.summary?.errors || 0}
                </div>
                <div className="text-xs text-red-600">Erros</div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {results.summary?.total || 0}
                </div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.results?.map((result: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span className="text-sm capitalize">{result.sentimento}</span>
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <>
                        <Badge variant="default" className="bg-green-500">
                          {result.frequencia}Hz
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </>
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}