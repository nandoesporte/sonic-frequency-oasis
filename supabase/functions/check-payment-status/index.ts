import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYMENT-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const mercadoPagoToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!mercadoPagoToken) {
      throw new Error("Mercado Pago token not configured");
    }

    // Get user's subscription info
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!subscriber) {
      return new Response(JSON.stringify({ 
        subscribed: false, 
        message: "No subscription record found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get recent payment history
    const { data: paymentHistory } = await supabaseClient
      .from('payment_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    logStep("Payment history retrieved", { count: paymentHistory?.length || 0 });

    // Check for recent approved payments
    const recentApprovedPayment = paymentHistory?.find(payment => 
      payment.status === 'approved' && 
      new Date(payment.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    );

    if (recentApprovedPayment && !subscriber.subscribed) {
      logStep("Found recent approved payment, updating subscription");
      
      // Use service role key to update subscription
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      let subscriptionEndDate = new Date();
      if (subscriber.plan_id) {
        const { data: plan } = await supabaseService
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
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      const { error: updateError } = await supabaseService
        .from('subscribers')
        .update({
          subscribed: true,
          is_trial: false,
          trial_started_at: null,
          trial_ends_at: null,
          subscription_end: subscriptionEndDate.toISOString(),
          last_payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        logStep("Error updating subscription", updateError);
      } else {
        logStep("Subscription updated successfully");
        return new Response(JSON.stringify({
          subscribed: true,
          subscription_end: subscriptionEndDate.toISOString(),
          message: "Subscription activated based on recent payment"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    // Return current subscription status
    const isTrialActive = subscriber.is_trial && 
      subscriber.trial_ends_at && 
      new Date(subscriber.trial_ends_at) > new Date();

    const hasAccess = subscriber.subscribed || isTrialActive;

    return new Response(JSON.stringify({
      subscribed: subscriber.subscribed,
      is_trial: subscriber.is_trial,
      trial_ends_at: subscriber.trial_ends_at,
      subscription_end: subscriber.subscription_end,
      has_access: hasAccess,
      payment_history_count: paymentHistory?.length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-payment-status", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});