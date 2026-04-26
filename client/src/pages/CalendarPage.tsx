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
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#1A1614",
          borderTop: `2px solid ${cfg.bg}`,
          borderRadius: "20px 20px 0 0",
          padding: "1.5rem 1.5rem 2.5rem",
          zIndex: 101,
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: "40px",
            height: "4px",
            background: "#2A2420",
            borderRadius: "2px",
            margin: "0 auto 1.25rem",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#6A5A4A",
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{cfg.icon}</span>
            <span
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontSize: "1.3rem",
                color: "#F7F2EB",
              }}
            >
              {dateLabel}
            </span>
            {isToday && (
              <span
                style={{
                  background: `${cfg.bg}30`,
                  color: cfg.bg,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                TODAY
              </span>
            )}
          </div>
          <p style={{ color: cfg.bg, fontSize: "0.8rem", fontWeight: 600, margin: 0 }}>
            {cfg.name} — Day {cycleDay}
          </p>
        </div>

        {/* Today feels like */}
        <p
          style={{
            color: "#C4B8A8",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            marginBottom: "1rem",
            fontStyle: "italic",
          }}
        >
          {cfg.todayFeelsLike}
        </p>

        {/* Focus */}
        <p
          style={{
            color: cfg.bg,
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "1rem",
          }}
        >
          Focus: {cfg.focus}
        </p>

        {/* Do / Avoid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                color: "#5B8A6B",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              Do
            </p>
            {cfg.do.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  marginBottom: "0.4rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#5B8A6B", fontSize: "0.8rem" }}>✔</span>
                <span style={{ color: "#C4B8A8", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div>
            <p
              style={{
                color: "#8B4A6B",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.5rem",
              }}
            >
              Avoid
            </p>
            {cfg.avoid.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  marginBottom: "0.4rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#8B4A6B", fontSize: "0.8rem" }}>✖</span>
                <span style={{ color: "#C4B8A8", fontSize: "0.8rem", lineHeight: 1.4 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {isToday && (
          <button
            onClick={onGoToTodaysPlan}
            style={{
              width: "100%",
              background: cfg.bg,
              color: cfg.text,
              border: "none",
              borderRadius: "12px",
              padding: "0.9rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
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

  // Today's phase for micro summary
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
      <div
        style={{
          minHeight: "100vh",
          background: "#0D0B0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#C4B8A8", fontFamily: "Inter, sans-serif" }}>
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0B0A",
        color: "#F7F2EB",
        fontFamily: "Inter, sans-serif",
        padding: "0",
      }}
    >
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
      <div
        style={{
          background: "#1A1614",
          borderBottom: "1px solid #2A2420",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "DM Serif Display, Georgia, serif",
              fontSize: "1.6rem",
              margin: "0 0 0.25rem",
            }}
          >
            Calendar
          </h1>
          {/* Micro summary */}
          {todayCfg && (
            <p
              style={{
                color: todayCfg.bg,
                fontSize: "0.875rem",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Today: {todayCfg.icon} {todayCfg.name} — {todayCfg.focus}
            </p>
          )}
          {!todayCfg && (
            <p style={{ color: "#9A8A7A", fontSize: "0.85rem", margin: 0 }}>
              Your monthly view
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>

        {/* Phase Legend */}
        {isCycling && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              justifyContent: "center",
            }}
          >
            {Object.values(PHASE_CONFIG).map((cfg) => (
              <div
                key={cfg.name}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: cfg.bg,
                  }}
                />
                <span style={{ color: "#C4B8A8", fontSize: "0.85rem" }}>
                  {cfg.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Month Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "10px",
              color: "#C4B8A8",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft style={{ width: "16px", height: "16px" }} />
          </button>

          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontSize: "1.4rem",
                margin: "0 0 0.5rem",
              }}
            >
              {monthName}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date())}
              style={{
                background: "transparent",
                border: "1px solid #B07D52",
                borderRadius: "8px",
                color: "#B07D52",
                padding: "0.35rem 1rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Today
            </button>
          </div>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "10px",
              color: "#C4B8A8",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* Tap hint */}
        {isCycling && (
          <p
            style={{
              color: "#4A3A2A",
              fontSize: "0.75rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Tap any day to see what it means
          </p>
        )}

        {/* Calendar Grid */}
        <div
          style={{
            background: "#1A1614",
            border: "1px solid #2A2420",
            borderRadius: "16px",
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          {/* Weekday Headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  color: "#6A5A4A",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {week.map((date, dayIdx) => {
                if (!date) {
                  return (
                    <div
                      key={dayIdx}
                      style={{ aspectRatio: "1", background: "transparent" }}
                    />
                  );
                }

                const phaseName =
                  isCycling && profile?.lastPeriodStart
                    ? getDisplayPhase(
                        date,
                        profile.lastPeriodStart,
                        profile.cycleLength || 28
                      )
                    : null;
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const cfg = phaseName ? PHASE_CONFIG[phaseName] : null;

                return (
                  <div
                    key={dayIdx}
                    onClick={() => handleDayTap(date)}
                    style={{
                      aspectRatio: "1",
                      background: cfg ? cfg.light : "#0D0B0A",
                      border: isToday
                        ? `2px solid ${cfg?.bg || "#B07D52"}`
                        : `1px solid ${cfg?.bg ? cfg.bg + "50" : "#2A2420"}`,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: cfg ? "#F7F2EB" : "#C4B8A8",
                      fontSize: "0.85rem",
                      fontWeight: isToday ? 800 : 500,
                      position: "relative",
                      cursor: isCycling ? "pointer" : "default",
                      boxShadow: isToday
                        ? `0 0 12px ${cfg?.bg || "#B07D52"}60, 0 0 4px ${cfg?.bg || "#B07D52"}40`
                        : "none",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    {isToday ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, color: cfg?.bg || "#B07D52", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>
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
          <div
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "12px",
              padding: "1.5rem",
              marginTop: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#9A8A7A",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Your profile is set to track without a period, so phase colors
              aren't shown. If this has changed, update your settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
