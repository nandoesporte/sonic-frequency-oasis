
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "../header";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Protect admin routes - redirect if not authenticated or not an admin
  useEffect(() => {
    // Only check once when loading is complete
    if (!loading) {
      if (!user) {
        console.log('Unauthorized access attempt to admin area (not logged in), redirecting');
        toast.error('Acesso restrito', {
          description: 'Você precisa estar logado para acessar a área de administração.'
        });
        navigate('/auth', { replace: true });
      } else if (isAdmin === false) {
        console.log('Unauthorized access attempt to admin area (not admin), redirecting');
        toast.error('Acesso restrito', {
          description: 'Você não tem permissões de administrador.'
        });
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // If not admin or not logged in, the useEffect will redirect
  if (!isAdmin && !user) {
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
