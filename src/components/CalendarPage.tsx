import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, Instagram,
  MessageCircle, Film, Image as ImageIcon, Check, X, Edit2, Trash2, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/lib/services/dataService";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

type ViewMode = "month" | "week";
type PostStatus = "scheduled" | "published" | "failed" | "draft";
type Channel = "Instagram" | "WhatsApp" | "TikTok";
type ContentType = "Feed" | "Reels" | "Story" | "WhatsApp";

interface ScheduledPost {
  id: string;
  offerName: string;
  contentType: ContentType;
  channel: Channel;
  date: Date;
  time: string;
  status: PostStatus;
  caption?: string;
  platform: string;
}

const statusConfig: Record<PostStatus, { label: string; color: string; dot: string }> = {
  scheduled: { label: "Agendado", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
  published: { label: "Publicado", color: "bg-success/10 text-success border-success/20", dot: "bg-success" },
  failed: { label: "Falhou", color: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
  draft: { label: "Rascunho", color: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20", dot: "bg-muted-foreground" },
};

const channelIcons: Record<Channel, React.ReactNode> = {
  Instagram: <Instagram className="w-3.5 h-3.5" />,
  WhatsApp: <MessageCircle className="w-3.5 h-3.5" />,
  TikTok: <Film className="w-3.5 h-3.5" />,
};

const contentTypeEmoji: Record<ContentType, string> = {
  Feed: "📷",
  Reels: "🎬",
  Story: "📱",
  WhatsApp: "💬",
};

const DEMO_POSTS: ScheduledPost[] = [
  { id: "1", offerName: "Perfume Essencial Natura", contentType: "Feed", channel: "Instagram", date: new Date(), time: "19:30", status: "scheduled", platform: "Natura" },
  { id: "2", offerName: "Echo Dot 5ª Geração", contentType: "Story", channel: "Instagram", date: new Date(Date.now() + 86400000), time: "12:00", status: "scheduled", platform: "Amazon" },
  { id: "3", offerName: "Smart TV Samsung 55\"", contentType: "Reels", channel: "TikTok", date: new Date(Date.now() + 2 * 86400000), time: "20:00", status: "draft", platform: "Amazon" },
  { id: "4", offerName: "Kit Cuidados Boticário", contentType: "WhatsApp", channel: "WhatsApp", date: new Date(Date.now() - 86400000), time: "10:00", status: "published", platform: "Mercado Livre" },
  { id: "5", offerName: "Tênis Nike Air Max", contentType: "Reels", channel: "Instagram", date: new Date(Date.now() + 5 * 86400000), time: "18:00", status: "scheduled", platform: "Shopee" },
  { id: "6", offerName: "Airpods Pro 2", contentType: "Feed", channel: "Instagram", date: new Date(Date.now() - 3 * 86400000), time: "19:00", status: "published", platform: "Amazon" },
  { id: "7", offerName: "Creme Hidratante Natura", contentType: "Story", channel: "Instagram", date: new Date(Date.now() + 4 * 86400000), time: "15:00", status: "scheduled", platform: "Natura" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export default function CalendarPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterChannel, setFilterChannel] = useState<Channel | "all">("all");
  const [filterStatus, setFilterStatus] = useState<PostStatus | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    dataService.getScheduledPosts(user?.id).then((data) => {
      setPosts(data.map((p: any) => ({ ...p, date: new Date(p.date) })));
    });
  }, [user]);

  // New post form
  const [newPost, setNewPost] = useState({
    offerName: "", contentType: "Feed" as ContentType, channel: "Instagram" as Channel,
    date: "", time: "19:30", caption: "", platform: "Natura"
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigate = (dir: number) => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + dir, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + dir * 7 * 86400000));
    }
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const isToday = (d: Date) => isSameDay(d, new Date());

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (filterChannel !== "all" && p.channel !== filterChannel) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      return true;
    });
  }, [posts, filterChannel, filterStatus]);

  const getPostsForDay = (day: Date) => filteredPosts.filter(p => isSameDay(p.date, day));

  const handleCreate = async () => {
    if (!newPost.offerName || !newPost.date) {
      toast({ title: "Preencha os campos obrigatórios", variant: "destructive" });
      return;
    }
    const post: ScheduledPost = {
      id: Date.now().toString(),
      offerName: newPost.offerName,
      contentType: newPost.contentType,
      channel: newPost.channel,
      date: new Date(newPost.date + "T00:00:00"),
      time: newPost.time,
      status: "scheduled",
      caption: newPost.caption,
      platform: newPost.platform,
    };
    setPosts(prev => [...prev, post]);
    if (user) {
      await dataService.createScheduledPost(post, user.id).catch(() => {});
    }
    setShowModal(false);
    setNewPost({ offerName: "", contentType: "Feed", channel: "Instagram", date: "", time: "19:30", caption: "", platform: "Natura" });
    toast({ title: "Post agendado!", description: `${post.offerName} — ${post.date.toLocaleDateString("pt-BR")} às ${post.time}` });
  };

  const handleDelete = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    await dataService.deleteScheduledPost(id).catch(() => {});
    toast({ title: "Agendamento removido" });
  };

  // Get week days
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  // Upcoming posts (next 7 days)
  const upcomingPosts = useMemo(() => {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 86400000);
    return filteredPosts
      .filter(p => p.date >= now && p.date <= weekLater && p.status !== "published")
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredPosts]);

  // Month grid
  const renderMonthGrid = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells: React.ReactNode[] = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[80px] bg-muted/30 rounded-lg" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayPosts = getPostsForDay(date);
      const today = isToday(date);

      cells.push(
        <div
          key={d}
          className={cn(
            "min-h-[80px] rounded-lg border border-border p-1.5 transition-colors hover:border-primary/40 cursor-pointer",
            today ? "border-primary bg-primary/5" : "bg-card"
          )}
          onClick={() => {
            setNewPost(prev => ({ ...prev, date: date.toISOString().split("T")[0] }));
            setShowModal(true);
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={cn("text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full", today && "bg-primary text-white")}>
              {d}
            </span>
            {dayPosts.length > 0 && (
              <span className="text-xs text-muted-foreground">{dayPosts.length}</span>
            )}
          </div>
          <div className="space-y-0.5">
            {dayPosts.slice(0, 3).map(p => (
              <div
                key={p.id}
                className={cn("text-xs px-1.5 py-0.5 rounded truncate flex items-center gap-1", statusConfig[p.status].color)}
                title={`${p.offerName} — ${p.time}`}
                onClick={e => e.stopPropagation()}
              >
                <span>{contentTypeEmoji[p.contentType]}</span>
                <span className="truncate">{p.time}</span>
              </div>
            ))}
            {dayPosts.length > 3 && (
              <span className="text-xs text-muted-foreground pl-1">+{dayPosts.length - 3}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
        ))}
        {cells}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dayPosts = getPostsForDay(day);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "rounded-xl border border-border p-3 min-h-[200px] transition-colors",
                today ? "border-primary bg-primary/5" : "bg-card"
              )}
            >
              <div className="text-center mb-3">
                <p className="text-xs text-muted-foreground">{WEEKDAYS[day.getDay()]}</p>
                <p className={cn("text-lg font-bold", today ? "text-primary" : "text-foreground")}>
                  {day.getDate()}
                </p>
              </div>
              <div className="space-y-1.5">
                {dayPosts.map(p => (
                  <div
                    key={p.id}
                    className={cn("text-xs p-2 rounded-lg border", statusConfig[p.status].color)}
                  >
                    <div className="flex items-center gap-1 mb-0.5">
                      {channelIcons[p.channel]}
                      <span className="font-medium">{p.time}</span>
                    </div>
                    <p className="truncate text-foreground">{p.offerName}</p>
                    <Badge variant="outline" className="text-xs mt-1 h-4 px-1">{p.contentType}</Badge>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            Calendário de Postagens
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Agende e visualize seus posts em todas as plataformas</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowModal(true)} className="gradient-primary text-white border-0 shadow-glow hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <h2 className="text-lg font-display font-semibold text-foreground min-w-[180px] text-center">
            {viewMode === "month"
              ? `${MONTHS[month]} ${year}`
              : `Semana de ${getWeekDays()[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
            }
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs text-primary">Hoje</Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <select
            className="bg-muted border border-border text-foreground text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            value={filterChannel}
            onChange={e => setFilterChannel(e.target.value as Channel | "all")}
          >
            <option value="all">Todos os canais</option>
            <option value="Instagram">Instagram</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="TikTok">TikTok</option>
          </select>
          <select
            className="bg-muted border border-border text-foreground text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as PostStatus | "all")}
          >
            <option value="all">Todos os status</option>
            <option value="scheduled">Agendado</option>
            <option value="published">Publicado</option>
            <option value="failed">Falhou</option>
            <option value="draft">Rascunho</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["month", "week"] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === v ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {v === "month" ? "Mês" : "Semana"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl border border-border p-4 shadow-card" style={{ background: "hsl(var(--card))" }}>
        {viewMode === "month" ? renderMonthGrid() : renderWeekView()}
      </div>

      {/* Upcoming Posts */}
      <div className="rounded-2xl border border-border p-5 shadow-card" style={{ background: "hsl(var(--card))" }}>
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          📋 Posts Agendados <span className="text-xs text-muted-foreground font-normal">(próximos 7 dias)</span>
        </h3>
        {upcomingPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum post agendado para os próximos 7 dias</p>
        ) : (
          <div className="space-y-2">
            {upcomingPosts.map(p => {
              const today = isToday(p.date);
              const tomorrow = isSameDay(p.date, new Date(Date.now() + 86400000));
              const dateLabel = today ? "HOJE" : tomorrow ? "AMANHÃ" : p.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

              return (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", statusConfig[p.status].dot)} />
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className={cn("text-sm font-semibold", today ? "text-success" : tomorrow ? "text-warning" : "text-primary")}>
                      {dateLabel}
                    </span>
                    <span className="text-sm text-foreground">{p.time}</span>
                  </div>
                  <span className="text-sm text-foreground flex-1 truncate">{p.offerName}</span>
                  <Badge variant="outline" className="text-xs">{p.contentType}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {channelIcons[p.channel]}
                    <span className="text-xs">{p.channel}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Oferta *</Label>
              <Input
                placeholder="Nome do produto"
                value={newPost.offerName}
                onChange={e => setNewPost(prev => ({ ...prev, offerName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Tipo de Conteúdo</Label>
                <select
                  className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2.5 h-10 focus:outline-none focus:border-primary"
                  value={newPost.contentType}
                  onChange={e => setNewPost(prev => ({ ...prev, contentType: e.target.value as ContentType }))}
                >
                  <option value="Feed">Feed</option>
                  <option value="Reels">Reels</option>
                  <option value="Story">Story</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Canal</Label>
                <select
                  className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2.5 h-10 focus:outline-none focus:border-primary"
                  value={newPost.channel}
                  onChange={e => setNewPost(prev => ({ ...prev, channel: e.target.value as Channel }))}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Data *</Label>
                <Input
                  type="date"
                  value={newPost.date}
                  onChange={e => setNewPost(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Horário</Label>
                <Input
                  type="time"
                  value={newPost.time}
                  onChange={e => setNewPost(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Plataforma</Label>
              <select
                className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2.5 h-10 focus:outline-none focus:border-primary"
                value={newPost.platform}
                onChange={e => setNewPost(prev => ({ ...prev, platform: e.target.value }))}
              >
                <option value="Natura">Natura</option>
                <option value="Amazon">Amazon</option>
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Shopee">Shopee</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Legenda (opcional)</Label>
              <textarea
                className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-3 h-20 focus:outline-none focus:border-primary resize-none"
                placeholder="Adicione uma legenda personalizada..."
                value={newPost.caption}
                onChange={e => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
              />
            </div>

            {/* Smart suggestion */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">💡</span>
                <span className="text-xs font-semibold text-primary">Sugestão Inteligente</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Para <strong>Perfumaria</strong>, o melhor horário é <strong className="text-success">Quinta às 19:30</strong> via Instagram Reels (34% mais conversão).
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="gradient-primary text-white border-0">
              <CalendarDays className="w-4 h-4 mr-2" /> Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
