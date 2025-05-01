
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  ShieldAlert,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const AdminMenu = () => {
  // Safe access to useAuth - wrapping in try/catch to prevent app crashes if used outside AuthProvider
  let isAdmin = false;
  let navigate;
  
  try {
    const auth = useAuth();
    isAdmin = auth.isAdmin;
    navigate = useNavigate();
  } catch (error) {
    console.error("AdminMenu must be used within AuthProvider", error);
    return null; // Return null if not within AuthProvider
  }

  if (!isAdmin) return null;

  const handleNavigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <NavigationMenu className="max-w-none px-4 py-2 bg-primary/10 rounded-md">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-primary/20">
            Painel Administrativo
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin"
                    onClick={handleNavigate('/admin')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Visão geral da plataforma e estatísticas.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin/users"
                    onClick={handleNavigate('/admin/users')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <Users className="h-4 w-4" />
                      <span>Usuários</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gerenciar usuários da plataforma.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin/subscriptions"
                    onClick={handleNavigate('/admin/subscriptions')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <CreditCard className="h-4 w-4" />
                      <span>Assinaturas</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gerenciar assinaturas e pagamentos.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin/content"
                    onClick={handleNavigate('/admin/content')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <FileText className="h-4 w-4" />
                      <span>Conteúdo</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gerenciar o conteúdo da plataforma.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin/access"
                    onClick={handleNavigate('/admin/access')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Acesso de Admin</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Gerenciar permissões de administradores.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/admin/settings"
                    onClick={handleNavigate('/admin/settings')}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium leading-none">
                      <Settings className="h-4 w-4" />
                      <span>Configurações</span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Configurações gerais do sistema.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default AdminMenu;
