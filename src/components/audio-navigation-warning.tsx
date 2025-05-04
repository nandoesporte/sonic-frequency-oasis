
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAudio } from "@/lib/audio-context";
import { AudioWarningDialog } from "./audio-warning-dialog";

export function AudioNavigationWarning({ children }: { children: React.ReactNode }) {
  const { isPlaying } = useAudio();
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [destinationName, setDestinationName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Capture clicks on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isPlaying) return;

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
  }, [isPlaying, routeNames]);

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
      <AudioWarningDialog 
        open={showWarning}
        onOpenChange={setShowWarning}
        onContinue={handleContinue}
        destinationName={destinationName}
      />
    </>
  );
}
