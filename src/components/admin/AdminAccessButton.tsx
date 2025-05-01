
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminAccessButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Só mostrar o botão para o email do administrador
  if (user?.email !== 'nandomartin21@msn.com') {
    return null;
  }
  
  return (
    <Button
      onClick={() => navigate('/admin')}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ShieldAlert className="h-4 w-4" />
      <span>Acessar Admin</span>
    </Button>
  );
};

export default AdminAccessButton;
