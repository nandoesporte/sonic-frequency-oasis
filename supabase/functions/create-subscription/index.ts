
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
      Deno.env.get("SUPABASE_URL") ?? '',
      Deno.env.get("SUPABASE_ANON_KEY") ?? ''
    );

    // Parse request body
    const { planId } = await req.json();
    
    if (!planId) {
      return new Response(JSON.stringify({ error: 'ID do plano não fornecido' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Erro de autenticação:", userError);
      return new Response(JSON.stringify({ error: 'Usuário não autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile for better customer identification
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('name, email')
      .eq('id', user.id)
      .single();

    // Fetch plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      console.error("Erro ao buscar plano:", planError);
      return new Response(JSON.stringify({ error: 'Plano não encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for existing subscription
    const { data: existingSubscription } = await supabaseClient
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .eq('subscribed', true)
      .maybeSingle();
    
    if (existingSubscription) {
      console.log("Assinatura existente encontrada:", existingSubscription);
      // If there's an active subscription, we could offer to update it or cancel it
    }

    // Configure Mercado Pago
    const mercadoPagoToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!mercadoPagoToken) {
      console.error("Token do Mercado Pago não configurado");
      return new Response(JSON.stringify({ error: 'Erro de configuração do servidor' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Criando preferência de pagamento para usuário:", user.id, "plano:", planId);
    
    // Get the origin URL from the request
    const origin = req.headers.get('origin') || 'https://fd15ed9d-b283-4894-9de2-5d9a8c0d8a8e.lovableproject.com';
    
    // Create a better preference with proper metadata and auto_recurring for subscriptions
    const preferenceData = {
      // For recurrence using preapproval
      auto_recurring: {
        frequency: plan.interval === 'month' ? 1 : 12,
        frequency_type: plan.interval === 'month' ? "months" : "months",
        transaction_amount: Number(plan.price),
        currency_id: plan.currency,
      },
      // Standard preference data
      items: [{
        title: plan.name,
        description: plan.description || `Assinatura ${plan.interval === 'month' ? 'mensal' : 'anual'} do plano premium`,
        quantity: 1,
        currency_id: plan.currency,
        unit_price: Number(plan.price),
      }],
      payer: {
        name: profile?.name || user.email?.split('@')[0],
        email: profile?.email || user.email,
        identification: {
          type: "CPF",  // Default to CPF for Brazilian users
        }
      },
      back_urls: {
        success: `${origin}/payment?status=success`,
        failure: `${origin}/payment?status=failure`,
        pending: `${origin}/payment?status=pending`,
      },
      auto_return: "approved",
      statement_descriptor: "Frequenceas Premium",
      external_reference: user.id,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        interval: plan.interval,
        email: user.email,
      },
      notification_url: `${Deno.env.get("SUPABASE_URL") || ''}/functions/v1/handle-webhook`,
    };
    
    console.log("Enviando dados para Mercado Pago:", JSON.stringify(preferenceData));
    
    // Make direct API call to Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mercadoPagoToken}`
      },
      body: JSON.stringify(preferenceData)
    });
    
    const mpData = await mpResponse.json();
    
    if (!mpResponse.ok) {
      console.error("Erro na resposta do Mercado Pago:", mpData);
      return new Response(JSON.stringify({ error: 'Falha ao gerar link de pagamento', details: mpData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log("Resposta do Mercado Pago:", JSON.stringify(mpData));

    if (!mpData || !mpData.init_point) {
      return new Response(JSON.stringify({ error: 'Falha ao gerar link de pagamento' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save the pending subscription
    const { error: pendingSubError } = await supabaseClient
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email,
        plan_id: planId,
        subscribed: false, // Will be updated to true when payment is confirmed
        mercado_pago_preference_id: mpData.id,
        updated_at: new Date().toISOString()
      });

    if (pendingSubError) {
      console.error("Erro ao salvar assinatura pendente:", pendingSubError);
    }

    return new Response(JSON.stringify({
      init_point: mpData.init_point,
      id: mpData.id,
      preference_id: mpData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao processar assinatura:", error);
    return new Response(JSON.stringify({ error: error.message || 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
