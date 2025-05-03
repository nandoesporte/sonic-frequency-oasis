import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';
import { FrequencyData } from '@/lib/data';
import { PremiumContentDialog } from '@/components/subscription/PremiumContentDialog';

// Define the Screen Orientation API types that are missing in TypeScript
interface ScreenOrientationExtended extends ScreenOrientation {
  lock(orientation: 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'): Promise<void>;
  unlock(): void;
}

interface ScreenExtended extends Screen {
  orientation: ScreenOrientationExtended;
}

type AudioContextType = {
  isPlaying: boolean;
  currentFrequency: FrequencyData | null;
  volume: number;
  play: (frequency: FrequencyData) => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  togglePlayPause: () => void;
  addToFavorites: (frequency: FrequencyData) => void;
  removeFromFavorites: (id: string) => void;
  favorites: FrequencyData[];
  history: FrequencyData[];
  remainingTime: number | null;
  fadeIn: () => Promise<void>;
  fadeOut: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<FrequencyData | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [favorites, setFavorites] = useState<FrequencyData[]>([]);
  const [history, setHistory] = useState<FrequencyData[]>([]);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumFrequency, setPremiumFrequency] = useState<FrequencyData | null>(null);
  const { user } = useAuth();
  const { isPremium } = usePremium();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_PLAY_TIME = 30 * 60; // 30 minutes in seconds
  const fadeTime = 0.5; // 500ms fade time for smoother transitions

  // Lock screen orientation when audio is playing
  useEffect(() => {
    // Only attempt to lock orientation if playing and the API is supported
    if (isPlaying && window.screen && 'orientation' in window.screen) {
      try {
        // Cast screen to our extended type that includes the lock method
        const screenExtended = window.screen as unknown as ScreenExtended;
        
        // Lock to portrait orientation
        screenExtended.orientation.lock('portrait')
          .then(() => {
            console.log('Screen orientation locked to portrait');
          })
          .catch(error => {
            console.error('Failed to lock screen orientation:', error);
          });
      } catch (error) {
        console.error('Error accessing screen orientation API:', error);
      }
      
      // Unlock when component unmounts or playback stops
      return () => {
        if (window.screen && 'orientation' in window.screen) {
          try {
            const screenExtended = window.screen as unknown as ScreenExtended;
            screenExtended.orientation.unlock();
            console.log('Screen orientation unlocked');
          } catch (error) {
            console.error('Error unlocking screen orientation:', error);
          }
        }
      };
    }
  }, [isPlaying]);

