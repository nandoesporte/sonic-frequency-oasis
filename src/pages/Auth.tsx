import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Logo } from '@/components/ui/logo';

// Define proper schema for login and registration
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
});

// Use discriminated union type to handle different form modes
type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type FormData = LoginFormData | RegisterFormData;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const navigate = useNavigate();

  console.log('Auth page rendered, user:', user, 'loading:', loading);

  // Use the appropriate schema based on the current mode
  const currentSchema = isLogin ? loginSchema : registerSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isLogin ? {} : { fullName: '' }),
    },
  });

  // Reset form and error when switching between login and register
  useEffect(() => {
    setAuthError(null);
    setShowEmailConfirmation(false);
    form.reset({
      email: '',
      password: '',
      ...(isLogin ? {} : { fullName: '' }),
    });
  }, [isLogin, form]);

  // Handle authenticated user - with protection against redirecting multiple times
  useEffect(() => {
    if (user && !redirecting && !loading) {
      console.log('User is authenticated, redirecting to home');
      setRedirecting(true);
      
      // Provide visual feedback before redirecting
      toast.success('Login bem-sucedido!', {
        description: 'Redirecionando para a página inicial...',
      });

      // Use a small timeout to prevent potential race conditions
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    }
  }, [user, loading, navigate, redirecting]);

  // Show loading state
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const onSubmit = async (values: FormData) => {
    try {
      console.log('Form submitted:', values);
      setIsSubmitting(true);
      setAuthError(null);

      if (isLogin) {
        console.log('Attempting login for:', values.email);
        const result = await signIn(values.email, values.password);
        
        if (result && result.user) {
          console.log('Login successful');
          // Feedback is now handled in the useEffect
        } else {
          console.error('Login failed:', result?.error || 'Unknown error');
          setAuthError(result?.error || 'Email ou senha incorretos.');
        }
      } else {
        // Type assertion to access fullName in the registration path
        const registerValues = values as RegisterFormData;
        
        if (!registerValues.fullName) {
          setAuthError('Nome completo é obrigatório para criar conta.');
          toast.error('Erro ao registrar', {
            description: 'Nome completo é obrigatório para criar conta.'
          });
          setIsSubmitting(false);
          return;
        }

        console.log('Attempting signup for:', values.email);
        const result = await signUp(values.email, values.password, registerValues.fullName);
        
        if (result && result.user) {
          console.log('Signup successful');
          setRegisteredEmail(values.email);
          setShowEmailConfirmation(true);
          toast.success('Conta criada com sucesso!', {
            description: 'Por favor, verifique seu email para confirmar sua conta.'
          });
          
          // Don't automatically switch to login mode to keep the confirmation message visible
          form.reset({
            email: values.email,
            password: '',
          });
        } else if (result && result.error && result.error.includes('signup_disabled')) {
          console.error('Signup not allowed:', result.error);
          setAuthError('O cadastro de novas contas está desativado neste momento. Por favor, contate o administrador.');
          toast.error('Cadastro desativado', {
            description: 'Não é possível criar novas contas no momento.'
          });
        } else {
          console.error('Signup failed:', result?.error || 'Unknown error');
          setAuthError(result?.error || 'Não foi possível criar sua conta. Tente novamente.');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(
        isLogin 
          ? 'Erro ao fazer login. Tente novamente.'
          : 'Erro ao criar conta. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    await signInWithGoogle();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If the user is already logged in and we're not redirecting, show a loading screen
  if (user && !redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Redirecionando para a página inicial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Logo section added here */}
      <div className="mb-8">
        <Logo variant="default" className="scale-125" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Entrar' : 'Criar Conta'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Entre com seu email e senha'
              : 'Preencha os dados abaixo para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              {showEmailConfirmation && !isLogin && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Um email de confirmação foi enviado para <strong>{registeredEmail}</strong>. 
                    Por favor verifique sua caixa de entrada e clique no link para ativar sua conta.
                  </AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com" 
                        autoComplete="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••" 
                          autoComplete={isLogin ? "current-password" : "new-password"}
                          {...field} 
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-muted"></div>
                <span className="mx-4 flex-shrink text-xs text-muted-foreground">OU</span>
                <div className="flex-grow border-t border-muted"></div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full flex items-center justify-center"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Entrando...' : 'Criando conta...'}
                  </>
                ) : (
                  isLogin ? 'Entrar' : 'Criar Conta'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isSubmitting}
              >
                {isLogin
                  ? 'Não tem uma conta? Criar conta'
                  : 'Já tem uma conta? Entrar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
