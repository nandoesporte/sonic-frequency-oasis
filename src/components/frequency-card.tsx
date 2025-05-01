
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudio } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePremium } from "@/hooks/use-premium";

interface FrequencyCardProps {
  frequency: FrequencyData;
  variant?: "default" | "trending" | "compact";
}

export function FrequencyCard({ frequency, variant = "default" }: FrequencyCardProps) {
  const { play, isPlaying, currentFrequency, addToFavorites, favorites } = useAudio();
  const { isPremium } = usePremium();
  
  const isCurrentlyPlaying = isPlaying && currentFrequency?.id === frequency.id;
  const isFavorite = favorites.some(f => f.id === frequency.id);
  
  const handlePlay = () => {
    play(frequency);
  };
  
  // For trending and compact views
  if (variant === "trending" || variant === "compact") {
    return (
      <Card className={cn(
        "overflow-hidden hover-scale transition-all",
        variant === "trending" && "border-purple-light bg-purple-light/10",
        isCurrentlyPlaying && "border-primary",
        frequency.premium && !isPremium && "border-amber-200"
      )}>
        <div className="flex items-center p-4">
          <Button
            onClick={handlePlay}
            variant="secondary"
            size="icon"
            className={cn(
              "w-10 h-10 rounded-full mr-3 flex-shrink-0",
              isCurrentlyPlaying ? "bg-primary text-white" : "bg-secondary"
            )}
          >
            <Play className="h-5 w-5 ml-0.5" />
          </Button>
          
          <div className="flex-grow min-w-0">
            <h3 className="font-semibold truncate">
              {frequency.name}
              {frequency.premium && (
                <Crown className="inline-block w-4 h-4 ml-1 text-amber-500" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {frequency.hz} Hz • {frequency.purpose}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => addToFavorites(frequency)}
            className={cn(
              "flex-shrink-0",
              isFavorite && "text-red-500"
            )}
          >
            <Heart className={cn(
              "h-4 w-4",
              isFavorite && "fill-current"
            )} />
          </Button>
        </div>
      </Card>
    );
  }
  
  // Default full card
  return (
    <Card className={cn(
      "overflow-hidden hover-scale transition-all",
      isCurrentlyPlaying && "border-primary",
      frequency.premium && !isPremium && "border-amber-200"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{frequency.name}</CardTitle>
          {frequency.premium && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-2">
          <Badge variant="secondary">{frequency.hz} Hz</Badge>
          <Badge variant="outline">{frequency.category}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">{frequency.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          onClick={handlePlay}
          variant={isCurrentlyPlaying ? "default" : "secondary"}
          className={cn(
            "w-full mr-2", 
            isCurrentlyPlaying && "bg-primary hover:bg-primary/90"
          )}
        >
          <Play className="mr-2 h-4 w-4" />
          {isCurrentlyPlaying ? "Tocando" : "Tocar Agora"}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => addToFavorites(frequency)}
          className={cn(
            isFavorite && "text-red-500 border-red-200"
          )}
        >
          <Heart className={cn(
            "h-4 w-4",
            isFavorite && "fill-current"
          )} />
        </Button>
      </CardFooter>
    </Card>
  );
}
