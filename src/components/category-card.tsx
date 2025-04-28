
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryCount } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

export function CategoryCard({ id, name, description, icon, requiresAuth = false }: CategoryCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCount = async () => {
      try {
        if (user) {
          const frequencyCount = await getCategoryCount(id);
          setCount(frequencyCount);
        }
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };
    
    loadCount();
  }, [id, user]);
  
  const handleClick = () => {
    if (requiresAuth) {
      toast.info("Faça login para acessar", {
        description: "É necessário estar logado para acessar esta categoria"
      });
      navigate("/auth");
      return;
    }
    
    // Normal navigation
    navigate(`/categories/${id}`);
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden hover-scale cursor-pointer", 
        requiresAuth && "opacity-80 hover:opacity-100"
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon}
            <CardTitle className="ml-2">{name}</CardTitle>
          </div>
          {requiresAuth && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-3">{description}</CardDescription>
        
        <div className="flex items-center justify-between">
          {user && count !== null && (
            <span className="text-xs text-muted-foreground">
              {count} frequências
            </span>
          )}
          
          <Button variant="ghost" size="sm" className="ml-auto" asChild>
            <span>
              Explorar <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
