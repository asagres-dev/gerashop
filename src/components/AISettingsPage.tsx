import { useState, useEffect } from "react";
import {
  Brain, Plus, Trash2, TestTube, Check, X, Save, RefreshCw,
  ChevronDown, Loader2, AlertCircle, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { aiProviderService } from "@/lib/ai/providerService";
import { PROVIDER_TYPES, AI_TASKS } from "@/lib/ai/types";
import type { AIProvider, AIModel, AITaskConfig, AIGlobalParams } from "@/lib/ai/types";

export default function AISettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [taskConfigs, setTaskConfigs] = useState<AITaskConfig[]>([]);
  const [globalParams, setGlobalParams] = useState<AIGlobalParams>({
    temperature: 0.7, max_tokens: 2000, top_p: 0.9, frequency_penalty: 0.0,
  });
  const [modelCache, setModelCache] = useState<Record<string, AIModel[]>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add provider form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProvider, setNewProvider] = useState({ type: "openrouter", name: "", api_key: "", api_url: "" });
  const [modelSearch, setModelSearch] = useState("");

  useEffect(() => {
    if (user) loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [provs, configs, params] = await Promise.all([
        aiProviderService.getProviders(user!.id),
        aiProviderService.getTaskConfigs(user!.id),
        aiProviderService.getGlobalParams(user!.id),
      ]);
      setProviders(provs);
      setTaskConfigs(configs);
      setGlobalParams(params);
    } catch {}
    setLoading(false);
  };

  const handleAddProvider = async () => {
    if (!user || !newProvider.name || !newProvider.api_key) {
      toast({ title: "Preencha nome e API Key", variant: "destructive" });
      return;
    }
    try {
      const created = await aiProviderService.createProvider({
        user_id: user.id,
        type: newProvider.type,
        name: newProvider.name,
        api_key: newProvider.api_key,
        api_url: newProvider.api_url || undefined,
        is_active: true,
      });
      setProviders((p) => [created, ...p]);
      setNewProvider({ type: "openrouter", name: "", api_key: "", api_url: "" });
      setShowAddForm(false);
      toast({ title: "Provedor adicionado!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteProvider = async (id: string) => {
    try {
      await aiProviderService.deleteProvider(id);
      setProviders((p) => p.filter((x) => x.id !== id));
      toast({ title: "Provedor removido" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const handleTestProvider = async (provider: AIProvider) => {
    setTesting(provider.id);
    try {
      const result = await aiProviderService.testProvider(provider);
      if (result.success) {
        if (result.models?.length) {
          setModelCache((c) => ({ ...c, [provider.id]: result.models! }));
        }
        toast({ title: "✅ Conexão OK!", description: `${result.models?.length || 0} modelos encontrados` });
      } else {
        toast({ title: "❌ Falha na conexão", description: result.error, variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
    setTesting(null);
  };

  const handleFetchModels = async (provider: AIProvider) => {
    setTesting(provider.id);
    try {
      const models = await aiProviderService.fetchModels(provider);
      setModelCache((c) => ({ ...c, [provider.id]: models }));
      toast({ title: `${models.length} modelos carregados` });
    } catch {}
    setTesting(null);
  };

  const getTaskConfig = (task: string) => taskConfigs.find((c) => c.task === task);

  const handleTaskModelChange = (task: string, providerId: string, modelId: string) => {
    setTaskConfigs((prev) => {
      const existing = prev.find((c) => c.task === task);
      if (existing) {
        return prev.map((c) => (c.task === task ? { ...c, provider_id: providerId, model_id: modelId } : c));
      }
      return [
        ...prev,
        {
          id: "",
          user_id: user!.id,
          task,
          provider_id: providerId,
          model_id: modelId,
          temperature: globalParams.temperature,
          max_tokens: globalParams.max_tokens,
          top_p: globalParams.top_p,
          frequency_penalty: globalParams.frequency_penalty,
        },
      ];
    });
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await aiProviderService.updateGlobalParams(user.id, globalParams);
      for (const config of taskConfigs) {
        const payload = { 
          ...config, 
          user_id: user.id,
          provider_id: config.provider_id || null,
          model_id: config.model_id || null
        } as any;
        await aiProviderService.upsertTaskConfig(payload);
      }
      toast({ title: "Configurações salvas!" });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const allModels = Object.entries(modelCache).flatMap(([providerId, models]) =>
    models.map((m) => ({ ...m, _providerId: providerId }))
  );

  const providerTypeInfo = (type: string) => PROVIDER_TYPES.find((t) => t.id === type);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Configuração de IA</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie provedores, modelos e parâmetros de geração</p>
        </div>
        <Button onClick={handleSaveAll} disabled={saving} className="gradient-primary text-white border-0 shadow-glow">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Configurações
        </Button>
      </div>

      {/* Providers Section */}
      <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-display font-semibold text-foreground">Provedores Configurados</h3>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar Provedor
          </Button>
        </div>

        {/* Add provider form */}
        {showAddForm && (
          <div className="mb-4 p-4 rounded-xl bg-muted space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Tipo do Provedor</Label>
                <select
                  value={newProvider.type}
                  onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value, name: PROVIDER_TYPES.find((t) => t.id === e.target.value)?.name || "" })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
                >
                  {PROVIDER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} — {t.description}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nome (identificação)</Label>
                <Input
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  placeholder="Ex: Minha OpenRouter"
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">API Key</Label>
                <Input
                  value={newProvider.api_key}
                  onChange={(e) => setNewProvider({ ...newProvider, api_key: e.target.value })}
                  placeholder="sk-or-v1-..."
                  type="password"
                  className="h-9 font-mono"
                />
              </div>
              {providerTypeInfo(newProvider.type)?.apiUrlRequired && (
                <div className="space-y-1">
                  <Label className="text-xs">URL da API (custom)</Label>
                  <Input
                    value={newProvider.api_url}
                    onChange={(e) => setNewProvider({ ...newProvider, api_url: e.target.value })}
                    placeholder="https://api.exemplo.com/v1"
                    className="h-9 font-mono"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddProvider}>
                <Check className="w-3.5 h-3.5 mr-1" /> Adicionar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Provider list */}
        {providers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum provedor configurado</p>
            <p className="text-xs mt-1">Adicione um provedor de IA para começar a gerar conteúdo com IA real</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...providers].sort((a,b) => a.name.localeCompare(b.name)).map((prov) => {
              const typeInfo = providerTypeInfo(prov.type);
              const cachedModels = modelCache[prov.id] || [];
              return (
                <div key={prov.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${prov.is_active ? "bg-success" : "bg-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{prov.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {typeInfo?.name} • {cachedModels.length > 0 ? `${cachedModels.length} modelos` : "Clique em Testar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleFetchModels(prov)}
                      disabled={testing === prov.id}
                    >
                      {testing === prov.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => handleTestProvider(prov)}
                      disabled={testing === prov.id}
                    >
                      <TestTube className="w-3.5 h-3.5 mr-1" /> Testar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProvider(prov.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Model Config */}
      <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-display font-semibold text-foreground">Modelos por Tarefa</h3>
        </div>

        {providers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Adicione um provedor primeiro para configurar modelos por tarefa
          </p>
        ) : (
          <div className="space-y-3">
            <div className="mb-2">
              <Input 
                placeholder="Pesquisar por modelo (ex: claude, gpt-4)..." 
                value={modelSearch} 
                onChange={(e) => setModelSearch(e.target.value)} 
                className="h-9 w-full bg-background border-border"
              />
            </div>
            {AI_TASKS.map((task) => {
              const config = getTaskConfig(task.id);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{task.icon}</span>
                    <span className="text-sm font-medium text-foreground truncate">{task.label}</span>
                  </div>
                  <select
                    value={config ? `${config.provider_id}::${config.model_id}` : ""}
                    onChange={(e) => {
                      const [pid, mid] = e.target.value.split("::");
                      if (pid && mid) handleTaskModelChange(task.id, pid, mid);
                    }}
                    className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm max-w-[300px]"
                  >
                    <option value="">Selecione um modelo...</option>
                    {[...providers].sort((a,b) => a.name.localeCompare(b.name)).map((prov) => {
                      const models = (modelCache[prov.id] || [])
                        .filter(m => !modelSearch || m.name?.toLowerCase().includes(modelSearch.toLowerCase()) || m.id.toLowerCase().includes(modelSearch.toLowerCase()))
                        .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
                      
                      if (models.length === 0) return null;
                      return (
                        <optgroup key={prov.id} label={prov.name}>
                          {models.map((m) => (
                            <option key={m.id} value={`${prov.id}::${m.id}`}>
                              {m.name || m.id}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Parameters */}
      <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-display font-semibold text-foreground">Parâmetros Globais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Temperatura</Label>
              <Badge variant="secondary" className="text-xs">{globalParams.temperature.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[globalParams.temperature]}
              onValueChange={([v]) => setGlobalParams((p) => ({ ...p, temperature: v }))}
              min={0} max={1} step={0.1}
            />
            <p className="text-xs text-muted-foreground">0 = preciso e determinístico · 1 = criativo e variado</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Max Tokens</Label>
              <Badge variant="secondary" className="text-xs">{globalParams.max_tokens}</Badge>
            </div>
            <Slider
              value={[globalParams.max_tokens]}
              onValueChange={([v]) => setGlobalParams((p) => ({ ...p, max_tokens: v }))}
              min={256} max={8192} step={256}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Top P</Label>
              <Badge variant="secondary" className="text-xs">{globalParams.top_p.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[globalParams.top_p]}
              onValueChange={([v]) => setGlobalParams((p) => ({ ...p, top_p: v }))}
              min={0} max={1} step={0.1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Frequency Penalty</Label>
              <Badge variant="secondary" className="text-xs">{globalParams.frequency_penalty.toFixed(1)}</Badge>
            </div>
            <Slider
              value={[globalParams.frequency_penalty]}
              onValueChange={([v]) => setGlobalParams((p) => ({ ...p, frequency_penalty: v }))}
              min={0} max={2} step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
