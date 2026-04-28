import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface RZEElement {
  id: string;
  name: string;
  symbol: string;
  color: string;
  cities: number;
  ratePerHour: number;
  stockpile: number;
  maxStock: number;
  trend: number;
}

const initialElements: RZEElement[] = [
  { id: "La", name: "Лантан", symbol: "La", color: "from-blue-500 to-cyan-400", cities: 2, ratePerHour: 48, stockpile: 1240, maxStock: 5000, trend: 12 },
  { id: "Ce", name: "Церий", symbol: "Ce", color: "from-purple-500 to-violet-400", cities: 2, ratePerHour: 36, stockpile: 890, maxStock: 5000, trend: 8 },
  { id: "Nd", name: "Неодим", symbol: "Nd", color: "from-pink-500 to-rose-400", cities: 2, ratePerHour: 22, stockpile: 540, maxStock: 3000, trend: -3 },
  { id: "Eu", name: "Европий", symbol: "Eu", color: "from-orange-500 to-amber-400", cities: 1, ratePerHour: 15, stockpile: 310, maxStock: 2000, trend: 5 },
  { id: "Gd", name: "Гадолиний", symbol: "Gd", color: "from-teal-500 to-emerald-400", cities: 1, ratePerHour: 8, stockpile: 120, maxStock: 2000, trend: 2 },
  { id: "Dy", name: "Диспрозий", symbol: "Dy", color: "from-indigo-500 to-blue-400", cities: 1, ratePerHour: 40, stockpile: 2100, maxStock: 5000, trend: 18 },
  { id: "Tb", name: "Тербий", symbol: "Tb", color: "from-green-500 to-lime-400", cities: 1, ratePerHour: 30, stockpile: 1550, maxStock: 4000, trend: 11 },
  { id: "Ho", name: "Гольмий", symbol: "Ho", color: "from-red-500 to-orange-400", cities: 1, ratePerHour: 25, stockpile: 980, maxStock: 3000, trend: 7 },
  { id: "Lu", name: "Лютеций", symbol: "Lu", color: "from-cyan-500 to-sky-400", cities: 1, ratePerHour: 55, stockpile: 3200, maxStock: 6000, trend: 22 },
  { id: "Yb", name: "Иттербий", symbol: "Yb", color: "from-violet-500 to-purple-400", cities: 1, ratePerHour: 48, stockpile: 2700, maxStock: 6000, trend: 15 },
  { id: "Sm", name: "Самарий", symbol: "Sm", color: "from-yellow-500 to-amber-300", cities: 2, ratePerHour: 35, stockpile: 1100, maxStock: 4000, trend: 9 },
];

const historyHours = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"];
const historyData = [120, 158, 203, 187, 241, 275, 320];

export default function REE() {
  const [elements, setElements] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [totalCollected, setTotalCollected] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setElements((prev) =>
        prev.map((el) => {
          const gain = Math.floor(el.ratePerHour / 3600 * 2 * (0.8 + Math.random() * 0.4));
          return {
            ...el,
            stockpile: Math.min(el.maxStock, el.stockpile + gain),
            ratePerHour: Math.max(1, el.ratePerHour + Math.floor((Math.random() - 0.5) * 3)),
          };
        })
      );
      setTotalCollected((n) => n + Math.floor(Math.random() * 5 + 2));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const totalRate = elements.reduce((a, e) => a + e.ratePerHour, 0);
  const totalStock = elements.reduce((a, e) => a + e.stockpile, 0);
  const maxTotalStock = elements.reduce((a, e) => a + e.maxStock, 0);
  const selected = elements.find((e) => e.id === selectedElement);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Элементов добывается", value: elements.length, icon: "Gem", color: "text-cyan-400" },
          { label: "Суммарно / час", value: `${totalRate.toLocaleString()}`, icon: "Zap", color: "text-yellow-400" },
          { label: "Запас РЗЭ", value: `${Math.round((totalStock / maxTotalStock) * 100)}%`, icon: "Database", color: "text-purple-400" },
          { label: "Добыто за сессию", value: `${(totalCollected + 14820).toLocaleString()}`, icon: "TrendingUp", color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border gradient-card p-4 flex items-center gap-3 card-hover">
            <Icon name={s.icon} size={20} className={s.color} />
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Selected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly chart */}
        <div className="lg:col-span-2 rounded-xl border border-border gradient-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Добыча РЗЭ по часам (ед.)</h3>
            <span className="flex items-center gap-1.5 text-[10px] text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
              live
            </span>
          </div>
          <div className="flex items-end gap-3 h-36">
            {historyData.map((val, i) => {
              const max = Math.max(...historyData);
              const pct = (val / max) * 100;
              const isLast = i === historyData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${isLast ? "glow-cyan" : ""}`}
                    style={{ height: `${pct}%`, minHeight: 6 }}
                  >
                    <div className={`w-full h-full rounded-t-md bg-gradient-to-t ${isLast ? "from-cyan-500 to-cyan-300" : "from-purple-500/60 to-cyan-500/60"}`} />
                  </div>
                  <div className="text-[9px] text-muted-foreground">{historyHours[i]}</div>
                  {isLast && <div className="text-[9px] text-cyan-400 font-medium">{val}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected element detail */}
        <div className="rounded-xl border border-border gradient-card p-5">
          <h3 className="font-semibold text-sm mb-3">Детали элемента</h3>
          {selected ? (
            <div className="space-y-3">
              <div className={`rounded-xl p-4 bg-gradient-to-br ${selected.color} bg-opacity-10 flex items-center gap-3`}>
                <div className="w-12 h-12 rounded-xl bg-black/30 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold text-white">{selected.symbol}</div>
                  <div className="text-[8px] text-white/70">РЗЭ</div>
                </div>
                <div>
                  <div className="text-white font-bold">{selected.name}</div>
                  <div className="text-white/70 text-xs">{selected.cities} город(а)</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Скорость добычи</span>
                  <span className="text-cyan-400 font-medium">{selected.ratePerHour}/ч</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Запас</span>
                  <span className="text-foreground">{selected.stockpile.toLocaleString()} / {selected.maxStock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Прирост за 24ч</span>
                  <span className="text-green-400">+{(selected.ratePerHour * 24).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground mb-1">Заполненность склада</div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${selected.color} transition-all duration-700`}
                    style={{ width: `${(selected.stockpile / selected.maxStock) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Icon name="Gem" size={24} className="mb-2 opacity-30" />
              <span className="text-xs">Выберите элемент</span>
            </div>
          )}
        </div>
      </div>

      {/* Element Grid */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Все добываемые элементы</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {elements.map((el) => {
            const stockPct = (el.stockpile / el.maxStock) * 100;
            const isSelected = selectedElement === el.id;
            return (
              <button
                key={el.id}
                onClick={() => setSelectedElement(isSelected ? null : el.id)}
                className={`rounded-xl border p-4 text-left transition-all duration-200 card-hover ${
                  isSelected ? "border-primary/50 bg-primary/5 glow-purple" : "border-border gradient-card"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${el.color} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{el.symbol}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${el.trend > 0 ? "text-green-400" : "text-red-400"}`}>
                    {el.trend > 0 ? "↑" : "↓"} {Math.abs(el.trend)}%
                  </span>
                </div>
                <div className="text-sm font-semibold mb-0.5">{el.name}</div>
                <div className="text-xs text-cyan-400 mb-2">+{el.ratePerHour}/ч</div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${el.color} transition-all duration-700`}
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {el.stockpile.toLocaleString()} / {el.maxStock.toLocaleString()} ед.
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
