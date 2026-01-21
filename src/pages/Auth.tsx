import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'Senha deve ter pelo menos 6 caracteres');

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateFields = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch {
      newErrors.email = 'Email inválido';
    }
    
    try {
      passwordSchema.parse(password);
    } catch {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      let message = 'Erro ao fazer login';
      if (error.message.includes('Invalid login credentials')) {
        message = 'Email ou senha incorretos';
      }
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } else {
      toast({ title: 'Bem-vinda!', description: 'Login realizado com sucesso.' });
      navigate('/');
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    try {
      emailSchema.parse(recoveryEmail.trim());
    } catch {
      setRecoveryError('Email inválido');
      return;
    }

    setRecoveryLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail.trim(), {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      setRecoverySent(true);
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o email de recuperação.',
        variant: 'destructive',
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  const resetRecoveryForm = () => {
    setShowRecovery(false);
    setRecoveryEmail('');
    setRecoveryError('');
    setRecoverySent(false);
  };

  // Password recovery view
  if (showRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">OverSoul</h1>
            <p className="text-muted-foreground">Sistema de Gestão de Pedidos</p>
          </div>

          <Card className="glass border-border">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl flex items-center justify-center gap-2">
                <KeyRound className="h-5 w-5" />
                Recuperação de Senha
              </CardTitle>
              <CardDescription>
                {recoverySent 
                  ? 'Um email foi enviado com instruções para redefinir a senha.'
                  : 'Informe seu email para receber um link de recuperação.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recoverySent ? (
                <div className="flex flex-col items-center py-6 gap-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <p className="text-center text-muted-foreground">
                    Verifique a caixa de entrada do email <strong>{recoveryEmail}</strong>
                  </p>
                  <Button onClick={resetRecoveryForm} className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordRecovery} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Seu Email</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className={recoveryError ? 'border-destructive' : ''}
                    />
                    {recoveryError && <p className="text-sm text-destructive">{recoveryError}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={recoveryLoading}>
                    {recoveryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Link de Recuperação
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={resetRecoveryForm}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao Login
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">OverSoul</h1>
          <p className="text-muted-foreground">Sistema de Gestão de Pedidos</p>
        </div>

        <Card className="glass border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Acesso ao Sistema</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-6">
              O cadastro de novos usuários é feito internamente.<br />
              Solicite acesso a um administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}