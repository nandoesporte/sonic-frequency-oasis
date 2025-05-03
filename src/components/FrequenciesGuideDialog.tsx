
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Headphones, Volume2, Clock, Heart, List, ChevronRight, Smartphone } from "lucide-react";
import { useIsMobile } from "@/hooks";

interface FrequenciesGuideDialogProps {
  manualOpen?: boolean;
  onManualClose?: () => void;
}

export function FrequenciesGuideDialog({ manualOpen, onManualClose }: FrequenciesGuideDialogProps = {}) {
  const [showGuide, setShowGuide] = useState(false);
  const isMobile = useIsMobile();

  // Handle auto-show effect on first login
  useEffect(() => {
    if (manualOpen !== undefined) {
      return; // Skip auto logic if manually controlled
    }
    
    // Check if the user has seen the guide before
    const hasSeenGuide = localStorage.getItem('hasSeenFrequenciesGuide');
    
    if (!hasSeenGuide) {
      // Show the guide if user hasn't seen it yet
      setShowGuide(true);
    }
  }, [manualOpen]);
  
  // Handle manual open state changes
  useEffect(() => {
    if (manualOpen !== undefined) {
      setShowGuide(manualOpen);
    }
  }, [manualOpen]);

  const closeGuide = () => {
    // Mark the guide as seen
    localStorage.setItem('hasSeenFrequenciesGuide', 'true');
    setShowGuide(false);
    
    // Call the manual close handler if provided
    if (onManualClose) {
      onManualClose();
    }
  };

  // Use controlled or uncontrolled open state
  const isOpen = manualOpen !== undefined ? manualOpen : showGuide;
  
  // Handle dialog state change
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeGuide();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl flex items-center">
            <Headphones className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Como usar as Frequências
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base pt-2">
            Guia rápido para aproveitar ao máximo as frequências terapêuticas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base">Use fones de ouvido</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Para uma experiência imersiva, utilize fones de ouvido para captar todas as nuances das frequências.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base">Escolha o volume adequado</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ajuste para um volume confortável. As frequências não precisam estar altas para serem eficazes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base">Duração recomendada</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Para melhores resultados, ouça por 15-30 minutos. Você pode repetir conforme necessário ao longo do dia.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base">Ambiente tranquilo</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Encontre um local calmo e confortável, livre de distrações para melhor absorção das frequências.
              </p>
            </div>
          </div>
          
          {isMobile && (
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">Dicas para celular</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Coloque seu celular no modo "Não Perturbe" e feche outros aplicativos para evitar interrupções durante a sessão.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <List className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base">Explore diferentes categorias</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cada categoria oferece benefícios específicos. Experimente várias frequências para descobrir o que funciona melhor para você.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-2">
          <Button 
            variant="outline" 
            onClick={closeGuide} 
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            Não mostrar novamente
          </Button>
          <Button 
            onClick={closeGuide} 
            className="gap-1 text-xs sm:text-sm w-full sm:w-auto"
          >
            Começar a explorar <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
