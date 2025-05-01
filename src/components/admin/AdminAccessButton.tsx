
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { setupAdminUser } from '@/utils/setupAdminUser';

const AdminAccessButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Só mostrar o botão para o email do administrador
  if (user?.email !== 'nandomartin21@msn.com') {
    return null;
  }
  
  const handleAdminAccess = async () => {
    setIsVerifying(true);
    try {
      console.log('Initiating admin access verification');
      const result = await setupAdminUser();
      
      if (result) {
        console.log('Admin access verified, navigating to admin dashboard');
        navigate('/admin');
      } else {
        console.log('Admin access verification failed');
        toast.error('Acesso negado', {
          description: 'Não foi possível verificar seu acesso de administrador'
        });
      }
    } catch (error: any) {
      console.error('Unexpected error accessing admin:', error);
      toast.error('Erro ao acessar área administrativa', {
        description: error?.message || 'Ocorreu um erro interno'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Button
      onClick={handleAdminAccess}
      variant="outline"
      className="flex items-center gap-2"
      disabled={isVerifying}
    >
      <ShieldAlert className="h-4 w-4" />
      <span>{isVerifying ? 'Verificando...' : 'Acessar Admin'}</span>
    </Button>
  );
};

export default AdminAccessButton;
