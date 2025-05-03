
export function initPwaInstall() {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show a custom install button if desired
    showInstallPromotion();
  });

  // Function to show installation promotion UI if needed
  function showInstallPromotion() {
    // You could show a custom UI element to promote installation
    console.log("App can be installed. Install button could be shown.");
    
    // Optional: add a button to the UI
    const installButton = document.getElementById('pwa-install-button');
    
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', async () => {
        // Hide the app provided install promotion
        installButton.style.display = 'none';
        
        // Show the install prompt
        if (deferredPrompt) {
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User installation choice: ${outcome}`);
          
          // We've used the prompt, and can't use it again, discard it
          deferredPrompt = null;
        }
      });
    }
  }

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    // Hide the app-provided install promotion
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
    
    // Clear the deferredPrompt
    deferredPrompt = null;
    
    console.log('PWA was installed');
  });
}
