
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status') || 
                (location.pathname.includes('success') ? 'success' : 
                 location.pathname.includes('failure') ? 'failure' : null);

  useEffect(() => {
    if (status === 'success' || status === 'approved') {
      toast({
        title: "Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
      navigate('/premium');
    } else if (status === 'failure' || status === 'rejected') {
      toast({
        title: "Pagamento não concluído",
        description: "Houve um problema com seu pagamento. Tente novamente.",
        variant: "destructive",
      });
      navigate('/premium');
    } else {
      // Se não há status, redirecionar para premium após um curto período
      const timer = setTimeout(() => {
        navigate('/premium');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Processando pagamento...</h2>
      <p className="text-muted-foreground text-center">
        Aguarde enquanto verificamos o status do seu pagamento.
      </p>
    </div>
  );
}
