
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusProcessed, setStatusProcessed] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status') || 
                  (location.pathname.includes('success') ? 'success' : 
                   location.pathname.includes('failure') ? 'failure' : null);
                   
    console.log("Status do pagamento:", status);
    
    if (statusProcessed) return;

    if (status === 'success' || status === 'approved') {
      setStatusProcessed(true);
      toast({
        title: "Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
      // Aguardar um momento para que o usuário possa ver o toast
      setTimeout(() => {
        navigate('/premium');
      }, 2000);
    } else if (status === 'failure' || status === 'rejected') {
      setStatusProcessed(true);
      toast({
        title: "Pagamento não concluído",
        description: "Houve um problema com seu pagamento. Tente novamente.",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate('/premium');
      }, 2000);
    } else {
      // Se não há status, aguardar por um momento antes de redirecionar
      const timer = setTimeout(() => {
        if (!statusProcessed) {
          setStatusProcessed(true);
          navigate('/premium');
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location, navigate, toast, statusProcessed]);

  // Determinar qual mensagem e ícone mostrar com base no status
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status') || 
               (location.pathname.includes('success') ? 'success' : 
                location.pathname.includes('failure') ? 'failure' : null);
               
  const isSuccess = status === 'success' || status === 'approved';
  const isFailure = status === 'failure' || status === 'rejected';
  const isPending = !isSuccess && !isFailure;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md p-6 bg-background border rounded-lg shadow-lg">
        {isPending && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Processando pagamento...</h2>
            <p className="text-muted-foreground text-center mb-6">
              Aguarde enquanto verificamos o status do seu pagamento.
            </p>
          </>
        )}
        
        {isSuccess && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Pagamento confirmado!</h2>
            <p className="text-muted-foreground text-center mb-6">
              Sua assinatura foi ativada com sucesso. Você já pode aproveitar todos os benefícios.
            </p>
          </>
        )}
        
        {isFailure && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Pagamento não concluído</h2>
            <p className="text-muted-foreground text-center mb-6">
              Houve um problema ao processar seu pagamento. Por favor, tente novamente.
            </p>
          </>
        )}
        
        <div className="flex justify-center">
          <Button onClick={() => navigate('/premium')}>
            {isSuccess ? 'Acessar Premium' : 'Voltar para Planos'}
          </Button>
        </div>
      </div>
    </div>
  );
}
