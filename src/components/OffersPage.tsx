import { useState, useEffect } from "react";
import { Plus, Search, ExternalLink, Edit2, Trash2, Wand2, ChevronDown, RefreshCw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/lib/services/dataService";
import { ofertashopClient } from "@/lib/integrations/ofertashop";
import AddOfferModal from "./AddOfferModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Offer {
  id: string;
  name: string;
  platform: "Natura" | "Amazon" | "Mercado Livre" | "Shopee";
  category: string;
  originalPrice: number;
  promoPrice: number;
  link: string;
  imageUrl: string;
  expiry: string;
  clicks: number;
  commission: number;
  status: "Ativa" | "Expirada" | "Agendada";
}

const platformConfig = {
  Natura: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400", gradient: "from-emerald-500 to-teal-500" },
  Amazon: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400", gradient: "from-amber-500 to-orange-500" },
  "Mercado Livre": { color: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400", gradient: "from-blue-500 to-indigo-500" },
  Shopee: { color: "bg-orange-500/15 text-orange-400 border-orange-500/30", dot: "bg-orange-400", gradient: "from-orange-500 to-red-500" },
};

const statusConfig = {
  Ativa: "bg-success/10 text-success border-success/20",
  Expirada: "bg-destructive/10 text-destructive border-destructive/20",
  Agendada: "bg-primary/10 text-primary border-primary/20",
};

interface OffersPageProps {
  onGenerateContent: (offer: Offer) => void;
}

export default function OffersPage({ onGenerateContent }: OffersPageProps) {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOffers();
  }, [user]);

  const loadOffers = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await dataService.getOffers(user.id);
      setOffers(data);
    } catch (err: any) {
      toast({ title: "Erro ao carregar ofertas", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = offers.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === "Todas" || o.platform === platformFilter;
    const matchStatus = statusFilter === "Todas" || o.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const discount = (o: Offer) => Math.round(((o.originalPrice - o.promoPrice) / o.originalPrice) * 100);

  const handleDelete = async (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    try {
      await dataService.deleteOffer(id);
      toast({ title: "Oferta removida" });
    } catch {
      loadOffers();
    }
  };

  const handleAdd = async (offer: Offer) => {
    if (!user) return;
    try {
      const created = await dataService.createOffer(offer, user.id);
      setOffers((prev) => [created, ...prev]);
      toast({ title: "Oferta criada!", description: offer.name });
    } catch (err: any) {
      toast({ title: "Erro ao criar oferta", description: err.message, variant: "destructive" });
    }
  };

  const loadAndCheckConfig = async () => {
    try {
      const { data } = await supabase.from('integrations_config').select('*').eq('provider', 'ofertashop').single();
      if (data) {
        await ofertashopClient.activate({
          apiUrl: data.api_url,
          apiKey: data.api_key,
          isEnabled: data.is_active,
        });
      }
    } catch (err) {
      console.error(err);
    }
    return ofertashopClient.isReady();
  };

  const handleSync = async (offer: Offer) => {
    setIsConfigLoading(true);
    const isReady = await loadAndCheckConfig();
    setIsConfigLoading(false);

    if (!isReady) {
      toast({
        title: "⏳ API não configurada",
        description: "A API do Ofertashop ainda não está disponível ou inativa. Configure em Configurações > Integrações.",
        variant: "destructive",
      });
      return;
    }
    setSyncingId(offer.id);
    try {
      const externalData = await ofertashopClient.getOfferById(offer.id);
      await dataService.syncOfferManually(offer.id, externalData);
      toast({ title: "Sincronização concluída", description: offer.name });
      loadOffers();
    } catch {
      toast({ title: "Erro na sincronização", variant: "destructive" });
    } finally {
      setSyncingId(null);
    }
  };

  const handleBulkImport = async () => {
    setIsConfigLoading(true);
    const isReady = await loadAndCheckConfig();
    setIsConfigLoading(false);

    if (!isReady) {
      toast({
        title: "⏳ API não configurada",
        description: "A API do Ofertashop ainda não está disponível ou inativa. Configure em Configurações > Integrações.",
        variant: "destructive",
      });
      return;
    }
    setIsBulkImporting(true);
    try {
      toast({ title: "Iniciando importação...", description: "Buscando ofertas do Ofertashop." });
      const offers = await ofertashopClient.getAllActiveOffers();
      if (offers.length > 0) {
        await dataService.bulkCreateOrUpdateOffers(offers);
        toast({ title: "Importação concluída!", description: `${offers.length} ofertas sincronizadas com sucesso.` });
        loadOffers();
      } else {
        toast({ title: "Nenhuma oferta encontrada", description: "Não há ofertas ativas no momento na origem." });
      }
    } catch (err: any) {
      toast({ title: "Erro na importação em lote", description: err.message, variant: "destructive" });
    } finally {
      setIsBulkImporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Gestão de Ofertas</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} ofertas encontradas</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleBulkImport} disabled={isBulkImporting || isConfigLoading} variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <RefreshCw className={cn("w-4 h-4 mr-2", (isBulkImporting || isConfigLoading) && "animate-spin")} /> Importar Lote
          </Button>
          <Button onClick={() => setShowModal(true)} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" /> Nova Oferta
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou produto..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border h-10" />
        </div>
        {[
          { label: "Plataforma", value: platformFilter, setValue: setPlatformFilter, options: ["Todas", "Natura", "Amazon", "Mercado Livre", "Shopee"] },
          { label: "Status", value: statusFilter, setValue: setStatusFilter, options: ["Todas", "Ativa", "Expirada", "Agendada"] },
        ].map((f) => (
          <div key={f.label} className="relative">
            <select value={f.value} onChange={(e) => f.setValue(e.target.value)} className="appearance-none bg-card border border-border text-foreground text-sm rounded-xl px-4 pr-9 py-2 h-10 focus:outline-none focus:border-primary cursor-pointer">
              {f.options.map((o) => <option key={o} value={o}>{o === "Todas" ? `${f.label}: Todas` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando ofertas...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">Nenhuma oferta cadastrada</h3>
          <p className="text-sm text-muted-foreground mb-4">Comece adicionando sua primeira oferta para gerar conteúdo automaticamente.</p>
          <Button onClick={() => setShowModal(true)} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" /> Criar Primeira Oferta
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhuma oferta encontrada com esses filtros.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((offer) => {
            const pc = platformConfig[offer.platform as keyof typeof platformConfig] || { color: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400", gradient: "from-slate-500 to-gray-500" };
            return (
              <div key={offer.id} className="rounded-2xl border border-border shadow-card hover:shadow-elevated hover:border-border/60 transition-all group" style={{ background: "hsl(var(--card))" }}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", pc.color)}>{offer.platform}</span>
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusConfig[offer.status])}>{offer.status}</span>
                  </div>
                  <div className="flex gap-3">
                    {offer.imageUrl ? (
                      <img src={offer.imageUrl} alt={offer.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{offer.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{offer.category}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground line-through">R$ {offer.originalPrice.toFixed(2)}</p>
                      <p className="text-lg font-display font-bold text-foreground">R$ {offer.promoPrice.toFixed(2)}</p>
                    </div>
                    <div className={cn("px-3 py-1.5 rounded-xl text-white font-bold text-sm bg-gradient-to-br", pc.gradient)}>-{discount(offer)}%</div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 py-3 border-t border-border">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Cliques</p>
                      <p className="text-sm font-semibold text-foreground">{offer.clicks.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Comissão</p>
                      <p className="text-sm font-semibold text-success">R$ {offer.commission.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Expira</p>
                      <p className="text-sm font-semibold text-foreground">{offer.expiry ? new Date(offer.expiry).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "—"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" className="flex-1 gradient-primary text-white border-0 h-8 text-xs shadow-glow hover:opacity-90" onClick={() => onGenerateContent(offer)}>
                      <Wand2 className="w-3 h-3 mr-1" /> Gerar Conteúdo
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border hover:bg-muted" onClick={() => handleSync(offer)} disabled={syncingId === offer.id} title="Sincronizar oferta">
                      <RefreshCw className={cn("w-3 h-3", syncingId === offer.id && "animate-spin")} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border hover:bg-muted" onClick={() => window.open(offer.link, "_blank")}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-destructive/30 hover:bg-destructive/10 text-destructive" onClick={() => handleDelete(offer.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <AddOfferModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
