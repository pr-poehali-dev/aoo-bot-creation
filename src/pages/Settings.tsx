import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
        enabled ? "gradient-primary glow-purple" : "bg-secondary border border-border"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          enabled ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    autoShield: true,
    alertLevel: "2",
    notifications: true,
    soundAlerts: false,
    autoRestart: true,
    ddosProtection: true,
    bruteForce: true,
    portScan: false,
    logRetention: "30",
    updateInterval: "2",
    maxBots: "300",
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  const update = (key: keyof typeof settings, val: string) => {
    setSettings((s) => ({ ...s, [key]: val }));
  };

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      {/* Dome / Shield */}
      <div className="rounded-xl border border-border gradient-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Shield" size={16} className="text-primary" />
          <h3 className="font-semibold text-sm">Управление куполом</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Автоматическая активация купола</div>
              <div className="text-xs text-muted-foreground mt-0.5">Купол включается при обнаружении нападения</div>
            </div>
            <Toggle enabled={settings.autoShield as unknown as boolean} onChange={() => toggle("autoShield")} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <div className="text-sm font-medium">Минимальный уровень угрозы</div>
              <div className="text-xs text-muted-foreground mt-0.5">Купол активируется при угрозе этого уровня и выше</div>
            </div>
            <select
              value={settings.alertLevel}
              onChange={(e) => update("alertLevel", e.target.value)}
              className="bg-secondary border border-border text-foreground text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="1">Уровень 1 (любая)</option>
              <option value="2">Уровень 2 (средняя+)</option>
              <option value="3">Уровень 3 (высокая+)</option>
              <option value="4">Уровень 4 (критическая)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threats */}
      <div className="rounded-xl border border-border gradient-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="AlertOctagon" size={16} className="text-red-400" />
          <h3 className="font-semibold text-sm">Типы угроз для мониторинга</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: "ddosProtection", label: "DDoS-атаки", desc: "Флуд и перегрузка соединений" },
            { key: "bruteForce", label: "Брутфорс", desc: "Перебор паролей и ключей" },
            { key: "portScan", label: "Сканирование портов", desc: "Разведка открытых портов" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <Toggle
                enabled={settings[item.key as keyof typeof settings] as unknown as boolean}
                onChange={() => toggle(item.key as keyof typeof settings)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border gradient-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Bell" size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-sm">Уведомления</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Push-уведомления</div>
              <div className="text-xs text-muted-foreground">Получать уведомления об атаках</div>
            </div>
            <Toggle enabled={settings.notifications as unknown as boolean} onChange={() => toggle("notifications")} />
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border pt-4">
            <div>
              <div className="text-sm font-medium">Звуковые сигналы</div>
              <div className="text-xs text-muted-foreground">Звук при критических угрозах</div>
            </div>
            <Toggle enabled={settings.soundAlerts as unknown as boolean} onChange={() => toggle("soundAlerts")} />
          </div>
        </div>
      </div>

      {/* System */}
      <div className="rounded-xl border border-border gradient-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Server" size={16} className="text-purple-400" />
          <h3 className="font-semibold text-sm">Параметры системы</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "updateInterval", label: "Интервал обновления (сек)", min: 1, max: 60 },
            { key: "logRetention", label: "Хранить логи (дней)", min: 7, max: 365 },
            { key: "maxBots", label: "Максимум ботов", min: 10, max: 1000 },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type="number"
                min={f.min}
                max={f.max}
                value={settings[f.key as keyof typeof settings] as string}
                onChange={(e) => update(f.key as keyof typeof settings, e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
          <div>
            <div className="text-sm font-medium">Автоперезапуск ботов</div>
            <div className="text-xs text-muted-foreground">При сбое — перезапускать автоматически</div>
          </div>
          <Toggle enabled={settings.autoRestart as unknown as boolean} onChange={() => toggle("autoRestart")} />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded-lg text-sm text-muted-foreground bg-secondary hover:text-foreground transition-colors">
          Сбросить
        </button>
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            saved ? "bg-green-500 text-white glow-green" : "gradient-primary text-white glow-purple hover:opacity-90"
          }`}
        >
          <Icon name={saved ? "Check" : "Save"} size={14} />
          {saved ? "Сохранено!" : "Сохранить настройки"}
        </button>
      </div>
    </div>
  );
}
