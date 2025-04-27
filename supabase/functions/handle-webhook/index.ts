
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STATUS_MAPPING = {
  approved: 'active',
  rejected: 'failed',
  in_process: 'pending',
  refunded: 'cancelled',
  charged_back: 'dispute',
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

    // Check if we need to verify the Mercado Pago signature
    const mpToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    
    // Parse JSON payload from Mercado Pago
    const data = await req.json();
    console.log("Webhook recebido:", JSON.stringify(data));

    // Different webhook types from Mercado Pago
    const { action, type } = data;
    
    // Handle merchant_order notifications
    if (type === "merchant_order" && data.resource) {
      const orderId = data.resource.split('/').pop();
      console.log(`Processando merchant order: ${orderId}`);
      
      // Fetch the full merchant order details
      const orderResponse = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
        headers: {
          "Authorization": `Bearer ${mpToken}`
        }
      });
      
      if (!orderResponse.ok) {
        console.error("Falha ao buscar detalhes do pedido:", await orderResponse.text());
        return new Response(JSON.stringify({ error: 'Falha ao processar ordem' }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        });
      }
      
      const orderData = await orderResponse.json();
      
      // Process each payment in the order
      for (const payment of orderData.payments) {
        if (payment.status === "approved") {
          await processApprovedPayment(supabaseClient, payment, orderData);
        }
      }
    }
    
    // Handle payment notifications
    else if (action === "payment.created" || action === "payment.updated") {
      console.log(`Processando ${action}:`, JSON.stringify(data.data));
      
      const paymentData = data.data;
      
      if (paymentData.status === "approved") {
        // If this is an approved payment
        await processApprovedPayment(supabaseClient, paymentData);
      } else if (["rejected", "refunded", "charged_back"].includes(paymentData.status)) {
        // Handle failed/cancelled payments
        await processRejectedPayment(supabaseClient, paymentData);
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

// Process approved payments
async function processApprovedPayment(supabase, payment, orderData = null) {
  try {
    // Extract metadata from payment or order
    const metadata = payment.metadata || {};
    const userId = metadata.user_id || payment.external_reference;
    const planId = metadata.plan_id;
    
    // If no user ID, we can't process this payment
    if (!userId) {
      console.error("Metadata inválida no webhook:", JSON.stringify(metadata));
      return;
    }
    
    console.log(`Processando pagamento aprovado para usuário ${userId}, plano ${planId}`);
    
    // Get the payment's plan details
    const { data: planData } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .maybeSingle();
    
    // Calculate subscription end date
    const subscriptionEndDate = new Date();
    const interval = planData?.interval || metadata.interval || 'month';
    
    if (interval === 'month') {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else if (interval === 'year') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }
    
    // Update subscriber status in the database
    const { error: subscriberError } = await supabase
      .from('subscribers')
      .upsert({
        user_id: userId,
        email: metadata.email,
        subscribed: true,
        subscription_end: subscriptionEndDate.toISOString(),
        mercado_pago_customer_id: payment.payer?.id,
        mercado_pago_subscription_id: payment.id,
        last_payment_date: new Date().toISOString(),
        plan_id: planId,
      });
      
    if (subscriberError) {
      console.error("Erro ao atualizar assinante:", subscriberError);
    }
    
    // Log the payment
    const { error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        status: 'completed',
        payment_method: payment.payment_method?.type || 'mercado_pago',
        payment_id: payment.id,
      });
      
    if (paymentError) {
      console.error("Erro ao registrar pagamento:", paymentError);
    }
  } catch (err) {
    console.error("Erro ao processar pagamento aprovado:", err);
  }
}

// Process rejected payments
async function processRejectedPayment(supabase, payment) {
  try {
    // Extract metadata
    const metadata = payment.metadata || {};
    const userId = metadata.user_id || payment.external_reference;
    
    if (!userId) {
      console.error("Metadata inválida no payment rejeitado:", JSON.stringify(metadata));
      return;
    }
    
    console.log(`Processando pagamento rejeitado para usuário ${userId}`);
    
    // Register the failed payment
    const { error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        status: 'failed',
        payment_method: payment.payment_method?.type || 'mercado_pago',
        payment_id: payment.id,
      });
      
    if (paymentError) {
      console.error("Erro ao registrar pagamento rejeitado:", paymentError);
    }
  } catch (err) {
    console.error("Erro ao processar pagamento rejeitado:", err);
  }
}
