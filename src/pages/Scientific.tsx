import { useState } from "react";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Clock, Headphones, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

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
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequências Sonoras Terapêuticas
            <span className="block text-primary mt-2">Comprovação Científica</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra como as frequências sonoras podem transformar sua saúde e bem-estar,
            com base em estudos científicos rigorosos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="col-span-1 lg:col-span-3 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Benefícios Comprovados
              </CardTitle>
              <CardDescription>
                Mais de 100 estudos científicos comprovam a eficácia das frequências sonoras terapêuticas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            {benefits.map((benefit) => (
              <TabsTrigger
                key={benefit.id}
                value={benefit.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <benefit.icon className="h-4 w-4 mr-2" />
                {benefit.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {benefits.map((benefit) => (
            <TabsContent key={benefit.id} value={benefit.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <benefit.icon className="h-6 w-6 text-primary" />
                    {benefit.title}
                  </CardTitle>
                  <CardDescription>
                    Frequências utilizadas: {benefit.frequencies.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {benefit.studies.map((study, index) => (
                      <div key={index} className="flex gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium">{study.title}</h4>
                          <p className="text-muted-foreground">{study.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="font-medium">Resumo dos Benefícios:</p>
                    <p className="text-muted-foreground">{benefit.summary}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
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
