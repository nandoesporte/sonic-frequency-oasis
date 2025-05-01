
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

const queryClient = new QueryClient();

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
            <Toaster />
            <Sonner position="top-center" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/scientific" element={<Scientific />} />
              <Route path="/categories/:category" element={<Category />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/history" element={<History />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* Catch all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
