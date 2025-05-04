
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Footer } from "./components/ui/footer";
import { useAuth } from "@/hooks";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Category from "./pages/Category";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Premium from "./pages/Premium";
import NotFound from "./pages/NotFound";
import Trending from "./pages/Trending";
import Guide from "./pages/Guide";
import Scientific from "./pages/Scientific";
import Admin from "./pages/Admin";
import WebhookConfig from "./pages/WebhookConfig";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import { TermsAcceptanceDialog } from "./components/TermsAcceptanceDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FrequenciesGuideDialog } from "./components/FrequenciesGuideDialog";

const queryClient = new QueryClient();

// ScrollToTop component that uses the useLocation hook to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
}

// Footer component that conditionally renders based on auth state and current path
function ConditionalFooter() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't render footer if user is not logged in or on auth page
  if (!user || location.pathname === '/auth') {
    return null;
  }
  
  return <Footer />;
}

// The main application component
function AppContent() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Alterado para preferir o tema escuro por padrão
    const theme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "dark");
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Toaster />
      <TermsAcceptanceDialog />
      {user && <FrequenciesGuideDialog />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scientific" element={<Scientific />} />
        <Route path="/categories/:category" element={<Category />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/history" element={<History />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/webhook-config" element={<WebhookConfig />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConditionalFooter />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
