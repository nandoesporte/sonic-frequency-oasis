
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const data = await req.json();
    const { action, data: paymentData } = data;

    if (action === "payment.created" && paymentData.status === "approved") {
      const { metadata } = paymentData;
      const { user_id, plan_id } = metadata;

      // Atualizar status do assinante
      await supabaseClient
        .from('subscribers')
        .upsert({
          user_id,
          subscribed: true,
          subscription_end: new Date(Date.now() + (metadata.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          mercado_pago_customer_id: paymentData.payer.id,
          mercado_pago_subscription_id: paymentData.id,
          last_payment_date: new Date().toISOString(),
        });

      // Registrar pagamento
      await supabaseClient
        .from('payment_history')
        .insert({
          user_id,
          amount: paymentData.transaction_amount,
          currency: paymentData.currency_id,
          status: 'completed',
          payment_method: paymentData.payment_method.type,
          payment_id: paymentData.id,
        });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
