import { useState } from "react";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Clock, Headphones, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Frequências Sonoras Terapêuticas
            <span className="block text-primary mt-2">Comprovação Científica</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Descubra como as frequências sonoras podem transformar sua saúde e bem-estar,
            com base em estudos científicos rigorosos.
          </p>
        </div>

        <div className="mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Star className="h-5 w-5 text-primary" />
                Benefícios Comprovados
              </CardTitle>
              <CardDescription>
                Mais de 100 estudos científicos comprovam a eficácia das frequências sonoras terapêuticas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="max-w-full overflow-hidden">
              <TabsList className="inline-flex w-auto px-4 py-2 overflow-x-auto no-scrollbar">
                {benefits.map((benefit) => (
                  <TabsTrigger
                    key={benefit.id}
                    value={benefit.id}
                    className="min-w-fit data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground whitespace-nowrap transition-colors"
                  >
                    <benefit.icon className="h-4 w-4 mr-2" />
                    {benefit.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {benefits.map((benefit) => (
              <TabsContent key={benefit.id} value={benefit.id}>
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                      <benefit.icon className="h-6 w-6 text-primary" />
                      {benefit.title}
                    </CardTitle>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Frequências utilizadas:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {benefit.frequencies.map((freq, idx) => (
                          <span 
                            key={idx} 
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {freq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Estudos Científicos</h3>
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
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p className="font-medium">Resumo dos Benefícios:</p>
                      <p className="text-muted-foreground mt-1">{benefit.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="rounded-full">
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
