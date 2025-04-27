
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
  const fadeIntervalRef = useRef<number | null>(null);

  // Fade duration in milliseconds
  const fadeDuration = 300;

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
      
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

  const fadeIn = (startVolume: number, targetVolume: number) => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
    }
    
    if (!gainNodeRef.current) return;
    
    const step = (targetVolume - startVolume) / (fadeDuration / 10);
    let currentVolume = startVolume;
    gainNodeRef.current.gain.value = currentVolume;
    
    fadeIntervalRef.current = window.setInterval(() => {
      if (!gainNodeRef.current) {
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
        return;
      }
      
      currentVolume += step;
      
      if ((step > 0 && currentVolume >= targetVolume) || 
          (step < 0 && currentVolume <= targetVolume)) {
        currentVolume = targetVolume;
        gainNodeRef.current.gain.value = currentVolume;
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
        return;
      }
      
      gainNodeRef.current.gain.value = currentVolume;
    }, 10);
  };

  const fadeOut = (startVolume: number, callback: () => void) => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
    }
    
    if (!gainNodeRef.current) {
      callback();
      return;
    }
    
    const step = startVolume / (fadeDuration / 10);
    let currentVolume = startVolume;
    
    fadeIntervalRef.current = window.setInterval(() => {
      if (!gainNodeRef.current) {
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
        callback();
        return;
      }
      
      currentVolume -= step;
      
      if (currentVolume <= 0) {
        currentVolume = 0;
        gainNodeRef.current.gain.value = 0;
        if (fadeIntervalRef.current) window.clearInterval(fadeIntervalRef.current);
        callback();
        return;
      }
      
      gainNodeRef.current.gain.value = currentVolume;
    }, 10);
  };

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
    
    // If we have an oscillator already playing, fade it out first
    if (oscillatorRef.current) {
      const oldOscillator = oscillatorRef.current;
      const currentGainValue = gainNodeRef.current?.gain.value || 0;
      
      // Create new oscillator setup while old one is still playing
      setupNewOscillator(frequency);
      
      // Fade out old oscillator, then stop it
      fadeOut(currentGainValue, () => {
        oldOscillator.stop();
        oldOscillator.disconnect();
        
        // After old oscillator is stopped, fade in the new one
        fadeIn(0, volume);
      });
    } else {
      // First time playing, just set up and fade in
      setupNewOscillator(frequency);
      fadeIn(0, volume);
    }
    
    setIsPlaying(true);
    setCurrentFrequency(frequency);
    
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== frequency.id);
      return [frequency, ...filtered].slice(0, 20);
    });
  };
  
  const setupNewOscillator = (frequency: FrequencyData) => {
    const ctx = audioContextRef.current!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency.hz, ctx.currentTime);
    
    // Start with volume 0 for fade in
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  };

  const pause = () => {
    if (oscillatorRef.current && gainNodeRef.current) {
      const currentVolume = gainNodeRef.current.gain.value;
      
      // Fade out then stop
      fadeOut(currentVolume, () => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
      });
    }
    
    setIsPlaying(false);
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && isPlaying) {
      // For volume changes while playing, apply immediately but with smooth transition
      const currentVolume = gainNodeRef.current.gain.value;
      fadeIn(currentVolume, newVolume);
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
