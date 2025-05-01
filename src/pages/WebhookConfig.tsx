
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, Webhook, ArrowLeft, Link, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function WebhookConfig() {
  const navigate = useNavigate();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // URL to be displayed to Kiwify users
  const webhookEndpoint = `https://otzytxkynqcywtqgpgmn.supabase.co/functions/v1/handle-kiwify-webhook`;
  
  const handleWebhookTest = async () => {
    setLoading(true);
    try {
      // Simulating a successful payment webhook
      const testData = {
        event: 'subscription.created',
        data: {
          customer: {
            email: user?.email || 'teste@exemplo.com'
          },
          product: {
            id: 'test-product-123'
          },
          subscription: {
            interval: 'month'
          }
        }
      };
      
      // Call the webhook function directly
      const { data, error } = await supabase.functions.invoke('handle-kiwify-webhook', {
        body: testData,
      });
      
      if (error) {
        console.error('Erro no teste:', error);
        toast.error('Erro ao testar webhook', {
          description: 'Não foi possível testar a integração. Detalhes no console.'
        });
        return;
      }
      
      toast.success('Teste enviado com sucesso', {
        description: 'O webhook de teste foi processado corretamente.'
      });
      
    } catch (error) {
      console.error('Erro no teste:', error);
      toast.error('Erro ao testar webhook', {
        description: 'Não foi possível testar a integração. Detalhes no console.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    toast.success('URL copiada', {
      description: 'URL do webhook copiada para a área de transferência.'
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Configuração de Webhooks</h1>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Admin
        </Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Webhook Kiwify</CardTitle>
            <CardDescription>
              Configure o webhook da Kiwify para notificar seu aplicativo sobre eventos de assinatura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="webhook-url">URL do Webhook (Copie para a Kiwify)</Label>
                <div className="flex mt-1.5">
                  <Input
                    id="webhook-url"
                    value={webhookEndpoint}
                    readOnly
                    className="flex-grow"
                  />
                  <Button variant="outline" onClick={handleCopyUrl} className="ml-2">
                    <Link className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cole esta URL nas configurações de webhook da Kiwify.
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium text-lg mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Eventos configurados automaticamente
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>subscription.created</TableCell>
                      <TableCell>Assinatura criada</TableCell>
                      <TableCell>Liberar acesso</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>subscription.canceled</TableCell>
                      <TableCell>Assinatura cancelada</TableCell>
                      <TableCell>Revogar acesso</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>subscription.payment_failed</TableCell>
                      <TableCell>Pagamento falhou</TableCell>
                      <TableCell>Revogar acesso</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <div className="w-full">
              <Button onClick={handleWebhookTest} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Webhook className="mr-2 h-4 w-4" />
                    Testar Webhook
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md w-full">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-500">Instruções de configuração na Kiwify</h3>
                  <ol className="text-sm mt-2 space-y-2 text-amber-800 dark:text-amber-400">
                    <li>1. Faça login na sua conta Kiwify</li>
                    <li>2. Acesse Configurações &gt; Webhooks</li>
                    <li>3. Clique em "Adicionar webhook"</li>
                    <li>4. Cole a URL acima no campo de URL</li>
                    <li>5. Selecione os eventos: subscription.created, subscription.canceled e subscription.payment_failed</li>
                    <li>6. Salve as configurações</li>
                  </ol>
                  <div className="mt-3">
                    <a 
                      href="https://ajuda.kiwify.com.br/pt-BR/article/o-que-sao-webhooks-e-como-configura-los-npnvk3/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm flex items-center text-amber-800 dark:text-amber-400 font-medium hover:underline"
                    >
                      Documentação da Kiwify
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
