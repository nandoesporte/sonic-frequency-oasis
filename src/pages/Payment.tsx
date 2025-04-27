
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success') {
      toast({
        title: "Pagamento confirmado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
      navigate('/premium');
    } else if (status === 'failure') {
      toast({
        title: "Pagamento não concluído",
        description: "Houve um problema com seu pagamento. Tente novamente.",
        variant: "destructive",
      });
      navigate('/premium');
    }
  }, [status, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
