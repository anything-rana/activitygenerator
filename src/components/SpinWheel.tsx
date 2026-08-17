import { useState } from "react";
import { cn } from "@/lib/utils";

export type WheelSlice = { id: string; label: string };

const SLICE_FILLS = [
  "var(--primary)",
  "var(--card)",
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function slicePath(index: number, total: number) {
  const step = 360 / total;
  const start = index * step;
  const end = start + step;
  const s = polar(50, 50, 49, start);
  const e = polar(50, 50, 49, end);
  const large = step > 180 ? 1 : 0;
  return `M50,50 L${s.x},${s.y} A49,49 0 ${large} 1 ${e.x},${e.y} Z`;
}

export function SpinWheel({
  slices,
  disabled,
  onResult,
}: {
  slices: WheelSlice[];
  disabled?: boolean;
  onResult: (id: string) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const total = Math.max(slices.length, 1);
  const step = 360 / total;

  const spin = () => {
    if (spinning || disabled || !slices.length) return;
    const target = Math.floor(Math.random() * slices.length);
    // Pointer sits at top (0deg). Land the middle of the target slice there.
    const base = 360 * 5 + (360 - (target * step + step / 2));
    const next = rotation + base + (360 - (rotation % 360));
    setSpinning(true);
    setRotation(next);
    window.setTimeout(() => {
      setSpinning(false);
      const slice = slices[target];
      if (slice) onResult(slice.id);
    }, 3600);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative aspect-square w-full max-w-[300px]">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="size-0 border-x-[9px] border-t-[16px] border-x-transparent border-t-accent" />
        </div>
        <svg
          viewBox="0 0 100 100"
          className="size-full"
          style={{
            filter: "drop-shadow(0 0 24px color-mix(in oklch, var(--primary) 35%, transparent))",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 3.5s cubic-bezier(0.12, 0.72, 0.06, 1)",
          }}
          aria-hidden
        >
          <circle cx="50" cy="50" r="49.5" fill="var(--card)" />
          {slices.map((slice, i) => (
            <g key={slice.id}>
              <path
                d={slicePath(i, total)}
                fill={SLICE_FILLS[i % 2] ?? "var(--card)"}
                stroke="var(--border)"
                strokeWidth="0.4"
              />
              <text
                x="45"
                y="50.4"
                fontSize="3.4"
                fontWeight="700"
                fill={i % 2 === 0 ? "var(--primary-foreground)" : "var(--foreground)"}
                transform={`rotate(${i * step + step / 2 - 90} 50 50)`}
                textAnchor="end"
              >
                {slice.label.length > 20 ? `${slice.label.slice(0, 19)}…` : slice.label}
              </text>
            </g>
          ))}
          <circle cx="50" cy="50" r="8" fill="var(--background)" stroke="var(--primary)" strokeWidth="1" />
        </svg>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={disabled || spinning || !slices.length}
        className={cn(
          "w-full rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-transform",
          "disabled:opacity-50",
          !disabled && !spinning && "hover:scale-[1.02] active:scale-[0.99]",
        )}
      >
        {spinning ? "Spinning…" : "Spin the wheel"}
      </button>
    </div>
  );
}
