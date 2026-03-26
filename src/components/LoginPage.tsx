import { useState } from "react";
import { Eye, EyeOff, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@affiliateai.com" && password === "Admin@123") {
        onLogin();
      } else {
        toast({ title: "Credenciais inválidas", description: "E-mail ou senha incorretos.", variant: "destructive" });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" style={{animationDelay:'1.5s'}} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-glow mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-primary">AffiliateAI Pro</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sistema de Automação de Marketing</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl glow-border p-8 shadow-elevated" style={{background: 'hsl(var(--card))'}}>
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@affiliateai.com"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Lembrar-me</Label>
              </div>
              <button type="button" className="text-sm text-primary hover:underline">Esqueci a senha</button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gradient-primary text-white font-semibold rounded-xl shadow-glow hover:opacity-90 transition-all duration-200 border-0"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-primary font-medium">Demo:</span> admin@affiliateai.com / Admin@123
            </p>
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
