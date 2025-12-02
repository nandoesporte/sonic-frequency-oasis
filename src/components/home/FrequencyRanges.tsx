import { Waves, Speaker, HeartPulse, Music } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FrequencyRanges() {
  const ranges = [
    {
      id: 1,
      icon: HeartPulse,
      title: "1-40 Hz",
      subtitle: "Ondas Cerebrais",
      description: "Sono profundo, regeneração celular, relaxamento e foco mental intenso.",
      color: "blue"
    },
    {
      id: 2,
      icon: Speaker,
      title: "40-174 Hz",
      subtitle: "Frequências Terapêuticas",
      description: "Alívio de dor, função imunológica e equilíbrio do humor.",
      color: "purple"
    },
    {
      id: 3,
      icon: Music,
      title: "174-963 Hz",
      subtitle: "Escala Solfeggio",
      description: "Harmonização física, emocional e espiritual completa.",
      color: "pink"
    },
    {
      id: 4,
      icon: Waves,
      title: "+1000 Hz",
      subtitle: "Frequências Avançadas",
      description: "Regeneração profunda e harmonização energética de alto nível.",
      color: "amber"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string; gradient: string }> = {
      blue: { bg: "bg-blue-100 dark:bg-blue-900/30", icon: "text-blue-500", border: "border-blue-200 dark:border-blue-800/30", gradient: "from-blue-500/10 to-blue-600/5" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-500", border: "border-purple-200 dark:border-purple-800/30", gradient: "from-purple-500/10 to-purple-600/5" },
      pink: { bg: "bg-pink-100 dark:bg-pink-900/30", icon: "text-pink-500", border: "border-pink-200 dark:border-pink-800/30", gradient: "from-pink-500/10 to-pink-600/5" },
      amber: { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-500", border: "border-amber-200 dark:border-amber-800/30", gradient: "from-amber-500/10 to-amber-600/5" },
    };
    return colors[color] || colors.purple;
  };

  return (
    <section className="py-16 sm:py-24 px-2 sm:px-4 relative overflow-hidden sales-section">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-50/10 to-background dark:from-background dark:via-purple-900/5 dark:to-background pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
            Faixas de <span className="gradient-text-animated">Frequência</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
            Cada faixa de frequência tem benefícios específicos comprovados cientificamente para diferentes necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {ranges.map((range, index) => {
            const Icon = range.icon;
            const colorClasses = getColorClasses(range.color);
            return (
              <Card 
                key={range.id} 
                className={`card-smooth overflow-hidden relative group bg-white/60 dark:bg-white/5 backdrop-blur-sm ${colorClasses.border}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="relative z-10">
                  <div className={`p-3 rounded-xl ${colorClasses.bg} w-fit mb-3`}>
                    <Icon className={`h-8 w-8 ${colorClasses.icon}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{range.title}</CardTitle>
                  <p className={`text-sm font-medium ${colorClasses.icon}`}>{range.subtitle}</p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground leading-relaxed">{range.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
