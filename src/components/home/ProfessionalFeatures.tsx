
import { Heart, Brain, Moon, Sparkles, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfessionalFeatures() {
  const features = [
    {
      id: 1,
      icon: Heart,
      title: "Ansiedade e Estresse",
      description: "Elimine a angústia no peito, o coração acelerado e aquela sensação constante de preocupação. Frequências específicas que acalmam seu sistema nervoso de forma natural."
    },
    {
      id: 2,
      icon: Sparkles,
      title: "Dores Crônicas",
      description: "Alívio real para dores nas costas, enxaquecas e tensões musculares. Sem medicamentos, sem efeitos colaterais. Apenas ondas sonoras que restauram o equilíbrio do seu corpo."
    },
    {
      id: 3,
      icon: Moon,
      title: "Sono Reparador",
      description: "Durma profundamente e acorde renovada. Frequências que regulam seus ciclos de sono e acabam com a insônia que te persegue há anos."
    },
    {
      id: 4,
      icon: Brain,
      title: "Equilíbrio Emocional",
      description: "Liberte-se das oscilações de humor, irritabilidade e sobrecarga mental. Encontre a paz interior que você merece e melhore todos os seus relacionamentos."
    },
    {
      id: 5,
      icon: Shield,
      title: "Sem Efeitos Colaterais",
      description: "Diferente de medicamentos que causam dependência, as frequências sonoras são 100% naturais e seguras. Aprovadas por especialistas em medicina integrativa."
    },
    {
      id: 6,
      icon: Clock,
      title: "Resultados em 21 Dias",
      description: "Nossa Sequência de Harmonização Celular foi desenvolvida para transformar sua vida em apenas 3 semanas. Milhares de mulheres já comprovaram."
    }
  ];

  return (
    <section className="py-10 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-background to-purple-50/10 dark:from-background dark:to-purple-900/5">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Diga Adeus ao <span className="text-primary">Ciclo de Sofrimento</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
            Você já tentou médicos, terapeutas e medicamentos sem resultados duradouros. 
            A verdade é que eles nunca abordam a raiz do problema. Nossas frequências atuam diretamente 
            na vibração das suas células, promovendo cura real e definitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="hover:bg-accent/5 transition-colors hover-scale border-primary/10 bg-white/50 dark:bg-white/5"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Objection Handler */}
        <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xl font-bold text-center mb-4">
            "Mas será que isso realmente funciona?"
          </h3>
          <p className="text-muted-foreground text-center mb-4">
            Entendemos sua dúvida. Você já gastou tempo e dinheiro com soluções que prometeram e não entregaram. 
            Por isso oferecemos <strong className="text-foreground">30 dias de teste grátis</strong> - 
            você experimenta primeiro, sem risco, e só continua se realmente funcionar para você.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full">✓ Aprovado por especialistas</span>
            <span className="bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full">✓ +5.000 mulheres satisfeitas</span>
            <span className="bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full">✓ Garantia total</span>
          </div>
        </div>
      </div>
    </section>
  );
}
