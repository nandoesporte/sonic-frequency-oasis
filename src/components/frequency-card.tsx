
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudio } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePremium } from "@/hooks/use-premium";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface FrequencyCardProps {
  frequency: FrequencyData;
  variant?: "default" | "trending" | "compact";
  onBeforePlay?: () => boolean; // Return true to prevent default play behavior
}

export function FrequencyCard({ frequency, variant = "default", onBeforePlay }: FrequencyCardProps) {
  const { play, isPlaying, currentFrequency, addToFavorites, favorites } = useAudio();
  const { hasAccess, isInTrialPeriod, trialDaysLeft } = usePremium();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Safety check in case the frequency data is null or undefined
  if (!frequency) {
    return null;
  }
  
  const isCurrentlyPlaying = isPlaying && currentFrequency?.id === frequency.id;
  const isFavorite = favorites.some(f => f.id === frequency.id);
  
  const handlePlay = () => {
    // If there's an onBeforePlay callback and it returns true, stop processing
    if (onBeforePlay && onBeforePlay()) {
      console.log("Play prevented by onBeforePlay callback");
      return;
    }
    
    if (!user && !loading) {
      console.log("User not logged in, redirecting to auth page");
      toast.info("Faça login para ouvir", {
        description: "É necessário estar logado para ouvir as frequências"
      });
      navigate("/auth");
      return;
    }
    
    // Check if user has access (premium or trial)
    if (frequency.premium && !hasAccess) {
      if (isInTrialPeriod) {
        toast.info("Período de Teste", {
          description: `Você tem ${trialDaysLeft} dias restantes no seu teste gratuito`
        });
      } else {
        toast.info("Teste Expirado", {
          description: "Seu período de teste expirou. Assine para continuar ouvindo"
        });
      }
      navigate("/premium#planos");
      return;
    }
    
    play(frequency);
  };
  
  const handleCardClick = () => {
    // If premium content and user doesn't have access, redirect to premium plans
    if (frequency.premium && !hasAccess) {
      navigate("/premium#planos");
      return;
    }
  };
  
  const handleAddToFavorites = (e: React.MouseEvent) => {
    // Prevent the click event from bubbling up to the card
    e.stopPropagation();
    
    if (!user && !loading) {
      toast.info("Faça login para favoritar", {
        description: "É necessário estar logado para adicionar aos favoritos"
      });
      navigate("/auth");
      return;
    }
    
    addToFavorites(frequency);
  };
  
  // For trending and compact views - simplified for better performance
  if (variant === "trending" || variant === "compact") {
    return (
      <Card 
        className={cn(
          "overflow-hidden hover-scale transition-all cursor-pointer",
          variant === "trending" && "border-purple-light bg-purple-light/10",
          isCurrentlyPlaying && "border-primary",
          frequency.premium && !hasAccess && "border-purple-300"
        )}
        onClick={handleCardClick}
      >
        <div className="flex items-center p-4">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            variant="secondary"
            size="icon"
            className={cn(
              "w-10 h-10 rounded-full mr-3 flex-shrink-0",
              isCurrentlyPlaying ? "bg-purple-500 text-white" : "bg-secondary"
            )}
          >
            {frequency.premium && !hasAccess ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center">
              <h3 className="font-semibold truncate text-base">
                {frequency.name}
                {frequency.premium && (
                  <Crown className="inline-block w-4 h-4 ml-1 text-purple-500" />
                )}
              </h3>
              {!frequency.premium && (
                <Badge variant="success" className="ml-2 text-xs">Grátis</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {frequency.hz} Hz • {frequency.purpose}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleAddToFavorites}
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
    <Card 
      className={cn(
        "overflow-hidden hover-scale transition-all cursor-pointer",
        isCurrentlyPlaying && "border-primary",
        frequency.premium && !hasAccess && "border-purple-300"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{frequency.name}</CardTitle>
          <div className="flex space-x-2">
            {!frequency.premium && (
              <Badge variant="success">Grátis</Badge>
            )}
            {frequency.premium && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
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
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          variant={isCurrentlyPlaying ? "default" : "secondary"}
          className={cn(
            "w-full mr-2", 
            isCurrentlyPlaying && "bg-purple-500 hover:bg-purple-600"
          )}
        >
          {frequency.premium && !hasAccess ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Conteúdo Premium
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              {isCurrentlyPlaying ? "Tocando" : "Tocar Agora"}
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleAddToFavorites}
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
