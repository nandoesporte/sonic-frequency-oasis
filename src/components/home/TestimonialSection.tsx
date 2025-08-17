
import { Star } from "lucide-react";

export function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      quote: "Incorporar as frequências nas minhas sessões de terapia elevou completamente a experiência dos meus clientes. Eles relatam um relaxamento mais profundo e resultados mais duradouros.",
      author: "Dra. Marina Silva",
      role: "Terapeuta Holística",
      stars: 5
    },
    {
      id: 2,
      quote: "Como coach de bem-estar, sempre busco ferramentas que possam potencializar os resultados. As frequências terapêuticas se tornaram essenciais no meu trabalho com clientes.",
      author: "Ricardo Almeida",
      role: "Coach de Bem-estar",
      stars: 5
    },
    {
      id: 3,
      quote: "Nas minhas aulas de meditação em grupo, as frequências criaram uma atmosfera completamente diferente. Meus alunos conseguem atingir estados meditativos mais profundos muito mais rapidamente.",
      author: "Juliana Torres",
      role: "Instrutora de Meditação",
      stars: 5
    }
  ];

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-purple-50/10 to-background dark:from-purple-900/5 dark:to-background">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            O que dizem os <span className="text-primary">Profissionais</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            Experiências reais de terapeutas e facilitadores que transformaram sua prática
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="p-6 rounded-xl bg-white dark:bg-white/5 shadow-sm border border-primary/5 hover-scale"
            >
              <div className="flex mb-3">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <h4 className="font-semibold">{testimonial.author}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
