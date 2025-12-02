
import { Star, Quote } from "lucide-react";

export function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      quote: "Depois de anos tentando resolver minha ansiedade com remédios, finalmente encontrei algo que funciona de verdade. Em 3 semanas usando as frequências, minha insônia melhorou 80% e consigo passar o dia sem aquela angústia no peito.",
      author: "Marina S.",
      role: "Empresária, 42 anos",
      location: "São Paulo, SP",
      stars: 5
    },
    {
      id: 2,
      quote: "Minhas dores nas costas me impediam de ser a mãe que queria ser. Não conseguia brincar com meus filhos. Depois de 21 dias com o protocolo, voltei a viver. Até meu relacionamento com meu marido melhorou!",
      author: "Claudia M.",
      role: "Advogada, 38 anos",
      location: "Curitiba, PR",
      stars: 5
    },
    {
      id: 3,
      quote: "Estava cética no início - já tinha gastado fortunas com terapias que não funcionavam. Mas resolvi dar uma chance pelo teste grátis. Hoje, 2 meses depois, minha vida mudou completamente. Durmo melhor, trabalho melhor, amo melhor.",
      author: "Patricia R.",
      role: "Psicóloga, 45 anos",
      location: "Rio de Janeiro, RJ",
      stars: 5
    },
    {
      id: 4,
      quote: "A menopausa estava destruindo minha qualidade de vida. Ondas de calor, irritabilidade, enxaquecas constantes. As frequências me devolveram o equilíbrio que eu achei que nunca mais teria. Recomendo para todas as mulheres!",
      author: "Regina L.",
      role: "Empresária, 52 anos",
      location: "Belo Horizonte, MG",
      stars: 5
    },
    {
      id: 5,
      quote: "Meu terapeuta holístico me indicou e foi a melhor decisão. Uso as frequências diariamente na minha rotina de meditação e os resultados são impressionantes. Minha autoestima voltou e me sinto conectada comigo mesma novamente.",
      author: "Fernanda T.",
      role: "Coach de Vida, 40 anos",
      location: "Porto Alegre, RS",
      stars: 5
    },
    {
      id: 6,
      quote: "Após um divórcio difícil, estava destruída emocionalmente. As frequências me ajudaram a processar a dor e encontrar paz interior. Hoje estou em um novo relacionamento saudável e feliz. Gratidão eterna!",
      author: "Luciana A.",
      role: "Arquiteta, 44 anos",
      location: "Brasília, DF",
      stars: 5
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-2 sm:px-4 bg-gradient-to-b from-purple-50/10 to-background dark:from-purple-900/5 dark:to-background">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Histórias Reais de <span className="text-primary">Transformação</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Milhares de mulheres já transformaram suas vidas. Veja o que elas dizem:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="p-6 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-primary/5 hover-scale relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <div className="flex mb-3">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="border-t border-border/50 pt-4">
                <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground text-sm">
            * Resultados podem variar. Depoimentos reais de usuárias do aplicativo.
          </p>
        </div>
      </div>
    </section>
  );
}
