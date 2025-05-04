
// PWA installation handler

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Store the install prompt event
let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Setup event listeners for PWA installation
export const initPwaInstall = () => {
  // Capture the install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Optionally, show your own install button
    // You could dispatch an event here to show your install UI
    document.dispatchEvent(new CustomEvent('pwaInstallReady'));
    
    console.log('App can be installed, stored event');
  });
  
  // Track successful installations
  window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt
    deferredPrompt = null;
    
    // Log or track the installation
    console.log('PWA was installed');
  });
};

// Function to trigger installation prompt
export const promptInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    console.log('Installation prompt not available');
    return false;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user's choice
  const choiceResult = await deferredPrompt.userChoice;
  
  // Reset the deferred prompt variable
  deferredPrompt = null;
  
  // Return true if the app was installed
  return choiceResult.outcome === 'accepted';
};

// Check if the app is running in standalone mode (installed)
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};
