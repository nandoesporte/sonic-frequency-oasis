
-- Criar tabela para armazenar os áudios das caminhadas do Sentipasso
CREATE TABLE public.sentipasso_audios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  audio_url TEXT,
  script_content TEXT,
  ritual_preparation TEXT NOT NULL,
  activation_phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sentipasso_audios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos os usuários autenticados leiam os áudios
CREATE POLICY "Authenticated users can view sentipasso audios" 
  ON public.sentipasso_audios 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política para permitir que apenas admins insiram/atualizem áudios
CREATE POLICY "Admins can manage sentipasso audios" 
  ON public.sentipasso_audios 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Inserir os dados das caminhadas
INSERT INTO public.sentipasso_audios (walk_id, name, duration_minutes, ritual_preparation, activation_phrase, script_content) VALUES
('liberacao', 'Caminhada da Liberação', 12, 'Deixar os ombros caírem, soltar maxilares, imaginar-se deixando algo para trás.', 'Deixo o que pesa para a terra levar.', 'Bem-vindo à Caminhada da Liberação. Durante os próximos 12 minutos, você vai se conectar com o poder de deixar ir aquilo que não serve mais. Comece deixando seus ombros caírem naturalmente, solte a tensão da mandíbula... Respire profundamente e repita comigo: "Deixo o que pesa para a terra levar." A cada passo, imagine que está deixando algo pesado para trás...'),

('clareza', 'Caminhada da Clareza', 10, 'Caminhar reto, depois em zigue-zague, visualizando clareza.', 'Me movo com clareza e direção, mesmo sem saber tudo.', 'Esta é a Caminhada da Clareza. Por 10 minutos, vamos trabalhar sua capacidade de enxergar com mais nitidez. Comece caminhando em linha reta, sentindo cada passo... Agora, mude para um padrão em zigue-zague, como se estivesse navegando pelos desafios da vida... Repita: "Me movo com clareza e direção, mesmo sem saber tudo."'),

('gratidao', 'Caminhada da Gratidão', 11, 'Agradecer a cada passo algo diferente.', 'Cada passo é um altar para minha história.', 'Bem-vindo à Caminhada da Gratidão. Durante 11 minutos, cada passo será uma oportunidade de reconhecer as bênçãos em sua vida. A cada passo, agradeça por algo diferente... Pode ser algo simples, como o ar que você respira, ou algo complexo, como uma lição aprendida... "Cada passo é um altar para minha história."'),

('raiva', 'Caminhada da Raiva', 13, 'Bater suavemente os pés no chão, respirar forte.', 'Dou voz ao que me atravessa, sem me perder.', 'Esta é a Caminhada da Raiva - um espaço seguro para honrar essa emoção poderosa. Por 13 minutos, você pode expressar sua raiva de forma saudável. Bata suavemente os pés no chão, sinta a conexão com a terra... Respire forte, deixe o ar sair com força... "Dou voz ao que me atravessa, sem me perder."'),

('recomeco', 'Caminhada do Recomeço', 10, 'Observar como se fosse a primeira vez.', 'Tudo começa agora, inclusive eu.', 'Bem-vindo à Caminhada do Recomeço. Nos próximos 10 minutos, você vai redescobrir o mundo com olhos novos. Olhe ao seu redor como se fosse a primeira vez... Observe as cores, as formas, os sons... Sinta-se como uma criança explorando... "Tudo começa agora, inclusive eu."'),

('perdao', 'Caminhada do Perdão', 14, 'Caminhar com a mão sobre o peito, repetir "Eu libero... eu me liberto."', 'Eu mereço a leveza que só o perdão traz.', 'Esta é a Caminhada do Perdão, um dos atos mais corajosos que podemos fazer. Durante 14 minutos, coloque uma mão sobre o peito e sinta seu coração... Repita comigo: "Eu libero... eu me liberto." Perdoar não significa esquecer, significa escolher a paz... "Eu mereço a leveza que só o perdão traz."'),

('encerramento', 'Caminhada do Encerramento', 12, 'Imaginar fechamento de ciclos.', 'Fecho portas com honra, abro espaços com amor.', 'Bem-vindo à Caminhada do Encerramento. Por 12 minutos, vamos honrar aquilo que está terminando em sua vida. Imagine ciclos se fechando, capítulos terminando... Visualize portas se fechando suavemente atrás de você... "Fecho portas com honra, abro espaços com amor."'),

('foco', 'Caminhada do Foco', 9, 'Repetir intenção de foco, evitar distrações.', 'Tudo o que preciso está à minha frente.', 'Esta é a Caminhada do Foco. Durante 9 minutos intensos, você vai treinar sua mente para se concentrar no que realmente importa. Defina sua intenção agora... Mantenha os olhos à frente, evite distrações... "Tudo o que preciso está à minha frente."'),

('abertura', 'Caminhada da Abertura', 11, 'Caminhar com braços abertos e respirar profundamente.', 'Abro-me para o novo com confiança e curiosidade.', 'Bem-vindo à Caminhada da Abertura. Nos próximos 11 minutos, você vai se abrir para as possibilidades infinitas da vida. Abra os braços, respire profundamente... Sinta o espaço ao seu redor se expandindo... "Abro-me para o novo com confiança e curiosidade."');

-- Criar tabela para feedback das caminhadas
CREATE TABLE public.sentipasso_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  walk_id TEXT NOT NULL,
  walk_name TEXT,
  feedback_text TEXT NOT NULL,
  keyword TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sentipasso_feedback ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas seus próprios feedbacks
CREATE POLICY "Users can view their own sentipasso feedback" 
  ON public.sentipasso_feedback 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para que usuários insiram apenas seus próprios feedbacks
CREATE POLICY "Users can create their own sentipasso feedback" 
  ON public.sentipasso_feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para admins verem todos os feedbacks
CREATE POLICY "Admins can view all sentipasso feedback" 
  ON public.sentipasso_feedback 
  FOR SELECT 
  USING (is_admin(auth.uid()));
