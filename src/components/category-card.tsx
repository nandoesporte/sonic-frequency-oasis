
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

export function CategoryCard({ id, name, description, icon, requiresAuth = false }: CategoryCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/categories/${id}`);
  };

  return (
    <Link to={`/categories/${id}`}>
      <Card
        className={cn(
          "cursor-pointer overflow-hidden relative hover-scale group",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
            id.includes("sleep") && "from-blue-400 to-purple-400",
            id.includes("healing") && "from-purple-400 to-pink-400",
            id.includes("cognitive") && "from-amber-400 to-orange-400",
            id.includes("solfeggio") && "from-orange-400 to-rose-400",
            id.includes("emotional") && "from-green-400 to-cyan-400",
            id.includes("spiritual") && "from-indigo-400 to-sky-400",
            id.includes("pain") && "from-red-400 to-orange-400",
            id.includes("physical") && "from-lime-400 to-emerald-400"
          )}
        />
        <CardContent className="flex items-center p-6">
          <div
            className={cn(
              "mr-4 p-2 rounded-full",
              id.includes("sleep") && "bg-blue-100 dark:bg-blue-900/30",
              id.includes("healing") && "bg-purple-100 dark:bg-purple-900/30",
              id.includes("cognitive") && "bg-amber-100 dark:bg-amber-900/30",
              id.includes("solfeggio") && "bg-orange-100 dark:bg-orange-900/30",
              id.includes("emotional") && "bg-green-100 dark:bg-green-900/30",
              id.includes("spiritual") && "bg-indigo-100 dark:bg-indigo-900/30",
              id.includes("pain") && "bg-red-100 dark:bg-red-900/30",
              id.includes("physical") && "bg-lime-100 dark:bg-lime-900/30"
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <ChevronRight className="opacity-60 ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </CardContent>
      </Card>
    </Link>
  );
}
