
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const data = await req.json();
    console.log("Webhook recebido:", JSON.stringify(data));

    const { action, data: paymentData } = data;

    // Verificar se é um pagamento aprovado
    if (action === "payment.created" && paymentData.status === "approved") {
      console.log("Pagamento aprovado:", JSON.stringify(paymentData));
      const { metadata } = paymentData;
      
      if (!metadata || !metadata.user_id) {
        console.error("Metadata inválida no webhook:", JSON.stringify(metadata));
        return new Response(JSON.stringify({ error: 'Metadata inválida' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { user_id, plan_id, interval } = metadata;
      const subscriptionEndDate = new Date();
      
      // Calcular data de término da assinatura
      if (interval === 'month') {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      } else if (interval === 'year') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        console.error("Intervalo inválido:", interval);
      }

      // Atualizar status do assinante
      const { error: subscriberError } = await supabaseClient
        .from('subscribers')
        .upsert({
          user_id,
          subscribed: true,
          subscription_end: subscriptionEndDate.toISOString(),
          mercado_pago_customer_id: paymentData.payer.id,
          mercado_pago_subscription_id: paymentData.id,
          last_payment_date: new Date().toISOString(),
          plan_id,
        });

      if (subscriberError) {
        console.error("Erro ao atualizar assinante:", subscriberError);
      }

      // Registrar pagamento
      const { error: paymentError } = await supabaseClient
        .from('payment_history')
        .insert({
          user_id,
          amount: paymentData.transaction_amount,
          currency: paymentData.currency_id,
          status: 'completed',
          payment_method: paymentData.payment_method?.type || 'mercado_pago',
          payment_id: paymentData.id,
        });

      if (paymentError) {
        console.error("Erro ao registrar pagamento:", paymentError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return new Response(JSON.stringify({ error: error.message || 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
