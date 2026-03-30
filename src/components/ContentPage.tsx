import { useState, useEffect } from "react";
import {
  Wand2, Copy, Check, Instagram, MessageCircle, Film, Image as ImageIcon, Zap,
  ChevronDown, Sparkles, RefreshCw, Share2, Save, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Offer } from "./OffersPage";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/lib/services/dataService";
import { aiProviderService } from "@/lib/ai/providerService";
import type { AIProvider, AIModel } from "@/lib/ai/types";

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
  const campaignTag = campaign !== "Nenhuma" ? ` | ${campaign}` : "";

  return {
    type: "all",
    titles: [
      `🔥 ${offer.name} com ${discount}% OFF!`,
      `⚡ IMPERDÍVEL! ${offer.name} por apenas R$${offer.promoPrice.toFixed(2)}`,
      `💥 Economize R$${saving} em ${offer.name}${campaignTag}`,
    ],
    captions: [
      { text: `✨ ${offer.name}\n💰 De R$${offer.originalPrice.toFixed(2)} por apenas R$${offer.promoPrice.toFixed(2)}\n🎯 ${discount}% de desconto — economia de R$${saving}!\n🔗 Link na bio!\n\n#${offer.platform.replace(" ", "")} #oferta #desconto`, type: "urgencia" },
      { text: `🛍️ Atenção, caçadores de oferta! ${offer.name} nunca esteve tão barato!\n⬇️ ${discount}% OFF = R$${offer.promoPrice.toFixed(2)}\n⏰ Promoção por tempo limitado!\n👇 Link na bio`, type: "escassez" },
      { text: `❤️ ${offer.name} chegou com tudo!\nPreço de R$${offer.originalPrice.toFixed(2)} caiu para R$${offer.promoPrice.toFixed(2)} (${discount}% OFF)\nAproveite enquanto dura! Link na bio 👆`, type: "emocional" },
    ],
    hashtags: {
      broad: ["#oferta", "#desconto", "#promoção", "#compras", "#deal", "#sale", "#economize", "#imperdível", "#melhorpreço", "#cupom"],
      specific: [`#${offer.platform.replace(" ", "").toLowerCase()}`, `#${offer.category.toLowerCase()}`, "#ofertas2026", "#descontão", "#fretegratis", "#afiliado", "#comprasonline", `#${offer.platform.toLowerCase()}brasil`, "#blackfriday", "#hotmart"],
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
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
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
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiProviders, setAiProviders] = useState<AIProvider[]>([]);
  const [aiModels, setAiModels] = useState<Record<string, AIModel[]>>({});
  const [selectedModel, setSelectedModel] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      dataService.getOffers(user.id).then(setOffers).catch(() => {});
      aiProviderService.getProviders(user.id).then((provs) => {
        setAiProviders(provs);
        provs.forEach((p) => {
          aiProviderService.fetchModels(p).then((models) => {
            setAiModels((prev) => ({ ...prev, [p.id]: models }));
          });
        });
      }).catch(() => {});
    }
  }, [user]);

  const handleGenerate = () => {
    if (!selectedOffer) { toast({ title: "Selecione uma oferta", variant: "destructive" }); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerated(generateContent(selectedOffer, tone, trigger, persona, campaign));
      setGenerating(false);
    }, 1800);
  };

  const handleSaveContent = async () => {
    if (!generated || !selectedOffer || !user) return;
    setSaving(true);
    try {
      await dataService.saveContent({
        offer_id: selectedOffer.id,
        type: contentType === "all" ? "FEED" : contentType.toUpperCase(),
        format: "TEXT",
        text: generated.captions[0]?.text || "",
        hashtags: [...generated.hashtags.broad, ...generated.hashtags.specific],
        tone_of_voice: tone,
        cta: generated.stories.cta,
      }, user.id);
      toast({ title: "Conteúdo salvo!", description: "O conteúdo foi salvo no banco de dados." });
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
          <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm">1. Selecionar Oferta</h3>
            <div className="relative">
              <select value={selectedOffer?.id || ""} onChange={(e) => setSelectedOffer(offers.find((o) => o.id === e.target.value) || null)} className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 pr-9 py-2.5 focus:outline-none focus:border-primary cursor-pointer appearance-none">
                <option value="">Selecione uma oferta...</option>
                {offers.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            {offers.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">Nenhuma oferta cadastrada. Crie uma oferta primeiro.</p>
            )}
            {selectedOffer && (
              <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-muted">
                {selectedOffer.imageUrl ? (
                  <img src={selectedOffer.imageUrl} alt={selectedOffer.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedOffer.name}</p>
                  <p className="text-xs text-success font-semibold">R${selectedOffer.promoPrice.toFixed(2)} — {discount}% OFF</p>
                </div>
              </div>
            )}
          </div>

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
                  <button key={f.id} onClick={() => setContentType(f.id as ContentType)} className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border", f.id === "all" ? "col-span-2" : "", active ? `bg-gradient-to-r ${f.color} text-white border-transparent shadow-glow` : "bg-muted text-muted-foreground border-border hover:bg-card hover:text-foreground")}>
                    <Icon className="w-3.5 h-3.5" /> {f.label}
                  </button>
                );
              })}
            </div>
          </div>

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

          <Button onClick={handleGenerate} disabled={generating || !selectedOffer} className="w-full h-12 gradient-primary text-white border-0 shadow-glow hover:opacity-90 font-semibold text-base">
            {generating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Gerando com IA...</> : <><Sparkles className="w-4 h-4 mr-2" /> Gerar Conteúdo</>}
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
              {/* Action Bar */}
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  <Eye className="w-3.5 h-3.5 mr-1" /> {showPreview ? "Ocultar Preview" : "Preview"}
                </Button>
                <Button size="sm" onClick={handleSaveContent} disabled={saving} className="gradient-primary text-white border-0">
                  <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>

              {/* Instagram Preview */}
              {showPreview && selectedOffer && (
                <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
                  <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-primary" /> Preview da Publicação
                  </h4>
                  <div className="max-w-sm mx-auto rounded-xl border border-border overflow-hidden bg-background">
                    <div className="flex items-center gap-2 p-3 border-b border-border">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div><p className="text-xs font-semibold text-foreground">AffiliateAI Pro</p><p className="text-[10px] text-muted-foreground">Patrocinado</p></div>
                    </div>
                    {selectedOffer.imageUrl ? (
                      <img src={selectedOffer.imageUrl} alt={selectedOffer.name} className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full aspect-square bg-muted flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/30" /></div>
                    )}
                    <div className="p-3">
                      <div className="flex gap-3 mb-2"><span>❤️</span><span>💬</span><span>📤</span></div>
                      <p className="text-xs text-foreground whitespace-pre-wrap line-clamp-4">{generated.captions[0]?.text}</p>
                      <p className="text-[10px] text-primary mt-1">{generated.hashtags.broad.slice(0, 5).join(" ")}</p>
                    </div>
                  </div>
                </div>
              )}

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
