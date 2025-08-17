
import { Waves, Speaker, HeartPulse, Music } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FrequencyRanges() {
  const ranges = [
    {
      id: 1,
      icon: HeartPulse,
      title: "1-40 Hz",
      description: "Ondas cerebrais para sono profundo, regeneração celular, relaxamento e foco.",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: 2,
      icon: Speaker,
      title: "40-174 Hz",
      description: "Frequências para dor, função imunológica e modulação de humor.",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 3,
      icon: Music,
      title: "174-963 Hz",
      description: "Escala Solfeggio completa para harmonização física, emocional e espiritual.",
      color: "from-pink-500/20 to-orange-500/20"
    },
    {
      id: 4,
      icon: Waves,
      title: "+1000 Hz",
      description: "Frequências avançadas para regeneração profunda e harmonização energética.",
      color: "from-orange-500/20 to-yellow-500/20"
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-background to-purple-50/10">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Faixas de <span className="text-primary">Frequência</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Cada faixa de frequência tem benefícios específicos comprovados cientificamente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ranges.map((range) => {
            const Icon = range.icon;
            return (
              <Card 
                key={range.id} 
                className="hover-scale overflow-hidden relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${range.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{range.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{range.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
