import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getProfileId } from "@/lib/storage";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getPhaseForCycleLength } from "@/lib/cycleUtils";

// ── Phase config ─────────────────────────────────────────────────────────────
const PHASE_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    bg: string;
    text: string;
    light: string;
    todayFeelsLike: string;
    focus: string;
    do: string[];
    avoid: string[];
  }
> = {
  Flow: {
    name: "Flow",
    icon: "🌊",
    bg: "#8B4A6B",
    text: "#F7F2EB",
    light: "#8B4A6B22",
    todayFeelsLike: "Everything feels slower — and that's okay.",
    focus: "Rest and reset",
    do: ["Rest without guilt", "Keep things minimal"],
    avoid: ["Pushing productivity", "Overcommitting"],
  },
  Bloom: {
    name: "Bloom",
    icon: "🌱",
    bg: "#5B8A6B",
    text: "#F7F2EB",
    light: "#5B8A6B22",
    todayFeelsLike: "Things feel a little lighter and easier.",
    focus: "Start small, stay curious",
    do: ["Try something new", "Take light action"],
    avoid: ["Overloading your schedule", "Starting too many things"],
  },
  Spark: {
    name: "Spark",
    icon: "⚡",
    bg: "#C4846E",
    text: "#0D0B0A",
    light: "#C4846E22",
    todayFeelsLike: "You've got more energy and presence today.",
    focus: "Connect and express",
    do: ["Have important conversations", "Show up and engage"],
    avoid: ["Overextending", "Saying yes to everything"],
  },
  Recharge: {
    name: "Recharge",
    icon: "🔋",
    bg: "#7A6B8A",
    text: "#F7F2EB",
    light: "#7A6B8A22",
    todayFeelsLike: "Things might feel a little heavier today.",
    focus: "Simplify and protect your energy",
    do: ["Finish what matters", "Keep things simple"],
    avoid: ["Overcommitting", "Starting something new"],
  },
};

