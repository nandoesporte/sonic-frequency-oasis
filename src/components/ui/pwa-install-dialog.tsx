import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Smartphone, Download, X, Star, Gift } from 'lucide-react';
import { pwaInstallManager, isIOS, isAndroid, isAppInstalled } from '@/lib/pwa-install';
import { useToast } from '@/components/ui/use-toast';

export function PWAInstallDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Don't show for non-logged users or if app is already installed
    if (!user || isAppInstalled()) {
      return;
    }

    // Check if user has already dismissed the dialog in this session
    const hasShownDialog = sessionStorage.getItem('pwa-install-dialog-shown');
    if (hasShownDialog) {
      return;
    }

    const handleInstallabilityChange = (installable: boolean) => {
      console.log('PWA Dialog: Installability changed:', installable);
      setCanInstall(installable);
      
      // Show dialog automatically when PWA becomes installable or on mobile devices
      if (installable && !hasShownDialog) {
        console.log('PWA Dialog: Showing dialog in 2 seconds...');
        // Small delay to ensure user has settled in after login
        setTimeout(() => {
          setShowDialog(true);
          sessionStorage.setItem('pwa-install-dialog-shown', 'true');
          console.log('PWA Dialog: Dialog should be visible now');
        }, 2000);
      }
    };

    pwaInstallManager.onInstallabilityChange(handleInstallabilityChange);

    return () => {
      pwaInstallManager.removeInstallabilityListener(handleInstallabilityChange);
    };
  }, [user]);

  const handleInstall = async () => {
    console.log('PWA Dialog: Iniciando instalação');
    
    if (isAppInstalled()) {
      toast({
        title: "App já instalado",
        description: "O aplicativo já está instalado no seu dispositivo.",
      });
      setShowDialog(false);
      return;
    }

    if (!canInstall) {
      if (isIOS() || isAndroid()) {
        setShowManualInstructions(true);
      } else {
        toast({
          title: "Instalação não disponível",
          description: "A instalação automática não está disponível neste navegador.",
          variant: "destructive",
        });
        setShowDialog(false);
      }
      return;
    }

    setIsInstalling(true);
    
    try {
      const success = await pwaInstallManager.install();
      
      if (success) {
        toast({
          title: "App instalado com sucesso! 🎉",
          description: "O Sonic Frequency Oasis foi adicionado à sua tela inicial.",
        });
        setShowDialog(false);
      } else {
        toast({
          title: "Instalação cancelada",
          description: "A instalação foi cancelada pelo usuário.",
        });
      }
    } catch (error) {
      console.error('PWA Dialog: Erro durante instalação:', error);
      toast({
        title: "Erro na instalação",
        description: "Ocorreu um erro durante a instalação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowDialog(false);
    // Mark as dismissed for this session
    sessionStorage.setItem('pwa-install-dialog-dismissed', 'true');
  };

  const getInstallInstructions = () => {
    if (isIOS()) {
      return "Para instalar no iOS: 1) Toque no botão de compartilhar (⬆️), 2) Selecione 'Adicionar à Tela de Início'";
    } else if (isAndroid()) {
      return "Para instalar no Android: Toque no menu (⋮) e selecione 'Adicionar à tela inicial' ou 'Instalar app'";
    }
    return "Para instalar: Clique no ícone de instalação na barra de endereços";
  };

  if (!user || isAppInstalled()) {
    return null;
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Smartphone className="h-6 w-6 text-primary" />
              Instalar Aplicativo
            </DialogTitle>
            <DialogDescription className="text-base">
              Tenha acesso rápido às frequências terapêuticas direto da sua tela inicial!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Benefícios do App:</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Acesso instantâneo às frequências
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Funciona offline após primeiro uso
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Experiência nativa no celular
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Notificações e lembranças
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col space-y-2">
            <Button
              onClick={handleInstall}
              className="w-full"
              disabled={isInstalling}
            >
              <Download className="h-4 w-4 mr-2" />
              {isInstalling ? 'Instalando...' : 'Instalar Agora'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="w-full"
            >
              Agora Não
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Instructions Dialog */}
      <Dialog open={showManualInstructions} onOpenChange={setShowManualInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Como Instalar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {getInstallInstructions()}
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 Dica: Depois de instalado, o app ficará disponível na sua tela inicial como qualquer outro aplicativo.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowManualInstructions(false)} className="w-full">
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}