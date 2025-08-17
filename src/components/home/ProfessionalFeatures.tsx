
import { CheckCircle, Heart, ThumbsUp, Users, Volume2, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfessionalFeatures() {
  const features = [
    {
      id: 1,
      icon: Heart,
      title: "Bem-Estar Emocional",
      description: "Encontre paz interior, equilibre suas emoções e cultive uma mentalidade positiva com frequências cuidadosamente selecionadas."
    },
    {
      id: 2,
      icon: Users,
      title: "Para Toda a Família",
      description: "Frequências seguras e eficazes para adultos, idosos e até mesmo pets. Bem-estar para todos em casa."
    },
    {
      id: 3,
      icon: Volume2,
      title: "Biblioteca Completa",
      description: "Mais de 200 frequências organizadas por objetivo: relaxamento, foco, cura emocional, energia e muito mais."
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Baseado na Ciência",
      description: "Todas as frequências são fundamentadas em pesquisas científicas e estudos comprovados sobre terapia sonora."
    },
    {
      id: 5,
      icon: ThumbsUp,
      title: "Fácil de Usar",
      description: "Interface simples e intuitiva. Basta escolher sua frequência e começar sua jornada de bem-estar imediatamente."
    },
    {
      id: 6,
      icon: Award,
      title: "Resultados Comprovados",
      description: "Milhares de usuários já experimentaram mudanças positivas em estresse, ansiedade, sono e foco mental."
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-background to-purple-50/10 dark:from-background dark:to-purple-900/5">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Benefícios das <span className="text-primary">Frequências</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Descubra como as frequências sonoras podem transformar sua vida diária e bem-estar emocional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="hover:bg-accent/5 transition-colors hover-scale border-primary/5"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
