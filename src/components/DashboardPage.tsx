import { TrendingUp, TrendingDown, DollarSign, Eye, Users, Package, Activity, Calendar, Star, Lightbulb } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const weeklyClicks = [
  { day: "Seg", clicks: 420, natura: 120, amazon: 180, shopee: 80, ml: 40 },
  { day: "Ter", clicks: 580, natura: 200, amazon: 220, shopee: 90, ml: 70 },
  { day: "Qua", clicks: 350, natura: 100, amazon: 150, shopee: 60, ml: 40 },
  { day: "Qui", clicks: 720, natura: 280, amazon: 250, shopee: 120, ml: 70 },
  { day: "Sex", clicks: 890, natura: 320, amazon: 310, shopee: 150, ml: 110 },
  { day: "Sáb", clicks: 1040, natura: 400, amazon: 380, shopee: 160, ml: 100 },
  { day: "Dom", clicks: 760, natura: 250, amazon: 280, shopee: 140, ml: 90 },
];

const conversionData = [
  { type: "Reels", value: 4200 },
  { type: "Feed", value: 2800 },
  { type: "Stories", value: 1900 },
  { type: "WhatsApp", value: 3500 },
];

const recentActivity = [
  { icon: "🆕", text: "Nova oferta importada: Perfume Essencial", time: "5 min" },
  { icon: "🤖", text: "Conteúdo gerado: Echo Dot (Reels)", time: "12 min" },
  { icon: "📅", text: "Campanha programada: Dia das Mães", time: "1 hora" },
  { icon: "🔍", text: "Análise de concorrente concluída", time: "2 horas" },
  { icon: "💰", text: "Comissão recebida: R$45,20 (Shopee)", time: "3 horas" },
];

const upcomingCampaigns = [
  { name: "Dia das Mães", days: 18, color: "from-pink-500 to-rose-500", emoji: "💐" },
  { name: "Dia dos Namorados", days: 55, color: "from-red-500 to-pink-500", emoji: "💕" },
  { name: "Black Friday", days: 112, color: "from-orange-500 to-amber-500", emoji: "🛍️" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const metrics = [
    { label: "Comissões do Mês", value: "R$ 12.450", change: "+23%", up: true, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: "Visualizações (7d)", value: "8,2K", change: "+12%", up: true, icon: Eye, color: "from-blue-500 to-indigo-500" },
    { label: "Membros do Grupo", value: "1.240", change: "+8%", up: true, icon: Users, color: "from-purple-500 to-violet-500" },
    { label: "Ofertas Ativas", value: "34", change: "-2%", up: false, icon: Package, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral do seu negócio em tempo real</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-2xl border border-border p-5 shadow-card hover:shadow-elevated transition-shadow cursor-pointer group" style={{ background: "hsl(var(--card))" }}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", m.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", m.up ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                  {m.up ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Cliques nos Links</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 dias por plataforma</p>
            </div>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyClicks}>
              <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="clicks" stroke="hsl(262 80% 60%)" strokeWidth={2.5} dot={false} name="Total" />
              <Line type="monotone" dataKey="amazon" stroke="hsl(38 92% 55%)" strokeWidth={1.5} dot={false} name="Amazon" />
              <Line type="monotone" dataKey="natura" stroke="hsl(142 68% 45%)" strokeWidth={1.5} dot={false} name="Natura" />
              <Line type="monotone" dataKey="shopee" stroke="hsl(20 90% 55%)" strokeWidth={1.5} dot={false} name="Shopee" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <div className="mb-4">
            <h3 className="font-display font-semibold text-foreground">Conversões</h3>
            <p className="text-xs text-muted-foreground">Por tipo de conteúdo</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData} barSize={28}>
              <XAxis dataKey="type" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="hsl(262 80% 60%)" radius={[6, 6, 0, 0]} name="Conversões" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="xl:col-span-2 rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="text-lg">{a.icon}</span>
                <p className="flex-1 text-sm text-foreground">{a.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">há {a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Campaigns + AI Tip */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-sm">Próximas Campanhas</h3>
            </div>
            <div className="space-y-3">
              {upcomingCampaigns.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{c.emoji}</span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.days} dias</p>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:underline font-medium">Preparar</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 p-5 shadow-card" style={{ background: "hsl(262 80% 60% / 0.06)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-primary">Dica do Dia — IA</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Reels com gatilho de <strong>escassez</strong> tiveram <span className="text-success font-semibold">34% mais conversão</span> esta semana. Teste nos próximos posts!
            </p>
            <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              <Lightbulb className="w-3 h-3" /> Nova dica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
