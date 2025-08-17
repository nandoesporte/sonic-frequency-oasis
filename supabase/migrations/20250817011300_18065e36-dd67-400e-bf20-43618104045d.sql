-- Criar frequências baseadas nos sentimentos para integrar ao sistema principal
INSERT INTO public.frequencies (name, hz, purpose, description, category, is_premium) VALUES
('Sentimento: Alegria - Transformação', 528, 'Irradiar alegria e transformação através da frequência do amor', 'Você está irradiando alegria. Essa frequência de 528Hz é conhecida como a frequência do amor e da transformação. Deixe essa vibração positiva fluir através de você e se espalhar ao seu redor.', 'healing', true),
('Sentimento: Tristeza - Liberação', 396, 'Transformar tristeza em energia liberadora', 'Percebo que você está passando por um momento de tristeza. A frequência de 396Hz ajuda na liberação do medo e na transformação de energias negativas. Permita-se sentir, mas saiba que isso também passará.', 'healing', true),
('Sentimento: Raiva - Expressão Saudável', 741, 'Canalizar raiva de forma construtiva', 'Sinto que há raiva em você. A frequência de 741Hz promove a limpeza e a expressão saudável de emoções. Use essa energia para criar mudanças positivas em sua vida.', 'healing', true),
('Sentimento: Medo - Coragem', 417, 'Transformar medo em coragem e mudança', 'O medo está presente, mas você não está sozinho. A frequência de 417Hz facilita a mudança e desfaz situações negativas. Respire profundamente e confie na sua capacidade de superar desafios.', 'healing', true),
('Sentimento: Paz - Equilíbrio Espiritual', 852, 'Despertar intuição e encontrar paz interior', 'Que bela energia de paz você está emanando. A frequência de 852Hz desperta a intuição e ajuda no retorno ao equilíbrio espiritual. Aproveite esse momento de serenidade.', 'healing', true),
('Sentimento: Amor - Harmonização', 639, 'Harmonizar relacionamentos através do amor', 'O amor flui através de você. A frequência de 639Hz harmoniza relacionamentos e promove comunicação, compreensão e tolerância. Compartilhe essa energia amorosa com o mundo.', 'healing', true),
('Sentimento: Ansiedade - Tranquilidade', 174, 'Acalmar ansiedade com frequência natural', 'Percebo sua ansiedade, mas você pode encontrar calma. A frequência de 174Hz é conhecida como um anestésico natural que remove a dor. Deixe essa vibração te tranquilizar.', 'healing', true),
('Sentimento: Neutro - Harmonia Universal', 432, 'Equilibrar energia com a frequência universal', 'Você está em um estado equilibrado. A frequência de 432Hz é considerada a frequência natural do universo, promovendo harmonia e bem-estar geral.', 'healing', true);

-- Criar uma função para sincronizar áudios com frequências
CREATE OR REPLACE FUNCTION sync_sentimento_frequencies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    sentimento_rec RECORD;
    freq_rec RECORD;
BEGIN
    -- Para cada sentimento com áudio
    FOR sentimento_rec IN 
        SELECT * FROM sentimento_audios WHERE audio_url IS NOT NULL AND audio_url != ''
    LOOP
        -- Encontrar a frequência correspondente
        SELECT * INTO freq_rec 
        FROM frequencies 
        WHERE hz = sentimento_rec.frequencia_hz 
        AND name LIKE 'Sentimento: %'
        LIMIT 1;
        
        IF FOUND THEN
            -- Atualizar a frequência com URL do áudio
            UPDATE frequencies 
            SET description = sentimento_rec.mensagem_texto,
                updated_at = now()
            WHERE id = freq_rec.id;
            
            RAISE NOTICE 'Sincronizado: % (%.0fHz)', sentimento_rec.sentimento, sentimento_rec.frequencia_hz;
        END IF;
    END LOOP;
END;
$$;