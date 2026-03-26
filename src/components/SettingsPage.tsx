import { useState } from "react";
import { Settings, Key, Bell, Palette, Webhook, User, Save, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("sk-or-v1-•••••••••••••••••••••••••••••••••••");
  const [webhookKey, setWebhookKey] = useState("wh_live_a3f9x2kp8mQ4nR7vYzW1");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setSaved(true);
    toast({ title: "Configurações salvas!", description: "Suas preferências foram atualizadas com sucesso." });
    setTimeout(() => setSaved(false), 2000);
  };

  const copyWebhook = () => {
    navigator.clipboard.writeText(`https://affiliateai.pro/api/webhook/nova-oferta`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      id: "ai",
      icon: Key,
      title: "Integrações de IA",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">OpenRouter API Key</Label>
            <div className="flex gap-2">
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="bg-muted border-border h-10 font-mono text-sm" />
              <Button variant="outline" size="sm" className="h-10 px-3 border-border hover:bg-muted">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Obtenha sua chave em <span className="text-primary">openrouter.ai/keys</span></p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Modelo Padrão de IA</Label>
            <select className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2.5 h-10 focus:outline-none focus:border-primary">
              <option>openai/gpt-4-turbo</option>
              <option>anthropic/claude-3-opus</option>
              <option>google/gemini-pro</option>
              <option>meta-llama/llama-3.1-70b-instruct</option>
            </select>
          </div>
          <div className="p-3 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">API conectada e funcionando</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "webhook",
      icon: Webhook,
      title: "Webhook — Integração com Site",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">URL do Webhook</Label>
            <div className="flex gap-2">
              <Input readOnly value="https://affiliateai.pro/api/webhook/nova-oferta" className="bg-muted border-border h-10 font-mono text-xs" />
              <Button onClick={copyWebhook} variant="outline" size="sm" className="h-10 px-3 border-border hover:bg-muted flex-shrink-0">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Chave de Autenticação</Label>
            <Input value={webhookKey} readOnly className="bg-muted border-border h-10 font-mono text-sm" />
          </div>
          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{`POST /api/webhook/nova-oferta
Authorization: Bearer ${webhookKey}
Content-Type: application/json

{
  "produto": "Nome do Produto",
  "plataforma": "Amazon",
  "preco_original": 299.90,
  "preco_promocional": 199.90,
  "link_afiliado": "https://amzn.to/..."
}`}</p>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notificações",
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
      id: "account",
      icon: User,
      title: "Conta",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input defaultValue="Admin" className="bg-muted border-border h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">E-mail</Label>
              <Input defaultValue="admin@affiliateai.com" className="bg-muted border-border h-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Nome do Grupo WhatsApp</Label>
            <Input defaultValue="OfertaShop — Melhores Promoções 🔥" className="bg-muted border-border h-10" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Link de Convite do Grupo</Label>
            <Input placeholder="https://chat.whatsapp.com/..." className="bg-muted border-border h-10" />
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
        <Button onClick={handleSave} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
          {saved ? <><Check className="w-4 h-4 mr-2" /> Salvo!</> : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
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
