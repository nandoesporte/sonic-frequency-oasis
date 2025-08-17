import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fd15ed9db28348949de25d9a8c0d8a8e',
  appName: 'sonic-frequency-oasis',
  webDir: 'dist',
  server: {
    url: 'https://fd15ed9d-b283-4894-9de2-5d9a8c0d8a8e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1e1e2e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    }
  }
};

export default config;