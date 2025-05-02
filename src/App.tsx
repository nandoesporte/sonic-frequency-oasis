
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Footer } from "./components/ui/footer";
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

const queryClient = new QueryClient();

// ScrollToTop component that uses the useLocation hook to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <ScrollToTop />
              <Toaster />
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
                
                {/* Catch all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
