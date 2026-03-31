import { useState, useEffect } from "react";
import { Share2, Instagram, MessageCircle, Save, Check, AlertTriangle, Shield, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/lib/services/dataService";
import { cn } from "@/lib/utils";
import {
  INSTAGRAM_STRATEGIES,
  WHATSAPP_STRATEGIES,
  DEFAULT_PUBLISHING_CONFIG,
  type PublishingStrategy,
  type UserPublishingConfig,
} from "@/lib/publishing/types";

const riskColors: Record<string, string> = {
  none: "bg-success/10 text-success",
  low: "bg-blue-500/10 text-blue-500",
  medium: "bg-warning/10 text-warning",
};

const costBadge = (cost: string) =>
  cost === "paid"
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : "bg-success/10 text-success border-success/20";

function StrategyCard({
  strategy,
  selected,
  onSelect,
}: {
  strategy: PublishingStrategy;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-xl border-2 transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-glow"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{strategy.name}</span>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", costBadge(strategy.cost))}>
          {strategy.cost === "paid" ? "💰 Pago" : "🆓 Grátis"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{strategy.description}</p>
      <div className="flex items-center gap-3 text-xs">
        <span className={cn("px-2 py-0.5 rounded-full", riskColors[strategy.riskLevel])}>
          {strategy.riskLevel === "none" ? "✅ Sem risco" : strategy.riskLevel === "low" ? "🔒 Risco baixo" : "⚠️ Risco médio"}
        </span>
        <span className="text-muted-foreground">📊 {strategy.dailyLimit}</span>
      </div>
    </button>
  );
}

export default function PublishingConfigPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<UserPublishingConfig>(DEFAULT_PUBLISHING_CONFIG);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadConfig();
  }, [user]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const settings = await dataService.getUserSettings(user!.id);
      if (settings?.sync_settings) {
        const s = typeof settings.sync_settings === "string" ? JSON.parse(settings.sync_settings) : settings.sync_settings;
        if (s.publishingConfig) setConfig(s.publishingConfig);
      }
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const settings = await dataService.getUserSettings(user.id);
      const existingSync = settings?.sync_settings
        ? typeof settings.sync_settings === "string" ? JSON.parse(settings.sync_settings) : settings.sync_settings
        : {};
      await dataService.updateUserSettings(user.id, {
        sync_settings: { ...existingSync, publishingConfig: config },
      });
      setSaved(true);
      toast({ title: "Configurações salvas!", description: "Estratégias de publicação atualizadas." });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="w-8 h-8 rounded-xl gradient-primary animate-pulse-glow flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">📤 Configuração de Publicação</h1>
          <p className="text-muted-foreground text-sm mt-1">Escolha como publicar em cada plataforma</p>
        </div>
        <Button onClick={handleSave} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
          {saved ? <><Check className="w-4 h-4 mr-2" /> Salvo!</> : <><Save className="w-4 h-4 mr-2" /> Salvar Configurações</>}
        </Button>
      </div>

      {/* Instagram Strategies */}
      <div className="rounded-2xl border border-border p-6 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground text-lg">Instagram</h2>
            <p className="text-xs text-muted-foreground">Escolha como publicar no Instagram</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INSTAGRAM_STRATEGIES.map((s) => (
            <StrategyCard
              key={s.id}
              strategy={s}
              selected={config.instagramStrategy === s.id}
              onSelect={() => setConfig({ ...config, instagramStrategy: s.id })}
            />
          ))}
        </div>
      </div>

      {/* WhatsApp Strategies */}
      <div className="rounded-2xl border border-border p-6 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground text-lg">WhatsApp</h2>
            <p className="text-xs text-muted-foreground">Escolha como enviar mensagens no WhatsApp</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {WHATSAPP_STRATEGIES.map((s) => (
            <StrategyCard
              key={s.id}
              strategy={s}
              selected={config.whatsappStrategy === s.id}
              onSelect={() => setConfig({ ...config, whatsappStrategy: s.id })}
            />
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-border p-6 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <h2 className="font-display font-semibold text-foreground text-lg mb-4">📊 Comparativo de Métodos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Recurso</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">🥇 API Oficial</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">🥈 Automação</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">🥉 Manual</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Custo", "💰 Pago", "🆓 Grátis", "🆓 Grátis"],
                ["Automação total", "✅", "✅", "❌"],
                ["Requer aprovação", "✅ Sim", "❌ Não", "❌ Não"],
                ["Risco de bloqueio", "Baixo", "Médio", "Nenhum"],
                ["Volume de posts", "Ilimitado", "Limitado (~50/dia)", "Manual"],
                ["Configuração", "Complexa (dias)", "Simples (minutos)", "Nenhuma"],
                ["Recomendado", "Empresas", "Afiliados", "Testes"],
              ].map(([label, api, browser, manual], i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2.5 px-4 font-medium text-foreground">{label}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{api}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{browser}</td>
                  <td className="py-2.5 px-4 text-center text-muted-foreground">{manual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warning messages */}
      {config.instagramStrategy === "instagram-browser" || config.whatsappStrategy === "whatsapp-browser" ? (
        <div className="rounded-2xl border border-warning/30 p-4 flex items-start gap-3" style={{ background: "hsl(var(--warning) / 0.05)" }}>
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">⚠️ Automação via navegador</p>
            <p className="text-xs text-muted-foreground mt-1">
              Use com moderação para evitar bloqueios. Recomendamos no máximo 30 publicações/dia e intervalos de 1 minuto entre elas.
            </p>
          </div>
        </div>
      ) : null}

      {/* Info box */}
      <div className="rounded-2xl border border-primary/20 p-4 flex items-start gap-3" style={{ background: "hsl(var(--primary) / 0.05)" }}>
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">💡 Comece com o modo manual</p>
          <p className="text-xs text-muted-foreground mt-1">
            O modo manual funciona hoje, sem custo. Escale para automação quando tiver volume, e migre para API oficial quando tiver orçamento.
          </p>
        </div>
      </div>
    </div>
  );
}
