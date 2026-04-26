import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import AskAuntB from "@/components/AskAuntB";
import {
  calculateCycleDay,
  getPhaseForCycleLength,
} from "@/lib/cycleUtils";
import { getPhaseStartDay } from "@/lib/dailyBriefing";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { SpoonEntry, UserProfile } from "@shared/schema";
import { getProfileId, getUserName } from "@/lib/storage";

// ── Phase config ─────────────────────────────────────────────────────────────
const PHASE_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    accent: string;
    todayFeelsLike: string;
    focus: string;
    do: string[];
    avoid: string[];
    patternToWatch: string;
  }
> = {
  menstrual: {
    name: "Flow",
    icon: "🌊",
    accent: "#8B4A6B",
    todayFeelsLike: "Everything feels slower — and that's okay.",
    focus: "Rest and reset",
    do: ["Rest without guilt", "Keep things minimal"],
    avoid: ["Pushing productivity", "Overcommitting"],
    patternToWatch:
      "You may feel more depleted if you pushed hard in Recharge. Notice if rest today helps you recover faster.",
  },
  follicular: {
    name: "Bloom",
    icon: "🌱",
    accent: "#5B8A6B",
    todayFeelsLike: "Things feel a little lighter and easier.",
    focus: "Start small, stay curious",
    do: ["Try something new", "Take light action"],
    avoid: ["Overloading your schedule", "Starting too many things"],
    patternToWatch:
      "Your energy is building. Notice what ideas feel exciting — they're worth writing down before Recharge makes them harder to access.",
  },
  ovulatory: {
    name: "Spark",
    icon: "⚡",
    accent: "#C4846E",
    todayFeelsLike: "You've got more energy and presence today.",
    focus: "Connect and express",
    do: ["Have important conversations", "Show up and engage"],
    avoid: ["Overextending", "Saying yes to everything"],
    patternToWatch:
      "This is your peak window. Notice what you accomplish here — it sets the tone for how Recharge feels in two weeks.",
  },
  luteal: {
    name: "Recharge",
    icon: "🔋",
    accent: "#7A6B8A",
    todayFeelsLike: "Things might feel a little heavier today.",
    focus: "Simplify and protect your energy",
    do: ["Finish what matters", "Keep things simple"],
    avoid: ["Overcommitting", "Starting something new"],
    patternToWatch:
      "You may feel more overwhelmed if you've taken on too much earlier this week. Notice the pattern — it's information.",
  },
};

