/**
 * Storage abstraction.
 *
 * Check-ins are saved to the server API first, with localStorage as fallback.
 * Profile and spoon data use the API directly.
 * Moods use localStorage (UI-only state).
 */

export interface CheckInEntry {
  energy: string;
  mood: string;
  symptoms: string[];
  notes: string;
  date: string;
}

const KEYS = {
  CHECK_INS: "cycleSync_checkIns",
  MOODS: "cycleSync_dashboardMoods",
  PROFILE_ID: "cycleSync_profileId",
  USER_NAME: "cycleSync_userName",
} as const;

export function getProfileId(): string | null {
  return localStorage.getItem(KEYS.PROFILE_ID);
}

export function getUserName(): string {
  return localStorage.getItem(KEYS.USER_NAME) || "friend";
}

export async function saveCheckIn(entry: Omit<CheckInEntry, "date">): Promise<CheckInEntry> {
  try {
    const res = await fetch("/api/check-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      const saved = await res.json();
      return { ...entry, date: saved.createdAt || new Date().toISOString() };
    }
  } catch {
    // fall through to localStorage fallback
  }
  // localStorage fallback for offline/demo
  const dated: CheckInEntry = { ...entry, date: new Date().toISOString() };
  const history = await loadCheckInHistory();
  history.unshift(dated);
  localStorage.setItem(KEYS.CHECK_INS, JSON.stringify(history));
  return dated;
}

export async function loadLatestCheckIn(): Promise<CheckInEntry | null> {
  try {
    const res = await fetch("/api/check-ins/latest");
    if (res.ok) {
      const data = await res.json();
      if (data) return { ...data, date: data.createdAt };
    }
  } catch {
    // fall through to localStorage fallback
  }
  const history = await loadCheckInHistory();
  return history.length > 0 ? history[0] : null;
}

export async function loadCheckInHistory(): Promise<CheckInEntry[]> {
  try {
    const res = await fetch("/api/check-ins?limit=30");
    if (res.ok) {
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((d: any) => ({ ...d, date: d.createdAt }));
    }
  } catch {
    // fall through to localStorage fallback
  }
  try {
    const raw = localStorage.getItem(KEYS.CHECK_INS);
    if (!raw) return [];
    return JSON.parse(raw) as CheckInEntry[];
  } catch {
    return [];
  }
}

export async function loadProfile(): Promise<{ name: string; lastPeriodStart: string | null; cycleLength: number } | null> {
  const profileId = getProfileId();
  if (!profileId) return null;
  try {
    const response = await fetch(`/api/profile/${profileId}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function loadTodaySpoons(): Promise<{ totalSpoons: number; usedSpoons: number; note?: string | null } | null> {
  try {
    const response = await fetch(`/api/spoon-entries/today?userId=demo-user`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function saveMoods(moods: string[]): Promise<void> {
  localStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
}

export async function loadMoods(): Promise<string[]> {
  try {
    const raw = localStorage.getItem(KEYS.MOODS);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
