import { useAudio } from "@/lib/audio-context";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Pause, Play, RotateCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { FrequencyVisualizer } from "./frequency-visualizer";

export function AudioPlayer() {
  const { 
    isPlaying, 
    currentFrequency, 
    volume, 
    togglePlayPause, 
    setVolume, 
    addToFavorites, 
    favorites, 
    remainingTime,
    fadeIn,
    fadeOut
  } = useAudio();
  const [waves, setWaves] = useState<number[]>([]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const isFavorite = currentFrequency ? favorites.some(f => f.id === currentFrequency.id) : false;

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Prevent rapid clicks and debounce interactions
  const handleControlInteraction = (action: () => void) => {
    if (isInteracting) return;
    
    setIsInteracting(true);
    action();
    
    // Reset interaction state after a short delay
    setTimeout(() => {
      setIsInteracting(false);
    }, 300);
  };

  // Smoother toggle with fade in/out
  const handleTogglePlayPause = () => {
    console.log(`=== AUDIO PLAYER: Toggle chamado - isPlaying: ${isPlaying}, currentFrequency: ${currentFrequency?.name} ===`);
    
    handleControlInteraction(() => {
      if (isPlaying) {
        console.log('=== AUDIO PLAYER: Iniciando fade out e pausa ===');
        // If currently playing, trigger a fade out before stopping
        fadeOut().then(() => {
          console.log('=== AUDIO PLAYER: Fade out concluído, chamando togglePlayPause ===');
          togglePlayPause();
        });
      } else if (currentFrequency) {
        console.log('=== AUDIO PLAYER: Iniciando reprodução com fade in ===');
        // If not playing but frequency is selected, start playing with fade in
        togglePlayPause();
        fadeIn();
      } else {
        console.log('=== AUDIO PLAYER: Toggle sem frequência selecionada ===');
        togglePlayPause(); // Just toggle if no frequency is selected
      }
    });
  };

  // Handle volume change with debounce
  const handleVolumeChange = (values: number[]) => {
    handleControlInteraction(() => {
      setVolume(values[0] / 100);
    });
  };

  // Handle favorite button with debounce
  const handleFavoriteToggle = () => {
    if (!currentFrequency) return;
    
    handleControlInteraction(() => {
      addToFavorites(currentFrequency);
    });
  };

  if (!currentFrequency) {
    return (
      <Card className="fixed bottom-0 left-0 right-0 p-4 mx-4 mb-4 rounded-xl glass-card animate-slide-up">
        <div className="flex justify-center items-center text-muted-foreground py-2">
          <p>Selecione uma frequência para reproduzir</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 mx-4 mb-4 rounded-xl glass-card animate-slide-up z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleTogglePlayPause} 
            variant="secondary" 
            size="icon" 
            className={cn(
              "w-12 h-12 rounded-full text-primary bg-primary/10 hover:bg-primary/20",
              isInteracting && "pointer-events-none opacity-80"
            )}
            disabled={isInteracting}
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
              {isPlaying && remainingTime !== null && (
                <span className="ml-2 flex items-center text-primary">
                  <Clock className="h-3.5 w-3.5 mr-1 inline" />
                  {formatTime(remainingTime)}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isPlaying && (
            <>
              <div className="hidden xs:flex items-end h-8 px-2">
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
              <RotateCw className="h-4 w-4 text-primary/70" />
            </>
          )}
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => !isInteracting && setShowVolumeSlider(prev => !prev)}
              disabled={isInteracting}
              className={isInteracting ? "pointer-events-none opacity-80" : ""}
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
                  onValueChange={handleVolumeChange}
                  disabled={isInteracting}
                />
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFavoriteToggle}
            disabled={isInteracting}
            className={cn(
              isFavorite && "text-red-500",
              isInteracting && "pointer-events-none opacity-80"
            )}
          >
            <Heart className={cn(
              "h-5 w-5",
              isFavorite && "fill-current"
            )} />
          </Button>
        </div>
      </div>
      
      {/* Frequency Visualizer - Shows automatically when playing */}
      {isPlaying && currentFrequency && (
        <FrequencyVisualizer
          frequency={currentFrequency.hz}
          isPlaying={isPlaying}
          onClose={() => {}} // Não pode ser fechada manualmente, fecha automaticamente quando para
          frequencyName={currentFrequency.name}
        />
      )}
    </Card>
  );
}
