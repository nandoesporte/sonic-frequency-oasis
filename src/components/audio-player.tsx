
import { useAudio } from "@/lib/audio-context";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Heart, Pause, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function AudioPlayer() {
  const { isPlaying, currentFrequency, volume, togglePlayPause, setVolume, addToFavorites, favorites } = useAudio();
  const [waves, setWaves] = useState<number[]>([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const isFavorite = currentFrequency ? favorites.some(f => f.id === currentFrequency.id) : false;

  // Generate random wave heights for animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setWaves(Array.from({ length: 5 }, () => Math.random() * 0.8 + 0.5));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setWaves(Array.from({ length: 5 }, () => 0.5));
    }
  }, [isPlaying]);

  if (!currentFrequency) {
    return (
      <Card className="fixed bottom-0 left-0 right-0 p-4 mx-4 mb-4 rounded-xl glass-card animate-slide-up">
        <div className="flex justify-center items-center text-muted-foreground py-2">
          <p>Select a frequency to play</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 mx-4 mb-4 rounded-xl glass-card animate-slide-up z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={togglePlayPause} 
            variant="secondary" 
            size="icon" 
            className="w-12 h-12 rounded-full text-primary bg-primary/10 hover:bg-primary/20"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
          
          <div>
            <h3 className="font-bold">{currentFrequency.name}</h3>
            <p className="text-sm text-muted-foreground">
              {currentFrequency.hz} Hz • {currentFrequency.purpose}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-end h-8 px-2">
              {waves.map((height, i) => (
                <div 
                  key={i}
                  className="freq-wave"
                  style={{ 
                    height: `${height * 24}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowVolumeSlider(prev => !prev)}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
            
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 p-4 bg-card rounded-lg shadow-lg mb-2 w-48">
                <Slider
                  value={[volume * 100]} 
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0] / 100)}
                />
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => addToFavorites(currentFrequency)}
            className={cn(
              isFavorite && "text-red-500"
            )}
          >
            <Heart className={cn(
              "h-5 w-5",
              isFavorite && "fill-current"
            )} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
