import { useCallback, useEffect, useState } from "react";
import { SEED_ADVENTURES, type Adventure } from "./adventures";

export type Completion = {
  id: string;
  adventureId: string;
  title: string;
  note: string;
  photo?: string;
  at: string;
};

export type Profile = {
  ageBand: 13 | 16 | 18;
};

const KEYS = {
  custom: "dz.custom",
  hidden: "dz.hidden",
  completions: "dz.completions",
  profile: "dz.profile",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, fallback));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage full or unavailable */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function useDriftStore() {
  const [custom, setCustom, hydrated] = usePersisted<Adventure[]>(KEYS.custom, []);
  const [hidden, setHidden] = usePersisted<string[]>(KEYS.hidden, []);
  const [completions, setCompletions] = usePersisted<Completion[]>(KEYS.completions, []);
  const [profile, setProfile] = usePersisted<Profile>(KEYS.profile, { ageBand: 16 });
  const [scratch, setScratch] = usePersisted<ScratchState | null>(KEYS.scratch, null);

  const all = [...custom, ...SEED_ADVENTURES];
  const visible = all.filter((adv) => !hidden.includes(adv.id));

  const saveAdventure = (adv: Adventure) =>
    setCustom((prev) => {
      const exists = prev.some((p) => p.id === adv.id);
      return exists ? prev.map((p) => (p.id === adv.id ? adv : p)) : [{ ...adv, custom: true }, ...prev];
    });

  const deleteAdventure = (id: string) => setCustom((prev) => prev.filter((p) => p.id !== id));

  const hide = (id: string) => setHidden((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const unhideAll = () => setHidden([]);

  const flag = (id: string) =>
    setCustom((prev) => prev.map((p) => (p.id === id ? { ...p, flagged: true } : p)));

  const complete = (c: Completion) => setCompletions((prev) => [c, ...prev]);
  const removeCompletion = (id: string) =>
    setCompletions((prev) => prev.filter((c) => c.id !== id));

  const streak = computeStreak(completions);

  return {
    hydrated,
    custom,
    hidden,
    all,
    visible,
    completions,
    profile,
    scratch,
    streak,
    setProfile,
    setScratch,
    saveAdventure,
    deleteAdventure,
    hide,
    unhideAll,
    flag,
    complete,
    removeCompletion,
  };
}

function computeStreak(completions: Completion[]) {
  const days = new Set(completions.map((c) => c.at.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}