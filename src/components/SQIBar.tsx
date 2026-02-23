import { sqiBarColor, sqiColorClass, sqiLabel } from "../utils/helpers";

interface SQIBarProps {
  value: number;
  showLabel?: boolean;
  height?: string;
  width?: string;
  animate?: boolean;
}

export function SQIBar({
  value,
  showLabel = false,
  height = "h-1.5",
  width = "w-full",
  animate = true,
}: SQIBarProps) {
  const color = sqiBarColor(value);

  return (
    <div className={`${width} relative`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span
            className={`font-mono-dm font-bold text-base ${sqiColorClass(value)}`}
          >
            {value}
          </span>
          <span className="text-xs text-ink-100">{sqiLabel(value)}</span>
        </div>
      )}
      <div className={`${height} bg-cream rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full ${animate ? "transition-all duration-1000 ease-out" : ""}`}
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "ember" | "cobalt" | "sage" | "gold";
  sqi?: number;
}

export function MetricCard({
  label,
  value,
  sub,
  accent = "ember",
  sqi,
}: MetricCardProps) {
  const accentColors = {
    ember: "border-t-ember",
    cobalt: "border-t-cobalt",
    sage: "border-t-sage",
    gold: "border-t-gold",
  };

  return (
    <div
      className={`card p-6 border-t-2 ${accentColors[accent]} animate-fade-in`}
    >
      <p className="card-title mb-3">{label}</p>
      <div
        className={`font-display text-4xl tracking-tight ${sqi !== undefined ? sqiColorClass(sqi) : "text-ink"}`}
      >
        {value}
      </div>
      {sub && <p className="text-xs text-ink-100 mt-1">{sub}</p>}
      {sqi !== undefined && <SQIBar value={sqi} height="h-1" width="w-full" />}
    </div>
  );
}
