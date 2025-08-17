
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { pwaInstallManager } from './lib/pwa-install'

// Initialize PWA installation handling
if (typeof window !== 'undefined') {
  // Initialize PWA functionality automatically
  
  // Configure exit intent detection for non-logged users
  let exitIntentShown = false;
  document.addEventListener('mouseout', (e) => {
    // Check if the user is trying to leave the page
    if (!exitIntentShown && e.clientY < 0) {
      exitIntentShown = true;
      
      // Check if user is not logged in - this is a basic check, authentication check will happen in the component
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        // We'll just set a flag to show the exit intent popup in the app
        // The actual popup will be managed by the App component
        localStorage.setItem('showExitIntent', 'true');
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
