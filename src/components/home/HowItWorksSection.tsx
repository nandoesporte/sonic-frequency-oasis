
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Escolha a Frequência",
      description: "Selecione entre mais de 200 frequências organizadas por objetivo, condição ou efeito desejado."
    },
    {
      number: "02",
      title: "Integre na sua Sessão",
      description: "Reproduza durante suas sessões de terapia, coaching, meditação ou qualquer outra prática."
    },
    {
      number: "03",
      title: "Observe os Resultados",
      description: "Veja como seus clientes respondem positivamente, aumentando a eficácia de suas sessões."
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-accent/5">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Como Funciona
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Processo simples para transformar sua prática profissional
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
              Experimente Gratuitamente por 7 Dias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Sem necessidade de cartão de crédito. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
}
