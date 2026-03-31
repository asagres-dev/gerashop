import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Eye, Users, Package, Activity, Calendar, Star, Lightbulb, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

const upcomingCampaigns = [
  { name: "Dia das Mães", days: 18, color: "from-pink-500 to-rose-500", emoji: "💐" },
  { name: "Dia dos Namorados", days: 55, color: "from-red-500 to-pink-500", emoji: "💕" },
  { name: "Black Friday", days: 112, color: "from-orange-500 to-amber-500", emoji: "🛍️" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [offersCount, setOffersCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [recentOffers, setRecentOffers] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [offersRes, postsRes] = await Promise.all([
        supabase.from("offers").select("id, name, clicks, commission, platform, created_at, status").order("created_at", { ascending: false }).limit(10) as any,
        supabase.from("scheduled_posts").select("id, offer_name, channel, scheduled_date, status, created_at").order("created_at", { ascending: false }).limit(5) as any,
      ]);

      const offers = offersRes.data || [];
      const posts = postsRes.data || [];

      const activeOffers = offers.filter((o: any) => o.status === "ACTIVE");
      setOffersCount(activeOffers.length);
      setTotalClicks(offers.reduce((sum: number, o: any) => sum + (o.clicks || 0), 0));
      setTotalCommission(offers.reduce((sum: number, o: any) => sum + (Number(o.commission) || 0), 0));
      setScheduledCount(posts.filter((p: any) => p.status === "SCHEDULED").length);
      setRecentOffers(offers.slice(0, 5));
      setRecentPosts(posts.slice(0, 5));
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: "Comissões Totais", value: `R$ ${totalCommission.toFixed(2)}`, change: offersCount > 0 ? "+ativo" : "—", up: totalCommission > 0, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
    { label: "Cliques Totais", value: totalClicks.toLocaleString("pt-BR"), change: totalClicks > 0 ? `${totalClicks} cliques` : "—", up: totalClicks > 0, icon: Eye, color: "from-blue-500 to-indigo-500" },
    { label: "Posts Agendados", value: String(scheduledCount), change: scheduledCount > 0 ? "pendentes" : "nenhum", up: scheduledCount > 0, icon: Calendar, color: "from-purple-500 to-violet-500" },
    { label: "Ofertas Ativas", value: String(offersCount), change: offersCount > 0 ? "ativas" : "nenhuma", up: offersCount > 0, icon: Package, color: "from-orange-500 to-amber-500" },
  ];

  // Build simple chart data from recent offers
  const chartData = recentOffers.slice(0, 7).map((o: any, i: number) => ({
    name: (o.name || "").substring(0, 10),
    clicks: o.clicks || 0,
  })).reverse();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

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
                <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", m.up ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                  {m.up ? <TrendingUp className="w-3 h-3 inline mr-1" /> : null}
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
        {/* Bar Chart - clicks per offer */}
        <div className="xl:col-span-2 rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Cliques por Oferta</h3>
              <p className="text-xs text-muted-foreground">Ofertas recentes</p>
            </div>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" fill="hsl(262 80% 60%)" radius={[6, 6, 0, 0]} name="Cliques" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              Nenhuma oferta cadastrada ainda. Crie ofertas para ver os dados aqui.
            </div>
          )}
        </div>

        {/* Upcoming Campaigns */}
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
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <div className="xl:col-span-2 rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">Atividade Recente</h3>
          {recentOffers.length === 0 && recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhuma atividade ainda. Comece criando ofertas e agendando conteúdo.</p>
          ) : (
            <div className="space-y-3">
              {recentOffers.slice(0, 3).map((o: any, i: number) => (
                <div key={o.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-lg">🆕</span>
                  <p className="flex-1 text-sm text-foreground">Oferta: {o.name}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{o.platform}</span>
                </div>
              ))}
              {recentPosts.slice(0, 3).map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-lg">📅</span>
                  <p className="flex-1 text-sm text-foreground">Agendado: {p.offer_name || p.channel}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Tip */}
        <div className="rounded-2xl border border-primary/20 p-5 shadow-card" style={{ background: "hsl(262 80% 60% / 0.06)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-primary">Dica do Dia — IA</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {offersCount > 0
              ? <>Você tem <strong>{offersCount} ofertas ativas</strong>. Gere conteúdo para cada uma e agende publicações para aumentar conversões!</>
              : <>Comece cadastrando suas primeiras ofertas e configurando seu provedor de IA para gerar conteúdo automaticamente.</>
            }
          </p>
          <button className="mt-3 flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            <Lightbulb className="w-3 h-3" /> Nova dica
          </button>
        </div>
      </div>
    </div>
  );
}
