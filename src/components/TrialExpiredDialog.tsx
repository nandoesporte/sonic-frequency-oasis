import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Calendar } from "lucide-react";

interface TrialExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrialExpiredDialog({ open, onOpenChange }: TrialExpiredDialogProps) {
  const handleSubscribe = () => {
    window.location.href = "/premium#plans";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Seu período de teste expirou
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Você aproveitou seus 7 dias gratuitos! Para continuar acessando o conteúdo premium, assine um plano.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Período de teste: <strong>7 dias</strong></span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Continue explorando frequências exclusivas e caminhadas do Sentipasso
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button onClick={handleSubscribe} className="w-full">
            Ver Planos de Assinatura
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Explorar Conteúdo Gratuito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}