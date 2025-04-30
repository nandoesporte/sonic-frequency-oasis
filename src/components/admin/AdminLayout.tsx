
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, 
  SidebarFooter, SidebarGroup, SidebarGroupLabel, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, CreditCard, FileText, Settings, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

export const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Set auth check as complete when loading is done
    if (!loading) {
      setAuthChecked(true);
      
      // Show toast if access is denied
      if (!user) {
        toast.error('Acesso negado', {
          description: 'Você precisa fazer login para acessar esta página'
        });
      } else if (!isAdmin) {
        toast.error('Acesso negado', {
          description: 'Você não tem permissão de administrador'
        });
        console.error('Admin access denied. User:', user?.email, 'isAdmin:', isAdmin);
      } else {
        console.log('Admin access granted for:', user.email);
      }
    }
  }, [loading, user, isAdmin]);
  
  // Show detailed loading state while initial auth check is happening
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Verificando permissões...</p>
        <p className="text-xs text-muted-foreground mt-2">
          Aguarde enquanto verificamos seu acesso ao painel administrativo
        </p>
      </div>
    );
  }
  
  // Only redirect once we've finished checking authentication
  if (authChecked && (!user || !isAdmin)) {
    console.log('Access denied to admin area. User:', !!user, 'Admin:', isAdmin);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Only render the admin layout if user is authenticated and is an admin
  console.log('Rendering admin layout. User is admin:', isAdmin);
  return (
    <SidebarProvider>
      <div className="bg-muted/40 min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link to="/admin">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Usuários">
                    <Link to="/admin/users">
                      <Users />
                      <span>Usuários</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Assinaturas">
                    <Link to="/admin/subscriptions">
                      <CreditCard />
                      <span>Assinaturas</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Conteúdo">
                    <Link to="/admin/content">
                      <FileText />
                      <span>Conteúdo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Acesso de Admin">
                    <Link to="/admin/access">
                      <ShieldAlert />
                      <span>Acesso de Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Configurações">
                    <Link to="/admin/settings">
                      <Settings />
                      <span>Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-border p-4">
            <div className="text-sm text-muted-foreground">
              {user?.email}
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