// Internal phase key → display name
function getDisplayPhase(
  date: Date,
  lastPeriodStart: string,
  cycleLength: number
): string | null {
  let start: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
    const [year, month, day] = lastPeriodStart.split("-").map(Number);
    start = new Date(year, month - 1, day);
  } else {
    start = new Date(lastPeriodStart);
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const daysSince = Math.floor(
    (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dayInCycle = ((daysSince % cycleLength) + cycleLength) % cycleLength + 1;
  const internal = getPhaseForCycleLength(dayInCycle, cycleLength);
  const map: Record<string, string> = {
    menstrual: "Flow",
    follicular: "Bloom",
    ovulatory: "Spark",
    luteal: "Recharge",
  };
  return map[internal] || null;
}

function getCycleDay(
  date: Date,
  lastPeriodStart: string,
  cycleLength: number
): number {
  let start: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
    const [year, month, day] = lastPeriodStart.split("-").map(Number);
    start = new Date(year, month - 1, day);
  } else {
    start = new Date(lastPeriodStart);
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const daysSince = Math.floor(
    (d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return ((daysSince % cycleLength) + cycleLength) % cycleLength + 1;
}

// ── Action Drawer ─────────────────────────────────────────────────────────────
function ActionDrawer({
  date,
  phaseName,
  cycleDay,
  isToday,
  onClose,
  onGoToTodaysPlan,
}: {
  date: Date;
  phaseName: string;
  cycleDay: number;
  isToday: boolean;
  onClose: () => void;
  onGoToTodaysPlan: () => void;
}) {
  const cfg = PHASE_CONFIG[phaseName];
  if (!cfg) return null;

  const dateLabel = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[100]"
      />
      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl px-6 pt-4 pb-10 z-[101] max-w-lg mx-auto"
        style={{ borderTop: `2px solid ${cfg.bg}` }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer text-muted-foreground"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{cfg.icon}</span>
            <span className="font-display text-xl text-foreground">
              {dateLabel}
            </span>
            {isToday && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: `${cfg.bg}30`, color: cfg.bg }}
              >
                TODAY
              </span>
            )}
          </div>
          <p className="text-sm font-semibold m-0" style={{ color: cfg.bg }}>
            {cfg.name} — Day {cycleDay}
          </p>
        </div>

        {/* Today feels like */}
        <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic">
          {cfg.todayFeelsLike}
        </p>

        {/* Focus */}
        <p
          className="text-xs font-bold uppercase tracking-wider mb-4"
          style={{ color: cfg.bg }}
        >
          Focus: {cfg.focus}
        </p>

        {/* Do / Avoid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#5B8A6B" }}>
              Do
            </p>
            {cfg.do.map((item, i) => (
              <div key={i} className="flex gap-1.5 mb-1.5 items-start">
                <span className="text-sm flex-shrink-0" style={{ color: "#5B8A6B" }}>✔</span>
                <span className="text-foreground/80 text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#8B4A6B" }}>
              Avoid
            </p>
            {cfg.avoid.map((item, i) => (
              <div key={i} className="flex gap-1.5 mb-1.5 items-start">
                <span className="text-sm flex-shrink-0" style={{ color: "#8B4A6B" }}>✖</span>
                <span className="text-foreground/80 text-sm leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {isToday && (
          <button
            onClick={onGoToTodaysPlan}
            className="w-full rounded-xl py-3.5 text-base font-bold cursor-pointer border-none"
            style={{ background: cfg.bg, color: cfg.text }}
          >
            Go to Today's Plan →
          </button>
        )}
      </div>
    </>
  );
}

// ── Main CalendarPage ─────────────────────────────────────────────────────────
export default function CalendarPage() {
  const profileId = getProfileId();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<{
    lastPeriodStart?: string | null;
    cycleLength?: number;
    cycleStatus?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    phaseName: string;
    cycleDay: number;
    isToday: boolean;
  } | null>(null);

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/profile/${profileId}`)
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  const isCycling = profile?.cycleStatus !== "no_period";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayPhase =
    isCycling && profile?.lastPeriodStart
      ? getDisplayPhase(today, profile.lastPeriodStart, profile.cycleLength || 28)
      : null;
  const todayCfg = todayPhase ? PHASE_CONFIG[todayPhase] : null;

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }
    return weeks;
  };

  const weeks = renderCalendar();
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const handleDayTap = (date: Date) => {
    if (!isCycling || !profile?.lastPeriodStart) return;
    const phaseName = getDisplayPhase(
      date,
      profile.lastPeriodStart,
      profile.cycleLength || 28
    );
    if (!phaseName) return;
    const cycleDay = getCycleDay(
      date,
      profile.lastPeriodStart,
      profile.cycleLength || 28
    );
    const isToday = date.toDateString() === new Date().toDateString();
    setSelectedDay({ date, phaseName, cycleDay, isToday });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Action Drawer */}
      {selectedDay && (
        <ActionDrawer
          date={selectedDay.date}
          phaseName={selectedDay.phaseName}
          cycleDay={selectedDay.cycleDay}
          isToday={selectedDay.isToday}
          onClose={() => setSelectedDay(null)}
          onGoToTodaysPlan={() => {
            setSelectedDay(null);
            setLocation("/dashboard");
          }}
        />
      )}

      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl text-foreground mb-1">
            Calendar
          </h1>
          {todayCfg ? (
            <p className="text-sm font-medium m-0" style={{ color: todayCfg.bg }}>
              Today: {todayCfg.icon} {todayCfg.name} — {todayCfg.focus}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm m-0">Your monthly view</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Phase Legend */}
        {isCycling && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {Object.values(PHASE_CONFIG).map((cfg) => (
              <div key={cfg.name} className="flex items-center gap-1.5">
                <span className="text-base">{cfg.icon}</span>
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: cfg.bg }}
                />
                <span className="text-foreground/70 text-sm">{cfg.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              )
            }
            className="bg-card border border-border rounded-xl text-foreground/80 px-3 py-2 cursor-pointer flex items-center hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <h2 className="font-display text-xl text-foreground mb-1.5">{monthName}</h2>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="bg-transparent rounded-lg px-4 py-1.5 text-xs cursor-pointer"
              style={{ border: "1px solid #B07D52", color: "#B07D52" }}
            >
              Today
            </button>
          </div>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              )
            }
            className="bg-card border border-border rounded-xl text-foreground/80 px-3 py-2 cursor-pointer flex items-center hover:opacity-80 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tap hint */}
        {isCycling && (
          <p className="text-muted-foreground/40 text-xs text-center mb-4">
            Tap any day to see what it means
          </p>
        )}

        {/* Calendar Grid */}
        <div className="bg-card border border-border rounded-2xl p-4 overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-muted-foreground/60 text-xs font-semibold uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-2 mb-2">
              {week.map((date, dayIdx) => {
                if (!date) {
                  return (
                    <div key={dayIdx} style={{ aspectRatio: "1", background: "transparent" }} />
                  );
                }

                const phaseName =
                  isCycling && profile?.lastPeriodStart
                    ? getDisplayPhase(date, profile.lastPeriodStart, profile.cycleLength || 28)
                    : null;
                const isToday = date.toDateString() === new Date().toDateString();
                const cfg = phaseName ? PHASE_CONFIG[phaseName] : null;

                return (
                  <div
                    key={dayIdx}
                    onClick={() => handleDayTap(date)}
                    className="rounded-xl flex items-center justify-center text-sm transition-transform"
                    style={{
                      aspectRatio: "1",
                      background: cfg ? cfg.light : "transparent",
                      border: isToday
                        ? `2px solid ${cfg?.bg || "#B07D52"}`
                        : `1px solid ${cfg?.bg ? cfg.bg + "50" : "var(--border)"}`,
                      color: cfg ? "var(--foreground)" : "var(--muted-foreground)",
                      fontWeight: isToday ? 800 : 500,
                      cursor: isCycling ? "pointer" : "default",
                      boxShadow: isToday
                        ? `0 0 12px ${cfg?.bg || "#B07D52"}60, 0 0 4px ${cfg?.bg || "#B07D52"}40`
                        : "none",
                    }}
                  >
                    {isToday ? (
                      <div className="flex flex-col items-center gap-0">
                        <span
                          className="text-xs font-black uppercase tracking-tight leading-none"
                          style={{ fontSize: "0.5rem", color: cfg?.bg || "#B07D52" }}
                        >
                          TODAY
                        </span>
                        <span>{date.getDate()}</span>
                      </div>
                    ) : (
                      date.getDate()
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* No-period message */}
        {!isCycling && (
          <div className="bg-card border border-border rounded-xl p-6 mt-6 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed m-0">
              Your profile is set to track without a period, so phase colors
              aren't shown. You can still use the calendar to log how you feel
              each day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
