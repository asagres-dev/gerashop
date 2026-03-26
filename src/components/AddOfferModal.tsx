import { useState } from "react";
import { X, Link2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Offer } from "./OffersPage";

interface AddOfferModalProps {
  onClose: () => void;
  onAdd: (offer: Offer) => void;
}

export default function AddOfferModal({ onClose, onAdd }: AddOfferModalProps) {
  const [tab, setTab] = useState<"manual" | "url">("manual");
  const [form, setForm] = useState({
    name: "", platform: "Amazon" as Offer["platform"], category: "Eletrônicos",
    originalPrice: "", promoPrice: "", link: "", imageUrl: "", expiry: "", description: "",
  });
  const [urlImport, setUrlImport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.link || !form.originalPrice || !form.promoPrice) return;
    const newOffer: Offer = {
      id: Date.now().toString(),
      name: form.name, platform: form.platform, category: form.category,
      originalPrice: parseFloat(form.originalPrice), promoPrice: parseFloat(form.promoPrice),
      link: form.link, imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop",
      expiry: form.expiry || "2026-12-31", clicks: 0, commission: 0, status: "Ativa",
    };
    onAdd(newOffer);
    onClose();
  };

  const handleSmartImport = () => {
    if (!urlImport) return;
    setLoading(true);
    setTimeout(() => {
      let platform: Offer["platform"] = "Amazon";
      if (urlImport.includes("natura")) platform = "Natura";
      else if (urlImport.includes("mercadolivre") || urlImport.includes("ml.com")) platform = "Mercado Livre";
      else if (urlImport.includes("shopee")) platform = "Shopee";

      setForm({
        name: "Produto Importado Automaticamente",
        platform, category: "Geral",
        originalPrice: "299.90", promoPrice: "199.90",
        link: urlImport, imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop",
        expiry: "2026-06-30", description: "Produto importado via Smart Import.",
      });
      setTab("manual");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border shadow-elevated overflow-hidden" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-foreground">Nova Oferta</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[{ id: "manual", label: "Manual", icon: Upload }, { id: "url", label: "Smart Import (URL)", icon: Link2 }].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as "manual" | "url")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
          {tab === "url" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Cole o link do produto e o sistema extrai os dados automaticamente.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://www.amazon.com.br/dp/..."
                  value={urlImport}
                  onChange={(e) => setUrlImport(e.target.value)}
                  className="bg-muted border-border"
                />
                <Button onClick={handleSmartImport} disabled={loading} className="gradient-primary text-white border-0 whitespace-nowrap">
                  {loading ? "Importando..." : "Importar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Suporta: Amazon, Mercado Livre, Shopee e Natura</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Nome do Produto *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Perfume Essencial Natura" className="bg-muted border-border h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Plataforma *</Label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Offer["platform"] })} className="w-full bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2 h-9 focus:outline-none focus:border-primary">
                  <option>Amazon</option><option>Natura</option><option>Mercado Livre</option><option>Shopee</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Categoria *</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-muted border border-border text-foreground text-sm rounded-lg px-3 py-2 h-9 focus:outline-none focus:border-primary">
                  <option>Eletrônicos</option><option>Perfumaria</option><option>Beleza</option><option>Casa</option><option>Moda</option><option>Esportes</option><option>Brinquedos</option><option>Livros</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Preço Original *</Label>
                <Input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="299.90" type="number" className="bg-muted border-border h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Preço Promocional *</Label>
                <Input value={form.promoPrice} onChange={(e) => setForm({ ...form, promoPrice: e.target.value })} placeholder="199.90" type="number" className="bg-muted border-border h-9" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Link de Afiliado *</Label>
                <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://amzn.to/xxxxx" className="bg-muted border-border h-9" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">URL da Imagem</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="bg-muted border-border h-9" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Data de Expiração</Label>
                <Input value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} type="date" className="bg-muted border-border h-9" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 border-border hover:bg-muted">Cancelar</Button>
          <Button onClick={handleSubmit} className="flex-1 gradient-primary text-white border-0 shadow-glow hover:opacity-90">Salvar Oferta</Button>
        </div>
      </div>
    </div>
  );
}
