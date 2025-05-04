
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frequencyName?: string;
}

export function PremiumContentDialog({
  open,
  onOpenChange,
  frequencyName,
}: PremiumContentDialogProps) {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    onOpenChange(false);
    // Navigate to premium page with the #planos hash that will scroll to the plans section
    navigate("/premium#planos");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 bg-purple-100 dark:bg-purple-900/40 p-3 rounded-full">
            <Crown className="h-8 w-8 text-purple-500 dark:text-purple-300" />
          </div>
          <DialogTitle className="text-center text-xl">
            Conteúdo Premium
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {frequencyName ? `"${frequencyName}" é` : "Este conteúdo é"} exclusivo para assinantes premium
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4">
            <h4 className="font-medium mb-2">Benefícios do Premium:</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center">
                <span className="bg-purple-500 rounded-full h-2 w-2 mr-2"></span>
                <span className="text-sm text-muted-foreground">Acesso ilimitado a todas as frequências</span>
              </li>
              <li className="flex items-center">
                <span className="bg-purple-500 rounded-full h-2 w-2 mr-2"></span>
                <span className="text-sm text-muted-foreground">Conteúdo exclusivo atualizado mensalmente</span>
              </li>
              <li className="flex items-center">
                <span className="bg-purple-500 rounded-full h-2 w-2 mr-2"></span>
                <span className="text-sm text-muted-foreground">Sem anúncios ou interrupções</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Talvez depois
          </Button>
          <Button
            onClick={handleSubscribe}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Ver planos de assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
