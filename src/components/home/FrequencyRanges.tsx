
import { Waves, Speaker, HeartPulse, Music } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FrequencyRanges() {
  const ranges = [
    {
      id: 1,
      icon: HeartPulse,
      title: "1-50 Hz",
      description: "Controle de humor, sono, dor e regeneração emocional através de batidas binaurais.",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: 2,
      icon: Speaker,
      title: "100-1000 Hz",
      description: "Efeitos profundos na estrutura energética e psicoemocional.",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 3,
      icon: Music,
      title: "174-963 Hz",
      description: "Escala Solfeggio para meditações e terapias vibracionais.",
      color: "from-pink-500/20 to-orange-500/20"
    },
    {
      id: 4,
      icon: Waves,
      title: "+1000 Hz",
      description: "Áudio de estimulação energética e terapia vibracional experimental.",
      color: "from-orange-500/20 to-yellow-500/20"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Faixas de <span className="text-primary">Frequência</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada faixa de frequência tem benefícios específicos para seu bem-estar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ranges.map((range) => {
            const Icon = range.icon;
            return (
              <Card 
                key={range.id} 
                className="hover-scale overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${range.color} opacity-10`} />
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
