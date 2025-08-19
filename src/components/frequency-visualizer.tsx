import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrequencyVisualizerProps {
  frequency: number;
  isPlaying: boolean;
  onClose: () => void;
  frequencyName: string;
}

export function FrequencyVisualizer({ 
  frequency, 
  isPlaying, 
  onClose, 
  frequencyName 
}: FrequencyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isMinimized, setIsMinimized] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  // Prevent screen from turning off
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
          console.log('Wake lock activated');
        }
      } catch (err) {
        console.warn('Wake lock request failed:', err);
      }
    };

    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
        console.log('Wake lock released');
      }
    };

    if (isPlaying) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isPlaying, wakeLock]);

  // Animation loop for frequency visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let startTime = Date.now();
    const baseFreq = frequency;
    
    const animate = () => {
      if (!canvas || !ctx) return;
      
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      if (!isPlaying) {
        // Show static wave when not playing
        drawStaticWave(ctx, width, height);
      } else {
        // Draw animated frequency waves
        drawAnimatedWaves(ctx, width, height, elapsed, baseFreq);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frequency, isPlaying]);

  const drawStaticWave = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerY = height / 2;
    
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)'; // purple-600 with opacity
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 2) {
      const y = centerY + Math.sin((x / width) * Math.PI * 4) * 20;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  };

  const drawAnimatedWaves = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    elapsed: number, 
    baseFreq: number
  ) => {
    const centerY = height / 2;
    
    // Main frequency wave
    ctx.strokeStyle = 'rgb(147, 51, 234)'; // purple-600
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x <= width; x += 1) {
      const normalizedX = x / width;
      const waveSpeed = baseFreq / 100; // Adjust speed based on frequency
      const amplitude = 30 + Math.sin(elapsed * 2) * 10; // Breathing amplitude
      const y = centerY + Math.sin((normalizedX * Math.PI * 8) + (elapsed * waveSpeed)) * amplitude;
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Harmonic waves
    const harmonics = [0.5, 2, 0.3];
    const colors = ['rgba(147, 51, 234, 0.6)', 'rgba(147, 51, 234, 0.4)', 'rgba(147, 51, 234, 0.2)'];
    
    harmonics.forEach((harmonic, index) => {
      ctx.strokeStyle = colors[index];
      ctx.lineWidth = 2 - index * 0.3;
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 2) {
        const normalizedX = x / width;
        const harmonicFreq = baseFreq * harmonic;
        const harmonicSpeed = harmonicFreq / 100;
        const harmonicAmplitude = (20 - index * 5) + Math.sin(elapsed * 1.5) * 5;
        const y = centerY + Math.sin((normalizedX * Math.PI * 6 * harmonic) + (elapsed * harmonicSpeed)) * harmonicAmplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    });
    
    // Frequency particles
    drawFrequencyParticles(ctx, width, height, elapsed, baseFreq);
  };

  const drawFrequencyParticles = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    elapsed: number,
    baseFreq: number
  ) => {
    const particleCount = Math.min(20, Math.max(5, Math.floor(baseFreq / 50)));
    
    for (let i = 0; i < particleCount; i++) {
      const x = (width / particleCount) * i + Math.sin(elapsed + i) * 20;
      const y = height / 2 + Math.sin(elapsed * 2 + i * 0.5) * 40;
      const radius = 2 + Math.sin(elapsed * 3 + i) * 1;
      
      ctx.fillStyle = `rgba(147, 51, 234, ${0.3 + Math.sin(elapsed * 2 + i) * 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30"
        >
          <Maximize2 className="h-5 w-5 text-purple-600" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
      <Card className="h-full rounded-none border-0 bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Visualização de Frequência</h2>
            <p className="text-sm text-muted-foreground">
              {frequencyName} • {frequency} Hz
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            {onClose !== (() => {}) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Frequency Info */}
        <div className="px-4 py-3 border-b bg-purple-50/30 dark:bg-purple-950/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frequência Base:</span>
            <span className="font-mono font-semibold text-purple-600">{frequency} Hz</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Status:</span>
            <span className={cn(
              "font-medium",
              isPlaying ? "text-green-600" : "text-orange-600"
            )}>
              {isPlaying ? "Reproduzindo" : "Pausado"}
            </span>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="flex-1 p-4">
          <div className="relative h-full rounded-lg border border-purple-200/50 dark:border-purple-800/50 overflow-hidden bg-gradient-to-r from-purple-50/20 to-background dark:from-purple-950/20">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
            
            {/* Center frequency indicator */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-full h-px bg-purple-600/20 relative">
                <div className="absolute left-4 top-0 -translate-y-1/2 bg-background px-2 py-1 rounded text-xs text-purple-600 font-mono">
                  {frequency} Hz
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with instructions */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            {isPlaying 
              ? "A tela permanecerá ativa durante a reprodução. A visualização fecha automaticamente quando a música para."
              : "Toque no botão de reprodução para ver a visualização animada"
            }
          </p>
        </div>
      </Card>
    </div>
  );
}