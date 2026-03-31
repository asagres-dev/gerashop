import { useState, useEffect } from "react";
import {
  Settings, Key, Bell, Webhook, User, Save, Copy, Check, RefreshCw, Plug, AlertCircle,
  Instagram, MessageCircle, TestTube, Download, Clock, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/lib/services/dataService";
import { OfertashopClient, type ConnectionTestResult } from "@/lib/integrations/ofertashop";
import DataStatus from "./DataStatus";

export default function SettingsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [aiModel, setAiModel] = useState("openai/gpt-4-turbo");
  const [webhookKey, setWebhookKey] = useState("");
  const [whatsappGroupName, setWhatsappGroupName] = useState("");
  const [whatsappGroupLink, setWhatsappGroupLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Ofertashop
  const [ofertashopEnabled, setOfertashopEnabled] = useState(false);
  const [ofertashopUrl, setOfertashopUrl] = useState("");
  const [ofertashopKey, setOfertashopKey] = useState("");
  const [ofertashopWebhook, setOfertashopWebhook] = useState("");
  const [ofertashopSyncFreq, setOfertashopSyncFreq] = useState(30);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const settings = await dataService.getUserSettings(user!.id);
      if (settings) {
        if (settings.api_key) setApiKey(settings.api_key);
        if (settings.ai_model) setAiModel(settings.ai_model);
        if (settings.webhook_key) setWebhookKey(settings.webhook_key);
        if (settings.whatsapp_group_name) setWhatsappGroupName(settings.whatsapp_group_name);
        if (settings.whatsapp_group_link) setWhatsappGroupLink(settings.whatsapp_group_link);
        if (settings.ofertashop_config) {
          const config = typeof settings.ofertashop_config === "string"
            ? JSON.parse(settings.ofertashop_config)
            : settings.ofertashop_config;
          setOfertashopEnabled(config.isEnabled || false);
          setOfertashopUrl(config.apiUrl || "");
          setOfertashopKey(config.apiKey || "");
          setOfertashopWebhook(config.webhookSecret || "");
          setOfertashopSyncFreq(config.syncFrequency ?? 30);
          setLastSync(config.lastSync || null);
        }
      }
    } catch {}
    setLoadingSettings(false);
  };

  const handleSave = async () => {
    if (user) {
      await dataService.updateUserSettings(user.id, {
        api_key: apiKey,
        ai_model: aiModel,
        webhook_key: webhookKey,
        whatsapp_group_name: whatsappGroupName,
        whatsapp_group_link: whatsappGroupLink,
        ofertashop_config: {
          isEnabled: ofertashopEnabled,
          apiUrl: ofertashopUrl,
          apiKey: ofertashopKey,
          webhookSecret: ofertashopWebhook,
          syncFrequency: ofertashopSyncFreq,
          lastSync,
        },
      });
    }
    setSaved(true);
    toast({ title: "Configurações salvas!", description: "Suas preferências foram atualizadas com sucesso." });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const client = new OfertashopClient({ apiUrl: ofertashopUrl, apiKey: ofertashopKey, webhookSecret: ofertashopWebhook, isEnabled: true, lastSync: null, syncFrequency: 0 });
    const result = await client.testConnection();
    setTestResult(result);
    setTesting(false);
    if (result.success) {
      setOfertashopEnabled(true);
    }
  };

  const handleImportOffers = async () => {
    if (!ofertashopUrl || !ofertashopKey) {
      toast({ title: "Erro", description: "Configure e teste a conexão primeiro.", variant: "destructive" });
      return;
    }
    setImporting(true);
    setImportProgress(0);
    try {
      const client = new OfertashopClient({ apiUrl: ofertashopUrl, apiKey: ofertashopKey, webhookSecret: ofertashopWebhook, isEnabled: true, lastSync: null, syncFrequency: 0 });
      const interval = setInterval(() => setImportProgress(p => Math.min(p + 10, 90)), 400);
      const offers = await client.getOffers({ limit: 100 });
      clearInterval(interval);
      setImportProgress(100);

      let imported = 0;
      for (const offer of offers) {
        try {
          await dataService.createOffer({
            name: offer.name,
            platform: (offer.platform || "Ofertashop") as any,
            category: offer.category || "Geral",
            originalPrice: offer.original_price,
            promoPrice: offer.promotional_price,
            link: offer.affiliate_link,
            imageUrl: offer.image_url || "",
            expiry: offer.expiration_date || "",
            status: "Ativa" as any,
          }, user!.id);
          imported++;
        } catch {}
      }

      const now = new Date().toISOString();
      setLastSync(now);
      toast({ title: "Importação concluída!", description: `${imported} ofertas importadas do Ofertashop.` });
    } catch (err: any) {
      toast({ title: "Erro na importação", description: err.message, variant: "destructive" });
    } finally {
      setImporting(false);
      setImportProgress(0);
    }
  };

  const copyWebhook = () => {
    const url = `${window.location.origin}/api/webhook/ofertashop`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      id: "ai", icon: Key, title: "Integrações de IA",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Configuração avançada de IA</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gerencie provedores, modelos e parâmetros na página dedicada de <strong>Config. de IA</strong> no menu lateral.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">OpenRouter API Key (legado)</Label>
            <div className="flex gap-2">
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-muted border-border h-10 font-mono text-sm" />
              <Button variant="outline" size="sm" className="h-10 px-3 border-border hover:bg-muted"><RefreshCw className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "webhook", icon: Webhook, title: "Webhook — Integração com Site",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">URL do Webhook</Label>
            <div className="flex gap-2">
              <Input readOnly value={`${window.location.origin}/api/webhook/ofertashop`} className="bg-muted border-border h-10 font-mono text-xs" />
              <Button onClick={copyWebhook} variant="outline" size="sm" className="h-10 px-3 border-border hover:bg-muted flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Chave de Autenticação</Label>
            <Input value={webhookKey} onChange={(e) => setWebhookKey(e.target.value)} className="bg-muted border-border h-10 font-mono text-sm" />
          </div>
        </div>
      ),
    },
    {
      id: "notifications", icon: Bell, title: "Notificações",
      content: (
        <div className="space-y-3">
          {[
            { label: "Novas ofertas importadas", desc: "Receba alertas quando novas ofertas forem adicionadas" },
            { label: "Campanhas se aproximando", desc: "7 dias antes de cada data comemorativa" },
            { label: "Relatório semanal", desc: "Resumo de performance toda segunda-feira" },
            { label: "Alertas de conversão", desc: "Quando uma oferta ultrapassar 100 cliques" },
          ].map((n, i) => (
            <label key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-muted cursor-pointer hover:bg-card transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              </div>
              <input type="checkbox" defaultChecked className="mt-0.5 rounded accent-primary flex-shrink-0" />
            </label>
          ))}
        </div>
      ),
    },
    {
      id: "account", icon: User, title: "Conta",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input defaultValue={user?.user_metadata?.name || "Admin"} className="bg-muted border-border h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">E-mail</Label>
              <Input defaultValue={user?.email || ""} readOnly className="bg-muted border-border h-10 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nome do Grupo WhatsApp</Label>
            <Input value={whatsappGroupName} onChange={(e) => setWhatsappGroupName(e.target.value)} className="bg-muted border-border h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Link de Convite do Grupo</Label>
            <Input value={whatsappGroupLink} onChange={(e) => setWhatsappGroupLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." className="bg-muted border-border h-10" />
          </div>
        </div>
      ),
    },
    {
      id: "ofertashop", icon: Plug, title: "Integração Ofertashop",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span className="text-sm font-semibold text-foreground">Ofertashop.com.br</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${ofertashopEnabled ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              {ofertashopEnabled ? "✅ Ativo" : "⏳ Não configurado"}
            </span>
          </div>

          {lastSync && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Última sincronização: {new Date(lastSync).toLocaleString("pt-BR")}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">URL da API</Label>
              <Input value={ofertashopUrl} onChange={(e) => setOfertashopUrl(e.target.value)} placeholder="https://api.ofertashop.com.br/v1" className="bg-muted border-border h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Chave da API</Label>
              <Input value={ofertashopKey} onChange={(e) => setOfertashopKey(e.target.value)} placeholder="os_live_xxxxxxxx" className="bg-muted border-border h-10 font-mono" type="password" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Webhook Secret (opcional)</Label>
              <Input value={ofertashopWebhook} onChange={(e) => setOfertashopWebhook(e.target.value)} placeholder="whsec_xxxxxxxx" className="bg-muted border-border h-10 font-mono" type="password" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={testing || !ofertashopUrl || !ofertashopKey} variant="outline" className="flex-1">
              {testing ? <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> Testando...</> : <><TestTube className="w-3.5 h-3.5 mr-1" /> 🔌 Testar Conexão</>}
            </Button>
            <Button onClick={handleImportOffers} disabled={importing || !ofertashopEnabled} className="flex-1 gradient-primary text-white border-0">
              {importing ? <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> Importando...</> : <><Download className="w-3.5 h-3.5 mr-1" /> 📥 Importar Ofertas</>}
            </Button>
          </div>

          {importing && (
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${importProgress}%` }} />
            </div>
          )}

          {testResult && (
            <div className={`p-3 rounded-xl text-sm ${testResult.success ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
              {testResult.success ? "✅ " : "❌ "}{testResult.message}
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">🔄 Sincronização Automática</Label>
            <select value={ofertashopSyncFreq} onChange={(e) => setOfertashopSyncFreq(Number(e.target.value))} className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary">
              <option value={15}>A cada 15 minutos</option>
              <option value={30}>A cada 30 minutos</option>
              <option value={60}>A cada 1 hora</option>
              <option value={120}>A cada 2 horas</option>
              <option value={0}>Desativado</option>
            </select>
            {ofertashopSyncFreq > 0 && (
              <p className="text-xs text-muted-foreground">O sistema verificará automaticamente por novas ofertas ou alterações.</p>
            )}
          </div>

          {/* Webhook Config */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-foreground mb-2">🔔 Webhook para Atualizações em Tempo Real</p>
            <p className="text-xs text-muted-foreground mb-2">Configure esta URL no painel do Ofertashop:</p>
            <div className="flex gap-2">
              <Input readOnly value={`${window.location.origin}/api/webhook/ofertashop`} className="bg-muted border-border h-8 font-mono text-xs" />
              <Button onClick={copyWebhook} variant="outline" size="sm" className="h-8 px-2">
                {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">⚡ Com o webhook, ofertas serão atualizadas em segundos!</p>
          </div>
        </div>
      ),
    },
    {
      id: "instagram", icon: Instagram, title: "Integração Instagram",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📷</span>
              <span className="text-sm font-semibold text-foreground">Instagram Graph API</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-warning/10 text-warning">⏳ Aguardando Configuração</span>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              Configure o método de publicação na página <strong>📤 Publicação</strong> no menu lateral. Escolha entre API Oficial, Automação ou Modo Manual.
            </p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>📌 <strong>Requisitos:</strong> Conta Business ou Creator + Página do Facebook</p>
            <p>📊 <strong>Limites:</strong> 200 requisições/hora, 50 publicações/hora</p>
          </div>
        </div>
      ),
    },
    {
      id: "whatsapp", icon: MessageCircle, title: "Integração WhatsApp Business",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span className="text-sm font-semibold text-foreground">WhatsApp Business API</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-warning/10 text-warning">⏳ Aguardando Configuração</span>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              Configure o método de envio na página <strong>📤 Publicação</strong> no menu lateral. Escolha entre API Oficial, WhatsApp Web ou Modo Manual.
            </p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>📌 <strong>Requisitos:</strong> Conta WhatsApp Business verificada</p>
            <p>📝 <strong>Importante:</strong> Primeiro contato exige template aprovado</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie integrações, conta e preferências</p>
        </div>
        <div className="flex items-center gap-3">
          <DataStatus />
          <Button onClick={handleSave} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
            {saved ? <><Check className="w-4 h-4 mr-2" /> Salvo!</> : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className={`rounded-2xl border border-border p-5 shadow-card ${s.id === "ofertashop" ? "xl:col-span-2" : ""}`} style={{ background: "hsl(var(--card))" }}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
              </div>
              {s.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
