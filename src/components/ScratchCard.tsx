import { useEffect, useRef, useState } from "react";
import type { Adventure } from "@/lib/adventures";

type Props = {
  adventure: Adventure;
  revealed: boolean;
  onReveal: () => void;
};

export function ScratchCard({ adventure, revealed, onReveal }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratching, setScratching] = useState(false);
  const [done, setDone] = useState(revealed);

  useEffect(() => setDone(revealed), [revealed]);

  useEffect(() => {
    if (done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#2b2f3d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < 120; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 8, 8);
    }
  }, [done]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 26, 0, Math.PI * 2);
    ctx.fill();

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    for (let i = 3; i < data.length; i += 40) if (data[i] === 0) clear++;
    if (clear / (data.length / 40) > 0.45) {
      setDone(true);
      onReveal();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Today&apos;s scratch card
      </p>
      <h3 className="mt-2 text-xl font-bold">{adventure.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{adventure.description}</p>
      {!done && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={(e) => {
            setScratching(true);
            scratch(e.clientX, e.clientY);
          }}
          onPointerUp={() => setScratching(false)}
          onPointerLeave={() => setScratching(false)}
          onPointerMove={(e) => scratching && scratch(e.clientX, e.clientY)}
        />
      )}
      {!done && (
        <span className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm font-semibold text-primary">
          Scratch to reveal
        </span>
      )}
    </div>
  );
}