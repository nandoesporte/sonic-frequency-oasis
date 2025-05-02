
import { Check, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export function ScientificEvidence() {
  const isMobile = useIsMobile();
  
  const studies = [
    {
      id: 1,
      title: "Batidas Binaurais",
      description: "Pesquisas por Padmanabhan et al. (2005) e Garcia-Argibay (2019) comprovam os efeitos.",
    },
    {
      id: 2,
      title: "Ondas Schumann",
      description: "Estudos por Cherry (2002) sobre as ressonâncias naturais da Terra.",
    },
    {
      id: 3,
      title: "Frequência 40 Hz",
      description: "Pesquisas do MIT (2016) sobre benefícios em pacientes com Alzheimer.",
    },
    {
      id: 4,
      title: "Frequências Solfeggio",
      description: "Trabalhos históricos sobre ressonância harmônica e cura vibracional.",
    }
  ];

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-900/10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Base <span className="text-primary">Científica</span>
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Nossa plataforma é fundamentada em pesquisas científicas e estudos comprovados
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {studies.map((study) => (
            <Card key={study.id} className="hover:bg-accent/5 transition-colors">
              <CardHeader className="py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Check className="h-4 w-4 text-primary" />
                  {study.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 pb-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{study.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="group" variant="outline" size="default">
            <Link to="/scientific">
              Veja Mais Evidências Científicas
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
