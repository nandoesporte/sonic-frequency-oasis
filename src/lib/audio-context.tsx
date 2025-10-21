import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/contexts/PremiumContext';
import { FrequencyData } from '@/lib/data';
import { PremiumContentDialog } from '@/components/subscription/PremiumContentDialog';
import { supabase } from '@/integrations/supabase/client';

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
  playSentipassoAudio: (sentipassoData: any) => Promise<void>;
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
  const [isProcessing, setIsProcessing] = useState(false); // Flag to prevent concurrent operations
  const { user } = useAuth();
  const { isPremium, hasAccess } = usePremium();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const orientationLockedRef = useRef<boolean>(false);
  
  // SentiPassos specific refs
  const sentipassoAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundOscillatorRef = useRef<OscillatorNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);

  const MAX_PLAY_TIME = 30 * 60; // 30 minutes in seconds
  const fadeTime = 0.5; // 500ms fade time for smoother transitions

  // Prevent back button from stopping audio
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isPlaying) {
        // If audio is playing, don't allow navigation back
        // Push current state back to maintain audio playback
        window.history.pushState(null, '', window.location.href);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isPlaying) {
        // Prevent page unload when audio is playing
        event.preventDefault();
        event.returnValue = '';
      }
    };

    // Add event listeners when audio is playing
    if (isPlaying) {
      // Push a state to prevent back navigation
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  // Improved screen orientation locking function
  const lockScreenOrientation = () => {
    // Only try to lock if we're playing audio and haven't already locked
    if (!isPlaying || orientationLockedRef.current) return;
    
    // Check if the orientation API is available
    if (window.screen && 'orientation' in window.screen) {
      try {
        const screenExtended = window.screen as unknown as ScreenExtended;
        
        // Try to lock orientation to portrait
        screenExtended.orientation.lock('portrait')
          .then(() => {
            console.log('Screen orientation locked to portrait');
            orientationLockedRef.current = true;
          })
          .catch(error => {
            // Handle rejection gracefully - some browsers may reject permission
            console.log('Screen orientation lock not available or not permitted:', error.message);
          });
      } catch (error) {
        // Silent fail - API might exist but not be functional
        console.log('Screen orientation API not fully supported');
      }
    }
  };
  
  // Unlock screen orientation function
  const unlockScreenOrientation = () => {
    if (!orientationLockedRef.current) return;
    
    if (window.screen && 'orientation' in window.screen) {
      try {
        const screenExtended = window.screen as unknown as ScreenExtended;
        screenExtended.orientation.unlock();
        console.log('Screen orientation unlocked');
        orientationLockedRef.current = false;
      } catch (error) {
        // Silent fail
        console.log('Error unlocking screen orientation, but continuing');
      }
    }
  };

  // Lock screen orientation when audio is playing
  useEffect(() => {
    if (isPlaying) {
      lockScreenOrientation();
    } else {
      unlockScreenOrientation();
    }
    
    return () => {
      // Always unlock when component unmounts
      unlockScreenOrientation();
    };
  }, [isPlaying]);

  // Handle audio focus and interruptions
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        // When app goes to background, prevent audio interruption
        console.log('App visibility changed, preserving audio state');
      }
    };

    // Handle audio focus loss (e.g., incoming calls)
    const handleAudioInterruption = (event: Event) => {
      // This prevents other audio from stopping our player
      event.preventDefault();
      console.log('Audio interruption prevented');
    };

    // Add event listeners to handle interruptions
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('pause', handleAudioInterruption, true);
    
    // Clean up listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('pause', handleAudioInterruption, true);
    };
  }, [isPlaying]);

  // Cleanup function for all audio resources
  const cleanupAudioResources = () => {
    // Clean up regular frequency oscillators
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      try {
        setTimeout(() => {
          try {
            oscillatorRef.current?.stop();
            oscillatorRef.current?.disconnect();
            oscillatorRef.current = null;
            
            gainNodeRef.current?.disconnect();
            gainNodeRef.current = null;
          } catch (e) {
            console.error('Error during frequency cleanup:', e);
          }
        }, fadeTime * 1000);
      } catch (error) {
        console.error('Error in cleanup frequency resources:', error);
      }
    }
    
    // Clean up SentiPassos audio elements
    if (sentipassoAudioRef.current) {
      try {
        sentipassoAudioRef.current.pause();
        sentipassoAudioRef.current.currentTime = 0;
        sentipassoAudioRef.current = null;
      } catch (e) {
        console.error('Error cleaning up SentiPassos audio:', e);
      }
    }
    
    // Clean up background frequency oscillator
    if (backgroundOscillatorRef.current && backgroundGainRef.current && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime;
        backgroundGainRef.current.gain.setValueAtTime(backgroundGainRef.current.gain.value, currentTime);
        backgroundGainRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.5);
        
        setTimeout(() => {
          try {
            backgroundOscillatorRef.current?.stop();
            backgroundOscillatorRef.current?.disconnect();
            backgroundOscillatorRef.current = null;
            
            backgroundGainRef.current?.disconnect();
            backgroundGainRef.current = null;
          } catch (e) {
            console.error('Error stopping background frequency:', e);
          }
        }, 500);
      } catch (error) {
        console.error('Error cleaning up background frequency:', error);
      }
    }
    
    // Clear timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Make sure to unlock screen orientation when cleaning up audio
    unlockScreenOrientation();
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

  // Start playing a frequency (enhanced with sentiment audio support)
  const play = async (frequency: FrequencyData) => {
    // Prevent concurrent operations that could cause audio glitches
    if (isProcessing) {
      console.log('Audio operation already in progress, ignoring request');
      return;
    }
    
    try {
      setIsProcessing(true);
      console.log(`=== INICIANDO TRANSIÇÃO SUAVE PARA: ${frequency.name} ===`);
      
      // Smooth transition: fade-out current audio before starting new one
      if (isPlaying || oscillatorRef.current || sentipassoAudioRef.current || backgroundOscillatorRef.current) {
        console.log('=== FAZENDO FADE-OUT SUAVE DO ÁUDIO ATUAL ===');
        await pause(); // This now includes smooth fade-out
        console.log('=== FADE-OUT CONCLUÍDO, INICIANDO NOVO ÁUDIO ===');
      }
      
      if (frequency.premium && !hasAccess) {
        setPremiumFrequency(frequency);
        setShowPremiumDialog(true);
        setIsProcessing(false);
        return;
      }

      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Check if this is a sentiment frequency with audio message
      const isSentimentFreq = frequency.name.includes('Sentimento:');
      
      if (isSentimentFreq) {
        // For sentiment frequencies, play the audio message first, then the frequency
        try {
          // Get the sentiment audio URL from database
          const sentimentName = frequency.name.split(':')[1]?.split('-')[0]?.trim().toLowerCase();
          
          if (sentimentName) {
            const { data: sentimentAudio, error } = await supabase
              .from('sentimento_audios')
              .select('audio_url')
              .eq('sentimento', sentimentName)
              .single();

            if (!error && sentimentAudio?.audio_url) {
              // Play the sentiment message first
              const audio = new Audio(sentimentAudio.audio_url);
              audio.crossOrigin = "anonymous";
              
              toast.success(`Reproduzindo mensagem: ${frequency.name}`, {
                description: "Áudio de sentimento + frequência contínua"
              });
              
              await audio.play();
              
              // When audio message ends, start the frequency
              audio.onended = async () => {
                await startFrequencyOscillator(frequency);
              };
              
              setCurrentFrequency(frequency);
              setIsPlaying(true);
              
              // Add to history
              setHistory(prev => {
                const filtered = prev.filter(item => item.id !== frequency.id);
                return [frequency, ...filtered].slice(0, 20);
              });
              
              setIsProcessing(false);
              return;
            }
          }
        } catch (sentimentError) {
          console.warn('Failed to play sentiment audio, falling back to frequency only:', sentimentError);
        }
      }

      // Default frequency-only playback
      await startFrequencyOscillator(frequency);
      
    } catch (error) {
      console.error('Error playing frequency:', error);
      toast.error("Não foi possível reproduzir a frequência. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to start the frequency oscillator
  const startFrequencyOscillator = async (frequency: FrequencyData) => {
    // Create audio context if doesn't exist
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          latencyHint: 'playback',
          sampleRate: 48000,
        });
      } catch (e) {
        console.error('Web Audio API is not supported in this browser.', e);
        toast.error('Seu navegador não suporta Web Audio API');
        return;
      }
    }
    
    const ctx = audioContextRef.current;
    
    // Clean up existing oscillator with smooth fade out
    if (oscillatorRef.current) {
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
    
    // Lock the screen orientation once we're playing
    lockScreenOrientation();
    
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
            setIsProcessing(false);
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
    
    if (!frequency.name.includes('Sentimento:')) {
      toast.success(`Tocando ${frequency.name} (${frequency.hz}Hz) por até 30 minutos`);
    }
  };

  // Enhanced pause function with smooth fade-out
  const pause = async () => {
    console.log('=== INICIANDO PAUSA SUAVE ===');
    
    // Immediately set states to prevent new audio from starting
    setIsPlaying(false);
    setRemainingTime(null);
    
    // Clear timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('Timer limpo');
    }
    
    // 1. Smooth fade-out for SentiPassos audio
    if (sentipassoAudioRef.current) {
      try {
        const audio = sentipassoAudioRef.current;
        const originalVolume = audio.volume;
        
        // Smooth volume fade-out over 300ms
        const fadeOutSteps = 10;
        const fadeOutInterval = 30; // 30ms per step
        
        for (let i = fadeOutSteps; i >= 0; i--) {
          audio.volume = (originalVolume * i) / fadeOutSteps;
          await new Promise(resolve => setTimeout(resolve, fadeOutInterval));
        }
        
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
        sentipassoAudioRef.current = null;
        console.log('SentiPassos audio pausado SUAVEMENTE');
      } catch (e) {
        console.error('Erro pausando SentiPassos:', e);
      }
    }
    
    // 2. Smooth fade-out for background frequency
    if (backgroundOscillatorRef.current && backgroundGainRef.current && audioContextRef.current) {
      try {
        const context = audioContextRef.current;
        const gainNode = backgroundGainRef.current;
        const currentTime = context.currentTime;
        
        // Smooth fade-out over 300ms
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.3);
        
        // Wait for fade-out to complete before stopping
        await new Promise(resolve => setTimeout(resolve, 350));
        
        backgroundOscillatorRef.current.stop();
        backgroundOscillatorRef.current.disconnect();
        backgroundOscillatorRef.current = null;
        
        gainNode.disconnect();
        backgroundGainRef.current = null;
        console.log('Frequência de fundo pausada SUAVEMENTE');
      } catch (e) {
        console.error('Erro pausando frequência de fundo:', e);
      }
    }
    
    // 3. Smooth fade-out for main oscillator
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      try {
        const context = audioContextRef.current;
        const gainNode = gainNodeRef.current;
        const currentTime = context.currentTime;
        
        // Smooth fade-out over 300ms
        gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.3);
        
        // Wait for fade-out to complete before stopping
        await new Promise(resolve => setTimeout(resolve, 350));
        
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
        
        gainNode.disconnect();
        gainNodeRef.current = null;
        console.log('Oscilador principal pausado SUAVEMENTE');
      } catch (e) {
        console.error('Erro pausando oscilador principal:', e);
      }
    }
    
    // Unlock screen orientation
    unlockScreenOrientation();
    
    console.log('=== PAUSA SUAVE CONCLUÍDA ===');
  };

  // Update the volume
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current && !isProcessing) {
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
    console.log(`=== CONTEXT: togglePlayPause chamado - isProcessing: ${isProcessing}, isPlaying: ${isPlaying} ===`);
    
    if (isProcessing) {
      console.log('Audio operation already in progress, ignoring request');
      return;
    }
    
    if (isPlaying) {
      console.log('=== CONTEXT: Chamando função pause() ===');
      pause();
    } else if (currentFrequency) {
      console.log(`=== CONTEXT: Chamando função play() para ${currentFrequency.name} ===`);
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

  // Play sentipasso audio first, then background frequency
  const playSentipassoAudio = async (sentipassoData: any) => {
    try {
      setIsProcessing(true);
      
      console.log('=== INICIANDO SENTIPASSOS AUDIO ===');
      
      // Force stop ANY current audio first (including other SentiPassos)
      console.log('Pausando qualquer áudio atual...');
      await pause();
      await new Promise(resolve => setTimeout(resolve, 300)); // Extra wait for complete cleanup
      
      // Double-check: force cleanup any remaining SentiPassos audio
      if (sentipassoAudioRef.current) {
        console.log('Limpando áudio SentiPassos anterior...');
        try {
          sentipassoAudioRef.current.pause();
          sentipassoAudioRef.current.currentTime = 0;
          sentipassoAudioRef.current.src = '';
          sentipassoAudioRef.current = null;
        } catch (e) {
          console.error('Erro na limpeza do áudio anterior:', e);
        }
      }
      
      // Set up the sentipasso frequency data
      const sentipassoFrequency = {
        id: sentipassoData.id,
        name: sentipassoData.name,
        hz: sentipassoData.frequencia || 0,
        purpose: sentipassoData.purpose,
        description: sentipassoData.description,
        category: 'sentipasso' as any,
        premium: true,
        trending: false
      };
      
      setCurrentFrequency(sentipassoFrequency);
      setIsPlaying(true);
      
      // Set timer for the duration of the walk
      const walkDurationSeconds = sentipassoData.duration || 600; // Default 10 minutes
      setRemainingTime(walkDurationSeconds);
      
      // Create audio element for the meditation audio with safe volume
      const audio = new Audio(sentipassoData.audioUrl);
      audio.loop = false;
      // Set a safe initial volume (30% of current volume, max 0.3)
      audio.volume = Math.min(volume * 0.3, 0.3);
      audio.crossOrigin = "anonymous";
      
      console.log(`Volume inicial do SentiPassos: ${audio.volume}`);
      
      // Store reference for pause functionality
      sentipassoAudioRef.current = audio;
      
      let backgroundStarted = false;
      
      // Function to start background frequency
      const startBackgroundFrequency = async () => {
        if (backgroundStarted || !sentipassoData.frequencia || sentipassoData.frequencia <= 0) {
          return;
        }
        
        try {
          // Create audio context for background frequency
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
              latencyHint: 'playback',
              sampleRate: 48000,
            });
          }
          
          const ctx = audioContextRef.current;
          
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          
          // Create background frequency oscillator
          const backgroundOscillator = ctx.createOscillator();
          const backgroundGain = ctx.createGain();
          
          // Store references for pause functionality
          backgroundOscillatorRef.current = backgroundOscillator;
          backgroundGainRef.current = backgroundGain;
          
          backgroundOscillator.type = 'sine';
          backgroundOscillator.frequency.setValueAtTime(sentipassoData.frequencia, ctx.currentTime);
          
          // Start with zero gain for smooth fade in
          backgroundGain.gain.setValueAtTime(0, ctx.currentTime);
          
          backgroundOscillator.connect(backgroundGain);
          backgroundGain.connect(ctx.destination);
          
          backgroundOscillator.start();
          
          // Fade in the background frequency
          backgroundGain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 2); // 40% volume, 2s fade in
          
          backgroundStarted = true;
          
          toast.info(`Frequência ${sentipassoData.frequencia}Hz iniciada`, {
            description: "Continue sua caminhada meditativa"
          });
          
        } catch (error) {
          console.error('Error starting background frequency:', error);
        }
      };
      
      // Start the timer countdown
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setIsPlaying(false);
            setRemainingTime(null);
            
            // Stop audio and background frequency
            if (sentipassoAudioRef.current) {
              sentipassoAudioRef.current.pause();
              sentipassoAudioRef.current = null;
            }
            
            if (backgroundOscillatorRef.current && backgroundGainRef.current) {
              try {
                // Fade out background frequency
                const currentTime = audioContextRef.current?.currentTime || 0;
                backgroundGainRef.current.gain.setValueAtTime(backgroundGainRef.current.gain.value, currentTime);
                backgroundGainRef.current.gain.linearRampToValueAtTime(0, currentTime + 1);
                
                setTimeout(() => {
                  try {
                    backgroundOscillatorRef.current?.stop();
                    backgroundOscillatorRef.current?.disconnect();
                    backgroundOscillatorRef.current = null;
                    
                    backgroundGainRef.current?.disconnect();
                    backgroundGainRef.current = null;
                  } catch (e) {
                    console.error('Error stopping background frequency:', e);
                  }
                }, 1000);
              } catch (e) {
                console.error('Error stopping background frequency:', e);
              }
            }
            
            toast.info(`Caminhada ${sentipassoData.name} concluída`);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Handle audio end - start background frequency
      audio.onended = () => {
        console.log('Áudio de meditação finalizado, iniciando frequência de fundo...');
        startBackgroundFrequency();
      };
      
      // Play the meditation audio first
      toast.success(`Iniciando: ${sentipassoData.name}`, {
        description: "Escute o áudio meditativo primeiro, depois a frequência de fundo será ativada"
      });
      
      await audio.play();
      
      // Add to history
      setHistory(prev => {
        const filtered = prev.filter(item => item.id !== sentipassoFrequency.id);
        return [sentipassoFrequency, ...filtered].slice(0, 20);
      });
      
    } catch (error) {
      console.error('Error playing sentipasso audio:', error);
      toast.error("Não foi possível reproduzir a caminhada");
    } finally {
      setIsProcessing(false);
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
        fadeOut,
        playSentipassoAudio
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
