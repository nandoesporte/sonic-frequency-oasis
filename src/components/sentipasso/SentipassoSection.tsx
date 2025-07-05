
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Heart } from "lucide-react";
import { FeedbackDialog } from './FeedbackDialog';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface RitualWalk {
  id: string;
  name: string;
  duration: string;
  ritual: string;
  phrase: string;
  audioUrl?: string;
}

const ritualWalks: RitualWalk[] = [
  {
    id: 'liberacao',
    name: 'Caminhada da Liberação',
    duration: '12 min',
    ritual: 'Deixar os ombros caírem, soltar maxilares, imaginar-se deixando algo para trás.',
    phrase: 'Deixo o que pesa para a terra levar.',
  },
  {
    id: 'clareza',
    name: 'Caminhada da Clareza',
    duration: '10 min',
    ritual: 'Caminhar reto, depois em zigue-zague, visualizando clareza.',
    phrase: 'Me movo com clareza e direção, mesmo sem saber tudo.',
  },
  {
    id: 'gratidao',
    name: 'Caminhada da Gratidão',
    duration: '11 min',
    ritual: 'Agradecer a cada passo algo diferente.',
    phrase: 'Cada passo é um altar para minha história.',
  },
  {
    id: 'raiva',
    name: 'Caminhada da Raiva',
    duration: '13 min',
    ritual: 'Bater suavemente os pés no chão, respirar forte.',
    phrase: 'Dou voz ao que me atravessa, sem me perder.',
  },
  {
    id: 'recomeco',
    name: 'Caminhada do Recomeço',
    duration: '10 min',
    ritual: 'Observar como se fosse a primeira vez.',
    phrase: 'Tudo começa agora, inclusive eu.',
  },
  {
    id: 'perdao',
    name: 'Caminhada do Perdão',
    duration: '14 min',
    ritual: 'Caminhar com a mão sobre o peito, repetir "Eu libero... eu me liberto."',
    phrase: 'Eu mereço a leveza que só o perdão traz.',
  },
  {
    id: 'encerramento',
    name: 'Caminhada do Encerramento',
    duration: '12 min',
    ritual: 'Imaginar fechamento de ciclos.',
    phrase: 'Fecho portas com honra, abro espaços com amor.',
  },
  {
    id: 'foco',
    name: 'Caminhada do Foco',
    duration: '9 min',
    ritual: 'Repetir intenção de foco, evitar distrações.',
    phrase: 'Tudo o que preciso está à minha frente.',
  },
  {
    id: 'abertura',
    name: 'Caminhada da Abertura',
    duration: '11 min',
    ritual: 'Caminhar com braços abertos e respirar profundamente.',
    phrase: 'Abro-me para o novo com confiança e curiosidade.',
  },
];

export function SentipassoSection() {
  const { user } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedWalk, setSelectedWalk] = useState<RitualWalk | null>(null);

  const handlePlayWalk = (walk: RitualWalk) => {
    if (!user) {
      toast.info("Faça login para continuar", {
        description: "É necessário estar logado para acessar as caminhadas rituais"
      });
      return;
    }

    setSelectedWalk(walk);
    // Here you would integrate with your audio player
    toast.success(`Iniciando: ${walk.name}`, {
      description: "Prepare-se para sua caminhada ritual"
    });
  };

  const handleFeedback = () => {
    if (!user) {
      toast.info("Faça login para continuar", {
        description: "É necessário estar logado para enviar feedback"
      });
      return;
    }
    setFeedbackOpen(true);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-purple-50/30 to-background dark:from-purple-900/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Heart className="h-4 w-4 mr-2 text-purple-500" />
            Novo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sentipasso – Caminhadas Rituais com Emoção
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme sua caminhada em um ritual de cura e autoconhecimento. 
            Cada trilha foi criada para trabalhar uma emoção específica através do movimento consciente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {ritualWalks.map((walk) => (
            <Card key={walk.id} className="group hover:shadow-lg transition-all duration-300 border-purple-100 dark:border-purple-800/30">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {walk.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {walk.duration}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2">
                    Ritual de Preparação:
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {walk.ritual}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium text-sm text-purple-700 dark:text-purple-300 mb-1">
                    Frase de Ativação:
                  </h4>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200 italic">
                    "{walk.phrase}"
                  </p>
                </div>

                <Button 
                  onClick={() => handlePlayWalk(walk)}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Ouvir e Caminhar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={handleFeedback}
            variant="outline" 
            size="lg"
            className="bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Heart className="h-4 w-4 mr-2" />
            Enviar como me senti
          </Button>
        </div>

        <FeedbackDialog 
          open={feedbackOpen} 
          onOpenChange={setFeedbackOpen}
          selectedWalk={selectedWalk?.name}
        />
      </div>
    </section>
  );
}
