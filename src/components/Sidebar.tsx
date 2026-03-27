import { useState } from "react";
import {
  LayoutDashboard, Package, Wand2, BarChart3, Megaphone, Settings, LogOut,
  Zap, ChevronLeft, ChevronRight, Users, Bell, CalendarDays, Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Ofertas", id: "ofertas" },
  { icon: Wand2, label: "Gerar Conteúdo", id: "conteudo" },
  { icon: CalendarDays, label: "Calendário", id: "calendario" },
  { icon: Brain, label: "Mapeamento", id: "mapeamento" },
  { icon: Megaphone, label: "Campanhas", id: "campanhas" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Configurações", id: "configuracoes" },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 transition-all duration-300 border-r border-border",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ background: "hsl(var(--sidebar-background))" }}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-border", collapsed && "justify-center")}>
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-sm text-foreground leading-none">AffiliateAI</p>
            <p className="text-xs text-muted-foreground">Pro</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "gradient-primary text-white shadow-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-border space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted mb-2">
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@affiliateai.com</p>
            </div>
            <Bell className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </div>
        )}
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Sair"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted transition-all",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Recolher</span></>}
        </button>
      </div>
    </aside>
  );
}
