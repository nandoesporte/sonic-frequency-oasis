
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/use-admin";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminKiwifySettings } from "@/components/admin/AdminKiwifySettings";

export default function AdminSettings() {
  const { user, loading } = useAuth();
  const { isAdmin, isChecking } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificação única para redirecionamento
    const shouldRedirect = !loading && !isChecking && (!user || isAdmin === false);
    
    if (shouldRedirect) {
      console.log('Redirecting from AdminSettings - Not authorized');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, isAdmin, isChecking, navigate]);

  // Mostrar estado de carregamento
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não for admin, não renderiza
  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Configurações</h1>
        <AdminKiwifySettings />
      </div>
    </AdminLayout>
  );
}
