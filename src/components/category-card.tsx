
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CategoryProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

export function CategoryCard({ id, name, description, icon, count }: CategoryProps) {
  return (
    <Link to={`/category/${id}`}>
      <Card className="overflow-hidden hover-scale transition-all h-full">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className={cn(
              "rounded-full w-12 h-12 flex items-center justify-center mb-4",
              "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{description}</p>
            <div className="text-sm text-primary mt-auto">
              {count} frequencies
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
