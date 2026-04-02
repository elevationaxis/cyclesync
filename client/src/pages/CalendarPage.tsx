import { useState, useEffect } from "react";
import { getProfileId } from "@/lib/storage";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const PHASE_COLORS = {
  Flow: { bg: "#8B4A6B", text: "#F7F2EB", light: "#8B4A6B33" },
  Bloom: { bg: "#5B8A6B", text: "#F7F2EB", light: "#5B8A6B33" },
  Spark: { bg: "#C4846E", text: "#0D0B0A", light: "#C4846E33" },
  Alchemy: { bg: "#8B6A3E", text: "#F7F2EB", light: "#8B6A3E33" },
};

export default function CalendarPage() {
  const profileId = getProfileId();
  const [profile, setProfile] = useState<{
    lastPeriodStart?: string | null;
    cycleLength?: number;
    cycleStatus?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/profile/${profileId}`)
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  const isCycling = profile?.cycleStatus !== "no_period";

  const getPhaseForDay = (date: Date): string | null => {
    if (!isCycling || !profile?.lastPeriodStart) return null;

    let start: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(profile.lastPeriodStart)) {
      const [year, month, day] = profile.lastPeriodStart.split('-').map(Number);
      start = new Date(year, month - 1, day);
    } else {
      start = new Date(profile.lastPeriodStart);
    }

    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const cycleLength = profile.cycleLength || 28;
    const dayInCycle = (daysSince % cycleLength) + 1;

    const menstrualEnd = 5;
    const follicularEnd = Math.round(cycleLength * 0.45);
    const ovulatoryEnd = Math.round(cycleLength * 0.55);

    if (dayInCycle <= menstrualEnd) return "Flow";
    if (dayInCycle <= follicularEnd) return "Bloom";
    if (dayInCycle <= ovulatoryEnd) return "Spark";
    return "Alchemy";
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Fill leading empty cells
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill trailing empty cells
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = renderCalendar();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0B0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#C4B8A8", fontFamily: "Inter, sans-serif" }}>Loading calendar...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B0A", color: "#F7F2EB", fontFamily: "Inter, sans-serif", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "#1A1614", borderBottom: "1px solid #2A2420", padding: "1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <CalendarIcon style={{ width: "20px", height: "20px", color: "#B07D52" }} />
            <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.6rem", margin: 0 }}>
              Calendar
            </h1>
          </div>
          <p style={{ color: "#9A8A7A", fontSize: "0.85rem", margin: "0 0 0 2rem" }}>
            {isCycling ? "Your cycle phases mapped across the month" : "Your monthly view"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem" }}>

        {/* Phase Legend (cycling users only) */}
        {isCycling && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", justifyContent: "center" }}>
            {Object.entries(PHASE_COLORS).map(([phase, colors]) => (
              <div key={phase} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: colors.bg }} />
                <span style={{ color: "#C4B8A8", fontSize: "0.85rem" }}>{phase}</span>
              </div>
            ))}
          </div>
        )}

        {/* Month Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <button
            onClick={goToPrevMonth}
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "10px",
              color: "#C4B8A8",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <ChevronLeft style={{ width: "16px", height: "16px" }} />
          </button>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.4rem", margin: "0 0 0.5rem" }}>
              {monthName}
            </h2>
            <button
              onClick={goToToday}
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
            onClick={goToNextMonth}
            style={{
              background: "#1A1614",
              border: "1px solid #2A2420",
              borderRadius: "10px",
              color: "#C4B8A8",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "16px", padding: "1rem", overflow: "hidden" }}>
          {/* Weekday Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} style={{ textAlign: "center", color: "#6A5A4A", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {week.map((date, dayIdx) => {
                if (!date) {
                  return <div key={dayIdx} style={{ aspectRatio: "1", background: "transparent" }} />;
                }

                const phase = getPhaseForDay(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const colors = phase ? PHASE_COLORS[phase as keyof typeof PHASE_COLORS] : null;

                return (
                  <div
                    key={dayIdx}
                    style={{
                      aspectRatio: "1",
                      background: colors ? colors.light : "#0D0B0A",
                      border: isToday ? `2px solid ${colors?.bg || "#B07D52"}` : `1px solid ${colors?.bg || "#2A2420"}`,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors ? colors.text : "#C4B8A8",
                      fontSize: "0.9rem",
                      fontWeight: isToday ? 700 : 500,
                      position: "relative",
                    }}
                  >
                    {date.getDate()}
                    {isToday && (
                      <div style={{
                        position: "absolute",
                        bottom: "4px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: colors?.bg || "#B07D52",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* No-period message */}
        {!isCycling && (
          <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "12px", padding: "1.5rem", marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ color: "#9A8A7A", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              Your profile is set to track without a period, so phase colors aren't shown. If this has changed, update your settings.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
