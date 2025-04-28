
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  count?: number;
  requiresAuth?: boolean;
}

export function CategoryCard({ id, name, description, icon, count, requiresAuth }: CategoryCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden relative group hover:shadow-md transition-all duration-200",
      "hover:scale-[1.02] active:scale-[0.98]"
    )}>
      <Link to={requiresAuth ? "/auth" : `/categories/${id}`}>
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <CardTitle className="flex items-center gap-2">
            {name}
            {count && <span className="text-sm text-muted-foreground">({count})</span>}
          </CardTitle>
          <CardDescription>{requiresAuth ? "Entre para acessar" : description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}
