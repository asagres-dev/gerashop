import { BarChart3, TrendingUp, TrendingDown, Eye, MousePointerClick, DollarSign, Users, Download } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Out", comissoes: 8200, cliques: 4200, membros: 980 },
  { month: "Nov", comissoes: 15400, cliques: 8800, membros: 1050 },
  { month: "Dez", comissoes: 19800, cliques: 12400, membros: 1120 },
  { month: "Jan", comissoes: 9200, cliques: 5600, membros: 1160 },
  { month: "Fev", comissoes: 11400, cliques: 6800, membros: 1200 },
  { month: "Mar", comissoes: 12450, cliques: 8200, membros: 1240 },
];

const platformData = [
  { name: "Natura", value: 38, color: "hsl(142 68% 45%)" },
  { name: "Amazon", value: 29, color: "hsl(38 92% 55%)" },
  { name: "Shopee", value: 21, color: "hsl(20 90% 55%)" },
  { name: "Mercado Livre", value: 12, color: "hsl(210 80% 55%)" },
];

const topOffers = [
  { name: "Tênis Nike Air Max", platform: "Shopee", cliques: 2104, conversao: "4.2%", comissao: "R$ 1.240" },
  { name: "Echo Dot 5ª Geração", platform: "Amazon", cliques: 1247, conversao: "3.8%", comissao: "R$ 892" },
  { name: "Perfume Essencial EDP", platform: "Natura", cliques: 842, conversao: "6.1%", comissao: "R$ 724" },
  { name: "Kit Cuidados Boticário", platform: "Mercado Livre", cliques: 523, conversao: "2.9%", comissao: "R$ 312" },
];

const platformColors: Record<string, string> = {
  Shopee: "text-orange-400",
  Amazon: "text-amber-400",
  Natura: "text-emerald-400",
  "Mercado Livre": "text-blue-400",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" && p.name === "comissoes" ? `R$ ${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const kpis = [
    { label: "Comissão Total", value: "R$ 76.450", change: "+18%", up: true, icon: DollarSign },
    { label: "Total de Cliques", value: "46.000", change: "+24%", up: true, icon: MousePointerClick },
    { label: "Taxa de Conversão", value: "4.1%", change: "+0.3%", up: true, icon: TrendingUp },
    { label: "Membros no Grupo", value: "1.240", change: "+8%", up: true, icon: Users },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics & Relatórios</h1>
          <p className="text-muted-foreground text-sm mt-1">Desempenho dos últimos 6 meses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          <Download className="w-3.5 h-3.5" /> Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border border-border p-4 shadow-card" style={{ background: "hsl(var(--card))" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {k.up ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                  {k.change}
                </span>
              </div>
              <p className="text-xl font-display font-bold text-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-display font-semibold text-foreground mb-4 text-sm">Comissões e Cliques (6 meses)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorComissoes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262 80% 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262 80% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="comissoes" stroke="hsl(262 80% 60%)" fill="url(#colorComissoes)" strokeWidth={2.5} name="comissoes" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
          <h3 className="font-display font-semibold text-foreground mb-4 text-sm">Receita por Plataforma</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, "Participação"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <span className="text-xs text-muted-foreground truncate">{p.name}</span>
                <span className="text-xs font-semibold text-foreground ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Offers Table */}
      <div className="rounded-2xl border border-border shadow-card overflow-hidden" style={{ background: "hsl(var(--card))" }}>
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold text-foreground text-sm">Top Ofertas por Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">#</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Produto</th>
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Plataforma</th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">Cliques</th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">Conversão</th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {topOffers.map((o, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-muted-foreground font-medium">{i + 1}</td>
                  <td className="p-4 font-medium text-foreground">{o.name}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold ${platformColors[o.platform]}`}>{o.platform}</span>
                  </td>
                  <td className="p-4 text-right text-foreground">{o.cliques.toLocaleString()}</td>
                  <td className="p-4 text-right text-success font-semibold">{o.conversao}</td>
                  <td className="p-4 text-right font-bold text-foreground">{o.comissao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
