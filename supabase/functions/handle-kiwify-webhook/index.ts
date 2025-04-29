
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    console.log("Received webhook from Kiwify:", JSON.stringify(body));

    // Initialize Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate the webhook
    if (!body.event || !body.data || !body.data.customer || !body.data.customer.email) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const event = body.event;
    const email = body.data.customer.email;
    const planId = body.data.product?.id || null;
    
    let status = false;
    let subscriptionEnd = null;
    
    // Handle different event types
    if (event === 'subscription.created') {
      status = true;
      // Set subscription end date to 30 days or 365 days from now depending on interval
      const interval = body.data.subscription?.interval || 'month';
      const daysToAdd = interval === 'year' ? 365 : 30;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysToAdd);
      subscriptionEnd = endDate.toISOString();
    } else if (event === 'subscription.canceled' || event === 'subscription.payment_failed') {
      status = false;
    }

    // Find the user with this email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    const userId = userData.id;

    // Check if subscriber record exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Update or insert subscriber record
    if (existingSubscriber) {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          subscribed: status,
          subscription_end: subscriptionEnd,
          plan_id: planId,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error("Error updating subscriber:", updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert({
          user_id: userId,
          email: email,
          subscribed: status,
          subscription_end: subscriptionEnd,
          plan_id: planId,
        });

      if (insertError) {
        console.error("Error inserting subscriber:", insertError);
        throw insertError;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error processing webhook:", err);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
