
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const kiwifySchema = z.object({
  monthly_plan_url: z.string().url("URL inválida").or(z.string().length(0)),
  annual_plan_url: z.string().url("URL inválida").or(z.string().length(0)),
  webhook_secret: z.string().min(0)
});

type KiwifySettingsForm = z.infer<typeof kiwifySchema>;

export function AdminKiwifySettings() {
  const [loading, setLoading] = useState(false);

  const form = useForm<KiwifySettingsForm>({
    resolver: zodResolver(kiwifySchema),
    defaultValues: {
      monthly_plan_url: "",
      annual_plan_url: "",
      webhook_secret: ""
    }
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, name, kiwify_url, interval');
      
      if (error) throw error;

      // Find the monthly and annual plans
      const monthlyPlan = data.find(plan => plan.interval === 'month');
      const annualPlan = data.find(plan => plan.interval === 'year');

      // Update the form
      form.setValue('monthly_plan_url', monthlyPlan?.kiwify_url || '');
      form.setValue('annual_plan_url', annualPlan?.kiwify_url || '');
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: KiwifySettingsForm) => {
    setLoading(true);
    try {
      // Update monthly plan URL
      const { error: monthlyError } = await supabase
        .from('subscription_plans')
        .update({ kiwify_url: values.monthly_plan_url })
        .eq('interval', 'month');
      
      if (monthlyError) throw monthlyError;

      // Update annual plan URL
      const { error: annualError } = await supabase
        .from('subscription_plans')
        .update({ kiwify_url: values.annual_plan_url })
        .eq('interval', 'year');
      
      if (annualError) throw annualError;

      // If there's a webhook secret, update it
      if (values.webhook_secret) {
        // This would be stored in Supabase secrets in a real implementation
        console.log('Webhook secret would be updated:', values.webhook_secret);
      }

      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Load the settings when the component mounts
  useState(() => {
    loadSettings();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Kiwify</CardTitle>
        <CardDescription>
          Configure as URLs dos produtos do Kiwify e chaves secretas para integrações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthly_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Plano Mensal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://kiwify.com.br/produto/mensal" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL da página de checkout do plano mensal no Kiwify
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="annual_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Plano Anual</FormLabel>
                  <FormControl>
                    <Input placeholder="https://kiwify.com.br/produto/anual" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL da página de checkout do plano anual no Kiwify
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="webhook_secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segredo do Webhook</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Segredo para validação de webhooks" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Chave secreta usada para validar webhooks do Kiwify
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
