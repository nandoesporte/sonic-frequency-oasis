
import { Check, ChevronRight, Award, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function ScientificEvidence() {
  const isMobile = useIsMobile();
  
  const studies = [
    {
      id: 1,
      title: "Redução de Ansiedade",
      description: "Estudos por Garcia-Argibay (2019) comprovam redução de até 26% nos níveis de ansiedade com batidas binaurais.",
    },
    {
      id: 2,
      title: "Alívio de Dores Crônicas",
      description: "Pesquisas do Journal of Pain Research demonstram eficácia em tratamento de dores crônicas sem medicamentos.",
    },
    {
      id: 3,
      title: "Melhora do Sono",
      description: "Estudos clínicos mostram aumento de 65% na qualidade do sono em participantes que usaram frequências específicas.",
    },
    {
      id: 4,
      title: "Equilíbrio Hormonal",
      description: "Pesquisas indicam normalização de cortisol e melhora nos sintomas da menopausa com terapia sonora.",
    }
  ];

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Aprovado por Especialistas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Comprovação <span className="text-primary">Científica</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Não é magia, é ciência. Nossas frequências são baseadas em décadas de pesquisas 
            em neurociência e medicina integrativa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-4xl mx-auto">
          {studies.map((study) => (
            <Card key={study.id} className="hover:bg-accent/5 transition-colors bg-white/50 dark:bg-white/5">
              <CardHeader className="py-4 px-5">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <div className="p-1.5 rounded-full bg-green-500/10">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  {study.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-5 pb-5">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{study.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full">
            <FileCheck className="h-4 w-4 text-primary" />
            <span>Baseado em estudos peer-reviewed</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-full">
            <Award className="h-4 w-4 text-primary" />
            <span>Recomendado por terapeutas</span>
          </div>
        </div>

        <div className="text-center">
          <Button asChild className="group" variant="outline" size="lg">
            <Link to="/scientific">
              Ver Todas as Pesquisas
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
