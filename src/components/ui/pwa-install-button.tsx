import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, X, Info } from 'lucide-react';
import { pwaInstallManager, isIOS, isAndroid, isAppInstalled } from '@/lib/pwa-install';
import { useToast } from '@/components/ui/use-toast';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'card' | 'banner';
  showInstructions?: boolean;
}

export function PWAInstallButton({ 
  className = '', 
  variant = 'button',
  showInstructions = false 
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Don't show install option if app is already installed
    if (isAppInstalled()) {
      return;
    }

    const handleInstallabilityChange = (installable: boolean) => {
      setCanInstall(installable);
      
      // Show banner automatically for mobile users when installable
      if (installable && (isIOS() || isAndroid()) && variant === 'banner') {
        setShowBanner(true);
      }
    };

    pwaInstallManager.onInstallabilityChange(handleInstallabilityChange);

    return () => {
      pwaInstallManager.removeInstallabilityListener(handleInstallabilityChange);
    };
  }, [variant]);

  const handleInstall = async () => {
    if (isAppInstalled()) {
      toast({
        title: "App já instalado",
        description: "O aplicativo já está instalado no seu dispositivo.",
      });
      return;
    }

    if (!canInstall) {
      // Show manual instructions for iOS or when auto-install isn't available
      if (isIOS() || isAndroid()) {
        setShowManualInstructions(true);
      } else {
        toast({
          title: "Instalação não disponível",
          description: "A instalação automática não está disponível neste navegador.",
          variant: "destructive",
        });
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
        setShowBanner(false);
      } else {
        toast({
          title: "Instalação cancelada",
          description: "A instalação foi cancelada pelo usuário.",
        });
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast({
        title: "Erro na instalação",
        description: "Ocorreu um erro durante a instalação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render if app is already installed
  if (isAppInstalled()) {
    return null;
  }

  if (variant === 'banner' && showBanner) {
    return (
      <Card className="fixed top-4 left-4 right-4 z-50 shadow-lg border-primary">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm">Instalar App</CardTitle>
              <Badge variant="secondary" className="text-xs">Gratuito</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-xs mb-3">
            Adicione o Sonic Frequency Oasis à sua tela inicial para acesso rápido
          </CardDescription>
          <Button
            onClick={handleInstall}
            size="sm"
            className="w-full"
            disabled={isInstalling}
          >
            <Download className="h-4 w-4 mr-2" />
            {isInstalling ? 'Instalando...' : 'Instalar Agora'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <CardTitle>Instalar App Móvel</CardTitle>
          </div>
          <CardDescription>
            Adicione o Sonic Frequency Oasis à sua tela inicial para uma experiência móvel completa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">📱 Sem Download</Badge>
            <Badge variant="outline">⚡ Acesso Rápido</Badge>
            <Badge variant="outline">🔔 Notificações</Badge>
          </div>
          
          <Button
            onClick={handleInstall}
            className="w-full"
            disabled={isInstalling}
          >
            <Download className="h-4 w-4 mr-2" />
            {isInstalling ? 'Instalando...' : 'Instalar Aplicativo'}
          </Button>
          
          {showInstructions && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowManualInstructions(true)}
            >
              <Info className="h-4 w-4 mr-2" />
              Ver Instruções de Instalação
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Button variant (default)
  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className={className}
      disabled={isInstalling}
    >
      <Smartphone className="h-4 w-4 mr-2" />
      {isInstalling ? 'Instalando...' : 'Instalar App'}
    </Button>
  );
}

// Manual installation instructions modal/dialog component
export function PWAInstallInstructions({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void; 
}) {
  const instructions = pwaInstallManager.getInstallInstructions();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Como Instalar no {instructions.platform}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {instructions.instructions}
          </p>
          <Button onClick={onClose} className="w-full">
            Entendi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}