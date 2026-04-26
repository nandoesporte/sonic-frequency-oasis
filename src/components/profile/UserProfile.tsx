
import { useState } from "react";
import { User as AuthUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Crown, User, Calendar, LogOut, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

interface SubscriptionData {
  subscribed: boolean;
  subscription_end?: string;
  plan_id?: string;
  plan_name?: string;
  plan_description?: string;
  subscription_tier?: string;
  last_payment_date?: string;
}

interface UserProfileProps {
  user: AuthUser | null;
  userData: UserData | null;
  subscriptionData: SubscriptionData | null;
  isPremium: boolean;
  loading: boolean;
}

export function UserProfile({ 
  user, 
  userData, 
  subscriptionData, 
  isPremium, 
  loading 
}: UserProfileProps) {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro durante o logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Carregando informações do perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
        <p className="text-muted-foreground mb-6">Faça login para acessar seu perfil.</p>
        <Button asChild>
          <Link to="/auth">Login / Cadastro</Link>
        </Button>
      </div>
    );
  }

  const displayName = userData?.full_name || userData?.username || user.email?.split('@')[0] || 'Usuário';
  const isSubscriptionActive = subscriptionData?.subscribed || isPremium;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <Avatar className="w-full h-full border-2 border-primary/10">
            <AvatarImage src={userData?.avatar_url || undefined} />
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            {isSubscriptionActive && (
              <Badge variant="success" className="ml-2 flex items-center gap-1">
                <Crown className="h-3.5 w-3.5" />
                Premium
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-muted-foreground mb-4">
            <Mail className="h-4 w-4 mr-2" />
            <span>{user.email}</span>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {!showConfirmLogout ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowConfirmLogout(true)}
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>
            ) : (
              <>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Confirmar logout
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações da conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-sm font-medium text-muted-foreground">Nome:</span>
              <span>{userData?.full_name || "—"}</span>
              
              <span className="text-sm font-medium text-muted-foreground">Username:</span>
              <span>{userData?.username || "—"}</span>
              
              <span className="text-sm font-medium text-muted-foreground">Email:</span>
              <span>{user.email}</span>
              
              <span className="text-sm font-medium text-muted-foreground">Membro desde:</span>
              <span>{formatDate(user.created_at || userData?.created_at)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Status da assinatura
            </CardTitle>
            <CardDescription>
              Gerencie sua assinatura premium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSubscriptionActive ? (
              <>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <Badge variant="success">Ativo</Badge>
                  
                  <span className="text-sm font-medium text-muted-foreground">Plano:</span>
                  <span>{subscriptionData?.plan_name || "Premium"}</span>
                  
                  <span className="text-sm font-medium text-muted-foreground">Válido até:</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(subscriptionData?.subscription_end)}
                  </span>
                  
                  <span className="text-sm font-medium text-muted-foreground">Último pagamento:</span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDate(subscriptionData?.last_payment_date)}
                  </span>
                </div>
                
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link to="/premium#planos">Gerenciar assinatura</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p>Você ainda não possui um plano premium ativo.</p>
                
                <Button asChild className="w-full">
                  <Link to="/premium#planos">
                    <Crown className="mr-2 h-4 w-4" />
                    Assinar Premium
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
