
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAudio } from "@/lib/audio-context";

type AudioWarningDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  destinationName?: string;
};

export function AudioWarningDialog({
  open,
  onOpenChange,
  onContinue,
  destinationName = "outra página",
}: AudioWarningDialogProps) {
  const { pause } = useAudio();

  const handlePauseAndContinue = () => {
    pause();
    toast.info("Reprodução pausada");
    onContinue();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Reprodução em andamento</AlertDialogTitle>
          <AlertDialogDescription>
            Você está com uma frequência em reprodução. Recomendamos pausar antes de ir para {destinationName} para evitar interrupções abruptas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction onClick={handlePauseAndContinue} className="bg-primary">
            Pausar e continuar
          </AlertDialogAction>
          <AlertDialogAction onClick={onContinue}>
            Continuar sem pausar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
