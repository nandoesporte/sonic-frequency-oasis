
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Footer } from "./components/ui/footer";
import { useAuth } from "@/hooks";
import { AudioNavigationWarning } from "./components/audio-navigation-warning";
import { AudioProvider } from "@/lib/audio-context";
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

// Route guard component that redirects to auth if not logged in
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}

// Public route component that redirects to categories if logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (user) {
    return <Navigate to="/categories/emocao" />;
  }
  
  return <>{children}</>;
}

// The main application content
function AppContent() {
  const { user } = useAuth();
  
  useEffect(() => {
    // Always use dark theme
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Toaster />
      <TermsAcceptanceDialog />
      {user && <FrequenciesGuideDialog />}
      <AudioProvider>
        <AudioNavigationWarning>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/auth" 
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } 
            />
            <Route path="/terms" element={<Terms />} />
            
            {/* Private routes - require authentication */}
            <Route path="/categories/:category" element={
              <PrivateRoute>
                <Category />
              </PrivateRoute>
            } />
            <Route path="/trending" element={
              <PrivateRoute>
                <Trending />
              </PrivateRoute>
            } />
            <Route path="/favorites" element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            } />
            <Route path="/guide" element={
              <PrivateRoute>
                <Guide />
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
            <Route path="/premium" element={
              <PrivateRoute>
                <Premium />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } />
            <Route path="/webhook-config" element={
              <PrivateRoute>
                <WebhookConfig />
              </PrivateRoute>
            } />
            <Route path="/scientific" element={
              <PrivateRoute>
                <Scientific />
              </PrivateRoute>
            } />
            
            {/* Root route - redirect based on auth status */}
            <Route 
              path="/" 
              element={
                user ? (
                  <Navigate to="/categories/emocao" replace />
                ) : (
                  <Navigate to="/auth" replace />
                )
              } 
            />
            
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
