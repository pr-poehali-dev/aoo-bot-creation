import { useState } from "react";
import Icon from "@/components/ui/icon";

type AttackSeverity = "critical" | "high" | "medium" | "low";

interface Attack {
  id: string;
  time: string;
  type: string;
  source: string;
  target: string;
  severity: AttackSeverity;
  status: "blocked" | "active" | "resolved";
  shieldUsed: boolean;
  duration: string;
  ips: number;
}

const attacks: Attack[] = [
  { id: "ATK-2847", time: "14:23:01", type: "DDoS Flood", source: "192.168.x.x", target: "GuardBeta", severity: "critical", status: "blocked", shieldUsed: true, duration: "0.3с", ips: 847 },
  { id: "ATK-2846", time: "14:22:15", type: "Brute Force", source: "77.88.55.11", target: "WatcherEta", severity: "high", status: "blocked", shieldUsed: false, duration: "2.1с", ips: 1 },
  { id: "ATK-2845", time: "14:21:33", type: "Port Scan", source: "10.0.x.x", target: "ScoutAlpha", severity: "medium", status: "resolved", shieldUsed: false, duration: "8.7с", ips: 12 },
  { id: "ATK-2844", time: "14:19:47", type: "Botnet Attack", source: "Multiple", target: "GuardBeta", severity: "critical", status: "blocked", shieldUsed: true, duration: "0.8с", ips: 2341 },
  { id: "ATK-2843", time: "14:15:22", type: "SQL Injection", source: "45.33.x.x", target: "PatrolGamma", severity: "high", status: "blocked", shieldUsed: false, duration: "0.1с", ips: 1 },
  { id: "ATK-2842", time: "13:58:11", type: "MITM Attempt", source: "203.0.x.x", target: "RaidZeta", severity: "high", status: "resolved", shieldUsed: true, duration: "1.4с", ips: 3 },
  { id: "ATK-2841", time: "13:41:05", type: "XSS Attack", source: "Unknown", target: "SentryDelta", severity: "low", status: "blocked", shieldUsed: false, duration: "0.05с", ips: 1 },
  { id: "ATK-2840", time: "13:22:58", type: "DDoS Flood", source: "185.x.x.x", target: "WatcherEta", severity: "critical", status: "blocked", shieldUsed: true, duration: "0.2с", ips: 5500 },
];

const severityConfig: Record<AttackSeverity, { color: string; label: string; dot: string }> = {
  critical: { color: "text-red-400 bg-red-400/10 border-red-400/30", label: "Критическая", dot: "bg-red-400" },
  high: { color: "text-orange-400 bg-orange-400/10 border-orange-400/30", label: "Высокая", dot: "bg-orange-400" },
  medium: { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", label: "Средняя", dot: "bg-yellow-400" },
  low: { color: "text-blue-400 bg-blue-400/10 border-blue-400/30", label: "Низкая", dot: "bg-blue-400" },
};

const statusConfig = {
  blocked: "text-green-400 bg-green-400/10 border-green-400/20",
  active: "text-red-400 bg-red-400/10 border-red-400/20 animate-pulse",
  resolved: "text-muted-foreground bg-secondary border-border",
};

const statusLabel = {
  blocked: "Заблокирована",
  active: "Активная",
  resolved: "Решена",
};

export default function Attacks() {
  const [filterSeverity, setFilterSeverity] = useState<AttackSeverity | "ALL">("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = attacks.filter(
    (a) => filterSeverity === "ALL" || a.severity === filterSeverity
  );

  const counts = {
    critical: attacks.filter((a) => a.severity === "critical").length,
    high: attacks.filter((a) => a.severity === "high").length,
    medium: attacks.filter((a) => a.severity === "medium").length,
    low: attacks.filter((a) => a.severity === "low").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["critical", "high", "medium", "low"] as AttackSeverity[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(filterSeverity === s ? "ALL" : s)}
            className={`rounded-xl p-4 border text-left transition-all card-hover ${
              filterSeverity === s ? "border-primary/50 bg-primary/5" : "border-border gradient-card"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${severityConfig[s].dot} mb-2`} />
            <div className="text-xl font-bold">{counts[s]}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{severityConfig[s].label}</div>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Icon name="ShieldCheck" size={12} className="text-green-400" />
          Купол использовался: <span className="text-green-400 font-medium">{attacks.filter((a) => a.shieldUsed).length} раз</span>
        </span>
        <span className="text-border">|</span>
        <span>Показано: <span className="text-foreground font-medium">{filtered.length}</span> из {attacks.length}</span>
      </div>

      {/* Attack List */}
      <div className="space-y-2">
        {filtered.map((attack) => {
          const sev = severityConfig[attack.severity];
          const isExpanded = expanded === attack.id;
          return (
            <div
              key={attack.id}
              className={`rounded-xl border gradient-card overflow-hidden transition-all duration-300 ${
                attack.severity === "critical" ? "border-red-500/20" : "border-border"
              }`}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/20 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : attack.id)}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
                <span className="font-mono text-xs text-muted-foreground flex-shrink-0 w-20">{attack.id}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0 w-16">{attack.time}</span>
                <span className="font-medium text-sm flex-1">{attack.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${sev.color}`}>
                  {sev.label}
                </span>
                {attack.shieldUsed && (
                  <Icon name="Shield" size={13} className="text-green-400 flex-shrink-0" />
                )}
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${statusConfig[attack.status]}`}>
                  {statusLabel[attack.status]}
                </span>
                <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-muted-foreground flex-shrink-0" />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-border pt-3">
                  {[
                    { label: "Источник", value: attack.source, icon: "Globe" },
                    { label: "Цель", value: attack.target, icon: "Bot" },
                    { label: "IP-адресов", value: attack.ips.toLocaleString(), icon: "Network" },
                    { label: "Время реакции", value: attack.duration, icon: "Timer" },
                  ].map((d) => (
                    <div key={d.label} className="bg-secondary/40 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Icon name={d.icon} size={11} />
                        <span className="text-[10px]">{d.label}</span>
                      </div>
                      <div className="text-sm font-semibold font-mono">{d.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
