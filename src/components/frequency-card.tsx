import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudio } from "@/lib/audio-context";
import { FrequencyData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, Crown, Lock, Volume } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePremium } from "@/hooks/use-premium";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { useState } from "react";
import { PremiumContentDialog } from "@/components/subscription/PremiumContentDialog";

interface FrequencyCardProps {
  frequency: FrequencyData;
  variant?: "default" | "trending" | "compact";
  onBeforePlay?: () => boolean; // Return true to prevent default play behavior
}

export function FrequencyCard({ frequency, variant = "default", onBeforePlay }: FrequencyCardProps) {
  const { play, isPlaying, currentFrequency, addToFavorites, favorites } = useAudio();
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  
  // Safety check in case the frequency data is null or undefined
  if (!frequency) {
    return null;
  }
  
  const isCurrentlyPlaying = isPlaying && currentFrequency?.id === frequency.id;
  const isFavorite = favorites.some(f => f.id === frequency.id);
  const isFreeFrequency = frequency.free === true;
  
  const handlePlay = () => {
    // If there's an onBeforePlay callback and it returns true, stop processing
    if (onBeforePlay && onBeforePlay()) {
      console.log("Play prevented by onBeforePlay callback");
      return;
    }
    
    // If it's a free frequency, allow playback without login check
    if (isFreeFrequency) {
      console.log("Playing free frequency");
      play(frequency);
      return;
    }
    
    // Otherwise check login status
    if (!user) {
      console.log("User not logged in, redirecting to auth page");
      toast.info("Faça login para ouvir", {
        description: "É necessário estar logado para ouvir as frequências"
      });
      navigate("/auth");
      return;
    }
    
    // Check premium status for non-free frequencies
    if (frequency.premium && !isPremium) {
      console.log("Opening premium content dialog");
      setPremiumDialogOpen(true);
      return;
    }
    
    play(frequency);
  };
  
  const handleAddToFavorites = () => {
    if (!user) {
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
      <>
        <Card className={cn(
          "overflow-hidden hover-scale transition-all",
          variant === "trending" && "border-purple-light bg-purple-light/10",
          isCurrentlyPlaying && "border-primary",
          frequency.premium && !isPremium && !isFreeFrequency && "border-purple-300",
          isFreeFrequency && "border-green-300 bg-green-50/10"
        )}>
          <div className="flex items-center p-4">
            <Button
              onClick={handlePlay}
              variant="secondary"
              size="icon"
              className={cn(
                "w-10 h-10 rounded-full mr-3 flex-shrink-0",
                isCurrentlyPlaying ? "bg-purple-500 text-white" : isFreeFrequency ? "bg-green-500 text-white" : "bg-secondary"
              )}
            >
              {frequency.premium && !isPremium && !isFreeFrequency ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate text-base">
                  {frequency.name}
                  {frequency.premium && !isFreeFrequency && (
                    <Crown className="inline-block w-4 h-4 ml-1 text-purple-500" />
                  )}
                </h3>
                {isFreeFrequency && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                    <Volume className="w-3 h-3 mr-1" />
                    Grátis
                  </Badge>
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
        
        <PremiumContentDialog 
          open={premiumDialogOpen}
          onOpenChange={setPremiumDialogOpen}
          frequencyName={frequency.name}
        />
      </>
    );
  }
  
  // Default full card
  return (
    <>
      <Card className={cn(
        "overflow-hidden hover-scale transition-all",
        isCurrentlyPlaying && "border-primary",
        frequency.premium && !isPremium && !isFreeFrequency && "border-purple-300",
        isFreeFrequency && "border-green-300 bg-green-50/10"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{frequency.name}</CardTitle>
            <div className="flex gap-2">
              {isFreeFrequency && (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                  <Volume className="w-3 h-3 mr-1" />
                  Grátis
                </Badge>
              )}
              {frequency.premium && !isFreeFrequency && (
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
            onClick={handlePlay}
            variant={isCurrentlyPlaying ? "default" : isFreeFrequency ? "default" : "secondary"}
            className={cn(
              "w-full mr-2", 
              isCurrentlyPlaying && "bg-purple-500 hover:bg-purple-600",
              isFreeFrequency && !isCurrentlyPlaying && "bg-green-500 hover:bg-green-600"
            )}
          >
            {frequency.premium && !isPremium && !isFreeFrequency ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Conteúdo Premium
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {isCurrentlyPlaying ? "Tocando" : isFreeFrequency ? "Ouvir Grátis" : "Tocar Agora"}
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
      
      <PremiumContentDialog 
        open={premiumDialogOpen}
        onOpenChange={setPremiumDialogOpen}
        frequencyName={frequency.name}
      />
    </>
  );
}
