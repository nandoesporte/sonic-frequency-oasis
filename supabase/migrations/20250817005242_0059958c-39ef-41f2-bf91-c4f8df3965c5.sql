-- Criar tabela para armazenar áudios dos sentimentos
CREATE TABLE public.sentimento_audios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sentimento TEXT NOT NULL UNIQUE,
  frequencia_hz NUMERIC NOT NULL,
  audio_url TEXT NOT NULL,
  mensagem_texto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.sentimento_audios ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública (todos podem ver os áudios)
CREATE POLICY "Todos podem ver sentimento_audios" 
ON public.sentimento_audios 
FOR SELECT 
USING (true);

-- Política para que apenas admins possam inserir/atualizar
CREATE POLICY "Apenas admins podem gerenciar sentimento_audios" 
ON public.sentimento_audios 
FOR ALL 
USING (is_admin(auth.uid()));

-- Criar bucket para armazenar áudios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sentimento-audios', 'sentimento-audios', true);

-- Políticas para o bucket de áudios
CREATE POLICY "Todos podem ver áudios de sentimentos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'sentimento-audios');

CREATE POLICY "Apenas sistema pode criar áudios de sentimentos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'sentimento-audios' AND auth.role() = 'service_role');

-- Inserir dados iniciais dos sentimentos com suas frequências
INSERT INTO public.sentimento_audios (sentimento, frequencia_hz, audio_url, mensagem_texto) VALUES
('alegria', 528, '', 'Você está irradiando alegria. Essa frequência de 528Hz é conhecida como a frequência do amor e da transformação. Deixe essa vibração positiva fluir através de você e se espalhar ao seu redor.'),
('tristeza', 396, '', 'Percebo que você está passando por um momento de tristeza. A frequência de 396Hz ajuda na liberação do medo e na transformação de energias negativas. Permita-se sentir, mas saiba que isso também passará.'),
('raiva', 741, '', 'Sinto que há raiva em você. A frequência de 741Hz promove a limpeza e a expressão saudável de emoções. Use essa energia para criar mudanças positivas em sua vida.'),
('medo', 417, '', 'O medo está presente, mas você não está sozinho. A frequência de 417Hz facilita a mudança e desfaz situações negativas. Respire profundamente e confie na sua capacidade de superar desafios.'),
('paz', 852, '', 'Que bela energia de paz você está emanando. A frequência de 852Hz desperta a intuição e ajuda no retorno ao equilíbrio espiritual. Aproveite esse momento de serenidade.'),
('amor', 639, '', 'O amor flui através de você. A frequência de 639Hz harmoniza relacionamentos e promove comunicação, compreensão e tolerância. Compartilhe essa energia amorosa com o mundo.'),
('ansiedade', 174, '', 'Percebo sua ansiedade, mas você pode encontrar calma. A frequência de 174Hz é conhecida como um anestésico natural que remove a dor. Deixe essa vibração te tranquilizar.'),
('neutro', 432, '', 'Você está em um estado equilibrado. A frequência de 432Hz é considerada a frequência natural do universo, promovendo harmonia e bem-estar geral.');