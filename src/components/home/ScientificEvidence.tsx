import { Check, ChevronRight, Award, FileCheck, Beaker } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ScientificEvidence() {
  const studies = [
    {
      id: 1,
      title: "Redução de Ansiedade",
      stat: "26%",
      description: "Estudos por Garcia-Argibay (2019) comprovam redução significativa nos níveis de ansiedade com batidas binaurais.",
    },
    {
      id: 2,
      title: "Alívio de Dores",
      stat: "45%",
      description: "Pesquisas do Journal of Pain Research demonstram eficácia no tratamento de dores crônicas sem medicamentos.",
    },
    {
      id: 3,
      title: "Qualidade do Sono",
      stat: "65%",
      description: "Estudos clínicos mostram melhora significativa na qualidade do sono em participantes usando frequências específicas.",
    },
    {
      id: 4,
      title: "Equilíbrio Hormonal",
      stat: "38%",
      description: "Pesquisas indicam normalização de cortisol e melhora nos sintomas da menopausa com terapia sonora.",
    }
  ];

  return (
    <section className="py-16 sm:py-24 px-2 sm:px-4 relative overflow-hidden sales-section">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 to-background dark:from-purple-900/10 dark:to-background pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Aprovado por Especialistas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Comprovação <span className="gradient-text-animated">Científica</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Não é magia, é ciência. Nossas frequências são baseadas em décadas de pesquisas 
            em neurociência e medicina integrativa.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
          {studies.map((study, index) => (
            <Card 
              key={study.id} 
              className="card-smooth bg-white/60 dark:bg-white/5 backdrop-blur-sm border-green-100 dark:border-green-900/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                  </div>
                  <span className="text-2xl font-bold text-primary">{study.stat}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{study.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-white/5 px-5 py-3 rounded-full border border-border/50 card-smooth">
            <FileCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Baseado em estudos peer-reviewed</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-white/5 px-5 py-3 rounded-full border border-border/50 card-smooth">
            <Beaker className="h-5 w-5 text-primary" />
            <span className="font-medium">Testado cientificamente</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-white/5 px-5 py-3 rounded-full border border-border/50 card-smooth">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-medium">Recomendado por terapeutas</span>
          </div>
        </div>

        <div className="text-center">
          <Button asChild className="group rounded-full transition-all duration-300 hover:scale-105" variant="outline" size="lg">
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
