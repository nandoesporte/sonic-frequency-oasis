
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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

// Define the form validation schema
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
});

// Define the form types to match the schemas
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  console.log('Auth page rendered, user:', user, 'loading:', loading);

  // Use the appropriate form based on the current mode
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  // Reset form and error when switching between login and register
  useEffect(() => {
    setAuthError(null);
    loginForm.reset();
    registerForm.reset();
  }, [isLogin, loginForm, registerForm]);

  // Redirect if user is already logged in
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if user is already logged in
  if (user) {
    console.log('User is already authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      console.log('Form submitted:', values);
      setIsSubmitting(true);
      setAuthError(null);

      if (isLogin) {
        // Login flow - we know this is LoginFormValues
        const loginValues = values as LoginFormValues;
        console.log('Attempting login for:', loginValues.email);
        const result = await signIn(loginValues.email, loginValues.password);
        
        if (result.user) {
          console.log('Login successful, redirecting to home');
          navigate('/', { replace: true });
        } else {
          console.error('Login failed:', result.error);
          setAuthError(result.error || 'Email ou senha incorretos.');
        }
      } else {
        // Register flow - we know this is RegisterFormValues
        const registerValues = values as RegisterFormValues;
        
        if (!registerValues.fullName) {
          setAuthError('Nome completo é obrigatório para criar conta.');
          setIsSubmitting(false);
          return;
        }

        console.log('Attempting signup for:', registerValues.email);
        const result = await signUp(registerValues.email, registerValues.password, registerValues.fullName);
        
        if (result.user) {
          console.log('Signup successful, switching to login');
          setIsLogin(true);
          loginForm.reset({
            email: registerValues.email,
            password: '',
          });
        } else {
          console.error('Signup failed:', result.error);
          setAuthError(result.error || 'Não foi possível criar sua conta. Tente novamente.');
        }
      }
    } catch (error) {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Entrar' : 'Criar Conta'}</CardTitle>
          <CardDescription>
            {isLogin
              ? 'Entre com seu email e senha'
              : 'Preencha os dados abaixo para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <Form {...(isLogin ? loginForm : registerForm)}>
          <form onSubmit={isLogin ? loginForm.handleSubmit(onSubmit) : registerForm.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <FormField
                  control={registerForm.control}
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
                control={isLogin ? loginForm.control : registerForm.control}
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
                control={isLogin ? loginForm.control : registerForm.control}
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
