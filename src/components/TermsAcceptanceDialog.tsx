
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

// Current version of the Terms - update this when terms are modified
const CURRENT_TERMS_VERSION = "v1.0.0";

export function TermsAcceptanceDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Check if user has already accepted the current terms version
  useEffect(() => {
    const checkTermsAcceptance = async () => {
      if (!user) {
        setOpen(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('terms_acceptances')
          .select('*')
          .eq('user_id', user.id)
          .eq('terms_version', CURRENT_TERMS_VERSION)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking terms acceptance:", error);
          return;
        }
        
        // If no acceptance record found for current version, show dialog
        setOpen(data === null);
      } catch (err) {
        console.error("Error checking terms acceptance:", err);
      }
    };
    
    checkTermsAcceptance();
  }, [user]);
  
  // Handle acceptance of terms
  const handleAcceptTerms = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Get user agent and public IP (IP will be determined server-side)
      const userAgent = navigator.userAgent;
      
      // Record acceptance in database
      const { error } = await supabase
        .from('terms_acceptances')
        .insert([
          {
            user_id: user.id,
            terms_version: CURRENT_TERMS_VERSION,
            user_agent: userAgent
          }
        ]);
      
      if (error) {
        console.error("Error recording terms acceptance:", error);
        toast.error("Erro ao registrar aceite dos termos", {
          description: "Por favor, tente novamente."
        });
        return;
      }
      
      setOpen(false);
      toast.success("Termos aceitos", {
        description: "Obrigado por aceitar os nossos termos de uso e política de privacidade."
      });
    } catch (err) {
      console.error("Error accepting terms:", err);
      toast.error("Erro ao processar aceite", {
        description: "Por favor, tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Only show dialog for authenticated users
  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">📋</span> Termos de Uso e Privacidade
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Antes de continuar, precisamos do seu consentimento em nossos termos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm">
            Ao utilizar nossos serviços, você concorda com nossos{" "}
            <Link 
              to="/terms" 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary underline underline-offset-2"
              onClick={() => setOpen(false)}
            >
              Termos de Uso e Política de Privacidade
            </Link>.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Pontos importantes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Suas informações pessoais são protegidas</li>
              <li>As frequências sonoras têm caráter informativo e complementar</li>
              <li>Não comercializamos dados com terceiros</li>
              <li>Você pode solicitar exclusão dos seus dados a qualquer momento</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = "https://www.google.com"}
            className="mt-2 sm:mt-0"
            disabled={loading}
          >
            Recusar e Sair
          </Button>
          <Button
            type="button"
            onClick={handleAcceptTerms}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? "Processando..." : "Aceitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
