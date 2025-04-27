
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, CardHeader, CardContent, CardTitle, 
  CardDescription, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export const AdminSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  
  const handleSaveWebhookSettings = async () => {
    // This is a placeholder - in a real app, you would save these settings to your database
    // For this demo, we'll just show a toast notification
    setSavingWebhook(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de webhook foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um problema ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSavingWebhook(false);
    }
  };
  
  const handleTestWebhook = async () => {
    // This is a placeholder - in a real app, you would test the webhook
    setTestingWebhook(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Teste enviado",
        description: "O webhook de teste foi enviado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Ocorreu um problema ao testar o webhook.",
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações gerais</CardTitle>
              <CardDescription>
                Configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nome do site</Label>
                <Input id="site-name" defaultValue="Frequency App" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Descrição</Label>
                <Input id="site-description" defaultValue="Aplicativo de frequências terapêuticas" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks para integrar com sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input 
                  id="webhook-url" 
                  placeholder="https://exemplo.com/webhook" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Secret do Webhook</Label>
                <Input 
                  id="webhook-secret" 
                  placeholder="webhook_secret_123" 
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
              <Button 
                onClick={handleSaveWebhookSettings}
                disabled={savingWebhook}
              >
                {savingWebhook ? 'Salvando...' : 'Salvar configurações'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestWebhook}
                disabled={testingWebhook || !webhookUrl}
              >
                {testingWebhook ? 'Enviando...' : 'Enviar webhook de teste'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>
                Gerencie suas chaves de API e permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/40">
                  <h3 className="font-medium mb-2">Sua chave de API</h3>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="password" 
                      value="sk_test_123456789abcdefghijklmnopqrstuvwxyz" 
                      readOnly
                    />
                    <Button variant="outline" size="sm">Mostrar</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Esta chave é usada para acessar a API do sistema. Mantenha-a segura.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Permissões da API</h3>
                  <div className="border rounded-md divide-y">
                    <div className="p-3 flex justify-between items-center">
                      <span>Leitura de dados</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Ativado
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span>Escrita de dados</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Ativado
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span>Deleção de dados</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Desativado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Regenerar chave de API</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