  // Cleanup function for audio resources
  const cleanupAudioResources = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      try {
        // We now handle fade out in the fadeOut() function
        // so just disconnect the nodes here
        setTimeout(() => {
          try {
            oscillatorRef.current?.stop();
            oscillatorRef.current?.disconnect();
            oscillatorRef.current = null;
            
            gainNodeRef.current?.disconnect();
            gainNodeRef.current = null;
          } catch (e) {
            console.error('Error during audio cleanup:', e);
          }
        }, fadeTime * 1000);
      } catch (error) {
        console.error('Error in cleanup audio resources:', error);
      }
    }
    
    // Clear timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupAudioResources();
      
      if (audioContextRef.current?.state !== 'closed') {
        try {
          audioContextRef.current?.close();
        } catch (e) {
          console.error('Error closing audio context:', e);
        }
      }
    };
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('frequency-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      const savedHistory = localStorage.getItem('frequency-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('frequency-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('frequency-history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
  }, [history]);

  // Explicit fade in function for smooth start
  const fadeIn = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (gainNodeRef.current && audioContextRef.current) {
        try {
          const currentTime = audioContextRef.current.currentTime;
          // Start from 0 volume
          gainNodeRef.current.gain.setValueAtTime(0, currentTime);
          // Gradually increase to set volume
          gainNodeRef.current.gain.linearRampToValueAtTime(volume, currentTime + fadeTime);
          
          // Resolve after the fade is complete
          setTimeout(() => resolve(), fadeTime * 1000);
        } catch (e) {
          console.error('Error during fade in:', e);
          resolve(); // Resolve even on error to continue execution
        }
      } else {
        resolve(); // Resolve immediately if no gain node
      }
    });
  };

  // Explicit fade out function for smooth stop
  const fadeOut = async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (gainNodeRef.current && audioContextRef.current) {
        try {
          const currentTime = audioContextRef.current.currentTime;
          // Get current gain value
          gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
          // Gradually decrease to zero
          gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + fadeTime);
          
          // Resolve after the fade is complete
          setTimeout(() => resolve(), fadeTime * 1000);
        } catch (e) {
          console.error('Error during fade out:', e);
          resolve(); // Resolve even on error to continue execution
        }
      } else {
        resolve(); // Resolve immediately if no gain node
      }
    });
  };

  // Start playing a frequency
  const play = async (frequency: FrequencyData) => {
    try {
      if (frequency.premium && !isPremium) {
        setPremiumFrequency(frequency);
        setShowPremiumDialog(true);
        return;
      }

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Create audio context if doesn't exist
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
          console.error('Web Audio API is not supported in this browser.', e);
          toast.error('Seu navegador não suporta Web Audio API');
          return;
        }
      }
      
      const ctx = audioContextRef.current;
      
      // Clean up existing oscillator with smooth fade out
      if (oscillatorRef.current) {
        // Use our fadeOut function for consistent behavior
        await fadeOut();
        
        const oldOscillator = oscillatorRef.current;
        const oldGain = gainNodeRef.current;
        
        setTimeout(() => {
          try {
            oldOscillator?.stop();
            oldOscillator?.disconnect();
            oldGain?.disconnect();
          } catch (e) {
            console.error('Error cleaning up old oscillator:', e);
          }
        }, fadeTime * 1000);
      }
      
      // Resume audio context if it's suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      // Create new oscillator and gain node
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency.hz, ctx.currentTime);
      
      // Start with zero gain for smooth fade in
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Start the oscillator
      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      setIsPlaying(true);
      setCurrentFrequency(frequency);
      
      // Perform the fade in
      await fadeIn();
      
      // Set initial remaining time to 30 minutes
      setRemainingTime(MAX_PLAY_TIME);
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up, pause the playback with fade out
            clearInterval(timerRef.current!);
            timerRef.current = null;
            fadeOut().then(() => {
              setIsPlaying(false);
              setRemainingTime(null);
            });
            toast.info(`Reprodução de ${frequency.name} encerrada após 30 minutos`);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(item => item.id !== frequency.id);
        return [frequency, ...filtered].slice(0, 20);
      });
      
      toast.success(`Tocando ${frequency.name} (${frequency.hz}Hz) por até 30 minutos`);
    } catch (error) {
      console.error('Error playing frequency:', error);
      toast.error("Não foi possível reproduzir a frequência. Tente novamente.");
    }
  };

  // Pause the currently playing frequency
  const pause = () => {
    try {
      fadeOut().then(() => {
        cleanupAudioResources();
        setIsPlaying(false);
        setRemainingTime(null);
      });
    } catch (error) {
      console.error('Error pausing frequency:', error);
      setIsPlaying(false);
    }
  };

  // Update the volume
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        // Apply volume change with a small ramp for smoothness
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(newVolume, currentTime + 0.05);
      } catch (e) {
        console.error('Error updating volume:', e);
      }
    }
  };

  // Toggle between play and pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentFrequency) {
      play(currentFrequency);
    } else {
      toast.info("Selecione uma frequência para tocar");
    }
  };

  // Add a frequency to favorites
  const addToFavorites = (frequency: FrequencyData) => {
    try {
      if (!favorites.some(f => f.id === frequency.id)) {
        setFavorites(prev => [...prev, frequency]);
        toast.success(`${frequency.name} adicionada aos favoritos`);
      } else {
        toast.info("Esta frequência já está nos favoritos");
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error("Não foi possível adicionar aos favoritos");
    }
  };

  // Remove a frequency from favorites
  const removeFromFavorites = (id: string) => {
    try {
      setFavorites(prev => {
        const newFavorites = prev.filter(f => f.id !== id);
        return newFavorites;
      });
      toast.success('Removido dos favoritos');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error("Não foi possível remover dos favoritos");
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentFrequency,
        volume,
        play,
        pause,
        setVolume: updateVolume,
        togglePlayPause,
        addToFavorites,
        removeFromFavorites,
        favorites,
        history,
        remainingTime,
        fadeIn,
        fadeOut
      }}
    >
      {children}
      <PremiumContentDialog 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog}
        frequencyName={premiumFrequency?.name}
      />
    </AudioContext.Provider>
  );
};
