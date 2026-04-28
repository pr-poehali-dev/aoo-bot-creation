import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const bots = [
  { id: "BOT-001", name: "ScoutAlpha", region: "EU-West", cpu: 23, mem: 41, ping: 12, status: "active", tasks: 8 },
  { id: "BOT-002", name: "GuardBeta", region: "US-East", cpu: 87, mem: 72, ping: 45, status: "alert", tasks: 3 },
  { id: "BOT-003", name: "PatrolGamma", region: "AS-South", cpu: 34, mem: 58, ping: 89, status: "active", tasks: 12 },
  { id: "BOT-004", name: "SentryDelta", region: "EU-North", cpu: 5, mem: 21, ping: 8, status: "idle", tasks: 0 },
  { id: "BOT-005", name: "WatcherEta", region: "US-West", cpu: 61, mem: 65, ping: 28, status: "active", tasks: 6 },
  { id: "BOT-006", name: "RaidZeta", region: "EU-Central", cpu: 44, mem: 39, ping: 19, status: "active", tasks: 9 },
];

function MetricBar({ value, warn = 70, danger = 85 }: { value: number; warn?: number; danger?: number }) {
  const color =
    value >= danger ? "from-red-500 to-red-400" :
    value >= warn ? "from-yellow-500 to-orange-400" :
    "from-purple-500 to-cyan-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-secondary">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-8 text-right ${
        value >= danger ? "text-red-400" : value >= warn ? "text-yellow-400" : "text-muted-foreground"
      }`}>{value}%</span>
    </div>
  );
}

export default function Monitoring() {
  const [metrics, setMetrics] = useState(bots);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setMetrics((prev) =>
        prev.map((b) => ({
          ...b,
          cpu: Math.max(1, Math.min(99, b.cpu + Math.floor((Math.random() - 0.5) * 10))),
          ping: Math.max(1, Math.min(200, b.ping + Math.floor((Math.random() - 0.5) * 8))),
        }))
      );
      setTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const statusColors: Record<string, string> = {
    active: "text-green-400 bg-green-400/10 border-green-400/20",
    alert: "text-red-400 bg-red-400/10 border-red-400/20",
    idle: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  };
  const statusDot: Record<string, string> = {
    active: "bg-green-400",
    alert: "bg-red-400",
    idle: "bg-yellow-400",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Всего в сети", value: metrics.length, icon: "Server", color: "text-purple-400" },
          { label: "Активных", value: metrics.filter((b) => b.status === "active").length, icon: "CheckCircle", color: "text-green-400" },
          { label: "Тревога", value: metrics.filter((b) => b.status === "alert").length, icon: "AlertOctagon", color: "text-red-400" },
          { label: "Ожидание", value: metrics.filter((b) => b.status === "idle").length, icon: "PauseCircle", color: "text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border gradient-card p-3 flex items-center gap-3">
            <Icon name={s.icon} size={18} className={s.color} />
            <div>
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live update indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" />
        Данные обновляются в реальном времени · обновление #{tick}
      </div>

      {/* Bot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {metrics.map((bot) => (
          <div
            key={bot.id}
            className={`rounded-xl border gradient-card p-4 card-hover transition-all duration-300 ${
              bot.status === "alert" ? "border-red-500/30" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusDot[bot.status]} pulse-dot`} />
                <span className="font-semibold text-sm">{bot.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{bot.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[bot.status]}`}>
                  {bot.status === "active" ? "Активен" : bot.status === "alert" ? "Тревога" : "Ожидание"}
                </span>
                <Icon name="MapPin" size={11} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{bot.region}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-8">CPU</span>
                <MetricBar value={bot.cpu} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-8">MEM</span>
                <MetricBar value={bot.mem} warn={75} danger={90} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="Wifi" size={11} />
                <span className={bot.ping > 80 ? "text-red-400" : "text-green-400"}>{bot.ping}ms</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="ListChecks" size={11} />
                <span>{bot.tasks} задач</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
