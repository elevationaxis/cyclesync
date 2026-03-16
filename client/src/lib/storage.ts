/**
 * Demo-mode storage abstraction.
 *
 * Every read/write in the app goes through this module.
 * Right now the backing store is localStorage.
 *
 * To upgrade to production:
 *   1. Replace each function body with a fetch() call to the real API.
 *   2. The async signatures stay the same — no component changes needed.
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
  const dated: CheckInEntry = { ...entry, date: new Date().toISOString() };
  const history = await loadCheckInHistory();
  history.unshift(dated);
  localStorage.setItem(KEYS.CHECK_INS, JSON.stringify(history));
  return dated;
}

export async function loadLatestCheckIn(): Promise<CheckInEntry | null> {
  const history = await loadCheckInHistory();
  return history.length > 0 ? history[0] : null;
}

export async function loadCheckInHistory(): Promise<CheckInEntry[]> {
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
