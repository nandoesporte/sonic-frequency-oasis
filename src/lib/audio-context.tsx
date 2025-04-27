import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';

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

export type FrequencyData = {
  id: string;
  name: string;
  hz: number;
  purpose: string;
  category: string;
  description: string;
  trending?: boolean;
  premium?: boolean;
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

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('frequency-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }

    const savedHistory = localStorage.getItem('frequency-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('frequency-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('frequency-history', JSON.stringify(history));
  }, [history]);

  const play = (frequency: FrequencyData) => {
    if (frequency.premium && !isPremium) {
      toast.error("Esta frequência é exclusiva para usuários premium");
      return;
    }

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error('Web Audio API is not supported in this browser.', e);
        toast.error('Your browser does not support Web Audio API');
        return;
      }
    }
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency.hz, ctx.currentTime);
    
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    setIsPlaying(true);
    setCurrentFrequency(frequency);
    
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== frequency.id);
      return [frequency, ...filtered].slice(0, 20);
    });
  };

  const pause = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentFrequency) {
      play(currentFrequency);
    }
  };

  const addToFavorites = (frequency: FrequencyData) => {
    if (!favorites.some(f => f.id === frequency.id)) {
      setFavorites(prev => [...prev, frequency]);
      toast.success(`Added ${frequency.name} to favorites`);
    }
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f.id !== id);
      return newFavorites;
    });
    toast.success('Removed from favorites');
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
