import { useState } from "react";
import { Plus, Search, Filter, ExternalLink, Edit2, Trash2, Wand2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AddOfferModal from "./AddOfferModal";

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

const initialOffers: Offer[] = [
  { id: "1", name: "Perfume Essencial Natura EDP", platform: "Natura", category: "Perfumaria", originalPrice: 299.90, promoPrice: 189.90, link: "https://natura.com.br/p/123", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&h=120&fit=crop", expiry: "2026-05-30", clicks: 842, commission: 28.50, status: "Ativa" },
  { id: "2", name: "Echo Dot 5ª Geração", platform: "Amazon", category: "Eletrônicos", originalPrice: 399.00, promoPrice: 249.00, link: "https://amzn.to/abc", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop", expiry: "2026-04-20", clicks: 1247, commission: 12.45, status: "Ativa" },
  { id: "3", name: "Kit Cuidados Boticário", platform: "Mercado Livre", category: "Beleza", originalPrice: 180.00, promoPrice: 99.90, link: "https://produto.ml.com.br/123", imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=120&h=120&fit=crop", expiry: "2026-04-25", clicks: 523, commission: 9.99, status: "Ativa" },
  { id: "4", name: "Tênis Nike Air Max 270", platform: "Shopee", category: "Moda", originalPrice: 650.00, promoPrice: 379.90, link: "https://shopee.com.br/p/456", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop", expiry: "2026-05-01", clicks: 2104, commission: 37.99, status: "Ativa" },
  { id: "5", name: "Fritadeira Air Fryer 4L", platform: "Amazon", category: "Casa", originalPrice: 450.00, promoPrice: 279.90, link: "https://amzn.to/xyz", imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=120&h=120&fit=crop", expiry: "2026-03-31", clicks: 389, commission: 13.99, status: "Expirada" },
  { id: "6", name: "Perfume Natura Essencial Masculino", platform: "Natura", category: "Perfumaria", originalPrice: 199.90, promoPrice: 139.90, link: "https://natura.com.br/p/456", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&h=120&fit=crop", expiry: "2026-06-15", clicks: 0, commission: 0, status: "Agendada" },
];

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
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [showModal, setShowModal] = useState(false);

  const filtered = offers.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === "Todas" || o.platform === platformFilter;
    const matchStatus = statusFilter === "Todas" || o.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const discount = (o: Offer) => Math.round(((o.originalPrice - o.promoPrice) / o.originalPrice) * 100);

  const handleDelete = (id: string) => setOffers((prev) => prev.filter((o) => o.id !== id));

  const handleAdd = (offer: Offer) => setOffers((prev) => [offer, ...prev]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Gestão de Ofertas</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} ofertas encontradas</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Nova Oferta
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border h-10"
          />
        </div>
        {[
          { label: "Plataforma", value: platformFilter, setValue: setPlatformFilter, options: ["Todas", "Natura", "Amazon", "Mercado Livre", "Shopee"] },
          { label: "Status", value: statusFilter, setValue: setStatusFilter, options: ["Todas", "Ativa", "Expirada", "Agendada"] },
        ].map((f) => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={(e) => f.setValue(e.target.value)}
              className="appearance-none bg-card border border-border text-foreground text-sm rounded-xl px-4 pr-9 py-2 h-10 focus:outline-none focus:border-primary cursor-pointer"
            >
              {f.options.map((o) => <option key={o} value={o}>{o === "Todas" ? `${f.label}: Todas` : o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Offer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((offer) => {
          const pc = platformConfig[offer.platform];
          return (
            <div key={offer.id} className="rounded-2xl border border-border shadow-card hover:shadow-elevated hover:border-border/60 transition-all group" style={{ background: "hsl(var(--card))" }}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", pc.color)}>{offer.platform}</span>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusConfig[offer.status])}>{offer.status}</span>
                </div>

                <div className="flex gap-3">
                  <img src={offer.imageUrl} alt={offer.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
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
                  <div className={cn("px-3 py-1.5 rounded-xl text-white font-bold text-sm bg-gradient-to-br", pc.gradient)}>
                    -{discount(offer)}%
                  </div>
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
                    <p className="text-sm font-semibold text-foreground">{new Date(offer.expiry).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <Button
                    size="sm"
                    className="flex-1 gradient-primary text-white border-0 h-8 text-xs shadow-glow hover:opacity-90"
                    onClick={() => onGenerateContent(offer)}
                  >
                    <Wand2 className="w-3 h-3 mr-1" /> Gerar Conteúdo
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border hover:bg-muted" onClick={() => window.open(offer.link, "_blank")}>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border hover:bg-muted">
                    <Edit2 className="w-3 h-3" />
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

      {showModal && <AddOfferModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}
