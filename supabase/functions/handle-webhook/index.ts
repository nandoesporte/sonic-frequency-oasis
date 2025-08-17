import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HANDLE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const mercadoPagoToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!mercadoPagoToken) {
      throw new Error("Mercado Pago token not configured");
    }

    // Parse webhook payload
    const webhookData = await req.json();
    logStep("Webhook data received", webhookData);

    // Extract payment ID from the webhook
    const paymentId = webhookData.data?.id;
    const action = webhookData.action;

    if (!paymentId || action !== "payment.updated") {
      logStep("Ignoring webhook - not a payment update", { paymentId, action });
      return new Response(JSON.stringify({ status: "ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Processing payment update", { paymentId });

    // Fetch payment details from Mercado Pago
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${mercadoPagoToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!paymentResponse.ok) {
      throw new Error(`Failed to fetch payment details: ${paymentResponse.statusText}`);
    }

    const paymentData = await paymentResponse.json();
    logStep("Payment data fetched", { 
      status: paymentData.status, 
      external_reference: paymentData.external_reference,
      amount: paymentData.transaction_amount
    });

    const userId = paymentData.external_reference;
    const paymentStatus = paymentData.status;
    const amount = paymentData.transaction_amount;

    if (!userId) {
      logStep("No user ID found in external_reference");
      return new Response(JSON.stringify({ error: "No user ID in payment" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Update payment history
    const { error: paymentHistoryError } = await supabaseClient
      .from('payment_history')
      .insert({
        user_id: userId,
        payment_id: paymentId,
        amount: amount,
        currency: paymentData.currency_id || 'BRL',
        status: paymentStatus,
        payment_method: paymentData.payment_method_id,
      });

    if (paymentHistoryError) {
      logStep("Error saving payment history", paymentHistoryError);
    }

    // If payment is approved, update subscription
    if (paymentStatus === "approved") {
      logStep("Payment approved, updating subscription", { userId });

      // Get the plan from subscriber record
      const { data: subscriber } = await supabaseClient
        .from('subscribers')
        .select('plan_id')
        .eq('user_id', userId)
        .single();

      let subscriptionEndDate = new Date();
      
      if (subscriber?.plan_id) {
        const { data: plan } = await supabaseClient
          .from('subscription_plans')
          .select('interval')
          .eq('id', subscriber.plan_id)
          .single();

        if (plan?.interval === 'year') {
          subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        } else {
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        }
      } else {
        // Default to monthly if no plan found
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      // Update subscriber record
      const { error: updateError } = await supabaseClient
        .from('subscribers')
        .update({
          subscribed: true,
          is_trial: false,
          trial_started_at: null,
          trial_ends_at: null,
          subscription_end: subscriptionEndDate.toISOString(),
          last_payment_date: new Date().toISOString(),
          mercado_pago_customer_id: paymentData.payer?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        logStep("Error updating subscription", updateError);
        throw updateError;
      }

      logStep("Subscription updated successfully", { 
        userId, 
        subscription_end: subscriptionEndDate.toISOString() 
      });
    } else {
      logStep("Payment not approved", { status: paymentStatus, userId });
    }

    return new Response(JSON.stringify({ 
      status: "processed",
      payment_status: paymentStatus,
      user_id: userId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in handle-webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});