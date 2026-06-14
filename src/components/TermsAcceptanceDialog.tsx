
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Current version of the Terms - update this when terms are modified
const CURRENT_TERMS_VERSION = "v1.0.0";

export function TermsAcceptanceDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  
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
        toast.error(t("terms.errorRecording"), {
          description: t("terms.errorRetry")
        });
        return;
      }
      
      setOpen(false);
      toast.success(t("terms.accepted"), {
        description: t("terms.acceptedDesc")
      });
    } catch (err) {
      console.error("Error accepting terms:", err);
      toast.error(t("terms.errorRecording"), {
        description: t("terms.errorRetry")
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
            <span className="text-2xl">📋</span> {t("terms.title")}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {t("terms.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm">
            {t("terms.intro")}{" "}
            <Link 
              to="/terms" 
              target="_blank" 
              rel="noreferrer" 
              className="text-primary underline underline-offset-2"
              onClick={() => setOpen(false)}
            >
              {t("terms.link")}
            </Link>.
          </p>
          
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">{t("terms.importantPoints")}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t("terms.point1")}</li>
              <li>{t("terms.point2")}</li>
              <li>{t("terms.point3")}</li>
              <li>{t("terms.point4")}</li>
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
            {t("terms.decline")}
          </Button>
          <Button
            type="button"
            onClick={handleAcceptTerms}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? t("terms.processing") : t("terms.accept")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
