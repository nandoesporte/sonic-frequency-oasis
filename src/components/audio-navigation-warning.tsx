
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAudio } from "@/lib/audio-context";
import { AudioWarningDialog } from "./audio-warning-dialog";

export function AudioNavigationWarning({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for handling navigation
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [destinationName, setDestinationName] = useState<string>("");
  
  // Map routes to readable names
  const routeNames: Record<string, string> = {
    "/": "página inicial",
    "/scientific": "evidências científicas",
    "/trending": "frequências populares",
    "/favorites": "favoritos",
    "/guide": "guia de uso",
    "/history": "histórico",
    "/premium": "área premium",
    "/profile": "perfil",
    "/auth": "autenticação",
    "/terms": "termos de uso",
    "/admin": "administração",
    "/webhook-config": "configuração de webhook",
  };

  // We need to check if we're within an AudioProvider context
  let isPlaying = false;
  let audioContextAvailable = true;

  try {
    // Try to use the audio context, but catch the error if it's not available
    const audioContext = useAudio();
    isPlaying = audioContext.isPlaying;
  } catch (e) {
    // If useAudio throws an error, we're not within an AudioProvider
    audioContextAvailable = false;
  }

  // Only set up event listeners if audio context is available and audio is playing
  useEffect(() => {
    if (!audioContextAvailable || !isPlaying) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestAnchor = target.closest('a');
      
      if (closestAnchor && closestAnchor.getAttribute('href')) {
        const href = closestAnchor.getAttribute('href') as string;
        
        // Skip if it's an external link or hash link on same page
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }
        
        // Prevent default navigation
        e.preventDefault();
        
        // Set the pending navigation and show warning
        setPendingNavigation(href);
        setDestinationName(routeNames[href] || "outra página");
        setShowWarning(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isPlaying, routeNames, audioContextAvailable]);

  const handleContinue = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
      setShowWarning(false);
    }
  };

  return (
    <>
      {children}
      {audioContextAvailable && (
        <AudioWarningDialog 
          open={showWarning}
          onOpenChange={setShowWarning}
          onContinue={handleContinue}
          destinationName={destinationName}
        />
      )}
    </>
  );
}
