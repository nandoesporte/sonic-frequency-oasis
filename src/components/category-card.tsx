
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
          console.log(`Loading count for category: ${id}`);
          const frequencyCount = await getCategoryCount(id);
          setCount(frequencyCount);
          console.log(`Category ${id} has ${frequencyCount} frequencies`);
        }
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };
    
    if (user) {
      loadCount();
    }
  }, [id, user]);
  
  const handleClick = () => {
    if (requiresAuth && !user) {
      console.log("Auth required, redirecting to login");
      toast.info("Faça login para acessar", {
        description: "É necessário estar logado para acessar esta categoria"
      });
      navigate("/auth");
      return;
    }
    
    // Normal navigation with scroll to top
    console.log(`Navigating to category: ${id}`);
    window.scrollTo(0, 0);
    navigate(`/categories/${id}`);
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden hover-scale cursor-pointer", 
        requiresAuth && !user && "opacity-80 hover:opacity-100"
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon}
            <CardTitle className="ml-2">{name}</CardTitle>
          </div>
          {requiresAuth && !user && <Lock className="h-4 w-4 text-muted-foreground" />}
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
          
          <Button variant="ghost" size="sm" className="ml-auto">
            <span className="flex items-center">
              Explorar <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
