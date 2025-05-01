
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings, 
  Crown, 
  LayoutDashboard, 
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <LayoutDashboard className="w-5 h-5 mr-2" />
    },
    { 
      name: "Usuários", 
      path: "/admin/users", 
      icon: <Users className="w-5 h-5 mr-2" /> 
    },
    { 
      name: "Assinaturas", 
      path: "/admin/subscriptions", 
      icon: <Crown className="w-5 h-5 mr-2" /> 
    },
    { 
      name: "Configurações", 
      path: "/admin/settings", 
      icon: <Settings className="w-5 h-5 mr-2" /> 
    },
  ];

  return (
    <aside className="w-64 border-r bg-background hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 px-4">Admin</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive(item.path) ? "bg-secondary" : ""
              )}
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
