
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

  // Use the service role key to perform writes (upsert) in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error("No user_id provided");
    }
    
    // Get user info
    const { data: userData, error: userError } = await supabaseClient.auth
      .admin.getUserById(user_id);
    
    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!userData.user) {
      throw new Error("User not found");
    }
    
    const user = userData.user;
    
    // Check if the user already has a subscriber record
    const { data: existingSubscriber } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user_id)
      .single();
      
    // If the user already has a subscriber record, don't modify it
    if (existingSubscriber) {
      return new Response(
        JSON.stringify({ 
          message: "User already has a subscriber record", 
          trial: false 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

    // Create a 30-day trial period
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 days from now

    // Insert the subscriber record with trial information
    const { error: insertError } = await supabaseClient
      .from('subscribers')
      .insert({
        user_id: user.id,
        email: user.email,
        subscribed: false,
        is_trial: true,
        trial_started_at: trialStartDate.toISOString(),
        trial_ends_at: trialEndDate.toISOString()
      });

    if (insertError) {
      throw new Error(`Error creating subscriber record: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        message: "Trial period successfully started",
        trial: true,
        trial_end: trialEndDate.toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("ERROR in start-trial-for-new-user", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
