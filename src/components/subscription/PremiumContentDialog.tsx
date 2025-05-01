
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
    navigate("/premium#planos");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full">
            <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center text-xl">
            Conteúdo Premium
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {frequencyName ? `"${frequencyName}" é` : "Este conteúdo é"} exclusivo para assinantes premium
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">Benefícios do Premium:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <span className="bg-green-500 rounded-full h-1.5 w-1.5 mr-2"></span>
                Acesso ilimitado a todas as frequências
              </li>
              <li className="flex items-center">
                <span className="bg-green-500 rounded-full h-1.5 w-1.5 mr-2"></span>
                Conteúdo exclusivo atualizado mensalmente
              </li>
              <li className="flex items-center">
                <span className="bg-green-500 rounded-full h-1.5 w-1.5 mr-2"></span>
                Sem anúncios ou interrupções
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-full">
            Talvez depois
          </Button>
          <Button 
            onClick={handleSubscribe} 
            className="sm:w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            Ver planos de assinatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
