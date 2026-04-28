import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type CityStatus = "building" | "idle" | "max" | "paused";

interface BuildTask {
  building: string;
  from: number;
  to: number;
  timeLeft: number;
  total: number;
}

interface City {
  id: string;
  name: string;
  bot: string;
  region: string;
  level: number;
  status: CityStatus;
  queue: BuildTask[];
  rze: string[];
  rzeRate: number;
}

const initialCities: City[] = [
  {
    id: "C-001", name: "Аурелиум", bot: "ScoutAlpha", region: "EU-West", level: 14, status: "building",
    queue: [
      { building: "Шахта РЗЭ", from: 7, to: 8, timeLeft: 142, total: 300 },
      { building: "Завод переработки", from: 5, to: 6, timeLeft: 0, total: 480 },
      { building: "Казармы", from: 12, to: 13, timeLeft: 0, total: 620 },
    ],
    rze: ["Лантан", "Церий"], rzeRate: 48,
  },
  {
    id: "C-002", name: "Ксенония", bot: "GuardBeta", region: "US-East", level: 9, status: "building",
    queue: [
      { building: "Командный центр", from: 9, to: 10, timeLeft: 87, total: 200 },
      { building: "Шахта РЗЭ", from: 4, to: 5, timeLeft: 0, total: 360 },
    ],
    rze: ["Неодим", "Европий"], rzeRate: 22,
  },
  {
    id: "C-003", name: "Прометий", bot: "PatrolGamma", region: "AS-South", level: 20, status: "max",
    queue: [],
    rze: ["Диспрозий", "Тербий", "Гольмий"], rzeRate: 120,
  },
  {
    id: "C-004", name: "Иттербург", bot: "WatcherEta", region: "US-West", level: 17, status: "building",
    queue: [
      { building: "Шахта РЗЭ", from: 11, to: 12, timeLeft: 320, total: 800 },
      { building: "Стена", from: 17, to: 18, timeLeft: 0, total: 1200 },
      { building: "Лаборатория", from: 8, to: 9, timeLeft: 0, total: 540 },
    ],
    rze: ["Лютеций", "Иттербий"], rzeRate: 87,
  },
  {
    id: "C-005", name: "Гадолиния", bot: "RaidZeta", region: "EU-Central", level: 5, status: "paused",
    queue: [
      { building: "Ратуша", from: 5, to: 6, timeLeft: 60, total: 120 },
    ],
    rze: ["Гадолиний"], rzeRate: 8,
  },
  {
    id: "C-006", name: "Самарий", bot: "SentryDelta", region: "EU-North", level: 12, status: "idle",
    queue: [],
    rze: ["Самарий", "Неодим"], rzeRate: 35,
  },
];

