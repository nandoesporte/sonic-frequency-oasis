
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';
import { FrequencyData } from '@/lib/data';

type AudioContextType = {
  isPlaying: boolean;
  currentFrequency: FrequencyData | null;
  volume: number;
  play: (frequency: FrequencyData) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  togglePlayPause: () => void;
  addToFavorites: (frequency: FrequencyData) => void;
  removeFromFavorites: (id: string) => void;
  favorites: FrequencyData[];
  history: FrequencyData[];
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
  const { user } = useAuth();
  const { isPremium } = usePremium();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const fadeTime = 0.1; // 100ms fade time

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          console.error('Error stopping oscillator:', e);
        }
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.error('Error closing audio context:', e);
        }
      }
    };
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('frequency-favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('frequency-history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
  }, [history]);

  const play = (frequency: FrequencyData) => {
    try {
      if (frequency.premium && !isPremium) {
        toast.error("Esta frequência é exclusiva para usuários premium");
        return;
      }

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
      
      // Stop any current playing sound with a smooth fade out
      if (oscillatorRef.current) {
        const oldGain = gainNodeRef.current;
        if (oldGain) {
          oldGain.gain.setValueAtTime(oldGain.gain.value, ctx.currentTime);
          oldGain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeTime);
          setTimeout(() => {
            if (oscillatorRef.current) {
              try {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
              } catch (e) {
                console.error('Error stopping oscillator:', e);
              }
            }
            if (oldGain) oldGain.disconnect();
          }, fadeTime * 1000);
        } else {
          try {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
          } catch (e) {
            console.error('Error stopping oscillator:', e);
          }
        }
      }
      
      // Create new oscillator and gain node
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency.hz, ctx.currentTime);
      
      // Start with zero gain and fade in for a smooth start
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      setIsPlaying(true);
      setCurrentFrequency(frequency);
      
      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(item => item.id !== frequency.id);
        return [frequency, ...filtered].slice(0, 20);
      });
      
      toast.success(`Tocando ${frequency.name} (${frequency.hz}Hz)`);
    } catch (error) {
      console.error('Error playing frequency:', error);
      toast.error("Não foi possível reproduzir a frequência. Tente novamente.");
    }
  };

  const pause = () => {
    try {
      if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + fadeTime);
        
        setTimeout(() => {
          if (oscillatorRef.current) {
            try {
              oscillatorRef.current.stop();
              oscillatorRef.current.disconnect();
              oscillatorRef.current = null;
            } catch (e) {
              console.error('Error stopping oscillator:', e);
            }
          }
          if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
          }
        }, fadeTime * 1000);
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing frequency:', error);
      setIsPlaying(false);
    }
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.gain.value = newVolume;
      } catch (e) {
        console.error('Error updating volume:', e);
      }
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentFrequency) {
      play(currentFrequency);
    } else {
      toast.info("Selecione uma frequência para tocar");
    }
  };

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
        history
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
