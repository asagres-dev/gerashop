import { useState } from "react";
import {
  Wand2, Copy, Check, Instagram, MessageCircle, Film, Image as ImageIcon, Zap,
  ChevronDown, Sparkles, RefreshCw, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Offer } from "./OffersPage";

const OFFERS_DEMO: Offer[] = [
  { id: "1", name: "Perfume Essencial Natura EDP", platform: "Natura", category: "Perfumaria", originalPrice: 299.90, promoPrice: 189.90, link: "https://natura.com.br/p/123", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&h=120&fit=crop", expiry: "2026-05-30", clicks: 842, commission: 28.50, status: "Ativa" },
  { id: "2", name: "Echo Dot 5ª Geração", platform: "Amazon", category: "Eletrônicos", originalPrice: 399.00, promoPrice: 249.00, link: "https://amzn.to/abc", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop", expiry: "2026-04-20", clicks: 1247, commission: 12.45, status: "Ativa" },
  { id: "3", name: "Kit Cuidados Boticário", platform: "Mercado Livre", category: "Beleza", originalPrice: 180.00, promoPrice: 99.90, link: "https://produto.ml.com.br/123", imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=120&h=120&fit=crop", expiry: "2026-04-25", clicks: 523, commission: 9.99, status: "Ativa" },
  { id: "4", name: "Tênis Nike Air Max 270", platform: "Shopee", category: "Moda", originalPrice: 650.00, promoPrice: 379.90, link: "https://shopee.com.br/p/456", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop", expiry: "2026-05-01", clicks: 2104, commission: 37.99, status: "Ativa" },
];

const platformConfig: Record<string, { emoji: string; gradient: string }> = {
  Natura: { emoji: "🌿", gradient: "from-emerald-500 to-teal-500" },
  Amazon: { emoji: "📦", gradient: "from-amber-500 to-orange-500" },
  "Mercado Livre": { emoji: "🛒", gradient: "from-blue-500 to-indigo-500" },
  Shopee: { emoji: "🛍️", gradient: "from-orange-500 to-red-500" },
};

type ContentType = "feed" | "reels" | "stories" | "whatsapp" | "all";

interface GeneratedContent {
  type: ContentType;
  titles: string[];
  captions: { text: string; type: string }[];
  hashtags: { broad: string[]; specific: string[] };
  whatsapp: { message: string; short: string };
  reels: { hook: string; scenes: { duration: string; action: string; text: string; audio: string }[] };
  stories: { text: string; poll: string[]; cta: string };
}

function generateContent(offer: Offer, tone: string, trigger: string, persona: string, campaign: string): GeneratedContent {
  const discount = Math.round(((offer.originalPrice - offer.promoPrice) / offer.originalPrice) * 100);
  const saving = (offer.originalPrice - offer.promoPrice).toFixed(2);
  const pc = platformConfig[offer.platform] || platformConfig.Amazon;

  const toneMap: Record<string, string> = {
    Sofisticado: "elegante e sofisticado",
    Descontraído: "descontraído e amigável",
    Urgente: "urgente e impactante",
    Divertido: "divertido e animado",
    Inspirador: "inspirador e motivacional",
  };

  const campaignTag = campaign !== "Nenhuma" ? ` | ${campaign}` : "";

  return {
    type: "all",
    titles: [
      `🔥 ${offer.name} com ${discount}% OFF!`,
      `⚡ IMPERDÍVEL! ${offer.name} por apenas R$${offer.promoPrice.toFixed(2)}`,
      `💥 Economize R$${saving} em ${offer.name}${campaignTag}`,
    ],
    captions: [
      {
        text: `✨ ${offer.name}\n💰 De R$${offer.originalPrice.toFixed(2)} por apenas R$${offer.promoPrice.toFixed(2)}\n🎯 ${discount}% de desconto — economia de R$${saving}!\n🔗 Link na bio!\n\n#${offer.platform.replace(" ", "")} #oferta #desconto`,
        type: "urgencia",
      },
      {
        text: `🛍️ Atenção, caçadores de oferta! ${offer.name} nunca esteve tão barato!\n⬇️ ${discount}% OFF = R$${offer.promoPrice.toFixed(2)}\n⏰ Promoção por tempo limitado!\n👇 Link na bio`,
        type: "escassez",
      },
      {
        text: `❤️ ${offer.name} chegou com tudo!\nPreço de R$${offer.originalPrice.toFixed(2)} caiu para R$${offer.promoPrice.toFixed(2)} (${discount}% OFF)\nAproveite enquanto dura! Link na bio 👆`,
        type: "emocional",
      },
    ],
    hashtags: {
      broad: ["#oferta", "#desconto", "#promoção", "#compras", "#deal", "#sale", "#economize", "#imperdível", "#melhorpreço", "#cupom"],
      specific: [
        `#${offer.platform.replace(" ", "").toLowerCase()}`,
        `#${offer.category.toLowerCase()}`,
        "#ofertas2026",
        "#descontão",
        "#fretegratis",
        "#afiliado",
        "#comprasonline",
        `#${offer.platform.toLowerCase()}brasil`,
        "#blackfriday",
        "#hotmart",
      ],
    },
    whatsapp: {
      message: `${pc.emoji} *OFERTA IMPERDÍVEL!* ${pc.emoji}\n\n*${offer.name}*\n💰 De ~~R$${offer.originalPrice.toFixed(2)}~~ por *R$${offer.promoPrice.toFixed(2)}*\n📉 *${discount}% OFF* — Economia de R$${saving}!\n\n🛒 Compre agora: ${offer.link}\n\n⚠️ _Promoção por tempo limitado!_`,
      short: `🔥 ${offer.name} - ${discount}% OFF! R$${offer.promoPrice.toFixed(2)} → ${offer.link}`,
    },
    reels: {
      hook: `🎬 HOOK: "Você vai se arrepender se não aproveitar ESSA oferta hoje!"`,
      scenes: [
        { duration: "3s", action: "Zoom no produto com texto animado", text: `🔥 ${discount}% OFF`, audio: "Som de impacto + música trending" },
        { duration: "5s", action: "Mostrar preço original riscado → preço novo", text: `De R$${offer.originalPrice.toFixed(2)} por R$${offer.promoPrice.toFixed(2)}`, audio: "Efeito de caixa registradora" },
        { duration: "7s", action: "Benefícios do produto em texto animado", text: `✅ Frete Grátis ✅ Promoção limitada ✅ ${offer.platform}`, audio: "Música animada trending" },
        { duration: "5s", action: "CTA com seta para bio", text: `👆 Link na bio — Corre!`, audio: "Finalização com beat drop" },
      ],
    },
    stories: {
      text: `🔥 ${discount}% OFF\n${offer.name}\nR$${offer.promoPrice.toFixed(2)}`,
      poll: ["Quero comprar! 🛒", "Já comprei! ✅"],
      cta: "Deslize para ver 👆",
    },
  };
}

interface ContentPageProps {
  preSelectedOffer?: Offer | null;
}

export default function ContentPage({ preSelectedOffer }: ContentPageProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(preSelectedOffer || null);
  const [contentType, setContentType] = useState<ContentType>("all");
  const [tone, setTone] = useState("Urgente");
  const [trigger, setTrigger] = useState("Escassez");
  const [persona, setPersona] = useState("Todos");
  const [campaign, setCampaign] = useState("Nenhuma");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!selectedOffer) { toast({ title: "Selecione uma oferta", variant: "destructive" }); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerated(generateContent(selectedOffer, tone, trigger, persona, campaign));
      setGenerating(false);
    }, 1800);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copyText(text, id)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
      {copied === id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  const discount = selectedOffer ? Math.round(((selectedOffer.originalPrice - selectedOffer.promoPrice) / selectedOffer.originalPrice) * 100) : 0;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Gerador de Conteúdo IA</h1>
        <p className="text-muted-foreground text-sm mt-1">Gere posts virais em segundos para todas as plataformas</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Config Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Offer Selection */}
          <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm">1. Selecionar Oferta</h3>
            <div className="relative">
              <select
                value={selectedOffer?.id || ""}
                onChange={(e) => setSelectedOffer(OFFERS_DEMO.find((o) => o.id === e.target.value) || null)}
                className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 pr-9 py-2.5 focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="">Selecione uma oferta...</option>
                {OFFERS_DEMO.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            {selectedOffer && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-muted">
                <img src={selectedOffer.imageUrl} alt={selectedOffer.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedOffer.name}</p>
                  <p className="text-xs text-success font-semibold">R${selectedOffer.promoPrice.toFixed(2)} — {discount}% OFF</p>
                </div>
              </div>
            )}
          </div>

          {/* Format Buttons */}
          <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm">2. Formato de Conteúdo</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "feed", label: "Post Feed", icon: ImageIcon, color: "from-purple-500 to-violet-500" },
                { id: "reels", label: "Reels", icon: Film, color: "from-pink-500 to-rose-500" },
                { id: "stories", label: "Stories", icon: Instagram, color: "from-orange-500 to-yellow-500" },
                { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "from-green-500 to-emerald-500" },
                { id: "all", label: "Tudo de Uma Vez", icon: Zap, color: "from-primary to-primary-glow" },
              ].map((f) => {
                const Icon = f.icon;
                const active = contentType === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setContentType(f.id as ContentType)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border",
                      f.id === "all" ? "col-span-2" : "",
                      active ? `bg-gradient-to-r ${f.color} text-white border-transparent shadow-glow` : "bg-muted text-muted-foreground border-border hover:bg-card hover:text-foreground"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" /> {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Config */}
          <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm">3. Configurações Avançadas</h3>
            <div className="space-y-3">
              {[
                { label: "Campanha", value: campaign, setter: setCampaign, options: ["Nenhuma", "Páscoa", "Dia das Mães", "Dia dos Namorados", "Black Friday", "Natal", "Ano Novo"] },
                { label: "Tom de Voz", value: tone, setter: setTone, options: ["Sofisticado", "Descontraído", "Urgente", "Divertido", "Inspirador"] },
                { label: "Gatilho de Venda", value: trigger, setter: setTrigger, options: ["Escassez", "Prova Social", "Novidade", "Autoridade", "Reciprocidade"] },
                { label: "Persona", value: persona, setter: setPersona, options: ["Todos", "Cliente Natura", "Caçador de Descontos", "Presenteador", "Tech Lover"] },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-3">
                  <label className="text-xs text-muted-foreground flex-shrink-0 w-28">{f.label}</label>
                  <div className="relative flex-1">
                    <select value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full bg-muted border border-border text-foreground text-xs rounded-lg px-3 pr-8 py-2 focus:outline-none focus:border-primary appearance-none">
                      {f.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} className="rounded accent-primary" />
                <span className="text-xs text-muted-foreground">Incluir Hashtags</span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedOffer}
            className="w-full h-12 gradient-primary text-white border-0 shadow-glow hover:opacity-90 font-semibold text-base"
          >
            {generating ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gerando com IA...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Gerar Conteúdo</>
            )}
          </Button>
        </div>

        {/* Output Panel */}
        <div className="xl:col-span-3 space-y-4">
          {!generated && !generating && (
            <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center h-full min-h-64" style={{ background: "hsl(var(--card))" }}>
              <Wand2 className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-muted-foreground font-medium">Selecione uma oferta e clique em Gerar Conteúdo</p>
              <p className="text-xs text-muted-foreground mt-1">A IA criará posts para todas as plataformas</p>
            </div>
          )}

          {generating && (
            <div className="rounded-2xl border border-primary/20 p-12 flex flex-col items-center justify-center text-center" style={{ background: "hsl(262 80% 60% / 0.05)" }}>
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-foreground font-semibold font-display">Gerando conteúdo viral com IA...</p>
              <p className="text-xs text-muted-foreground mt-2">Aplicando gatilhos mentais e otimizando para conversão</p>
            </div>
          )}

          {generated && !generating && (
            <div className="space-y-4">
              {/* Titles */}
              <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-primary" /> Títulos Gerados
                </h4>
                <div className="space-y-2">
                  {generated.titles.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-muted group">
                      <p className="flex-1 text-sm text-foreground">{t}</p>
                      <CopyBtn text={t} id={`title-${i}`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Captions */}
              <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4 text-purple-400" /> Legendas para Feed/Instagram
                </h4>
                <div className="space-y-3">
                  {generated.captions.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted border border-border/50">
                      <div className="flex items-start justify-between gap-2">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans flex-1">{c.text}</pre>
                        <CopyBtn text={c.text} id={`caption-${i}`} />
                      </div>
                      <Badge className="mt-2 text-xs bg-primary/10 text-primary border-primary/20">{c.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4 text-green-400" /> Mensagem WhatsApp
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-muted border border-border/50">
                    <div className="flex items-start justify-between gap-2">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans flex-1">{generated.whatsapp.message}</pre>
                      <CopyBtn text={generated.whatsapp.message} id="wa-full" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-foreground">{generated.whatsapp.short}</p>
                      <CopyBtn text={generated.whatsapp.short} id="wa-short" />
                    </div>
                    <Badge className="mt-1 text-xs bg-muted-foreground/10 text-muted-foreground">Versão Curta</Badge>
                  </div>
                </div>
              </div>

              {/* Reels */}
              <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <Film className="w-4 h-4 text-pink-400" /> Roteiro de Reels
                </h4>
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 mb-3">
                  <p className="text-sm text-foreground">{generated.reels.hook}</p>
                </div>
                <div className="space-y-2">
                  {generated.reels.scenes.map((s, i) => (
                    <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-muted">
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-xs text-white font-bold">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge className="text-xs bg-muted-foreground/10 text-muted-foreground">{s.duration}</Badge>
                          <p className="text-xs text-muted-foreground">{s.action}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{s.text}</p>
                        <p className="text-xs text-primary mt-0.5">🎵 {s.audio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              {includeHashtags && (
                <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-semibold text-foreground text-sm">Hashtags</h4>
                    <CopyBtn text={[...generated.hashtags.broad, ...generated.hashtags.specific].join(" ")} id="hashtags" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...generated.hashtags.broad, ...generated.hashtags.specific].map((h, i) => (
                      <span key={i} className={cn("text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity", i < 10 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent")} onClick={() => copyText(h, `hash-${i}`)}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
