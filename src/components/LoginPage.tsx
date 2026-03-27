import { useState } from "react";
import { Eye, EyeOff, Zap, TrendingUp, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Conta criada!", description: "Verifique seu e-mail para confirmar o cadastro." });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Credenciais inválidas", description: error.message, variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Erro", description: "Ocorreu um erro inesperado.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-primary">AffiliateAI Pro</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sistema de Automação de Marketing</p>
        </div>

        <div className="rounded-2xl glow-border p-8 shadow-elevated" style={{ background: "hsl(var(--card))" }}>
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            {isSignUp ? "Criar nova conta" : "Entrar na sua conta"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted border-border focus:border-primary transition-colors h-11"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border-border focus:border-primary transition-colors h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted border-border focus:border-primary transition-colors h-11 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c as boolean)} />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Lembrar-me</Label>
                </div>
                <button type="button" className="text-sm text-primary hover:underline">Esqueci a senha</button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-primary text-white font-semibold rounded-xl shadow-glow hover:opacity-90 transition-all duration-200 border-0"
            >
              {loading ? (isSignUp ? "Criando conta..." : "Entrando...") : isSignUp ? "Criar Conta" : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline flex items-center gap-1 justify-center w-full"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar agora"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <TrendingUp className="w-4 h-4 text-success" />
          <p className="text-xs text-muted-foreground">Powered by IA • Natura • Amazon • Mercado Livre • Shopee</p>
        </div>
      </div>
    </div>
  );
}
