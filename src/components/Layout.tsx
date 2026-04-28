import { useState } from "react";
import Icon from "@/components/ui/icon";

const navItems = [
  { id: "dashboard", label: "Панель управления", icon: "LayoutDashboard" },
  { id: "cities", label: "Города", icon: "Building2" },
  { id: "ree", label: "РЗЭ", icon: "Gem" },
  { id: "stats", label: "Статистика", icon: "BarChart3" },
  { id: "monitoring", label: "Мониторинг", icon: "Activity" },
  { id: "attacks", label: "История атак", icon: "Swords" },
  { id: "logs", label: "Логи", icon: "FileText" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col glass border-r border-border transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 glow-purple">
            <Icon name="Bot" size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold text-gradient-primary">BotTracker</div>
              <div className="text-[10px] text-muted-foreground">v2.4.1 ACTIVE</div>
            </div>
          )}
          <button
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={14} />
          </button>
        </div>

        {/* Status bar */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot flex-shrink-0" />
            <span className="text-xs text-green-400 font-medium">Система активна</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive
                    ? "gradient-primary text-white glow-purple"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  className={isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"}
                />
                {!collapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bot count */}
        {!collapsed && (
          <div className="px-3 pb-4">
            <div className="px-3 py-3 rounded-lg border border-border bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Активных ботов</div>
              <div className="text-2xl font-bold text-gradient-primary">247</div>
              <div className="text-xs text-green-400 mt-1">↑ +12 за сегодня</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass">
          <div>
            <h1 className="text-lg font-semibold text-foreground capitalize">
              {navItems.find((n) => n.id === activePage)?.label ?? "Панель"}
            </h1>
            <p className="text-xs text-muted-foreground">Последнее обновление: только что</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center glow-purple">
                <Icon name="Bell" size={14} className="text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold">3</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Icon name="User" size={14} className="text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto scrollbar-custom p-6">
          {children}
        </div>
      </main>
    </div>
  );
}