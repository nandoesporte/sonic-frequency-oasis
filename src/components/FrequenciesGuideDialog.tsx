
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
import { Headphones, Volume2, Clock, Heart, List, ChevronRight } from "lucide-react";

interface FrequenciesGuideDialogProps {
  manualOpen?: boolean;
  onManualClose?: () => void;
}

export function FrequenciesGuideDialog({ manualOpen, onManualClose }: FrequenciesGuideDialogProps = {}) {
  const [showGuide, setShowGuide] = useState(false);

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
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Headphones className="mr-2 h-6 w-6 text-primary" />
            Como usar as Frequências
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Guia rápido para aproveitar ao máximo as frequências terapêuticas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <Volume2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Escolha o volume adequado</h3>
              <p className="text-muted-foreground">
                Ajuste para um volume confortável. As frequências não precisam estar altas para serem eficazes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Duração recomendada</h3>
              <p className="text-muted-foreground">
                Para melhores resultados, ouça por 15-30 minutos. Você pode repetir conforme necessário ao longo do dia.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Ambiente tranquilo</h3>
              <p className="text-muted-foreground">
                Encontre um local calmo e confortável. Use fones de ouvido para uma experiência mais imersiva.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-4">
              <List className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Explore diferentes categorias</h3>
              <p className="text-muted-foreground">
                Cada categoria oferece benefícios específicos. Experimente várias frequências para descobrir o que funciona melhor para você.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={closeGuide}>
            Não mostrar novamente
          </Button>
          <Button onClick={closeGuide} className="gap-1">
            Começar a explorar <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
