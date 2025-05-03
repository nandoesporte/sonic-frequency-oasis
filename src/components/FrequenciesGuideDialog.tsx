
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
import { 
  Headphones, 
  Volume2, 
  Clock, 
  Heart, 
  List, 
  ChevronRight, 
  Smartphone, 
  MessageSquare,
  CircleChevronRight,
  CircleChevronLeft
} from "lucide-react";
import { useIsMobile } from "@/hooks";

interface FrequenciesGuideDialogProps {
  manualOpen?: boolean;
  onManualClose?: () => void;
}

export function FrequenciesGuideDialog({ manualOpen, onManualClose }: FrequenciesGuideDialogProps = {}) {
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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
      // Reset step when dialog opens
      if (manualOpen) {
        setCurrentStep(0);
      }
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

  const steps = [
    {
      title: "Como usar as Frequências",
      description: "Guia rápido para aproveitar ao máximo as frequências terapêuticas",
      content: (
        <div className="space-y-4 py-2">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Use fones de ouvido</h3>
              <p className="text-sm text-muted-foreground">
                Para uma experiência imersiva, utilize fones de ouvido para captar todas as nuances das frequências.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Volume2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Escolha o volume adequado</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste para um volume confortável. As frequências não precisam estar altas para serem eficazes.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ambiente & Duração",
      description: "Maximize os benefícios da sua sessão",
      content: (
        <div className="space-y-4 py-2">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Duração recomendada</h3>
              <p className="text-sm text-muted-foreground">
                Para melhores resultados, ouça por 15-30 minutos. Você pode repetir conforme necessário ao longo do dia.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Ambiente tranquilo</h3>
              <p className="text-sm text-muted-foreground">
                Encontre um local calmo e confortável, livre de distrações para melhor absorção das frequências.
              </p>
            </div>
          </div>

          {isMobile && (
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base">Dicas para celular</h3>
                <p className="text-sm text-muted-foreground">
                  Coloque seu celular no modo "Não Perturbe" e feche outros aplicativos para evitar interrupções durante a sessão.
                </p>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Explore as Categorias",
      description: "Conheça as diferentes frequências disponíveis",
      content: (
        <div className="space-y-4 py-2">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <List className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Explore diferentes categorias</h3>
              <p className="text-sm text-muted-foreground">
                Cada categoria oferece benefícios específicos. Experimente várias frequências para descobrir o que funciona melhor para você.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3 shrink-0">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-base">Compartilhe sua experiência</h3>
              <p className="text-sm text-muted-foreground">
                Suas impressões sobre as frequências podem ajudar outras pessoas a encontrar o que precisam.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4 bg-card/95 backdrop-blur-sm border-primary/20 shadow-lg rounded-xl font-sans">
        <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-primary/20 backdrop-blur-md p-3 rounded-full shadow-xl">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <DialogHeader className="pt-4">
          <DialogTitle className="text-xl sm:text-2xl flex items-center justify-center text-center font-heading">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base pt-1 text-center">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {steps.map((_, index) => (
            <button 
              key={index} 
              className={`h-2 rounded-full transition-all ${index === currentStep ? 'bg-primary w-6' : 'bg-muted w-2'}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Passo ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="px-1 pt-2">
          {/* Content from current step */}
          {currentStepData.content}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-4">
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev - 1)} 
              className="text-sm w-full sm:w-auto flex items-center justify-center"
            >
              <CircleChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={() => setCurrentStep(prev => prev + 1)} 
              className="gap-2 text-sm w-full sm:w-auto bg-primary hover:bg-primary/90 font-medium"
            >
              Próximo
              <CircleChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={closeGuide} 
              className="gap-2 text-sm w-full sm:w-auto bg-primary hover:bg-primary/90 font-medium"
            >
              Começar a explorar
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
