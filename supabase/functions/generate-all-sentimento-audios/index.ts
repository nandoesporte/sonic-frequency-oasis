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
      Meu nome é Sofia, e eu serei sua guia nesta jornada especial de autoconhecimento e cura.
      
      Durante esta caminhada sagrada, você irá ouvir uma frequência especial de ${frequencia} Hz que ressoa harmoniosamente com a energia da alegria e do bem-estar profundo.
      
      Primeiro, respire profundamente três vezes. Inspire pelo nariz... e expire pela boca, soltando qualquer tensão. 
      Agora, comece a caminhar em um ritmo confortável que ressoe com seu coração.
      
      Sinta a frequência de ${frequencia} Hz permeando suavemente todo o seu ser, como ondas douradas de luz que elevam sua vibração para um estado de alegria pura e radiante.
      
      A cada passo que você dá, permita que a alegria flua naturalmente através de você. 
      Sorria gentilmente e sinta a leveza crescendo em seu coração. Esta é sua essência natural.
      
      A frequência sagrada de ${frequencia} Hz está trabalhando agora em suas células, harmonizando toda sua energia com a vibração mais elevada da felicidade genuína.
      
      Continue caminhando com consciência plena, deixando que cada passo seja uma celebração da vida e de sua capacidade infinita de sentir alegria.
      
      Quando esta meditação terminar, a frequência de ${frequencia} Hz continuará tocando suavemente ao fundo, ancorando em você este sentimento maravilhoso de alegria pura e radiante durante toda sua caminhada.
      
      Permaneça conectada com esta energia luminosa. Você é alegria. Você é luz. Você é vida em movimento.
    `,
    
    tristeza: `
      Seja muito bem-vinda à sua caminhada de cura e transformação com o sentimento de tristeza.
      Eu sou Sofia, e estarei aqui para guiá-la com muito carinho e compaixão neste momento.
      
      A frequência de ${frequencia} Hz que você ouvirá em seguida é uma frequência de cura profunda e acolhedora, 
      especialmente criada para abraçar e transformar a tristeza em sabedoria e renovação interior.
      
      Respire profundamente e permita-se sentir. A tristeza é uma emoção sagrada que nos conecta com nossa humanidade.
      Comece a caminhar devagar, permitindo que cada passo seja um ato gentil de autocompaixão e amor próprio.
      
      A frequência de ${frequencia} Hz está envolvendo seu coração agora em uma energia suave e profundamente curativa, 
      como um abraço maternal que acolhe toda sua dor com infinita ternura.
      
      É natural e saudável sentir tristeza. Ela faz parte do processo humano de crescimento e nos ensina sobre a profundidade de nossa capacidade de amar.
      Enquanto caminha, permita que a frequência de ${frequencia} Hz transforme suavemente esta tristeza em compreensão, aceitação e sabedoria interior.
      
      Respire profundamente e sinta como a vibração sagrada de ${frequencia} Hz está dissolvendo camadas de dor,
      substituindo-as por uma sensação crescente de paz, renovação e conexão com sua força interior.
      
      Continue sua caminhada com amor por si mesma, sabendo que cada passo está te levando para um lugar de maior sabedoria e serenidade.
      
      A frequência de ${frequencia} Hz continuará trabalhando em seu favor, curando e renovando sua energia emocional mesmo após esta meditação.
      
      Você é mais forte do que imagina. Você é capaz de transformar qualquer dor em crescimento.
    `,
    
    raiva: `
      Seja bem-vinda à sua caminhada de transformação da raiva em poder pessoal autêntico.
      Eu sou Sofia, e estarei aqui para guiá-la nesta jornada de alquimia emocional.
      
      A frequência de ${frequencia} Hz que irá acompanhá-la é uma frequência poderosa de transmutação,
      criada especialmente para transformar a energia intensa da raiva em determinação, clareza e força interior construtiva.
      
      Primeiro, respire profundamente e reconheça sua raiva sem julgamento. Ela contém informações importantes para você.
      Comece a caminhar com passos firmes, mas controlados, canalizando essa energia de forma consciente.
      
      Sinta a frequência de ${frequencia} Hz trabalhando para equilibrar e canalizar sua energia de forma sábia e construtiva.
      Esta vibração está transformando a intensidade em clareza, a agitação em foco dirigido.
      
      A raiva, quando bem direcionada, é uma energia poderosa que pode ser canalizada para mudanças positivas em sua vida.
      É o combustível da transformação, o impulso que nos move a estabelecer limites saudáveis e a lutar por nossos valores.
      
      Enquanto caminha, permita que a vibração de ${frequencia} Hz transforme esta energia em determinação focada, 
      em coragem para defender o que é importante para você, em força para criar mudanças positivas.
      
      Respire profundamente e sinta como a frequência está equilibrando suas emoções,
      transformando a intensidade da raiva em uma determinação serena e poderosa.
      
      Continue caminhando, deixando que cada passo libere a tensão desnecessária e transforme esta energia em poder pessoal autêntico.
      
      A frequência de ${frequencia} Hz continuará trabalhando para harmonizar suas emoções e transformar esta experiência em crescimento e empoderamento pessoal.
      
      Você tem o poder de transformar qualquer energia em algo construtivo. Você é força. Você é determinação consciente.
    `,
    
    medo: `
      Bem-vinda à sua caminhada de coragem e superação do medo.
      Eu sou Sofia, e estarei aqui para acompanhá-la com segurança nesta jornada de fortalecimento interior.
      
      A frequência de ${frequencia} Hz que você ouvirá é uma frequência especial de proteção e fortalecimento,
      cuidadosamente criada para transformar o medo em coragem, insegurança em confiança, ansiedade em serenidade.
      
      Respire profundamente três vezes. Sinta seus pés firmes no chão. Você está segura.
      Comece a caminhar com passos seguros, mesmo que pequenos no início. Cada passo é um ato de coragem.
      
      Sinta a frequência de ${frequencia} Hz criando um campo protetor de energia dourada ao seu redor,
      uma bolha de segurança que cresce a cada respiração, a cada passo que você dá.
      
      O medo é um sinal que nos convida a crescer além de nossas limitações percebidas. 
      Ele nos mostra onde precisamos desenvolver mais confiança e força interior.
      
      Enquanto caminha, permita que a vibração protetora de ${frequencia} Hz dissolva as tensões do medo
      e as substitua por uma sensação crescente de segurança interior, de conexão com sua força inata.
      
      Respire profundamente e sinta como a frequência está fortalecendo sua confiança,
      construindo uma base sólida de coragem que vem de dentro, do seu centro de poder pessoal.
      
      Continue caminhando, sabendo que cada passo é uma afirmação de sua bravura natural.
      Você é mais corajosa do que acredita. Você tem tudo o que precisa dentro de si.
      
      A frequência de ${frequencia} Hz continuará trabalhando para ancorar em você esta nova sensação de segurança e confiança em si mesma.
      
      Você é coragem. Você é força. Você é capaz de enfrentar qualquer desafio com serenidade e sabedoria.
    `,
    
    paz: `
      Seja muito bem-vinda à sua caminhada de paz profunda e serenidade interior.
      Eu sou Sofia, e é uma honra guiá-la nesta jornada sagrada de harmonização com sua essência mais pura.
      
      A frequência de ${frequencia} Hz que irá envolvê-la é uma frequência divina de harmonização,
      especialmente sintonizada para alinhar todo o seu ser com a vibração da paz universal e da serenidade absoluta.
      
      Respire profundamente e sinta seu corpo relaxando completamente. Solte todos os músculos, todas as tensões.
      Comece a caminhar em um ritmo suave e contemplativo, como se flutuasse em um oceano de tranquilidade.
      
      Sinta a frequência de ${frequencia} Hz permeando cada célula de seu corpo com uma tranquilidade profunda,
      como ondas suaves de serenidade que dissolvem qualquer agitação ou preocupação.
      
      A paz é seu estado natural de ser, sua essência mais verdadeira e pura.
      Esta frequência está simplesmente lembrando cada parte de você de retornar a este estado sagrado de harmonia.
      
      Enquanto caminha, permita que a vibração de ${frequencia} Hz dissolva qualquer resquício de tensão
      e reconecte você completamente com sua natureza pacífica interior, com sua sabedoria silenciosa.
      
      Respire profundamente e sinta como a frequência está criando uma sensação de calma profunda,
      como se você estivesse flutuando em um lago sereno ao amanhecer, em perfeita harmonia com o universo.
      
      Continue sua caminhada meditativa, deixando que cada passo seja uma oração silenciosa de gratidão,
      uma celebração desta paz que sempre esteve disponível em seu coração.
      
      A frequência de ${frequencia} Hz continuará irradiando paz através de todo o seu ser,
      ancorando esta sensação sagrada em sua consciência para que você possa acessá-la sempre que precisar.
      
      Você é paz. Você é serenidade. Você é uma expressão viva da harmonia universal.
    `,
    
    amor: `
      Bem-vinda à sua caminhada de expansão do amor incondicional.
      Eu sou Sofia, e é um privilégio acompanhá-la nesta jornada de abertura do coração e conexão com a força mais poderosa do universo.
      
      A frequência de ${frequencia} Hz que você está prestes a experimentar é a frequência sagrada do coração,
      especialmente criada para abrir e expandir infinitamente sua capacidade de amar e ser amada.
      
      Coloque sua mão no coração e respire profundamente. Sinta o ritmo do amor pulsando em seu peito.
      Comece a caminhar com o coração completamente aberto e receptivo, irradiando amor a cada passo.
      
      Sinta a frequência de ${frequencia} Hz irradiando do seu coração para todo o seu corpo,
      e depois se expandindo ao seu redor como uma aura dourada de amor puro e incondicional.
      
      O amor é a força mais poderosa do universo, e você é um canal sagrado desta energia divina.
      Sua capacidade de amar é infinita, ilimitada, e cresce à medida que é compartilhada.
      
      Enquanto caminha, permita que a vibração de ${frequencia} Hz amplifique o amor em seu coração,
      conectando você com a fonte universal de amor incondicional que flui através de toda a criação.
      
      Respire profundamente e sinta como a frequência está expandindo sua capacidade de amar,
      dissolvendo todas as barreiras e abrindo espaços infinitos para mais compaixão, mais conexão, mais entrega.
      
      Continue caminhando como um ser de amor puro, irradiando esta energia curativa a cada passo,
      sabendo que quanto mais amor você irradia, mais amor retorna multiplicado para você.
      
      A frequência de ${frequencia} Hz continuará trabalhando para expandir infinitamente sua capacidade de dar e receber amor em todas as suas formas mais elevadas.
      
      Você é amor. Você é compaixão. Você é uma expressão divina do amor universal se manifestando na Terra.
    `,
    
    ansiedade: `
      Seja bem-vinda à sua caminhada de calma e centralização interior.
      Eu sou Sofia, e estarei aqui para guiá-la de volta ao seu centro de paz e serenidade.
      
      A frequência de ${frequencia} Hz que irá acompanhá-la é uma frequência especial de estabilização e ancoragem,
      cuidadosamente criada para acalmar a mente ansiosa e trazer você de volta ao momento presente com suavidade.
      
      Respire profundamente pelo nariz e expire lentamente pela boca. Sinta seus pés firmes no chão.
      Comece a caminhar focando completamente em cada passo, cada movimento, cada respiração. Apenas o agora existe.
      
      Sinta a frequência de ${frequencia} Hz criando uma âncora de estabilidade em todo seu sistema nervoso,
      como raízes profundas que conectam você à terra e ao momento presente.
      
      A ansiedade é apenas energia desorganizada que precisa ser gentilmente reorganizada e canalizada.
      Esta frequência está fazendo exatamente isso, trazendo ordem, calma e clareza onde havia confusão.
      
      Enquanto caminha, permita que a vibração de ${frequencia} Hz organize esta energia,
      transformando a agitação mental em presença calma, a preocupação em confiança, o caos em serenidade.
      
      Respire profundamente e sinta como a frequência está acalmando seu sistema nervoso,
      trazendo clareza cristalina onde havia confusão e serenidade profunda onde havia agitação.
      
      Continue caminhando com atenção plena total, deixando que cada passo te traga mais para o presente,
      para este momento sagrado onde a paz sempre está disponível.
      
      A frequência de ${frequencia} Hz continuará trabalhando para estabilizar sua energia
      e ancorar você permanentemente em um estado de calma duradoura e confiança interior absoluta.
      
      Você é calma. Você é presença. Você é capaz de navegar qualquer situação com serenidade e sabedoria.
    `,
    
    neutro: `
      Bem-vinda à sua caminhada de equilíbrio e harmonização energética.
      Eu sou Sofia, e é um prazer guiá-la nesta jornada de alinhamento com seu centro de poder pessoal.
      
      A frequência de ${frequencia} Hz que você experimentará é uma frequência mestra de centralização,
      especialmente criada para alinhar e equilibrar todas as suas energias emocionais em perfeita harmonia.
      
      Respire profundamente e sinta-se completamente presente em seu corpo.
      Comece a caminhar em um ritmo perfeitamente equilibrado, nem muito rápido nem muito devagar, encontrando seu ponto de equilíbrio natural.
      
      Sinta a frequência de ${frequencia} Hz criando um estado de neutralidade equilibrada em todo o seu ser,
      como uma linha de força que atravessa seu centro, conectando terra e céu através de você.
      
      Este estado neutro é um lugar de imenso poder, onde você pode observar sem reagir impulsivamente,
      onde pode escolher conscientemente como responder às situações da vida com sabedoria e discernimento.
      
      Enquanto caminha, permita que a vibração de ${frequencia} Hz fortaleça esta capacidade de equilíbrio,
      criando em você um centro imóvel de paz que permanece estável independente das circunstâncias externas.
      
      Respire profundamente e sinta como a frequência está criando uma base sólida de estabilidade emocional,
      um centro calmo e poderoso a partir do qual você pode navegar qualquer situação com clareza e sabedoria.
      
      Continue caminhando como uma observadora consciente, mantendo seu centro de equilíbrio,
      sabendo que deste lugar de neutralidade você tem acesso a todo seu poder pessoal e sabedoria interior.
      
      A frequência de ${frequencia} Hz continuará trabalhando para ancorar em você esta capacidade de permanecer centrada e equilibrada em todas as circunstâncias da vida.
      
      Você é equilíbrio. Você é sabedoria. Você é o centro calmo em meio a qualquer tempestade.
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
    const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');
    
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('ElevenLabs API key não configurada');
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

        // Generate audio using ElevenLabs TTS with Brazilian Portuguese voice
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: meditationScript,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.6,
              similarity_boost: 0.8,
              style: 0.2, // More natural and calming
              use_speaker_boost: true
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro ElevenLabs para ${sentimento.sentimento}:`, errorText);
          throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }

        // Get audio buffer
        const audioBuffer = await response.arrayBuffer();
        const audioBlob = new Uint8Array(audioBuffer);

        // Upload to Supabase Storage
        const fileName = `${sentimento.sentimento}-elevenlabs-${Date.now()}.mp3`;
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