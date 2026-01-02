
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryCount } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function CategoryCard({ id, name, description, icon }: CategoryCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Use a more efficient approach to fetch counts - only when the card is mounted
    const loadCount = async () => {
      try {
        console.log(`Loading count for category: ${id}`);
        const frequencyCount = await getCategoryCount(id);
        setCount(frequencyCount);
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };
    
    // Load counts regardless of auth status - frequencies should be visible to all
    loadCount();
  }, [id]);
  
  const handleClick = () => {
    // Navigate to the category page regardless of authentication status
    console.log(`Navigating to category: ${id}`);
    window.scrollTo(0, 0);
    navigate(`/categories/${id}`);
  };
  
  return (
    <Card 
      className={cn(
        "overflow-hidden hover-scale cursor-pointer",
        isMobile && "p-0"
      )}
      onClick={handleClick}
    >
      <CardHeader className={cn("pb-2", isMobile && "p-3 pb-1")}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon}
            <CardTitle className={cn("ml-2 text-xl", isMobile && "text-lg")}>{name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn(isMobile && "p-3 pt-1")}>
        <CardDescription className={cn("mb-3", isMobile && "text-sm mb-2")}>{description}</CardDescription>
        
        <div className="flex items-center justify-between">
          {count !== null && (
            <span className={cn("text-xs text-muted-foreground", isMobile && "text-xs")}>
              {count} frequências
            </span>
          )}
          
          <Button variant="ghost" size="sm" className={cn("ml-auto", isMobile && "h-8 px-2 text-xs")}>
            <span className="flex items-center">
              Explorar <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