const statusConfig: Record<CityStatus, { label: string; color: string; dot: string; icon: string }> = {
  building: { label: "Строится", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", dot: "bg-cyan-400", icon: "Hammer" },
  idle: { label: "Ожидание", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400", icon: "Clock" },
  max: { label: "Макс. уровень", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", dot: "bg-purple-400", icon: "Star" },
  paused: { label: "Пауза", color: "text-muted-foreground bg-secondary border-border", dot: "bg-muted-foreground", icon: "PauseCircle" },
};

function formatTime(sec: number) {
  if (sec <= 0) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

export default function Cities() {
  const [cities, setCities] = useState(initialCities);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [autoAll, setAutoAll] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setCities((prev) =>
        prev.map((city) => {
          if (city.status !== "building" || city.queue.length === 0) return city;
          const [first, ...rest] = city.queue;
          const newTime = first.timeLeft - 1;
          if (newTime <= 0) {
            const newQueue = rest.length > 0
              ? [{ ...rest[0], timeLeft: rest[0].total > 0 ? rest[0].total : Math.floor(Math.random() * 400 + 100) }, ...rest.slice(1)]
              : [];
            const newLevel = newQueue.length === 0 && rest.length === 0 ? Math.min(city.level + 1, 20) : city.level;
            const newStatus: CityStatus = newLevel >= 20 ? "max" : newQueue.length === 0 ? "idle" : "building";
            return { ...city, level: newLevel, queue: newQueue, status: newStatus };
          }
          return {
            ...city,
            queue: [{ ...first, timeLeft: newTime }, ...rest],
          };
        })
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const toggleCity = (id: string) => {
    setCities((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "paused" ? (c.queue.length > 0 ? "building" : "idle") : c.status === "idle" || c.status === "building" ? "paused" : c.status }
          : c
      )
    );
  };

  const toggleAll = () => {
    setAutoAll(!autoAll);
    setCities((prev) =>
      prev.map((c) =>
        c.status === "max" ? c : { ...c, status: !autoAll ? (c.queue.length > 0 ? "building" : "idle") : "paused" }
      )
    );
  };

  const totalLevel = cities.reduce((a, c) => a + c.level, 0);
  const maxLevel = cities.length * 20;
  const cityAt20 = cities.filter((c) => c.level >= 20).length;
  const building = cities.filter((c) => c.status === "building").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Всего городов", value: cities.length, icon: "Building2", color: "text-purple-400" },
          { label: "Уровень 20", value: cityAt20, icon: "Star", color: "text-yellow-400" },
          { label: "Строятся сейчас", value: building, icon: "Hammer", color: "text-cyan-400" },
          { label: "Общий прогресс", value: `${Math.round((totalLevel / maxLevel) * 100)}%`, icon: "TrendingUp", color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border gradient-card p-4 flex items-center gap-3">
            <Icon name={s.icon} size={20} className={s.color} />
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Global progress */}
      <div className="rounded-xl border border-border gradient-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Общий прогресс развития городов</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{totalLevel} / {maxLevel} уровней</span>
            <button
              onClick={toggleAll}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                autoAll ? "gradient-primary text-white glow-purple" : "bg-secondary text-muted-foreground"
              }`}
            >
              <Icon name={autoAll ? "Play" : "Pause"} size={11} />
              {autoAll ? "Авто: ВКЛ" : "Авто: ВЫКЛ"}
            </button>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-700"
            style={{ width: `${(totalLevel / maxLevel) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">Старт</span>
          <span className="text-[10px] text-muted-foreground">Уровень 20 × {cities.length}</span>
        </div>
      </div>

      {/* City Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cities.map((city) => {
          const cfg = statusConfig[city.status];
          const levelPct = (city.level / 20) * 100;
          const isSelected = selectedCity === city.id;
          const currentTask = city.queue[0];

          return (
            <div
              key={city.id}
              className={`rounded-xl border gradient-card overflow-hidden transition-all duration-300 card-hover ${
                city.status === "max" ? "border-purple-500/30" : "border-border"
              }`}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot} ${city.status === "building" ? "pulse-dot" : ""}`} />
                      <span className="font-semibold">{city.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{city.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Icon name="Bot" size={10} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{city.bot} · {city.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    {city.status !== "max" && (
                      <button
                        onClick={() => toggleCity(city.id)}
                        className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                      >
                        <Icon name={city.status === "paused" ? "Play" : "Pause"} size={12} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Level progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Уровень города</span>
                    <span className={`font-bold ${city.level >= 20 ? "text-gradient-primary" : "text-foreground"}`}>
                      {city.level} / 20
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        city.level >= 20 ? "gradient-primary" : "bg-gradient-to-r from-cyan-500 to-purple-500"
                      }`}
                      style={{ width: `${levelPct}%` }}
                    />
                  </div>
                </div>

                {/* RZE */}
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Gem" size={12} className="text-cyan-400" />
                  <div className="flex gap-1 flex-wrap">
                    {city.rze.map((r) => (
                      <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {r}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto text-xs text-cyan-400 font-medium">+{city.rzeRate}/ч</span>
                </div>

                {/* Current task */}
                {currentTask && (
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Icon name="Hammer" size={11} className="text-cyan-400" />
                        <span className="font-medium">{currentTask.building}</span>
                        <span className="text-muted-foreground">ур. {currentTask.from} → {currentTask.to}</span>
                      </div>
                      <span className="text-cyan-400 font-mono font-medium">{formatTime(currentTask.timeLeft)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-1000"
                        style={{ width: `${Math.max(0, ((currentTask.total - currentTask.timeLeft) / currentTask.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Queue toggle */}
                {city.queue.length > 1 && (
                  <button
                    onClick={() => setSelectedCity(isSelected ? null : city.id)}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Icon name={isSelected ? "ChevronUp" : "ChevronDown"} size={12} />
                    Очередь: {city.queue.length - 1} задач
                  </button>
                )}

                {/* Queue expanded */}
                {isSelected && city.queue.slice(1).map((task, i) => (
                  <div key={i} className="mt-1.5 px-3 py-2 rounded-lg bg-secondary/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="w-4 h-4 rounded bg-secondary flex items-center justify-center text-[9px]">{i + 2}</span>
                      <span>{task.building}</span>
                      <span className="text-muted-foreground/60">ур. {task.from} → {task.to}</span>
                    </div>
                    <span className="text-muted-foreground">{formatTime(task.total)}</span>
                  </div>
                ))}

                {city.level >= 20 && (
                  <div className="mt-2 text-center text-xs text-gradient-primary font-semibold py-1">
                    ✦ Максимальный уровень достигнут ✦
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
