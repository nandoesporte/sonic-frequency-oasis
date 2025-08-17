
// PWA Install functionality
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Utility functions (must be declared before PWAInstallManager class)
// Utility function to check if device is iOS
export const isIOS = (): boolean => {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
};

// Utility function to check if device is Android
export const isAndroid = (): boolean => {
  return /android/.test(navigator.userAgent.toLowerCase());
};

// Utility function to check if app is already installed
export const isAppInstalled = (): boolean => {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // For iOS Safari
  if ('standalone' in window.navigator && (window.navigator as any).standalone) {
    return true;
  }
  
  return false;
};

class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstallable = false;
  private callbacks: Array<(canInstall: boolean) => void> = [];

  constructor() {
    this.initializeInstallPrompt();
  }

  private initializeInstallPrompt() {
    console.log('PWA Manager: Inicializando...');
    
    // For testing purposes, force show the dialog on mobile devices even without beforeinstallprompt
    if (isIOS() || isAndroid()) {
      console.log('PWA Manager: Mobile device detected, enabling manual install');
      setTimeout(() => {
        this.isInstallable = true;
        this.notifyCallbacks(true);
      }, 500);
    }
    
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      console.log('PWA Manager: beforeinstallprompt event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;
      console.log('PWA Manager: App can be installed, stored event');
      this.notifyCallbacks(true);
    });

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA Manager: App was installed successfully');
      this.deferredPrompt = null;
      this.isInstallable = false;
      this.notifyCallbacks(false);
    });

    // Check if app is already installed
    this.checkIfInstalled();
    
    // For testing, also check after a delay
    setTimeout(() => {
      console.log('PWA Manager: Estado atual:', {
        isInstallable: this.isInstallable,
        hasDeferredPrompt: !!this.deferredPrompt,
        isInstalled: this.checkIfInstalled()
      });
    }, 1000);
  }

  private checkIfInstalled() {
    // Check if the app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: App is running in standalone mode (installed)');
      this.isInstallable = false;
      return;
    }

    // For iOS Safari, check if app is in standalone mode
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      console.log('PWA: App is running in iOS standalone mode (installed)');
      this.isInstallable = false;
      return;
    }
  }

  public canInstall(): boolean {
    // On mobile devices, allow showing the dialog even without deferredPrompt for manual instructions
    if (isIOS() || isAndroid()) {
      return this.isInstallable;
    }
    return this.isInstallable && this.deferredPrompt !== null;
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`PWA: User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        this.isInstallable = false;
        this.notifyCallbacks(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA: Error during installation:', error);
      return false;
    }
  }

  public onInstallabilityChange(callback: (canInstall: boolean) => void) {
    this.callbacks.push(callback);
    // Immediately call with current state
    callback(this.canInstall());
  }

  public removeInstallabilityListener(callback: (canInstall: boolean) => void) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  private notifyCallbacks(canInstall: boolean) {
    this.callbacks.forEach(callback => callback(canInstall));
  }

  public getInstallInstructions(): { platform: string; instructions: string } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return {
        platform: 'iOS',
        instructions: 'Para instalar este app: 1) Toque no botão de compartilhar, 2) Selecione "Adicionar à Tela de Início"'
      };
    } else if (/android/.test(userAgent)) {
      return {
        platform: 'Android',
        instructions: 'Para instalar este app: Toque no menu (⋮) e selecione "Adicionar à tela inicial" ou "Instalar app"'
      };
    } else {
      return {
        platform: 'Desktop',
        instructions: 'Para instalar este app: Clique no ícone de instalação na barra de endereços ou use o menu do navegador'
      };
    }
  }
}

// Create and export a singleton instance
export const pwaInstallManager = new PWAInstallManager();

