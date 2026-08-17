import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Camera, EyeOff, Flag, Flame, Plus, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AdventureForm } from "@/components/AdventureForm";
import { SpinWheel } from "@/components/SpinWheel";
import {
  COST_LABEL,
  DISTANCE_LABEL,
  SAFETY_LABEL,
  type Adventure,
  type Cost,
  type Distance,
} from "@/lib/adventures";
import { useDriftStore, type Completion } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Drift — random mini-adventures within 3 blocks" },
      {
        name: "description",
        content:
          "Spin the wheel for a free or under-$5 micro-adventure near you and snap photo proof.",
      },
      { property: "og:title", content: "Drift — random mini-adventures within 3 blocks" },
      {
        property: "og:description",
        content: "Spin, snap. Low-cost spontaneous adventures a few blocks from home.",
      },
    ],
  }),
  component: Index,
});

const AGE_BANDS = [13, 16, 18] as const;
const TIME_OPTIONS = [15, 30, 60] as const;

function isNight() {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}

function Index() {
  const store = useDriftStore();
  const [maxMinutes, setMaxMinutes] = useState<15 | 30 | 60>(30);
  const [maxCost, setMaxCost] = useState<Cost>(1);
  const [maxDistance, setMaxDistance] = useState<Distance>("3blocks");
  const [current, setCurrent] = useState<Adventure | null>(null);
  const [round, setRound] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [proofFor, setProofFor] = useState<Adventure | null>(null);

  const night = isNight();
  const distanceRank: Record<Distance, number> = { block: 0, "3blocks": 1, walk: 2 };

  const pool = useMemo(
    () =>
      store.visible.filter(
        (adv) =>
          adv.minutes <= maxMinutes &&
          adv.cost <= maxCost &&
          distanceRank[adv.distance] <= distanceRank[maxDistance] &&
          adv.minAge <= store.profile.ageBand &&
          !(night && adv.daylightOnly) &&
          !(night && store.profile.ageBand < 16),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.visible, maxMinutes, maxCost, maxDistance, store.profile.ageBand, night],
  );

  const slices = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
    return shuffled.map((adv) => ({ id: adv.id, label: adv.title }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, round]);

  const handleResult = (id: string) => {
    setCurrent(pool.find((adv) => adv.id === id) ?? null);
  };

  const reshuffle = () => {
    setCurrent(null);
    setRound((r) => r + 1);
  };

  const nightBlocked = night && store.profile.ageBand < 16;

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-24 pt-10">
      <Toaster />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Drift</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight">
            Escape your routine
            <br />
            in 15 minutes.
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Tiny, cheap, nearby adventures. Spin one, do it, snap proof.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">
            <Flame className="size-4 text-accent" />
            {store.streak} day streak
          </div>
          {store.hidden.length > 0 && (
            <Button variant="outline" size="sm" onClick={store.unhideAll}>
              <Undo2 className="size-4" /> Unhide {store.hidden.length}
            </Button>
          )}
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="size-4" /> Add your own
          </Button>
        </div>
      </header>

      <Tabs defaultValue="spin" className="mt-8">
        <TabsList className="w-full">
          <TabsTrigger value="spin" className="flex-1">
            Spin
          </TabsTrigger>
          <TabsTrigger value="log" className="flex-1">
            My log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spin" className="mt-6 space-y-6">
          <section className="rounded-3xl border border-border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <FilterRow label="Time">
                {TIME_OPTIONS.map((m) => (
                  <Chip key={m} active={maxMinutes === m} onClick={() => setMaxMinutes(m)}>
                    {m === 60 ? "1 hr" : `${m}m`}
                  </Chip>
                ))}
              </FilterRow>
              <FilterRow label="Budget">
                {([0, 1, 2] as Cost[]).map((c) => (
                  <Chip key={c} active={maxCost === c} onClick={() => setMaxCost(c)}>
                    {COST_LABEL[c]}
                  </Chip>
                ))}
              </FilterRow>
              <FilterRow label="Distance">
                {(["block", "3blocks", "walk"] as Distance[]).map((d) => (
                  <Chip key={d} active={maxDistance === d} onClick={() => setMaxDistance(d)}>
                    {DISTANCE_LABEL[d]}
                  </Chip>
                ))}
              </FilterRow>
            </div>

            <FilterRow label="I am" className="mt-4">
              {AGE_BANDS.map((band) => (
                <Chip
                  key={band}
                  active={store.profile.ageBand === band}
                  onClick={() => store.setProfile({ ageBand: band })}
                >
                  {band === 18 ? "18+" : `${band}–${band + 2}`}
                </Chip>
              ))}
            </FilterRow>

            {nightBlocked && (
              <p className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
                It&apos;s after dark. Outdoor prompts are paused for under-16s — come back in the
                morning, or try again tomorrow.
              </p>
            )}

            <div className="mt-6">
              <SpinWheel
                slices={slices}
                disabled={nightBlocked || !slices.length}
                onResult={handleResult}
              />
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              {pool.length} hidden adventures match your filters — spin to reveal one
            </p>
          </section>

          {current && (
            <section className="glow-card rounded-3xl border border-primary/40 bg-card p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{current.minutes === 60 ? "1 hr" : `${current.minutes} min`}</Badge>
                <Badge variant="secondary">{COST_LABEL[current.cost]}</Badge>
                <Badge variant="secondary">{DISTANCE_LABEL[current.distance]}</Badge>
                <Badge variant="outline">{SAFETY_LABEL[current.safety]}</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-bold">{current.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{current.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button onClick={() => setProofFor(current)}>
                  <Camera className="size-4" /> Mark complete
                </Button>
                <Button variant="outline" onClick={reshuffle}>
                  <Undo2 className="size-4" /> Reshuffle wheel
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    store.hide(current.id);
                    setCurrent(null);
                    toast("Hidden — you won't see that one again.");
                  }}
                >
                  <EyeOff className="size-4" /> Not for me
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    store.flag(current.id);
                    toast("Flagged for review. Thanks for looking out.");
                  }}
                >
                  <Flag className="size-4" /> Flag
                </Button>
              </div>
            </section>
          )}

        </TabsContent>


        <TabsContent value="log" className="mt-6 space-y-3">
          {store.completions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nothing completed yet. Spin something and bring back proof.
            </p>
          ) : (
            store.completions.map((c) => (
              <article key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                {c.photo && (
                  <img src={c.photo} alt={`Proof for ${c.title}`} className="h-48 w-full object-cover" />
                )}
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.at).toLocaleString()}
                    </p>
                    {c.note && <p className="mt-2 text-sm">{c.note}</p>}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete entry"
                    onClick={() => store.removeCompletion(c.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New adventure</DialogTitle>
          </DialogHeader>
          <AdventureForm
            initial={null}
            onCancel={() => setFormOpen(false)}
            onSave={(adv) => {
              store.saveAdventure(adv);
              setFormOpen(false);
              toast.success("Adventure added to the wheel.");
            }}
          />
        </DialogContent>
      </Dialog>

      <ProofDialog
        adventure={proofFor}
        onClose={() => setProofFor(null)}
        onSave={(completion) => {
          store.complete(completion);
          setProofFor(null);
          setCurrent(null);
          toast.success("Logged! Streak keeps rolling.");
        }}
      />
    </main>
  );
}

function FilterRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "text-muted-foreground hover:border-primary/60",
      )}
    >
      {children}
    </button>
  );
}

function ProofDialog({
  adventure,
  onClose,
  onSave,
}: {
  adventure: Adventure | null;
  onClose: () => void;
  onSave: (c: Completion) => void;
}) {
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <Dialog
      open={Boolean(adventure)}
      onOpenChange={(open) => {
        if (!open) {
          setNote("");
          setPhoto(undefined);
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proof of completion</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{adventure?.title}</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />

        {photo ? (
          <img src={photo} alt="Your proof" className="max-h-64 w-full rounded-xl object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary"
          >
            <Camera className="size-6" />
            Snap or upload proof
          </button>
        )}

        <Textarea
          rows={2}
          value={note}
          placeholder="How did it go?"
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          onClick={() => {
            if (!adventure) return;
            onSave({
              id: `k${Date.now()}`,
              adventureId: adventure.id,
              title: adventure.title,
              note: note.trim(),
              ...(photo ? { photo } : {}),
              at: new Date().toISOString(),
            });
            setNote("");
            setPhoto(undefined);
          }}
        >
          Save to my log
        </Button>
      </DialogContent>
    </Dialog>
  );
}
