
import { CheckCircle, Heart, ThumbsUp, Users, Volume2, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfessionalFeatures() {
  const features = [
    {
      id: 1,
      icon: Users,
      title: "Atraia Mais Clientes",
      description: "Diferencie seus serviços com frequências terapêuticas de alta qualidade. Seus clientes sentirão a diferença desde a primeira sessão."
    },
    {
      id: 2,
      icon: Heart,
      title: "Melhore a Retenção",
      description: "Resultados mais profundos e experiências mais imersivas mantêm seus clientes voltando e recomendando seus serviços."
    },
    {
      id: 3,
      icon: Volume2,
      title: "Biblioteca Profissional",
      description: "Acesso a mais de 200 frequências terapêuticas organizadas por objetivo, condição e efeito desejado."
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Resultados Comprovados",
      description: "Frequências baseadas em pesquisas científicas e testadas por profissionais em milhares de sessões."
    },
    {
      id: 5,
      icon: ThumbsUp,
      title: "Facilidade de Uso",
      description: "Reprodução simples e direta, pronta para usar em suas sessões sem complicações técnicas."
    },
    {
      id: 6,
      icon: Award,
      title: "Certificação Profissional",
      description: "Receba uma certificação digital mostrando que você utiliza frequências terapêuticas calibradas e de alta qualidade."
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-background to-purple-50/10 dark:from-background dark:to-purple-900/5">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Transforme suas <span className="text-primary">Sessões</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Ferramentas poderosas para profissionais que desejam oferecer uma experiência superior
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
