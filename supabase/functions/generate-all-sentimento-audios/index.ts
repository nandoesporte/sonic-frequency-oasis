import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced meditation script generator
function generateMeditationScript(sentimento: string, frequencia: number): string {
  const scripts = {
    alegria: `
      Olá, seja bem-vindo à sua caminhada de transformação com o sentimento de alegria. 
      Durante esta caminhada, você irá ouvir uma frequência especial de ${frequencia} Hz que ressoa com a energia da alegria e do bem-estar.
      
      Respire profundamente e comece a caminhar em um ritmo confortável. 
      Sinta a frequência de ${frequencia} Hz permeando todo o seu ser, elevando sua vibração para um estado de alegria pura.
      
      A cada passo, permita que a alegria flua através de você. Sorria gentilmente e sinta a leveza em seu coração.
      A frequência de ${frequencia} Hz está trabalhando em suas células, harmonizando sua energia com a vibração da felicidade.
      
      Continue caminhando, deixando que cada passo seja uma celebração da vida. 
      A alegria é seu estado natural, e com esta frequência sagrada, você está retornando ao seu centro de luz e felicidade.
      
      Permaneça conectado com esta energia enquanto a frequência de ${frequencia} Hz continua a tocar ao fundo, 
      ancorando em você este sentimento maravilhoso de alegria pura e radiante.
    `,
    
    tristeza: `
      Bem-vindo à sua caminhada de cura e transformação com o sentimento de tristeza.
      A frequência de ${frequencia} Hz que você ouvirá agora é uma frequência de cura profunda, 
      projetada para acolher e transformar a tristeza em sabedoria e renovação.
      
      Comece a caminhar devagar, permitindo que cada passo seja um ato de autocompaixão.
      A frequência de ${frequencia} Hz está envolvendo seu coração em uma energia suave e curativa.
      
      É normal sentir tristeza, ela faz parte do processo humano de crescimento.
      Enquanto caminha, permita que a frequência de ${frequencia} Hz transforme esta tristeza em compreensão e aceitação.
      
      Respire profundamente e sinta como a vibração sagrada de ${frequencia} Hz está dissolvendo a dor,
      substituindo-a por uma sensação de paz e renovação interior.
      
      Continue sua caminhada, sabendo que cada passo está te levando para um lugar de maior sabedoria e serenidade.
      A frequência de ${frequencia} Hz continua trabalhando em seu favor, curando e renovando sua energia emocional.
    `,
    
    raiva: `
      Seja bem-vindo à sua caminhada de transformação da raiva em poder pessoal.
      A frequência de ${frequencia} Hz que irá acompanhar você é uma frequência de transmutação,
      transformando a energia da raiva em determinação e força interior.
      
      Comece a caminhar com passos firmes, mas controlados.
      Sinta a frequência de ${frequencia} Hz trabalhando para canalizar sua energia de forma construtiva.
      
      A raiva contém uma energia poderosa que pode ser direcionada para mudanças positivas.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz transforme esta energia em clareza e propósito.
      
      Respire profundamente e sinta como a frequência está equilibrando suas emoções,
      transformando a intensidade da raiva em determinação focada e produtiva.
      
      Continue caminhando, deixando que cada passo libere a tensão e transforme a raiva em energia criativa.
      A frequência de ${frequencia} Hz está trabalhando continuamente para harmonizar suas emoções
      e transformar esta experiência em crescimento pessoal.
    `,
    
    medo: `
      Bem-vindo à sua caminhada de coragem e superação do medo.
      A frequência de ${frequencia} Hz que você ouvirá é uma frequência de proteção e fortalecimento,
      projetada para transformar o medo em coragem e confiança.
      
      Comece a caminhar com passos seguros, mesmo que pequenos no início.
      Sinta a frequência de ${frequencia} Hz criando um campo protetor de energia ao seu redor.
      
      O medo é um sinal que nos convida a crescer além de nossas limitações.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz dissolva as tensões do medo
      e as substitua por uma sensação crescente de segurança interior.
      
      Respire profundamente e sinta como a frequência está fortalecendo sua confiança,
      transformando o medo em sabedoria e a ansiedade em determinação serena.
      
      Continue caminhando, sabendo que cada passo é um ato de coragem.
      A frequência de ${frequencia} Hz continua trabalhando para ancorar em você
      uma nova sensação de segurança e confiança em si mesmo.
    `,
    
    paz: `
      Seja bem-vindo à sua caminhada de paz profunda e serenidade interior.
      A frequência de ${frequencia} Hz que irá te acompanhar é uma frequência de harmonização,
      projetada para alinhar todo o seu ser com a vibração da paz universal.
      
      Comece a caminhar em um ritmo suave e contemplativo.
      Sinta a frequência de ${frequencia} Hz permeando cada célula de seu corpo com tranquilidade.
      
      A paz é seu estado natural de ser, sua essência mais pura.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz dissolva qualquer tensão
      e te reconecte com sua natureza pacífica interior.
      
      Respire profundamente e sinta como a frequência está criando uma sensação de calma profunda,
      como se você estivesse flutuando em um oceano de serenidade e harmonia.
      
      Continue sua caminhada meditativa, deixando que cada passo seja uma oração de gratidão.
      A frequência de ${frequencia} Hz continua irradiando paz através de todo o seu ser,
      ancorando esta sensação sagrada em sua consciência.
    `,
    
    amor: `
      Bem-vindo à sua caminhada de expansão do amor incondicional.
      A frequência de ${frequencia} Hz que você ouvirá é a frequência do coração,
      projetada para abrir e expandir sua capacidade de amar e ser amado.
      
      Comece a caminhar com o coração aberto e receptivo.
      Sinta a frequência de ${frequencia} Hz irradiando do seu coração para todo o seu corpo
      e se expandindo ao seu redor como uma aura de amor puro.
      
      O amor é a força mais poderosa do universo, e você é um canal desta energia divina.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz amplifique o amor em seu coração,
      conectando você com a fonte universal de amor incondicional.
      
      Respire profundamente e sinta como a frequência está expandindo sua capacidade de amar,
      dissolvendo barreiras e abrindo espaços para mais compaixão e conexão.
      
      Continue caminhando como um ser de amor puro, irradiando esta energia a cada passo.
      A frequência de ${frequencia} Hz continua trabalhando para expandir infinitamente
      sua capacidade de dar e receber amor em todas as suas formas.
    `,
    
    ansiedade: `
      Seja bem-vindo à sua caminhada de calma e centralização interior.
      A frequência de ${frequencia} Hz que irá te acompanhar é uma frequência de estabilização,
      projetada para acalmar a mente ansiosa e trazer você de volta ao momento presente.
      
      Comece a caminhar focando em cada passo, cada movimento, cada respiração.
      Sinta a frequência de ${frequencia} Hz criando uma âncora de estabilidade em seu sistema nervoso.
      
      A ansiedade é apenas energia desorganizada que precisa ser canalizada.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz organize esta energia,
      transformando a agitação em presença calma e focada.
      
      Respire profundamente e sinta como a frequência está acalmando sua mente,
      trazendo clareza onde havia confusão e serenidade onde havia agitação.
      
      Continue caminhando com atenção plena, deixando que cada passo te traga mais para o presente.
      A frequência de ${frequencia} Hz continua trabalhando para estabilizar sua energia
      e ancorar você em um estado de calma duradoura e confiança interior.
    `,
    
    neutro: `
      Bem-vindo à sua caminhada de equilíbrio e harmonização energética.
      A frequência de ${frequencia} Hz que você ouvirá é uma frequência de centralização,
      projetada para alinhar e equilibrar todas as suas energias emocionais.
      
      Comece a caminhar em um ritmo equilibrado, nem muito rápido nem muito devagar.
      Sinta a frequência de ${frequencia} Hz criando um estado de neutralidade equilibrada em todo o seu ser.
      
      Este estado neutro é um lugar de poder, onde você pode observar sem reagir,
      onde pode escolher conscientemente como responder às situações da vida.
      Enquanto caminha, permita que a vibração de ${frequencia} Hz fortaleça esta capacidade de equilíbrio.
      
      Respire profundamente e sinta como a frequência está criando uma base sólida de estabilidade emocional,
      um centro calmo a partir do qual você pode navegar qualquer situação com sabedoria.
      
      Continue caminhando como um observador consciente, mantendo seu centro de equilíbrio.
      A frequência de ${frequencia} Hz continua trabalhando para ancorar em você
      esta capacidade de permanecer centrado e equilibrado em todas as circunstâncias.
    `
  };

  return scripts[sentimento as keyof typeof scripts] || scripts.neutro;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action = 'generate_all' } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key não configurada');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all sentiments from database
    const { data: sentimentos, error: fetchError } = await supabase
      .from('sentimento_audios')
      .select('*')
      .order('sentimento');

    if (fetchError) {
      throw fetchError;
    }

    if (!sentimentos || sentimentos.length === 0) {
      throw new Error('Nenhum sentimento encontrado no banco de dados');
    }

    console.log(`Processando ${sentimentos.length} sentimentos...`);

    const results = [];

    for (const sentimento of sentimentos) {
      try {
        console.log(`Gerando áudio para: ${sentimento.sentimento}`);

        // Create enhanced Portuguese meditation script
        const meditationScript = generateMeditationScript(sentimento.sentimento, sentimento.frequencia_hz);

        // Generate audio using OpenAI TTS
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: meditationScript,
            voice: 'nova', // Portuguese-friendly voice
            response_format: 'mp3',
            speed: 0.8 // Slower pace for meditation and frequency integration
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro OpenAI para ${sentimento.sentimento}:`, errorText);
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        // Get audio buffer
        const audioBuffer = await response.arrayBuffer();
        const audioBlob = new Uint8Array(audioBuffer);

        // Upload to Supabase Storage
        const fileName = `${sentimento.sentimento}-openai-${Date.now()}.mp3`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sentimento-audios')
          .upload(fileName, audioBlob, {
            contentType: 'audio/mpeg',
            duplex: 'half'
          });

        if (uploadError) {
          console.error(`Erro no upload para ${sentimento.sentimento}:`, uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('sentimento-audios')
          .getPublicUrl(fileName);

        // Update database with audio URL and enhanced script
        const enhancedScript = generateMeditationScript(sentimento.sentimento, sentimento.frequencia_hz);
        const { error: updateError } = await supabase
          .from('sentimento_audios')
          .update({ 
            audio_url: publicUrl,
            mensagem_texto: enhancedScript,
            updated_at: new Date().toISOString() 
          })
          .eq('id', sentimento.id);

        if (updateError) {
          console.error(`Erro ao atualizar banco para ${sentimento.sentimento}:`, updateError);
          throw updateError;
        }

        console.log(`✅ Áudio gerado com sucesso para: ${sentimento.sentimento}`);
        
        results.push({
          sentimento: sentimento.sentimento,
          audioUrl: publicUrl,
          frequencia: sentimento.frequencia_hz,
          status: 'success'
        });

      } catch (error) {
        console.error(`❌ Erro ao processar ${sentimento.sentimento}:`, error);
        results.push({
          sentimento: sentimento.sentimento,
          error: error.message,
          status: 'error'
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`\n🎯 RESUMO: ${successCount} sucessos, ${errorCount} erros`);

    return new Response(
      JSON.stringify({ 
        message: `Processamento concluído: ${successCount} sucessos, ${errorCount} erros`,
        results,
        summary: {
          total: sentimentos.length,
          success: successCount,
          errors: errorCount
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro geral:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});