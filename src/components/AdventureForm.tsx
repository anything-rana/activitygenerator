import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_TAGS, COST_LABEL, DISTANCE_LABEL, SAFETY_LABEL, type Adventure } from "@/lib/adventures";
import { cn } from "@/lib/utils";

type Props = {
  initial?: Adventure | null;
  onSave: (adv: Adventure) => void;
  onCancel: () => void;
};

export function AdventureForm({ initial, onSave, onCancel }: Props) {
  const [draft, setDraft] = useState<Adventure>(
    initial ?? {
      id: `c${Date.now()}`,
      title: "",
      description: "",
      tags: [],
      safety: 1,
      cost: 0,
      minAge: 13,
      minutes: 30,
      distance: "3blocks",
      daylightOnly: false,
      custom: true,
    },
  );

  const set = <K extends keyof Adventure>(key: K, value: Adventure[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleTag = (tag: string) =>
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(tag) ? d.tags.filter((t) => t !== tag) : [...d.tags, tag],
    }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim() || !draft.description.trim()) return;
        onSave({ ...draft, title: draft.title.trim(), description: draft.description.trim() });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={draft.title}
          placeholder="Find the loudest bird on your block"
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={draft.description}
          placeholder="What exactly should someone do? Keep it under a minute to read."
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Time</Label>
          <Select
            value={String(draft.minutes)}
            onValueChange={(v) => set("minutes", Number(v) as Adventure["minutes"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 min</SelectItem>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Budget</Label>
          <Select value={String(draft.cost)} onValueChange={(v) => set("cost", Number(v) as Adventure["cost"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COST_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Radius</Label>
          <Select
            value={draft.distance}
            onValueChange={(v) => set("distance", v as Adventure["distance"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DISTANCE_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum age</Label>
          <Select
            value={String(draft.minAge)}
            onValueChange={(v) => set("minAge", Number(v) as Adventure["minAge"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="13">13+</SelectItem>
              <SelectItem value="16">16+</SelectItem>
              <SelectItem value="18">18+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Safety rating</Label>
        <Select
          value={String(draft.safety)}
          onValueChange={(v) => set("safety", Number(v) as Adventure["safety"])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SAFETY_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-xs font-semibold transition-colors",
                draft.tags.includes(tag)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:border-primary/60",
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Daylight only</p>
          <p className="text-xs text-muted-foreground">Hide this after dark</p>
        </div>
        <Switch
          checked={draft.daylightOnly}
          onCheckedChange={(v) => set("daylightOnly", v)}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1">
          {initial ? "Save changes" : "Add adventure"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}