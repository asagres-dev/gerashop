import { useState } from "react";
import { Calendar, Megaphone, Clock, Tag, TrendingUp, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const campaigns = [
  { name: "Páscoa 2026", date: "2026-04-05", days: 10, emoji: "🐣", status: "upcoming", color: "from-yellow-500 to-amber-500", desc: "Chocolates, presentes e produtos especiais de páscoa" },
  { name: "Dia das Mães", date: "2026-05-10", days: 45, emoji: "💐", status: "planning", color: "from-pink-500 to-rose-500", desc: "Uma das datas mais lucrativas do ano para afiliados" },
  { name: "Dia dos Namorados", date: "2026-06-12", days: 78, emoji: "💕", status: "planning", color: "from-red-500 to-pink-600", desc: "Perfumes, joias, experiências e produtos românticos" },
  { name: "Black Friday", date: "2026-11-27", days: 246, emoji: "🛍️", status: "future", color: "from-orange-500 to-amber-600", desc: "A maior data de ofertas do ano no Brasil" },
  { name: "Natal", date: "2026-12-25", days: 274, emoji: "🎄", status: "future", color: "from-green-600 to-emerald-600", desc: "Presentes, eletrônicos e produtos especiais de fim de ano" },
];

const ideas: Record<string, { platforms: string[]; content: string[]; tips: string[] }> = {
  "Páscoa 2026": {
    platforms: ["Instagram Reels", "WhatsApp", "Stories"],
    content: ["Kit de chocolates artesanais com desconto", "Perfumes frutados como presente", "Ovos de Páscoa das marcas parceiras"],
    tips: ["Use cores pastéis (rosa, lilás, amarelo) nas imagens", "Destaque frete grátis para presentes", "CTA: 'Presenteie com amor e economia!'"],
  },
  "Dia das Mães": {
    platforms: ["Reels", "Feed", "Stories", "WhatsApp"],
    content: ["Perfumes Natura para ela", "Kit de skincare", "Eletrodomésticos práticos"],
    tips: ["Tom emocional e carinhoso", "Use depoimentos reais", "Campanha '7 dias antes' com contagem regressiva"],
  },
};

const statusLabels: Record<string, string> = { upcoming: "Em breve", planning: "Planejando", future: "Futuro", active: "Ativo" };
const statusColors: Record<string, string> = { upcoming: "bg-warning/10 text-warning border-warning/20", planning: "bg-primary/10 text-primary border-primary/20", future: "bg-muted text-muted-foreground border-border", active: "bg-success/10 text-success border-success/20" };

export default function CampaignsPage() {
  const [selected, setSelected] = useState<string | null>("Páscoa 2026");

  const campaign = campaigns.find((c) => c.name === selected);
  const idea = selected ? ideas[selected] : null;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Campanhas Sazonais</h1>
          <p className="text-muted-foreground text-sm mt-1">Planeje e prepare seu conteúdo para as datas mais importantes</p>
        </div>
        <Button className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" /> Nova Campanha
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {campaigns.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelected(c.name)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all hover:shadow-elevated",
              selected === c.name ? "border-primary/50 shadow-glow" : "border-border",
            )}
            style={{ background: selected === c.name ? "hsl(262 80% 60% / 0.08)" : "hsl(var(--card))" }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{c.emoji}</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", statusColors[c.status])}>
                {statusLabels[c.status]}
              </span>
            </div>
            <p className="font-display font-bold text-foreground text-sm">{c.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(c.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-primary">{c.days} dias</span>
            </div>
          </button>
        ))}
      </div>

      {/* Campaign Detail */}
      {campaign && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Overview */}
          <div className="xl:col-span-2 rounded-2xl border border-border p-6 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center gap-4 mb-5">
              <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl flex-shrink-0", campaign.color)}>
                {campaign.emoji}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">{campaign.name}</h2>
                <p className="text-sm text-muted-foreground">{campaign.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-muted text-center">
                <Calendar className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Data</p>
                <p className="text-sm font-semibold text-foreground">{new Date(campaign.date).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted text-center">
                <Clock className="w-4 h-4 text-warning mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Faltam</p>
                <p className="text-sm font-semibold text-foreground">{campaign.days} dias</p>
              </div>
              <div className="p-3 rounded-xl bg-muted text-center">
                <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Potencial</p>
                <p className="text-sm font-semibold text-success">Alto</p>
              </div>
            </div>

            {idea ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Megaphone className="w-3.5 h-3.5 text-primary" /> Canais Recomendados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.platforms.map((p) => (
                      <span key={p} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-accent" /> Ideias de Conteúdo
                  </h3>
                  <div className="space-y-2">
                    {idea.content.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted">
                        <span className="text-accent">→</span>
                        <p className="text-sm text-foreground">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-success" /> Dicas de Conversão
                  </h3>
                  <div className="space-y-2">
                    {idea.tips.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-success/5 border border-success/10">
                        <span className="text-success mt-0.5">✓</span>
                        <p className="text-sm text-foreground">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">Dicas e sugestões para esta campanha em breve</p>
              </div>
            )}
          </div>

          {/* Action Panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/20 p-5 shadow-card" style={{ background: "hsl(262 80% 60% / 0.06)" }}>
              <h3 className="font-display font-semibold text-foreground text-sm mb-3">Ações Rápidas</h3>
              <div className="space-y-2">
                {["Gerar posts temáticos com IA", "Criar série de Stories", "Preparar roteiro de Reels", "Montar mensagens WhatsApp", "Ver concorrência na data"].map((action) => (
                  <button key={action} className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted transition-all text-sm text-foreground group">
                    {action}
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
              <h3 className="font-display font-semibold text-foreground text-sm mb-3">Checklist de Preparação</h3>
              <div className="space-y-2">
                {[
                  { label: "Selecionar produtos", done: true },
                  { label: "Criar copies temáticos", done: false },
                  { label: "Preparar banco de imagens", done: false },
                  { label: "Agendar posts", done: false },
                  { label: "Testar links de afiliado", done: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={item.done} className="rounded accent-primary" />
                    <span className={cn("text-sm", item.done ? "line-through text-muted-foreground" : "text-foreground")}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
