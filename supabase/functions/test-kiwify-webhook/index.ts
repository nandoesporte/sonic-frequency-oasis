import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    
    // Parse request body for test parameters
    const { testType = "payment_approved" } = await req.json().catch(() => ({}));
    
    console.log(`[TEST-KIWIFY] Testing Kiwify webhook with type: ${testType} for user: ${user.email}`);

    // Create test webhook payload
    const testPayload = {
      event: testType,
      data: {
        customer: {
          email: user.email
        },
        product: {
          id: "8e31ccd0-e1c4-417a-805f-07fbca341c32" // Premium Mensal plan ID
        },
        subscription: {
          interval: "month"
        }
      }
    };

    // Call the actual Kiwify webhook function
    const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/handle-kiwify-webhook`;
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    const webhookResult = await webhookResponse.json();
    
    console.log(`[TEST-KIWIFY] Webhook response:`, webhookResult);

    // Get updated subscriber info
    const { data: subscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return new Response(JSON.stringify({
      test_payload: testPayload,
      webhook_response: webhookResult,
      webhook_status: webhookResponse.status,
      updated_subscriber: subscriber,
      message: `Test webhook sent for ${testType}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`[TEST-KIWIFY] ERROR: ${errorMessage}`);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});