import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

        // Generate audio using OpenAI TTS
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: sentimento.mensagem_texto,
            voice: 'nova', // Portuguese-friendly voice
            response_format: 'mp3',
            speed: 0.9 // Slightly slower for meditation
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

        // Update database with audio URL
        const { error: updateError } = await supabase
          .from('sentimento_audios')
          .update({ 
            audio_url: publicUrl, 
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