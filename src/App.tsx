
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Footer } from "./components/ui/footer";
import { useAuth } from "@/hooks";
import { AudioNavigationWarning } from "./components/audio-navigation-warning";
import { AudioProvider } from "@/lib/audio-context";
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

// Protected Route component to handle auth redirects
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    console.log('User not authenticated, redirecting to auth page from:', location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// ScrollToTop component that uses the useLocation hook to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Scrolled to top on navigation to:", location.pathname);
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

// The main application content
function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Always use dark theme
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    
    // Log current auth state and location for debugging
    console.log("Auth state:", user ? "Logged in" : "Not logged in", "Path:", location.pathname);
  }, [user, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Toaster />
      <TermsAcceptanceDialog />
      {user && <FrequenciesGuideDialog />}
      <AudioProvider>
        <AudioNavigationWarning>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scientific" element={<Scientific />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/categories/:category" element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            } />
            <Route path="/trending" element={
              <ProtectedRoute>
                <Trending />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/guide" element={
              <ProtectedRoute>
                <Guide />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/premium" element={
              <ProtectedRoute>
                <Premium />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/webhook-config" element={
              <ProtectedRoute>
                <WebhookConfig />
              </ProtectedRoute>
            } />
            
            {/* Catch all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AudioNavigationWarning>
      </AudioProvider>
      <ConditionalFooter />
    </div>
  );
}

function App() {
  console.log("App component rendered");
  
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