// ── 7-day strip ──────────────────────────────────────────────────────────────
function WeekStrip({
  cycleDay,
  cycleLength,
  lastPeriodStart,
  accent,
}: {
  cycleDay: number | null;
  cycleLength: number;
  lastPeriodStart: string | null | undefined;
  accent: string;
}) {
  const [, setLocation] = useLocation();

  const days = useMemo(() => {
    if (!cycleDay || !lastPeriodStart) return [];
    // Parse start date as local time
    let start: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
      const [y, m, d] = lastPeriodStart.split("-").map(Number);
      start = new Date(y, m - 1, d);
    } else {
      start = new Date(lastPeriodStart);
    }
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Show 3 days before today, today, 3 days after (7 total, today centered)
    return Array.from({ length: 7 }, (_, i) => {
      const offset = i - 3;
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const diffMs = date.getTime() - start.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const dayNum = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
      const phase = getPhaseForCycleLength(dayNum, cycleLength);
      const cfg = PHASE_CONFIG[phase];
      const isToday = offset === 0;
      return {
        date,
        dayNum,
        phase,
        icon: cfg.icon,
        accent: cfg.accent,
        isToday,
        label: isToday
          ? "Today"
          : date.toLocaleDateString("en-US", { weekday: "short" }),
        dayOfMonth: date.getDate(),
      };
    });
  }, [cycleDay, cycleLength, lastPeriodStart]);

  if (!days.length) return null;

  return (
    <div
      style={{
        background: "#1A1614",
        border: "1px solid #2A2420",
        borderRadius: "16px",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            color: "#9A8A7A",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
          }}
        >
          This Week
        </span>
        <button
          onClick={() => setLocation("/calendar")}
          style={{
            background: "transparent",
            border: "none",
            color: accent,
            fontSize: "0.75rem",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Full calendar →
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.35rem",
        }}
      >
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                color: d.isToday ? accent : "#6A5A4A",
                fontWeight: d.isToday ? 700 : 400,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {d.label}
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: d.isToday ? `${d.accent}30` : `${d.accent}14`,
                border: d.isToday
                  ? `2px solid ${d.accent}`
                  : `1px solid ${d.accent}40`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: d.isToday ? `0 0 8px ${d.accent}50` : "none",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>{d.icon}</span>
            </div>
            <span
              style={{
                fontSize: "0.65rem",
                color: d.isToday ? "#F7F2EB" : "#6A5A4A",
                fontWeight: d.isToday ? 700 : 400,
              }}
            >
              {d.dayOfMonth}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [showAskCync, setShowAskCync] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);
  const [, setLocation] = useLocation();

  const profileId = getProfileId();
  const userName = getUserName();

  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ["/api/profile", profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const response = await fetch(`/api/profile/${profileId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!profileId,
  });

  const isNoPeriod = profile?.cycleStatus === "no_period";

  const { cycleDay, currentPhase } = useMemo(() => {
    if (isNoPeriod) {
      return { cycleDay: null, currentPhase: "follicular" as const };
    }
    if (profile?.lastPeriodStart) {
      const day = calculateCycleDay(
        profile.lastPeriodStart,
        profile.cycleLength || 28
      );
      const phase = getPhaseForCycleLength(day, profile.cycleLength || 28);
      return { cycleDay: day, currentPhase: phase };
    }
    return { cycleDay: null, currentPhase: "follicular" as const };
  }, [profile, isNoPeriod]);

  const userId = profileId || "demo-user";

  const { data: spoonEntry } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) return null;
      return response.json();
    },
  });

  const cfg = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.follicular;
  const accent = cfg.accent;
  const spoonsLeft =
    spoonEntry ? spoonEntry.totalSpoons - spoonEntry.usedSpoons : null;

  // Evening check-in — persist per day
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("cync_evening_done");
    if (stored === today) setEveningDone(true);
  }, []);

  const handleEveningClose = () => {
    const today = new Date().toDateString();
    localStorage.setItem("cync_evening_done", today);
    setEveningDone(true);
    setLocation("/check-in");
  };

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
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "1.5rem 1rem 6rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* ── Header ── */}
        <div style={{ paddingBottom: "0.25rem" }}>
          <p
            style={{
              color: "#6A5A4A",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.25rem",
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, Georgia, serif",
              fontSize: "1.6rem",
              margin: 0,
              color: "#F7F2EB",
            }}
          >
            {userName ? `${userName.split(" ")[0]}'s Day` : "Your Daily Cync"}
          </h1>
        </div>

        {/* ── 1. TODAY CARD ── */}
        <div
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}35`,
            borderRadius: "20px",
            padding: "1.5rem",
          }}
        >
          {/* Phase title + day */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{cfg.icon}</span>
            <span
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontSize: "1.5rem",
                color: "#F7F2EB",
              }}
            >
              {isNoPeriod ? "Your Body Today" : cfg.name}
            </span>
            {!isNoPeriod && cycleDay && (
              <span
                style={{
                  background: `${accent}30`,
                  color: accent,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "20px",
                  marginLeft: "auto",
                }}
              >
                Day {cycleDay}
              </span>
            )}
          </div>

          {/* Today feels like */}
          <p
            style={{
              color: "#C4B8A8",
              fontSize: "0.9rem",
              margin: "0.5rem 0 0.25rem",
              lineHeight: 1.5,
            }}
          >
            {isNoPeriod
              ? "Tracking by how you feel today."
              : cfg.todayFeelsLike}
          </p>

          {/* Focus line */}
          <p
            style={{
              color: accent,
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0.5rem 0 1.25rem",
            }}
          >
            Focus: {cfg.focus}
          </p>

          {/* Action buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            <button
              onClick={() => setLocation("/check-in")}
              style={{
                background: accent,
                color: "#0D0B0A",
                border: "none",
                borderRadius: "12px",
                padding: "0.85rem 1.25rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                width: "100%",
                textAlign: "center",
              }}
            >
              Start Check-In
            </button>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                onClick={() => setShowAskCync((v) => !v)}
                style={{
                  flex: 1,
                  background: "#1A1614",
                  border: `1px solid ${accent}40`,
                  borderRadius: "12px",
                  padding: "0.65rem 1rem",
                  fontSize: "0.85rem",
                  color: accent,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
              >
                Ask Cync
              </button>
              <button
                onClick={() => setLocation("/spoons")}
                style={{
                  flex: 1,
                  background: "#1A1614",
                  border: "1px solid #2A2420",
                  borderRadius: "12px",
                  padding: "0.65rem 1rem",
                  fontSize: "0.85rem",
                  color:
                    spoonsLeft !== null
                      ? spoonsLeft > 6
                        ? "#5B8A6B"
                        : spoonsLeft > 3
                        ? "#C4846E"
                        : "#8B4A6B"
                      : "#9A8A7A",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                }}
              >
                {spoonsLeft !== null
                  ? `🥄 ${spoonsLeft} spoons`
                  : "🥄 Spoons"}
              </button>
            </div>
          </div>
        </div>

        {/* Ask Cync expanded */}
        {showAskCync && (
          <div
            style={{
              background: "#1A1614",
              border: `1px solid ${accent}25`,
              borderRadius: "16px",
              padding: "1rem",
            }}
          >
            <AskAuntB
              cycleDay={cycleDay}
              currentPhase={currentPhase}
              profileId={profileId || undefined}
            />
          </div>
        )}

        {/* ── 2. DO / AVOID ── */}
        {!isNoPeriod && (
          <div
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "16px",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                color: "#6A5A4A",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              What Today Looks Like
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p
                  style={{
                    color: "#5B8A6B",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.6rem",
                  }}
                >
                  Do
                </p>
                {cfg.do.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#5B8A6B", fontSize: "0.85rem", flexShrink: 0 }}>✔</span>
                    <span style={{ color: "#C4B8A8", fontSize: "0.85rem", lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <p
                  style={{
                    color: "#8B4A6B",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.6rem",
                  }}
                >
                  Avoid
                </p>
                {cfg.avoid.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: "#8B4A6B", fontSize: "0.85rem", flexShrink: 0 }}>✖</span>
                    <span style={{ color: "#C4B8A8", fontSize: "0.85rem", lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 3. 7-DAY STRIP ── */}
        {!isNoPeriod && cycleDay && (
          <WeekStrip
            cycleDay={cycleDay}
            cycleLength={profile?.cycleLength || 28}
            lastPeriodStart={profile?.lastPeriodStart}
            accent={accent}
          />
        )}

        {/* ── 4. PATTERN TO WATCH ── */}
        {!isNoPeriod && (
          <div
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "16px",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                color: "#6A5A4A",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
                marginBottom: "0.6rem",
              }}
            >
              Pattern to Watch
            </p>
            <p
              style={{
                color: "#9A8A7A",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {cfg.patternToWatch}
            </p>
          </div>
        )}

        {/* ── 5. EVENING CHECK-IN ── */}
        {!eveningDone && (
          <div
            style={{
              background: "#1A1614",
              border: `1px solid ${accent}25`,
              borderRadius: "16px",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <p
                style={{
                  color: "#F7F2EB",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  margin: "0 0 0.25rem",
                }}
              >
                Close your day
              </p>
              <p style={{ color: "#9A8A7A", fontSize: "0.8rem", margin: 0 }}>
                A quick reflection before you rest.
              </p>
            </div>
            <button
              onClick={handleEveningClose}
              style={{
                background: `${accent}20`,
                border: `1px solid ${accent}40`,
                borderRadius: "10px",
                padding: "0.6rem 1rem",
                color: accent,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Check in →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
