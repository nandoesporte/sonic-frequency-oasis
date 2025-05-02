
import React from "react";
import { Link } from "react-router-dom";
import { AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "mobile" | "full";
  showText?: boolean;
}

export function Logo({
  className,
  variant = "default",
  showText = true,
}: LogoProps) {
  // Calculate size based on variant
  const iconSize = variant === "mobile" ? 20 : 24;
  
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2 transition-all duration-300",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Main circle */}
        <div className="absolute w-full h-full bg-gradient-to-r from-primary/80 to-primary rounded-full animate-pulse-soft" />
        
        {/* Inner waveform icon */}
        <AudioWaveform 
          className="relative z-10 text-primary-foreground" 
          size={iconSize} 
          strokeWidth={2.5}
        />
      </div>
      
      {showText && (
        <div className="flex items-center font-bold">
          <span className="text-primary">Frequency</span>
          {variant !== "mobile" && <span className="ml-1">App</span>}
        </div>
      )}
    </Link>
  );
}
