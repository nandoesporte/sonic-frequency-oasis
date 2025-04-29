
import React, { useState } from 'react';
import { 
  Card, CardHeader, CardTitle, CardDescription, 
  CardContent, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { addAdminUser } from '@/contexts/admin-utils';

export const AdminAccess = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email válido",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await addAdminUser(email);
      
      if (result.success) {
        toast({
          title: "Usuário adicionado com sucesso",
          description: `${email} agora tem acesso de administrador`,
          variant: "default"
        });
        setEmail('');
      } else {
        toast({
          title: "Erro ao adicionar usuário",
          description: result.error || "Não foi possível adicionar este usuário como administrador",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding admin user:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao adicionar o usuário como administrador",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Acesso</h1>
        <p className="text-muted-foreground">Adicione ou remova acesso de administrador</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Administrador</CardTitle>
          <CardDescription>Conceda privilégios de administrador a um usuário existente</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddAdmin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email do usuário
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar como Administrador"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
