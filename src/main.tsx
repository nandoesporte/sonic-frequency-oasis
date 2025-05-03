
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initPwaInstall } from './lib/pwa-install'

// Initialize PWA installation handling
if (typeof window !== 'undefined') {
  initPwaInstall();
}

createRoot(document.getElementById("root")!).render(<App />);
