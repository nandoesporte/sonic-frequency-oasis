
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "../header";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Protect admin routes - redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      console.log('Unauthorized access attempt to admin area, redirecting');
      navigate('/auth', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not admin, this component will not render due to the redirect in useEffect
  if (!isAdmin && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
