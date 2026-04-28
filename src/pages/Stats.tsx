import { useState } from "react";
import Icon from "@/components/ui/icon";

const weekData = [
  { day: "Пн", bots: 210, attacks: 5, blocked: 320 },
  { day: "Вт", bots: 225, attacks: 8, blocked: 410 },
  { day: "Ср", bots: 230, attacks: 3, blocked: 280 },
  { day: "Чт", bots: 242, attacks: 12, blocked: 680 },
  { day: "Пт", bots: 238, attacks: 7, blocked: 490 },
  { day: "Сб", bots: 244, attacks: 2, blocked: 190 },
  { day: "Вс", bots: 247, attacks: 3, blocked: 284 },
];

const maxBlocked = Math.max(...weekData.map((d) => d.blocked));

const topRegions = [
  { region: "EU-West", bots: 68, pct: 28 },
  { region: "US-East", bots: 54, pct: 22 },
  { region: "AS-South", bots: 49, pct: 20 },
  { region: "US-West", bots: 41, pct: 17 },
  { region: "EU-North", bots: 35, pct: 14 },
];

export default function Stats() {
  const [activeMetric, setActiveMetric] = useState<"bots" | "attacks" | "blocked">("blocked");

  const metricConfig = {
    bots: { label: "Боты", color: "from-purple-500 to-indigo-500", textColor: "text-purple-400" },
    attacks: { label: "Атаки", color: "from-red-500 to-orange-500", textColor: "text-red-400" },
    blocked: { label: "Заблокировано", color: "from-cyan-500 to-teal-500", textColor: "text-cyan-400" },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["bots", "attacks", "blocked"] as const).map((key) => {
          const cfg = metricConfig[key];
          const last = weekData[weekData.length - 1][key];
          const prev = weekData[weekData.length - 2][key];
          const diff = last - prev;
          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`rounded-xl p-4 border text-left transition-all duration-200 card-hover ${
                activeMetric === key ? "border-primary/50 bg-primary/5 glow-purple" : "border-border gradient-card"
              }`}
            >
              <div className="text-xs text-muted-foreground mb-2">{cfg.label}</div>
              <div className={`text-2xl font-bold ${cfg.textColor}`}>{last.toLocaleString()}</div>
              <div className={`text-xs mt-1 ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)} vs вчера
              </div>
            </button>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border border-border gradient-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-sm">{metricConfig[activeMetric].label} — последние 7 дней</h3>
          <div className="flex gap-1">
            {(["bots", "attacks", "blocked"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  activeMetric === key ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {metricConfig[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {weekData.map((d) => {
            const val = d[activeMetric];
            const max = Math.max(...weekData.map((x) => x[activeMetric]));
            const pct = (val / max) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-md relative overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-90"
                  style={{ height: `${pct}%`, minHeight: 6 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${metricConfig[activeMetric].color} opacity-80`} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-white font-bold">{val}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border gradient-card p-5">
          <h3 className="font-semibold text-sm mb-4">Распределение по регионам</h3>
          <div className="space-y-3">
            {topRegions.map((r) => (
              <div key={r.region}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground">{r.region}</span>
                  <span className="text-muted-foreground">{r.bots} ботов · {r.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-primary transition-all duration-700"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border gradient-card p-5">
          <h3 className="font-semibold text-sm mb-4">Эффективность защиты</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(220 20% 16%)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="url(#grad)" strokeWidth="3"
                    strokeDasharray="92 100" strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(262 83% 65%)" />
                      <stop offset="100%" stopColor="hsl(192 91% 55%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gradient-primary">92%</span>
                  <span className="text-[9px] text-muted-foreground">эффект.</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Отражено атак", value: "1,842", color: "text-cyan-400" },
                { label: "Купол срабатываний", value: "47", color: "text-purple-400" },
                { label: "Среднее время ответа", value: "0.3с", color: "text-green-400" },
                { label: "Ложных тревог", value: "3", color: "text-yellow-400" },
              ].map((item) => (
                <div key={item.label} className="bg-secondary/50 rounded-lg p-3">
                  <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
