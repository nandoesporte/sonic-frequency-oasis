import { Heart, Brain, Moon, Sparkles, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfessionalFeatures() {
  const features = [
    {
      id: 1,
      icon: Heart,
      color: "rose",
      title: "Ansiedade e Estresse",
      description: "Elimine a angústia no peito, o coração acelerado e aquela sensação constante de preocupação. Frequências específicas que acalmam seu sistema nervoso de forma natural."
    },
    {
      id: 2,
      icon: Sparkles,
      color: "amber",
      title: "Dores Crônicas",
      description: "Alívio real para dores nas costas, enxaquecas e tensões musculares. Sem medicamentos, sem efeitos colaterais. Apenas ondas sonoras que restauram o equilíbrio do seu corpo."
    },
    {
      id: 3,
      icon: Moon,
      color: "blue",
      title: "Sono Reparador",
      description: "Durma profundamente e acorde renovada. Frequências que regulam seus ciclos de sono e acabam com a insônia que te persegue há anos."
    },
    {
      id: 4,
      icon: Brain,
      color: "purple",
      title: "Equilíbrio Emocional",
      description: "Liberte-se das oscilações de humor, irritabilidade e sobrecarga mental. Encontre a paz interior que você merece e melhore todos os seus relacionamentos."
    },
    {
      id: 5,
      icon: Shield,
      color: "green",
      title: "Sem Efeitos Colaterais",
      description: "Diferente de medicamentos que causam dependência, as frequências sonoras são 100% naturais e seguras. Aprovadas por especialistas em medicina integrativa."
    },
    {
      id: 6,
      icon: Clock,
      color: "orange",
      title: "Resultados em 21 Dias",
      description: "Nossa Sequência de Harmonização Celular foi desenvolvida para transformar sua vida em apenas 3 semanas. Milhares de mulheres já comprovaram."
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string }> = {
      rose: { bg: "bg-rose-100 dark:bg-rose-900/30", icon: "text-rose-500", border: "border-rose-100 dark:border-rose-900/20" },
      amber: { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-500", border: "border-amber-100 dark:border-amber-900/20" },
      blue: { bg: "bg-blue-100 dark:bg-blue-900/30", icon: "text-blue-500", border: "border-blue-100 dark:border-blue-900/20" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-500", border: "border-purple-100 dark:border-purple-900/20" },
      green: { bg: "bg-green-100 dark:bg-green-900/30", icon: "text-green-500", border: "border-green-100 dark:border-green-900/20" },
      orange: { bg: "bg-orange-100 dark:bg-orange-900/30", icon: "text-orange-500", border: "border-orange-100 dark:border-orange-900/20" },
    };
    return colors[color] || colors.purple;
  };

  return (
    <section className="py-16 sm:py-24 px-2 sm:px-4 relative overflow-hidden sales-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-50/20 to-background dark:from-background dark:via-purple-900/10 dark:to-background pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
            Diga Adeus ao <span className="gradient-text-animated">Ciclo de Sofrimento</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-2 leading-relaxed">
            Você já tentou médicos, terapeutas e medicamentos sem resultados duradouros. 
            A verdade é que eles nunca abordam a raiz do problema. Nossas frequências atuam diretamente 
            na vibração das suas células, promovendo cura real e definitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = getColorClasses(feature.color);
            return (
              <Card 
                key={feature.id} 
                className={`card-smooth border ${colorClasses.border} bg-white/60 dark:bg-white/5 backdrop-blur-sm`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${colorClasses.bg}`}>
                      <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
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
        <div className="mt-14 max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 p-8 rounded-2xl border border-purple-500/20 card-smooth backdrop-blur-sm">
          <h3 className="text-xl font-bold text-center mb-4">
            "Mas será que isso realmente funciona?"
          </h3>
          <p className="text-muted-foreground text-center mb-6 leading-relaxed">
            Entendemos sua dúvida. Você já gastou tempo e dinheiro com soluções que prometeram e não entregaram. 
            Por isso oferecemos <strong className="text-foreground">30 dias de teste grátis</strong> - 
            você experimenta primeiro, sem risco, e só continua se realmente funcionar para você.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white/60 dark:bg-white/10 px-4 py-2 rounded-full font-medium">✓ Aprovado por especialistas</span>
            <span className="bg-white/60 dark:bg-white/10 px-4 py-2 rounded-full font-medium">✓ +5.000 mulheres satisfeitas</span>
            <span className="bg-white/60 dark:bg-white/10 px-4 py-2 rounded-full font-medium">✓ Garantia total</span>
          </div>
        </div>
      </div>
    </section>
  );
}
