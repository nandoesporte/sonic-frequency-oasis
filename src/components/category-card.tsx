
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  requiresAuth?: boolean;
}

export function CategoryCard({ id, name, description, icon, requiresAuth }: CategoryCardProps) {
  return (
    <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow hover-scale">
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="ml-3 font-semibold text-lg">{name}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <Button 
        asChild 
        variant="outline" 
        className="w-full"
      >
        <Link to={requiresAuth ? "/auth" : `/categories/${id}`} className="gap-2">
          {requiresAuth ? "Entre para acessar" : "Explorar categoria"}
        </Link>
      </Button>
    </div>
  );
}
