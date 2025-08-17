
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Escolha sua Intenção",
      description: "Selecione entre relaxamento, foco, cura emocional, energia ou experimente os SentiPassos para caminhar e curar."
    },
    {
      number: "02",
      title: "Encontre seu Momento",
      description: "Use durante meditação, trabalho, exercícios, caminhadas ou simplesmente para relaxar em casa."
    },
    {
      number: "03",
      title: "Sinta a Transformação",
      description: "Permita que as frequências trabalhem naturalmente, trazendo equilíbrio e bem-estar para sua vida."
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Como Começar
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Três passos simples para transformar seu bem-estar com frequências sonoras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(100%-0.5rem)] w-[calc(100%-2.5rem)] h-[2px] bg-primary/20">
                  <ArrowRight className="text-primary/40 absolute right-[-12px] top-[-9px]" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90">
            <Link to="/auth">
              Comece sua Jornada - 7 dias Grátis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Acesso completo por 7 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}
