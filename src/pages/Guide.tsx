import { Header } from "@/components/header";
import { AudioProvider } from "@/lib/audio-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock, Droplets, FileText, Focus, Heart, Moon, Brain } from "lucide-react";
import { FrequenciesGuideDialog } from "@/components/FrequenciesGuideDialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState } from "react";

const Guide = () => {
  const [showGuideDialog, setShowGuideDialog] = useState(false);
  
  const openGuideDialog = () => {
    setShowGuideDialog(true);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={openGuideDialog}
      >
        <Info className="h-4 w-4" />
        Mostrar Guia Rápido
      </Button>
      
      <FrequenciesGuideDialog 
        manualOpen={showGuideDialog} 
        onManualClose={() => setShowGuideDialog(false)} 
      />
      
      <AudioProvider>
        <div className="min-h-screen pb-24">
          <Header />
          
          <div className="container pt-32 pb-12 px-4">
            <h1 className="text-4xl font-bold mb-8">Guia de Uso das Frequências</h1>
            
            <Tabs defaultValue="before" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-4">
                <TabsTrigger value="before" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Antes da Sessão
                </TabsTrigger>
                <TabsTrigger value="during" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Durante a Sessão
                </TabsTrigger>
                <TabsTrigger value="after" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Após a Sessão
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="before" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preparação</CardTitle>
                    <CardDescription>Siga estes passos antes de iniciar sua sessão</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Focus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Respiração Profunda</h3>
                        <p className="text-muted-foreground">Reserve 2 minutos para respirar profundamente</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Defina sua Intenção</h3>
                        <p className="text-muted-foreground">Estabeleça um propósito claro para sua sessão</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="during" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Duração Recomendada</CardTitle>
                    <CardDescription>Tempo sugerido por tipo de frequência</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Frequências Baixas (&lt; 20 Hz)</h4>
                          <p className="text-sm text-muted-foreground">20 a 30 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Frequências Médias (20-200 Hz)</h4>
                          <p className="text-sm text-muted-foreground">15 a 20 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">Frequências Solfeggio (174-963 Hz)</h4>
                          <p className="text-sm text-muted-foreground">10 a 20 minutos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="after" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Práticas Pós-sessão</CardTitle>
                    <CardDescription>Recomendações para após sua sessão</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Momento de Silêncio</h3>
                        <p className="text-muted-foreground">Permaneça em silêncio por 2-5 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Droplets className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Hidratação</h3>
                        <p className="text-muted-foreground">Beba água para ajudar na liberação de toxinas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Registro</h3>
                        <p className="text-muted-foreground">Anote suas percepções e sentimentos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Frequência de Uso</CardTitle>
                    <CardDescription>Recomendações por objetivo</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg border">
                      <Moon className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Relaxamento / Sono</h4>
                        <p className="text-sm text-muted-foreground">Diariamente, antes de dormir</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg border">
                      <Heart className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Alívio de dor crônica</h4>
                        <p className="text-sm text-muted-foreground">1-2 vezes ao dia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg border">
                      <Brain className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-medium">Reprogramação emocional</h4>
                        <p className="text-sm text-muted-foreground">3-5 vezes por semana</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <h3 className="font-medium mb-2">Precauções Importantes</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Não use durante a operação de veículos ou máquinas</li>
                      <li>Consulte um médico se tiver epilepsia fotossensível</li>
                      <li>Mantenha o volume em nível moderado</li>
                      <li>Interrompa em caso de tontura</li>
                      <li>Não substitui tratamentos médicos convencionais</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AudioProvider>
    </>
  );
};

export default Guide;
