import { useEffect, useMemo, useRef, useState } from "react";
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
  return sliceGeometry(index, total);
}

function truncate(label: string) {
  return label.length > 22 ? `${label.slice(0, 21)}…` : label;
}

function sliceGeometry(index: number, total: number) {
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
  const timer = useRef<number | null>(null);
  const total = Math.max(slices.length, 1);
  const step = 360 / total;

  const paths = useMemo(
    () => slices.map((_, i) => slicePath(i, total)),
    [slices, total],
  );

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const spin = () => {
    if (spinning || disabled || !slices.length) return;
    const target = Math.floor(Math.random() * slices.length);
    // Pointer sits at top (0deg). Land the middle of the target slice there.
    const base = 360 * 5 + (360 - (target * step + step / 2));
    const next = rotation + base + (360 - (rotation % 360));
    setSpinning(true);
    setRotation(next);
    timer.current = window.setTimeout(() => {
      setSpinning(false);
      const slice = slices[target];
      if (slice) onResult(slice.id);
    }, 3300);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative aspect-square w-full max-w-[300px]">
        {/* static glow, kept off the animated layer */}
        <div
          className="pointer-events-none absolute inset-2 rounded-full"
          style={{
            boxShadow:
              "0 0 34px color-mix(in oklch, var(--primary) 32%, transparent), 0 0 0 1px color-mix(in oklch, var(--primary) 25%, transparent)",
          }}
          aria-hidden
        />
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="size-0 border-x-[9px] border-t-[16px] border-x-transparent border-t-accent" />
        </div>
        <div
          className="size-full"
          style={{
            transform: `rotate(${rotation}deg) translateZ(0)`,
            transition: "transform 3.2s cubic-bezier(0.16, 0.84, 0.12, 1)",
            willChange: spinning ? "transform" : "auto",
            backfaceVisibility: "hidden",
          }}
        >
        <svg viewBox="0 0 100 100" className="size-full" shapeRendering="geometricPrecision" aria-hidden>
          <circle cx="50" cy="50" r="49.5" fill="var(--card)" />
          {slices.map((slice, i) => (
            <path
              key={slice.id}
              d={paths[i]}
              fill={SLICE_FILLS[i % 2] ?? "var(--card)"}
              stroke="var(--border)"
              strokeWidth="0.4"
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="var(--background)" stroke="var(--primary)" strokeWidth="1" />
          {/* labels painted last so no neighbouring slice can cover them */}
          {slices.map((slice, i) => (
            <text
              key={`label-${slice.id}`}
              x="46"
              y="50.9"
              fontSize="3.1"
              fontWeight="700"
              fill={i % 2 === 0 ? "var(--primary-foreground)" : "var(--foreground)"}
              transform={`rotate(${i * step + step / 2 - 90} 50 50)`}
              textAnchor="end"
              textLength={Math.min(slice.label.length * 1.7, 33)}
              lengthAdjust="spacingAndGlyphs"
            >
              {truncate(slice.label)}
            </text>
          ))}
        </svg>
        </div>
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
