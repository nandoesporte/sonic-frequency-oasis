import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    const { sentimento, regenerate = false } = await req.json();
    
    if (!sentimento) {
      throw new Error('Sentimento é obrigatório');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if audio already exists
    const { data: existingAudio, error: fetchError } = await supabase
      .from('sentimento_audios')
      .select('*')
      .eq('sentimento', sentimento.toLowerCase())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If audio exists and not regenerating, return existing URL
    if (existingAudio && existingAudio.audio_url && !regenerate) {
      return new Response(
        JSON.stringify({ 
          audioUrl: existingAudio.audio_url,
          frequencia: existingAudio.frequencia_hz,
          mensagem: existingAudio.mensagem_texto,
          cached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!existingAudio) {
      throw new Error(`Sentimento '${sentimento}' não encontrado no banco de dados`);
    }

    const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('Chave da API ElevenLabs não configurada');
    }

    console.log(`Gerando áudio para sentimento: ${sentimento}`);

    // Generate audio using ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text: existingAudio.mensagem_texto,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API ElevenLabs:', errorText);
      throw new Error(`Erro da API ElevenLabs: ${response.status} - ${errorText}`);
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Uint8Array(audioBuffer);

    // Upload to Supabase Storage
    const fileName = `${sentimento.toLowerCase()}-${Date.now()}.mp3`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sentimento-audios')
      .upload(fileName, audioBlob, {
        contentType: 'audio/mpeg',
        duplex: 'half'
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('sentimento-audios')
      .getPublicUrl(fileName);

    // Update database with audio URL
    const { error: updateError } = await supabase
      .from('sentimento_audios')
      .update({ audio_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', existingAudio.id);

    if (updateError) {
      console.error('Erro ao atualizar banco:', updateError);
      throw updateError;
    }

    console.log(`Áudio gerado e salvo com sucesso para ${sentimento}`);

    return new Response(
      JSON.stringify({ 
        audioUrl: publicUrl,
        frequencia: existingAudio.frequencia_hz,
        mensagem: existingAudio.mensagem_texto,
        cached: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao gerar áudio:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});