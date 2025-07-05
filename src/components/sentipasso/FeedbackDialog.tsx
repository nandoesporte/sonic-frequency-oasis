
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWalk?: string;
}

export function FeedbackDialog({ open, onOpenChange, selectedWalk }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [keyword, setKeyword] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Por favor, compartilhe como se sentiu");
      return;
    }

    if (rating === 0) {
      toast.error("Por favor, dê uma nota de 1 a 5");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would save the feedback to your database
      console.log('Saving feedback:', {
        feedback: feedback.trim(),
        keyword: keyword.trim(),
        rating,
        walkName: selectedWalk,
        timestamp: new Date().toISOString()
      });

      toast.success("Obrigado pelo seu feedback!", {
        description: "Sua experiência foi registrada com carinho."
      });

      // Reset form
      setFeedback('');
      setKeyword('');
      setRating(0);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao enviar feedback", {
        description: "Tente novamente em alguns instantes"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-500" />
            Como você se sentiu?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {selectedWalk && (
            <Badge variant="outline" className="w-fit">
              {selectedWalk}
            </Badge>
          )}

          <div className="space-y-2">
            <Label htmlFor="feedback">Conte-nos sobre sua experiência</Label>
            <Textarea
              id="feedback"
              placeholder="Descreva como se sentiu durante e após a caminhada..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyword">Palavra-chave (opcional)</Label>
            <Input
              id="keyword"
              placeholder="Uma palavra que resume sua experiência"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="space-y-3">
            <Label>Dê uma nota de 1 a 5</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-full transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 hover:text-yellow-500' 
                      : 'text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500'
                  }`}
                >
                  <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Não foi muito útil"}
                {rating === 2 && "Pouco útil"}
                {rating === 3 && "Neutro"}
                {rating === 4 && "Muito útil"}
                {rating === 5 && "Extremamente útil"}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
