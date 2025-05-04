
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function GoogleAuthConfig() {
  const [isLoading, setIsLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch current Google auth settings when component mounts
  useEffect(() => {
    async function fetchGoogleAuthSettings() {
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .eq('setting_key', 'google_auth_config')
          .maybeSingle();

        if (error) {
          console.error('Error fetching Google auth settings:', error);
          return;
        }

        // If we have settings, use them
        if (data) {
          const settings = data.setting_value;
          setClientId(settings.client_id || '');
          setClientSecret(settings.client_secret || '');
          setIsEnabled(settings.is_enabled || false);
        }
      } catch (error) {
        console.error('Error in fetchGoogleAuthSettings:', error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchGoogleAuthSettings();
  }, []);

  const handleSaveConfig = async () => {
    setIsLoading(true);

    try {
      if (!clientId || !clientSecret) {
        toast.error('Campos obrigatórios', {
          description: 'Cliente ID e Client Secret são obrigatórios.'
        });
        setIsLoading(false);
        return;
      }

      // Prepare data to save
      const settingValue = {
        client_id: clientId,
        client_secret: clientSecret,
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      };

      // Check if setting already exists
      const { data: existingData } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'google_auth_config')
        .maybeSingle();

      let error;
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({ setting_value: settingValue })
          .eq('setting_key', 'google_auth_config');
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert([{ 
            setting_key: 'google_auth_config', 
            setting_value: settingValue,
            setting_type: 'auth'
          }]);
          
        error = insertError;
      }

      if (error) {
        throw error;
      }
      
      toast.success('Configurações salvas', {
        description: 'As configurações de autenticação do Google foram salvas.'
      });
    } catch (error) {
      console.error('Error saving Google auth settings:', error);
      toast.error('Erro ao salvar', {
        description: 'Não foi possível salvar as configurações. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Google Sign-In</CardTitle>
            <CardDescription>Carregando configurações...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Google Sign-In</CardTitle>
          <CardDescription>
            Configure a autenticação do Google para permitir que os usuários façam login com suas contas Google.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="google-enabled">Habilitar login com Google</Label>
              <p className="text-sm text-muted-foreground">
                Permite que usuários façam login usando suas contas Google
              </p>
            </div>
            <Switch 
              id="google-enabled"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="google-client-id">Client ID</Label>
              <Input 
                id="google-client-id"
                placeholder="Seu Google Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Obtido no console de desenvolvedores do Google Cloud
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="google-client-secret">Client Secret</Label>
              <Input 
                id="google-client-secret"
                type="password"
                placeholder="Seu Google Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExternalLink className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Para configurar o Google Sign-In, você precisa criar um projeto no Google Cloud Console
                  e configurar as credenciais OAuth 2.0.
                </p>
                <p className="mt-3 text-sm md:ml-6 md:mt-0">
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    className="font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Configurar no Google Cloud
                    <span aria-hidden="true"> &rarr;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-muted p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">URLs de redirecionamento</p>
              <p className="text-sm text-muted-foreground">
                Adicione esta URL ao seu projeto do Google Cloud na seção de "URIs de redirecionamento autorizados":
              </p>
              <code className="rounded bg-muted-foreground/20 px-2 py-1 text-sm">
                https://otzytxkynqcywtqgpgmn.supabase.co/auth/v1/callback
              </code>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveConfig}
            disabled={isLoading || !clientId || !clientSecret}
            className="ml-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
