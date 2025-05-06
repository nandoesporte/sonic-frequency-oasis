
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
    // Make sure we use the correct path format
    navigate(`/categories/${id}`);
  };
  
  return (
    <Card 
      className="overflow-hidden hover-scale cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon}
            <CardTitle className={cn("ml-2 text-xl", isMobile && "text-2xl")}>{name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className={cn("mb-3", isMobile && "text-base")}>{description}</CardDescription>
        
        <div className="flex items-center justify-between">
          {count !== null && (
            <span className={cn("text-xs text-muted-foreground", isMobile && "text-sm")}>
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
