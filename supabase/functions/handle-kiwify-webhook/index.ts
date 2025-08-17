
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[KIWIFY-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    logStep("Webhook received from Kiwify");
    
    // Get the request body
    const body = await req.json();
    logStep("Webhook payload", body);

    // Initialize Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate the webhook
    if (!body.event || !body.data) {
      logStep("Invalid webhook payload - missing event or data", { event: body.event, hasData: !!body.data });
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const event = body.event;
    const customerEmail = body.data.customer?.email || body.data.email;
    const planId = body.data.product?.id || body.data.product_id || null;
    
    logStep("Processing webhook", { event, customerEmail, planId });
    
    if (!customerEmail) {
      logStep("No customer email found");
      return new Response(
        JSON.stringify({ error: "No customer email found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    let status = false;
    let subscriptionEnd = null;
    
    // Handle different event types
    if (event === 'subscription.created' || event === 'order.paid' || event === 'payment.approved') {
      status = true;
      // Set subscription end date to 30 days or 365 days from now depending on interval
      const interval = body.data.subscription?.interval || body.data.interval || 'month';
      const daysToAdd = interval === 'year' ? 365 : 30;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysToAdd);
      subscriptionEnd = endDate.toISOString();
      logStep("Subscription activated", { interval, subscriptionEnd });
    } else if (event === 'subscription.canceled' || event === 'subscription.payment_failed' || event === 'order.refunded') {
      status = false;
      logStep("Subscription deactivated", { event });
    } else {
      logStep("Unhandled event type", { event });
      return new Response(
        JSON.stringify({ message: "Event type not handled", event }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Find the user with this email
    const { data: userData, error: userError } = await supabase
      .from('users_view')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (userError) {
      logStep("Error finding user", { email: customerEmail, error: userError });
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    const userId = userData.id;
    logStep("User found", { userId, email: customerEmail });

    // Check if subscriber record exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Update or insert subscriber record
    if (existingSubscriber) {
      logStep("Updating existing subscriber", { userId, subscribed: status });
      const updateData: any = {
        subscribed: status,
        subscription_end: subscriptionEnd,
        plan_id: planId,
        updated_at: new Date().toISOString(),
      };
      
      // If activating subscription, disable trial
      if (status) {
        updateData.is_trial = false;
        updateData.trial_started_at = null;
        updateData.trial_ends_at = null;
        updateData.last_payment_date = new Date().toISOString();
      }
      
      const { error: updateError } = await supabase
        .from('subscribers')
        .update(updateData)
        .eq('user_id', userId);

      if (updateError) {
        logStep("Error updating subscriber", updateError);
        throw updateError;
      }
      logStep("Subscriber updated successfully");
    } else {
      logStep("Creating new subscriber", { userId, email: customerEmail });
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({
          user_id: userId,
          email: customerEmail,
          subscribed: status,
          subscription_end: subscriptionEnd,
          plan_id: planId,
          is_trial: false,
          last_payment_date: status ? new Date().toISOString() : null,
        });

      if (insertError) {
        logStep("Error inserting subscriber", insertError);
        throw insertError;
      }
      logStep("New subscriber created successfully");
    }

    logStep("Webhook processed successfully", { event, status, userId });
    return new Response(
      JSON.stringify({ success: true, event, status, user_id: userId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    logStep("Error processing webhook", { error: err.message, stack: err.stack });
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
