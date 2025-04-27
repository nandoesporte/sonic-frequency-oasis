
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusProcessed, setStatusProcessed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status') || 
                  (location.pathname.includes('success') ? 'success' : 
                   location.pathname.includes('failure') ? 'failure' : 
                   location.pathname.includes('pending') ? 'pending' : null);
                   
    console.log("Status do pagamento:", status);
    setPaymentStatus(status);
    
    if (statusProcessed) return;

    const handlePaymentStatus = async () => {
      if (status === 'success' || status === 'approved') {
        setStatusProcessed(true);
        
        // Fetch subscription status from database if user is logged in
        if (user) {
          try {
            const { data: subData } = await supabase
              .from('subscribers')
              .select('subscribed, subscription_end')
              .eq('user_id', user.id)
              .single();
              
            if (subData?.subscribed) {
              // Subscription is active, show success toast
              const endDate = new Date(subData.subscription_end);
              const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric'
              }).format(endDate);
              
              toast({
                title: "Assinatura confirmada!",
                description: `Sua assinatura está ativa até ${formattedDate}.`,
              });
            } else {
              // Subscription might still be processing
              toast({
                title: "Pagamento recebido!",
                description: "Estamos processando sua assinatura, isso pode levar alguns instantes.",
              });
            }
          } catch (err) {
            console.error("Erro ao verificar status da assinatura:", err);
          }
        } else {
          toast({
            title: "Pagamento confirmado!",
            description: "Sua assinatura foi ativada com sucesso.",
          });
        }
        
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
      } else if (status === 'pending') {
        setStatusProcessed(true);
        toast({
          title: "Pagamento pendente",
          description: "Seu pagamento está em processamento. Você receberá uma notificação quando for confirmado.",
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
    };
    
    handlePaymentStatus();
  }, [location, navigate, toast, statusProcessed, user]);

  // Determinar qual mensagem e ícone mostrar com base no status
  const isSuccess = paymentStatus === 'success' || paymentStatus === 'approved';
  const isFailure = paymentStatus === 'failure' || paymentStatus === 'rejected';
  const isPending = paymentStatus === 'pending';
  const isProcessing = !paymentStatus;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md p-6 bg-background border rounded-lg shadow-lg">
        {isProcessing && (
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
        
        {isPending && (
          <>
            <div className="flex justify-center mb-4">
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">Pagamento em processamento</h2>
            <p className="text-muted-foreground text-center mb-6">
              Seu pagamento está sendo processado. Você receberá uma confirmação assim que for concluído.
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
