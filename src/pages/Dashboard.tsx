import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const statCards = [
  { label: "Всего ботов", value: "247", change: "+12", trend: "up", icon: "Bot", color: "purple" },
  { label: "Активные атаки", value: "3", change: "+1", trend: "up", icon: "AlertTriangle", color: "red" },
  { label: "Защита куполом", value: "ON", change: "авто", trend: "up", icon: "Shield", color: "green" },
  { label: "Заблокировано", value: "1,842", change: "+284", trend: "up", icon: "Ban", color: "cyan" },
];

const recentBots = [
  { id: "BOT-001", name: "ScoutAlpha", status: "active", region: "EU-West", uptime: "12h 34m", threats: 0 },
  { id: "BOT-002", name: "GuardBeta", status: "alert", region: "US-East", uptime: "8h 12m", threats: 3 },
  { id: "BOT-003", name: "PatrolGamma", status: "active", region: "AS-South", uptime: "24h 01m", threats: 0 },
  { id: "BOT-004", name: "SentryDelta", status: "idle", region: "EU-North", uptime: "2h 45m", threats: 0 },
  { id: "BOT-005", name: "WatcherEta", status: "active", region: "US-West", uptime: "18h 55m", threats: 1 },
];

const statusColors: Record<string, string> = {
  active: "text-green-400 bg-green-400/10 border-green-400/30",
  alert: "text-red-400 bg-red-400/10 border-red-400/30",
  idle: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
};

const statusLabels: Record<string, string> = {
  active: "Активен",
  alert: "Тревога",
  idle: "Ожидание",
};

export default function Dashboard() {
  const [shieldActive, setShieldActive] = useState(true);
  const [attackAlert, setAttackAlert] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setAttackAlert(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleShield = () => {
    setShieldActive(!shieldActive);
    if (!shieldActive) setAttackAlert(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Attack Alert Banner */}
      {attackAlert && (
        <div className={`rounded-xl p-4 border flex items-center gap-4 transition-all duration-300 ${
          shieldActive
            ? "border-green-500/30 bg-green-500/5 glow-green"
            : "border-red-500/30 bg-red-500/5 animate-alert"
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            shieldActive ? "bg-green-500/20" : "bg-red-500/20"
          }`}>
            <Icon name={shieldActive ? "ShieldCheck" : "ShieldAlert"} size={20}
              className={shieldActive ? "text-green-400" : "text-red-400"} />
          </div>
          <div className="flex-1">
            <div className={`font-semibold text-sm ${shieldActive ? "text-green-400" : "text-red-400"}`}>
              {shieldActive ? "Купол активирован — атака отражена" : "ОБНАРУЖЕНО НАПАДЕНИЕ на BOT-002"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {shieldActive ? "Все входящие угрозы заблокированы автоматически" : "Регион: US-East · 3 одновременных угрозы · " + time.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={handleShield}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              shieldActive
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                : "gradient-danger text-white hover:opacity-90"
            }`}
          >
            {shieldActive ? "Деактивировать" : "Включить купол"}
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border gradient-card p-4 card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                card.color === "purple" ? "bg-purple-500/15" :
                card.color === "red" ? "bg-red-500/15" :
                card.color === "green" ? "bg-green-500/15" : "bg-cyan-500/15"
              }`}>
                <Icon name={card.icon} size={18} className={
                  card.color === "purple" ? "text-purple-400" :
                  card.color === "red" ? "text-red-400" :
                  card.color === "green" ? "text-green-400" : "text-cyan-400"
                } />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                card.trend === "up" && card.color !== "red"
                  ? "text-green-400 bg-green-400/10"
                  : card.color === "red"
                  ? "text-red-400 bg-red-400/10"
                  : "text-yellow-400 bg-yellow-400/10"
              }`}>
                {card.change}
              </span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              card.label === "Защита куполом"
                ? shieldActive ? "text-green-400" : "text-red-400"
                : "text-foreground"
            }`}>
              {card.label === "Защита куполом" ? (shieldActive ? "ON" : "OFF") : card.value}
            </div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Bots Table + Shield Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bot List */}
        <div className="lg:col-span-2 rounded-xl border border-border gradient-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Активные боты</h3>
            <span className="text-xs text-muted-foreground">247 всего</span>
          </div>
          <div className="space-y-2">
            {recentBots.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={13} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{bot.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{bot.id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{bot.region} · {bot.uptime}</div>
                </div>
                {bot.threats > 0 && (
                  <span className="text-xs text-red-400 font-medium">{bot.threats} угроз</span>
                )}
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColors[bot.status]}`}>
                  {statusLabels[bot.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shield Control */}
        <div className="rounded-xl border border-border gradient-card p-5 flex flex-col items-center justify-center gap-4">
          <h3 className="font-semibold text-sm self-start">Управление куполом</h3>
          <div className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
            shieldActive ? "animate-shield bg-green-500/10 border-2 border-green-500/40" : "bg-red-500/10 border-2 border-red-500/30 animate-alert"
          }`} onClick={handleShield}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              shieldActive ? "gradient-success" : "gradient-danger"
            }`}>
              <Icon name={shieldActive ? "ShieldCheck" : "ShieldOff"} size={36} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <div className={`text-base font-bold ${shieldActive ? "text-green-400" : "text-red-400"}`}>
              {shieldActive ? "Купол ВКЛЮЧЁН" : "Купол ВЫКЛЮЧЕН"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Нажмите для переключения</div>
          </div>
          <div className="w-full rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
            <div className="flex justify-between mb-1">
              <span>Автоактивация</span>
              <span className="text-green-400">Включена</span>
            </div>
            <div className="flex justify-between">
              <span>Порог угрозы</span>
              <span className="text-foreground">Level 2+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
