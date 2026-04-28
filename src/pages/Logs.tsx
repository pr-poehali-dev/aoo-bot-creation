import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type LogLevel = "INFO" | "WARN" | "ERROR" | "SUCCESS";

interface LogEntry {
  id: number;
  time: string;
  level: LogLevel;
  bot: string;
  message: string;
}

const initialLogs: LogEntry[] = [
  { id: 1, time: "14:23:01", level: "SUCCESS", bot: "ScoutAlpha", message: "Купол активирован автоматически при обнаружении угрозы уровня 3" },
  { id: 2, time: "14:22:47", level: "ERROR", bot: "GuardBeta", message: "Атака отражена: DDoS-флуд из диапазона 192.168.x.x (3 IP)" },
  { id: 3, time: "14:22:31", level: "WARN", bot: "PatrolGamma", message: "Высокий пинг обнаружен: 89ms (порог: 80ms)" },
  { id: 4, time: "14:21:58", level: "INFO", bot: "SentryDelta", message: "Переход в режим ожидания. Нет активных задач" },
  { id: 5, time: "14:21:44", level: "SUCCESS", bot: "WatcherEta", message: "Задача #4821 выполнена успешно. Результат записан" },
  { id: 6, time: "14:21:12", level: "ERROR", bot: "GuardBeta", message: "Попытка несанкционированного доступа заблокирована [src: 77.88.55.11]" },
  { id: 7, time: "14:20:55", level: "INFO", bot: "RaidZeta", message: "Синхронизация конфигурации завершена (v2.4.1)" },
  { id: 8, time: "14:20:31", level: "WARN", bot: "ScoutAlpha", message: "CPU нагрузка превысила 80%: текущее значение 87%" },
  { id: 9, time: "14:19:48", level: "SUCCESS", bot: "PatrolGamma", message: "12 новых угроз идентифицировано и внесено в базу" },
  { id: 10, time: "14:19:22", level: "INFO", bot: "WatcherEta", message: "Подключение к серверу восстановлено после 3с паузы" },
];

const levelColors: Record<LogLevel, string> = {
  INFO: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  WARN: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  ERROR: "text-red-400 bg-red-400/10 border-red-400/20",
  SUCCESS: "text-green-400 bg-green-400/10 border-green-400/20",
};

const newMessages = [
  { level: "INFO" as LogLevel, bot: "ScoutAlpha", message: "Плановая проверка параметров завершена" },
  { level: "WARN" as LogLevel, bot: "RaidZeta", message: "Нестабильное соединение: 3 повтора" },
  { level: "ERROR" as LogLevel, bot: "GuardBeta", message: "Подозрительная активность в регионе US-East" },
  { level: "SUCCESS" as LogLevel, bot: "PatrolGamma", message: "Новая угроза добавлена в блокировку" },
];

export default function Logs() {
  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState<LogLevel | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(initialLogs.length + 1);

  useEffect(() => {
    const t = setInterval(() => {
      const template = newMessages[Math.floor(Math.random() * newMessages.length)];
      const now = new Date();
      const time = now.toTimeString().slice(0, 8);
      setLogs((prev) => [
        ...prev.slice(-50),
        { id: idRef.current++, time, ...template },
      ]);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const filtered = logs.filter((l) => {
    const matchLevel = filter === "ALL" || l.level === filter;
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.bot.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по логам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-1">
          {(["ALL", "INFO", "WARN", "ERROR", "SUCCESS"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === lvl
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAutoScroll(!autoScroll)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            autoScroll ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Icon name="ArrowDown" size={12} />
          Автопрокрутка
        </button>
        <button
          onClick={() => setLogs([])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground hover:text-red-400 transition-colors"
        >
          <Icon name="Trash2" size={12} />
          Очистить
        </button>
      </div>

      {/* Log terminal */}
      <div className="rounded-xl border border-border bg-[hsl(220_20%_5%)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-secondary/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">system.log — {filtered.length} записей</span>
          <span className="ml-auto flex items-center gap-1 text-[10px] text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
            live
          </span>
        </div>
        <div className="h-96 overflow-auto scrollbar-custom p-3 space-y-1 font-mono text-xs">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 py-1 px-2 rounded hover:bg-secondary/30 transition-colors"
            >
              <span className="text-muted-foreground/60 flex-shrink-0 w-16">{log.time}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold flex-shrink-0 w-14 text-center ${levelColors[log.level]}`}>
                {log.level}
              </span>
              <span className="text-purple-400 flex-shrink-0 w-24 truncate">[{log.bot}]</span>
              <span className="text-foreground/80 leading-relaxed">{log.message}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
