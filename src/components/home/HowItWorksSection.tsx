import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Waves, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Headphones,
      title: "Escolha Sua Necessidade",
      description: "Ansiedade? Dores? Insônia? Relacionamentos? Selecione o que deseja transformar e nosso protocolo inteligente sugere as frequências ideais para você."
    },
    {
      number: "02",
      icon: Waves,
      title: "Ouça por 15-30 Minutos",
      description: "Use fones de ouvido ou alto-falante. As ondas sonoras penetram suas células, recalibrando sua frequência vibracional para um estado de harmonia e equilíbrio."
    },
    {
      number: "03",
      icon: Heart,
      title: "Sinta a Transformação",
      description: "Em 21 dias, seu corpo e mente estarão completamente realinhados. Dores diminuem, ansiedade se dissolve, relacionamentos florescem."
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-2 sm:px-4 bg-gradient-to-b from-background to-purple-50/20 dark:from-background dark:to-purple-900/10">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Como Funciona o <span className="text-primary">Protocolo 7D</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Simples, natural e sem complicação. Em apenas 3 passos, você inicia sua jornada de transformação.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10"></div>
                )}
                
                <div className="flex flex-col items-center text-center bg-white/50 dark:bg-white/5 p-6 rounded-2xl hover-scale">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Diferencial */}
        <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-xl border border-amber-500/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">Por que é diferente de tudo que você já tentou?</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Enquanto medicamentos mascaram sintomas e terapias tradicionais levam anos, 
            nossas frequências atuam diretamente na <strong className="text-foreground">raiz do problema</strong> - 
            a frequência vibracional das suas células. É ciência, não magia.
          </p>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg shadow-primary/25">
            <Link to="/auth" className="gap-2">
              Quero Começar Minha Transformação
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            30 dias grátis • Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}
