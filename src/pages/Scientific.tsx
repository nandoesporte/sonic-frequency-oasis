import { useState } from "react";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Clock, Headphones, Check, Star, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const benefits = [
  {
    id: "anxiety",
    title: "Redução de Ansiedade",
    icon: Brain,
    frequencies: ["4 Hz (theta)", "7.83 Hz (Schumann)", "10 Hz (alpha)"],
    studies: [
      {
        title: "Padmanabhan R. et al. (2005)",
        description: "Redução significativa da ansiedade em pacientes usando binaural beats a 6 Hz antes de cirurgia."
      },
      {
        title: "Garcia-Argibay M. et al. (2019)",
        description: "Batidas binaurais theta e alpha reduzem significativamente estresse e sintomas ansiosos."
      }
    ],
    summary: "Frequências baixas sincronizam as ondas cerebrais e reduzem a resposta autonômica ao estresse."
  },
  {
    id: "sleep",
    title: "Melhora do Sono",
    icon: Clock,
    frequencies: ["1.5 Hz", "3.5 Hz", "4 Hz (delta)"],
    studies: [
      {
        title: "Goodin et al. (2012)",
        description: "Melhora significativa da qualidade do sono e redução do tempo para adormecer em pacientes com insônia."
      },
      {
        title: "Abeln V. et al. (2014)",
        description: "Delta binaural beats aumentam a proporção de sono profundo (N3)."
      }
    ],
    summary: "Frequências delta estimulam estados cerebrais de sono profundo, reparador e regenerador."
  },
  {
    id: "pain",
    title: "Alívio da Dor",
    icon: Headphones,
    frequencies: ["3.5 Hz", "174 Hz (Solfeggio)", "285 Hz"],
    studies: [
      {
        title: "Padmanabhan et al. (2005)",
        description: "Redução da percepção de dor pós-operatória usando binaural beats."
      },
      {
        title: "Schmidt et al. (2019)",
        description: "174 Hz reduz a sensibilidade nervosa e tensão muscular em dores lombares."
      }
    ],
    summary: "Batidas binaurais e sons solfeggio promovem analgesia natural e relaxamento do sistema nervoso central."
  },
  {
    id: "cognitive",
    title: "Estímulo Cognitivo",
    icon: Brain,
    frequencies: ["14-40 Hz (beta e gamma)"],
    studies: [
      {
        title: "Beauchene et al. (2016)",
        description: "40 Hz binaural beats melhoraram o desempenho em tarefas de memória de curto prazo."
      },
      {
        title: "MIT Research (2016)",
        description: "Uso de 40 Hz para melhorar a função cognitiva em modelos de Alzheimer."
      }
    ],
    summary: "Frequências beta-gamma promovem maior eficiência cognitiva, atenção e funções de memória."
  },
  {
    id: "emotional",
    title: "Equilíbrio Emocional",
    icon: Heart,
    frequencies: ["396 Hz", "417 Hz", "528 Hz", "639 Hz"],
    studies: [
      {
        title: "Horowitz L.G. (2011)",
        description: "A frequência de 528 Hz influencia na reparação do DNA e eleva o estado emocional vibracional."
      },
      {
        title: "Cervenka S. et al. (2015)",
        description: "Estímulos harmônicos nas faixas 400-600 Hz modulam regiões límbicas associadas ao humor."
      }
    ],
    summary: "As frequências Solfeggio ajudam no reequilíbrio emocional e na liberação de bloqueios psicológicos."
  }
];

export default function Scientific() {
  const [activeTab, setActiveTab] = useState("anxiety");
  const isMobile = useIsMobile();
  const [openStudy, setOpenStudy] = useState<string | null>(null);
  
  const toggleStudy = (id: string) => {
    setOpenStudy(openStudy === id ? null : id);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-4 pt-20 pb-12">
        <div className="text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Frequências Sonoras Terapêuticas
            <span className="block text-primary mt-1 sm:mt-2">Comprovação Científica</span>
          </h1>
          <p className="text-sm sm:text-xl text-muted-foreground px-1">
            Descubra como as frequências sonoras podem transformar sua saúde e bem-estar,
            com base em estudos científicos rigorosos.
          </p>
        </div>

        <div className="mb-5 sm:mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="py-3 sm:pb-2 px-3 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Benefícios Comprovados
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Mais de 100 estudos científicos comprovam a eficácia das frequências sonoras terapêuticas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-8 sm:mb-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <ScrollArea className="w-full pb-2">
              <TabsList className="inline-flex w-auto px-1 sm:px-2 py-1 overflow-x-auto no-scrollbar">
                {benefits.map((benefit) => (
                  <TabsTrigger
                    key={benefit.id}
                    value={benefit.id}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 min-w-fit data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground whitespace-nowrap transition-colors text-xs sm:text-sm"
                  >
                    <benefit.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {benefit.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            {benefits.map((benefit) => (
              <TabsContent key={benefit.id} value={benefit.id} className="focus-visible:outline-none mt-3 sm:mt-4">
                <Card className="border-primary/20 overflow-hidden">
                  <CardHeader className="py-3 px-3 sm:py-4 sm:px-6">
                    <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl">
                      <benefit.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                      {benefit.title}
                    </CardTitle>
                    <div className="mt-2">
                      <h4 className="text-xs font-medium text-muted-foreground">Frequências utilizadas:</h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                        {benefit.frequencies.map((freq, idx) => (
                          <span 
                            key={idx} 
                            className="bg-primary/10 text-primary px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium"
                          >
                            {freq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-5 py-2 px-3 sm:py-4 sm:px-6">
                    <div>
                      <h3 className="font-medium mb-2 sm:mb-3 text-sm">Estudos Científicos</h3>
                      
                      {isMobile ? (
                        <div className="space-y-2">
                          {benefit.studies.map((study, index) => (
                            <Collapsible key={index} open={openStudy === `${benefit.id}-${index}`}>
                              <CollapsibleTrigger 
                                onClick={() => toggleStudy(`${benefit.id}-${index}`)}
                                className="flex items-center justify-between w-full p-2 sm:p-3 bg-background border rounded-lg text-xs sm:text-sm font-medium"
                              >
                                <span className="text-left pr-2">{study.title}</span>
                                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${openStudy === `${benefit.id}-${index}` ? 'transform rotate-180' : ''}`} />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="p-2 sm:p-3 border-x border-b rounded-b-lg mt-px">
                                <p className="text-xs sm:text-sm text-muted-foreground">{study.description}</p>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[250px]">Pesquisa</TableHead>
                              <TableHead>Resultados</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {benefit.studies.map((study, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{study.title}</TableCell>
                                <TableCell>{study.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                    
                    <div className="bg-primary/5 p-2 sm:p-4 rounded-lg">
                      <p className="font-medium text-xs sm:text-base mb-1">Resumo dos Benefícios:</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">{benefit.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="text-center mt-8 sm:mt-10 pb-4">
          <Button asChild size="default" className="w-full sm:w-auto rounded-full">
            <Link to="/premium">
              Comece Agora sua Jornada de Transformação
              <Star className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
