import { useState } from "react";
import {
  Brain, TrendingUp, Clock, Calendar, Zap, Target, BarChart3,
  Lightbulb, ArrowRight, Star, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface NicheData {
  id: string;
  name: string;
  emoji: string;
  platform: string;
  color: string;
  bestDay: string;
  bestDayLift: string;
  bestTime: string;
  bestTimePeriod: string;
  bestTone: string;
  toneVsAlt: string;
  bestChannel: string;
  channelCTR: string;
  bestTrigger: string;
  secondaryTrigger: string;
  totalPosts: number;
  avgConversion: number;
  weeklyData: { day: string; score: number }[];
  hourlyData: { hour: string; engagement: number }[];
}

const nichesData: NicheData[] = [
  {
    id: "perfumaria", name: "Perfumaria", emoji: "🌿", platform: "Natura", color: "from-emerald-500 to-teal-500",
    bestDay: "Quinta-feira", bestDayLift: "+34%", bestTime: "19:00 - 21:00", bestTimePeriod: "Noite",
    bestTone: "Sofisticado", toneVsAlt: "+28% vs Urgente", bestChannel: "Instagram Reels", channelCTR: "4.2%",
    bestTrigger: "Prova Social", secondaryTrigger: "Exclusividade", totalPosts: 347, avgConversion: 3.8,
    weeklyData: [
      { day: "Seg", score: 45 }, { day: "Ter", score: 52 }, { day: "Qua", score: 58 },
      { day: "Qui", score: 89 }, { day: "Sex", score: 72 }, { day: "Sáb", score: 65 }, { day: "Dom", score: 48 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 20 }, { hour: "10h", engagement: 35 }, { hour: "12h", engagement: 42 },
      { hour: "14h", engagement: 38 }, { hour: "16h", engagement: 50 }, { hour: "18h", engagement: 72 },
      { hour: "19h", engagement: 95 }, { hour: "20h", engagement: 88 }, { hour: "21h", engagement: 75 }, { hour: "22h", engagement: 40 },
    ],
  },
  {
    id: "eletronicos", name: "Eletrônicos", emoji: "📦", platform: "Amazon / ML", color: "from-amber-500 to-orange-500",
    bestDay: "Domingo", bestDayLift: "+41%", bestTime: "09:00 - 11:00", bestTimePeriod: "Manhã",
    bestTone: "Urgente", toneVsAlt: "+52% vs Sofisticado", bestChannel: "WhatsApp", channelCTR: "6.8%",
    bestTrigger: "Escassez", secondaryTrigger: "Desconto", totalPosts: 512, avgConversion: 5.1,
    weeklyData: [
      { day: "Seg", score: 40 }, { day: "Ter", score: 38 }, { day: "Qua", score: 42 },
      { day: "Qui", score: 55 }, { day: "Sex", score: 68 }, { day: "Sáb", score: 75 }, { day: "Dom", score: 92 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 55 }, { hour: "09h", engagement: 90 }, { hour: "10h", engagement: 95 },
      { hour: "11h", engagement: 82 }, { hour: "12h", engagement: 60 }, { hour: "14h", engagement: 45 },
      { hour: "16h", engagement: 38 }, { hour: "18h", engagement: 42 }, { hour: "20h", engagement: 65 }, { hour: "22h", engagement: 35 },
    ],
  },
  {
    id: "casa", name: "Casa & Decoração", emoji: "🏠", platform: "Shopee", color: "from-orange-500 to-red-500",
    bestDay: "Terça-feira", bestDayLift: "+22%", bestTime: "14:00 - 16:00", bestTimePeriod: "Tarde",
    bestTone: "Prático", toneVsAlt: "+18% vs Emocional", bestChannel: "Feed Instagram", channelCTR: "3.5%",
    bestTrigger: "Novidade", secondaryTrigger: "Antecipação", totalPosts: 189, avgConversion: 2.9,
    weeklyData: [
      { day: "Seg", score: 55 }, { day: "Ter", score: 85 }, { day: "Qua", score: 68 },
      { day: "Qui", score: 50 }, { day: "Sex", score: 45 }, { day: "Sáb", score: 60 }, { day: "Dom", score: 42 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 25 }, { hour: "10h", engagement: 40 }, { hour: "12h", engagement: 55 },
      { hour: "14h", engagement: 88 }, { hour: "15h", engagement: 92 }, { hour: "16h", engagement: 78 },
      { hour: "18h", engagement: 60 }, { hour: "20h", engagement: 50 }, { hour: "22h", engagement: 30 },
    ],
  },
  {
    id: "moda", name: "Moda", emoji: "👗", platform: "Shopee / ML", color: "from-pink-500 to-rose-500",
    bestDay: "Sexta-feira", bestDayLift: "+29%", bestTime: "20:00 - 22:00", bestTimePeriod: "Noite",
    bestTone: "Divertido", toneVsAlt: "+25% vs Formal", bestChannel: "Stories", channelCTR: "3.9%",
    bestTrigger: "Novidade", secondaryTrigger: "Estilo", totalPosts: 278, avgConversion: 3.4,
    weeklyData: [
      { day: "Seg", score: 35 }, { day: "Ter", score: 42 }, { day: "Qua", score: 48 },
      { day: "Qui", score: 55 }, { day: "Sex", score: 90 }, { day: "Sáb", score: 78 }, { day: "Dom", score: 52 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 15 }, { hour: "10h", engagement: 25 }, { hour: "12h", engagement: 40 },
      { hour: "14h", engagement: 35 }, { hour: "16h", engagement: 45 }, { hour: "18h", engagement: 60 },
      { hour: "20h", engagement: 92 }, { hour: "21h", engagement: 88 }, { hour: "22h", engagement: 70 },
    ],
  },
  {
    id: "cosmeticos", name: "Cosméticos", emoji: "💄", platform: "Natura / ML", color: "from-purple-500 to-violet-500",
    bestDay: "Quarta-feira", bestDayLift: "+26%", bestTime: "18:00 - 20:00", bestTimePeriod: "Noite",
    bestTone: "Inspirador", toneVsAlt: "+20% vs Direto", bestChannel: "Feed Instagram", channelCTR: "3.7%",
    bestTrigger: "Transformação", secondaryTrigger: "Antes/Depois", totalPosts: 234, avgConversion: 3.2,
    weeklyData: [
      { day: "Seg", score: 40 }, { day: "Ter", score: 55 }, { day: "Qua", score: 88 },
      { day: "Qui", score: 62 }, { day: "Sex", score: 58 }, { day: "Sáb", score: 72 }, { day: "Dom", score: 45 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 20 }, { hour: "10h", engagement: 30 }, { hour: "12h", engagement: 48 },
      { hour: "14h", engagement: 42 }, { hour: "16h", engagement: 55 }, { hour: "18h", engagement: 85 },
      { hour: "19h", engagement: 90 }, { hour: "20h", engagement: 80 }, { hour: "22h", engagement: 45 },
    ],
  },
  {
    id: "infantil", name: "Infantil", emoji: "🧸", platform: "Amazon / Shopee", color: "from-cyan-500 to-blue-500",
    bestDay: "Sábado", bestDayLift: "+35%", bestTime: "10:00 - 12:00", bestTimePeriod: "Manhã",
    bestTone: "Carinhoso", toneVsAlt: "+30% vs Direto", bestChannel: "Stories", channelCTR: "4.0%",
    bestTrigger: "Emoção", secondaryTrigger: "Família", totalPosts: 156, avgConversion: 3.6,
    weeklyData: [
      { day: "Seg", score: 30 }, { day: "Ter", score: 35 }, { day: "Qua", score: 42 },
      { day: "Qui", score: 48 }, { day: "Sex", score: 55 }, { day: "Sáb", score: 92 }, { day: "Dom", score: 78 },
    ],
    hourlyData: [
      { hour: "08h", engagement: 45 }, { hour: "09h", engagement: 70 }, { hour: "10h", engagement: 92 },
      { hour: "11h", engagement: 88 }, { hour: "12h", engagement: 65 }, { hour: "14h", engagement: 50 },
      { hour: "16h", engagement: 55 }, { hour: "18h", engagement: 40 }, { hour: "20h", engagement: 35 },
    ],
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-xs text-primary font-semibold">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function NicheMappingPage() {
  const [selectedNiche, setSelectedNiche] = useState<string>("perfumaria");
  const niche = nichesData.find(n => n.id === selectedNiche)!;

  const insightCards = [
    { icon: Calendar, label: "Melhor Dia", value: niche.bestDay, lift: niche.bestDayLift, color: "from-blue-500 to-indigo-500" },
    { icon: Clock, label: "Melhor Horário", value: niche.bestTime, lift: niche.bestTimePeriod, color: "from-emerald-500 to-teal-500" },
    { icon: Target, label: "Tom de Voz", value: niche.bestTone, lift: niche.toneVsAlt, color: "from-purple-500 to-violet-500" },
    { icon: Zap, label: "Melhor Canal", value: niche.bestChannel, lift: `CTR ${niche.channelCTR}`, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Mapeamento Inteligente por Nicho
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Análise de melhor dia, horário e tom de voz baseado em dados históricos</p>
        </div>
        <Button variant="outline" className="border-border">
          <RefreshCw className="w-4 h-4 mr-2" /> Atualizar Análise
        </Button>
      </div>

      {/* Niche Selector */}
      <div className="flex gap-2 flex-wrap">
        {nichesData.map(n => (
          <button
            key={n.id}
            onClick={() => setSelectedNiche(n.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              selectedNiche === n.id
                ? "gradient-primary text-white shadow-glow"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            <span>{n.emoji}</span>
            {n.name}
          </button>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-shadow" style={{ background: "hsl(var(--card))" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", card.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-success font-semibold mt-1">{card.lift}</p>
            </div>
          );
        })}
      </div>

      {/* Triggers */}
      <div className="rounded-2xl border border-primary/20 p-5 shadow-card" style={{ background: "hsl(262 80% 60% / 0.06)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-primary">Gatilhos Mentais Recomendados</span>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Baseado em {niche.totalPosts} posts</Badge>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-semibold text-success">{niche.bestTrigger}</span>
            <span className="text-xs text-muted-foreground">Principal</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border">
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium text-foreground">{niche.secondaryTrigger}</span>
            <span className="text-xs text-muted-foreground">Secundário</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Weekly Performance */}
        <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <div className="mb-4">
            <h3 className="font-display font-semibold text-foreground">Performance por Dia da Semana</h3>
            <p className="text-xs text-muted-foreground">Score de conversão (0-100)</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={niche.weeklyData} barSize={32}>
              <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="hsl(262 80% 60%)" radius={[6, 6, 0, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Engagement */}
        <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <div className="mb-4">
            <h3 className="font-display font-semibold text-foreground">Engajamento por Horário</h3>
            <p className="text-xs text-muted-foreground">Nível de engajamento ao longo do dia</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={niche.hourlyData} barSize={24}>
              <XAxis dataKey="hour" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" fill="hsl(142 68% 45%)" radius={[4, 4, 0, 0]} name="Engajamento" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-border p-5 shadow-card overflow-x-auto" style={{ background: "hsl(var(--card))" }}>
        <h3 className="font-display font-semibold text-foreground mb-4">Comparativo Completo por Nicho</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Nicho</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Melhor Dia</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Melhor Horário</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Tom de Voz</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Canal</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Gatilho</th>
              <th className="text-right py-3 px-2 text-xs text-muted-foreground font-medium">Conv. Média</th>
            </tr>
          </thead>
          <tbody>
            {nichesData.map(n => (
              <tr
                key={n.id}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer",
                  selectedNiche === n.id && "bg-primary/5"
                )}
                onClick={() => setSelectedNiche(n.id)}
              >
                <td className="py-3 px-2 font-medium text-foreground">
                  <span className="mr-2">{n.emoji}</span>{n.name}
                </td>
                <td className="py-3 px-2 text-foreground">{n.bestDay}</td>
                <td className="py-3 px-2 text-foreground">{n.bestTime}</td>
                <td className="py-3 px-2">
                  <Badge variant="outline" className="text-xs">{n.bestTone}</Badge>
                </td>
                <td className="py-3 px-2 text-foreground">{n.bestChannel}</td>
                <td className="py-3 px-2 text-foreground">{n.bestTrigger}</td>
                <td className="py-3 px-2 text-right text-success font-semibold">{n.avgConversion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Smart Suggestion */}
      <div className="rounded-2xl border border-primary/20 p-5 shadow-card" style={{ background: "hsl(262 80% 60% / 0.06)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Sugestão Inteligente para {niche.name}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          Baseado em <strong>{niche.totalPosts} posts</strong> analisados, agende seu próximo conteúdo de <strong>{niche.name}</strong> para{" "}
          <strong className="text-success">{niche.bestDay}</strong> entre{" "}
          <strong className="text-success">{niche.bestTime}</strong>, usando tom{" "}
          <strong className="text-primary">{niche.bestTone.toLowerCase()}</strong> com gatilho de{" "}
          <strong>{niche.bestTrigger.toLowerCase()}</strong> no <strong>{niche.bestChannel}</strong>.
          Conversão média esperada: <strong className="text-success">{niche.avgConversion}%</strong>.
        </p>
      </div>
    </div>
  );
}
