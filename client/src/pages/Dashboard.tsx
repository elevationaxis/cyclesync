import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import AskAuntB from "@/components/AskAuntB";
import {
  calculateCycleDay,
  getPhaseForCycleLength,
} from "@/lib/cycleUtils";
import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "@shared/schema";
import { getProfileId, getUserName } from "@/lib/storage";

// ── Phase config ─────────────────────────────────────────────────────────────
const PHASE_CONFIG: Record<
  string,
  {
    name: string;
    subtitle: string;
    accent: string;
    description: string;
    mind: string[];
    body: string[];
    soul: string[];
  }
> = {
  menstrual: {
    name: "Flow",
    subtitle: "Let Go",
    accent: "#8B4A6B",
    description:
      "Everything feels slower today — and that's not a flaw, it's a feature. Your body is doing significant internal work. The most productive thing you can do right now is rest without guilt and let the cycle complete itself.",
    mind: [
      "Zero expectations today. Your cognitive processing is naturally slower. Do the bare minimum to keep the wheels turning — nothing more.",
      "Clear the mental clutter. Write down everything you're stressing about, then close the notebook. You're not allowed to solve those problems until Bloom.",
      "Don't believe everything you think today. Your inner critic is louder during Flow. Notice the thought, then let it pass.",
    ],
    body: [
      "Deep rest and warmth. Skip the intense workout. A heating pad, magnesium-rich foods, and the Flow tea blend are your best tools today.",
      "Gentle movement only — a slow walk or restorative yoga. Your hormones are at their lowest; treat your body like it's recovering from a marathon.",
      "Nourishment over restriction. Your body needs dense, warm, grounding foods to rebuild what it's shedding. This is not the day to skip meals.",
    ],
    soul: [
      "Permission to cancel. You do not owe anyone your energy today. Send the 'I can't make it' text and retreat without apology.",
      "Radical acceptance. Stop fighting the fatigue. The more you resist the need to rest, the longer the exhaustion lasts. Surrender to the slow down.",
      "Reflection. Flow is the phase where your intuition is sharpest. What is no longer working in your life? Let it bleed out with this cycle.",
    ],
  },
  follicular: {
    name: "Bloom",
    subtitle: "Open Up",
    accent: "#5B8A6B",
    description:
      "The heavy fatigue is lifting and something is waking back up. Your estrogen is rising, your brain is primed for new ideas, and your body is ready to move again. This is your planning window — use it.",
    mind: [
      "Strategize. Your brain is wired for structural thinking right now. Map out the month, build the plan, set the goals. This is your best cognitive window.",
      "Tackle the hard tasks. That project you've been putting off? Do it now. Your cognitive endurance is peaking, making it easier to focus for long stretches.",
      "Learn something new. Your neuroplasticity is high right now. If you need to master a new skill or absorb complex information, this is the window.",
    ],
    body: [
      "Shake off the winter. Estrogen is rising, bringing your energy back online. Ease back into cardio or strength training — your body is ready.",
      "Fresh, vibrant nourishment. Feed your body light, energizing foods — think salads, fruits, and lean proteins to match your rising energy.",
      "Cruciferous vegetables. Broccoli, cauliflower, and kale help your liver process rising estrogen and keep your hormones balanced.",
    ],
    soul: [
      "Curiosity. What feels exciting right now? Follow the spark. This is the time to brainstorm without editing yourself.",
      "Initiate. Send the pitch, start the conversation, launch the idea. The energy of Bloom is all about forward momentum.",
      "Prioritize your own goals. It's easy to use this fresh energy to serve everyone else. Stop. Take the first 10% and apply it to your own ambitions.",
    ],
  },
  ovulatory: {
    name: "Spark",
    subtitle: "Turn Up",
    accent: "#C4846E",
    description:
      "You are magnetic right now. Your estrogen is peaking, your testosterone is surging, and your verbal fluency is at its absolute highest. This is your window to be seen, to speak, and to lead. Don't waste it hiding.",
    mind: [
      "The hardest conversation on your list. Your verbal fluency and emotional resilience are at their highest. Ask for the raise, set the boundary, pitch the client. You are bulletproof today.",
      "Collaborate. You are highly empathetic and communicative right now. This is the best time for team meetings, networking, and joint problem-solving.",
      "Advocate for yourself. You have the clarity and confidence to ask for exactly what you need. Do not dilute your requests.",
    ],
    body: [
      "High-intensity output. Your testosterone is surging alongside your estrogen. This is your window for PRs in the gym, heavy lifting, and intense cardio. Use the power.",
      "Fuel the surge. Your metabolism is speeding up. Complex carbohydrates and high-quality proteins will sustain this high-energy output.",
      "Liver support. As estrogen peaks, your liver works hard to clear it. Support it with leafy greens and plenty of water to prevent estrogen dominance later.",
    ],
    soul: [
      "Be seen. You are magnetic right now. Stop hiding behind the laptop. Go out, connect, lead the meeting, and let people experience your energy.",
      "Celebrate yourself. The Spark phase is the summer of your cycle. Enjoy the warmth, the confidence, and the feeling of being fully alive.",
      "Joy. Remember what it feels like to just have fun? Go find it today. Laugh loudly, be spontaneous, and let the heavy responsibilities wait.",
    ],
  },
  luteal: {
    name: "Recharge",
    subtitle: "Come Home",
    accent: "#7A6B8A",
    description:
      "Your energy is turning inward and your tolerance for noise is dropping. That's not a problem — it's your nervous system asking for protection. Honor it. Finish what matters, say no to what doesn't, and start coming home to yourself.",
    mind: [
      "Close the loops. You are highly detail-oriented right now. Edit the document, balance the budget, clean the inbox. Finish the tasks you started during Bloom.",
      "Delay the big decisions. You are highly critical right now — of yourself and others. Do not quit your job, break up with your partner, or send the angry email. Wait three days.",
      "Give yourself grace. The brain fog and irritability are biological, not moral failings. Lower your expectations for yourself today and just do what is necessary.",
    ],
    body: [
      "Transition from output to maintenance. Swap the HIIT for Pilates or long walks. Your body is preparing to reset and it wants to conserve energy.",
      "Blood sugar stabilization. Progesterone makes you more insulin resistant. Focus on protein-heavy meals and avoid sugar spikes to keep your mood stable.",
      "Magnesium and warmth. As hormones shift, cramps and tension can start. Support your nervous system with magnesium, warm baths, and the Recharge tea blend.",
    ],
    soul: [
      "Fierce boundaries. Your tolerance for things that don't serve you is at zero. Use this clarity to see what isn't working — but wait until Bloom to fix it. For now, just observe and protect your peace.",
      "Say no. You do not have the energetic bandwidth to be everything to everyone right now. 'No' is a complete sentence. Use it.",
      "Honor your anger. If you are furious about something today, pay attention. The luteal phase strips away your tolerance for things you usually put up with. The anger is valid — manage the reaction.",
    ],
  },
};

// ── Full-width Calendar ───────────────────────────────────────────────────────
function MonthCalendar({
  cycleLength,
  lastPeriodStart,
  accent,
}: {
  cycleLength: number;
  lastPeriodStart: string;
  accent: string;
}) {
  const [, setLocation] = useLocation();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [collapsed, setCollapsed] = useState(false);

  const PHASE_COLORS: Record<string, string> = {
    menstrual: "#8B4A6B",
    follicular: "#5B8A6B",
    ovulatory: "#C4846E",
    luteal: "#7A6B8A",
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
      const [y, m, d] = lastPeriodStart.split("-").map(Number);
      start = new Date(y, m - 1, d);
    } else {
      start = new Date(lastPeriodStart);
    }
    start.setHours(0, 0, 0, 0);

    const cells: Array<{
      day: number | null;
      phase: string | null;
      color: string | null;
      isToday: boolean;
    }> = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, phase: null, color: null, isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      const cycleDay =
        ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
      const phase = getPhaseForCycleLength(cycleDay, cycleLength);
      const isToday = date.getTime() === today.getTime();
      cells.push({
        day: d,
        phase,
        color: PHASE_COLORS[phase] || null,
        isToday,
      });
    }

    return cells;
  }, [viewDate, lastPeriodStart, cycleLength]);

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  return (
    <div className="bg-background border-b border-border">
      {/* Month nav */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2 cursor-pointer select-none"
        onClick={() => setCollapsed((c) => !c)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); prevMonth(); }}
          className="text-muted-foreground text-xl px-2 py-1 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-semibold tracking-wide uppercase">
            {monthLabel}
          </span>
          <span className="text-muted-foreground/50 text-xs">
            {collapsed ? "▸" : "▾"}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); nextMonth(); }}
          className="text-muted-foreground text-xl px-2 py-1 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Collapsible body */}
      {!collapsed && <>
      {/* Day headers */}
      <div className="grid grid-cols-7 px-3 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-muted-foreground/60 text-xs font-semibold uppercase tracking-widest py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 px-3 pb-3">
        {calendarDays.map((cell, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: "8px",
              background: cell.color
                ? cell.isToday
                  ? `${cell.color}55`
                  : `${cell.color}22`
                : "transparent",
              border: cell.isToday
                ? `2px solid ${cell.color || accent}`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: cell.isToday
                ? `0 0 10px ${cell.color || accent}60`
                : "none",
            }}
          >
            {cell.day !== null && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: cell.isToday
                    ? "#F7F2EB"
                    : cell.color
                    ? `${cell.color}cc`
                    : undefined,
                  fontWeight: cell.isToday ? 700 : 400,
                }}
                className={!cell.color && !cell.isToday ? "text-muted-foreground/40" : ""}
              >
                {cell.day}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Phase legend */}
      <div className="flex justify-center gap-4 px-4 pb-3 flex-wrap">
        {[
          { label: "Flow", color: "#8B4A6B" },
          { label: "Bloom", color: "#5B8A6B" },
          { label: "Spark", color: "#C4846E" },
          { label: "Recharge", color: "#7A6B8A" },
        ].map((p) => (
          <div key={p.label} className="flex items-center gap-1.5">
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                background: p.color,
              }}
            />
            <span className="text-muted-foreground text-xs">{p.label}</span>
          </div>
        ))}
      </div>

      {/* Full calendar link */}
      <div className="text-center pb-3">
        <button
          onClick={() => setLocation("/calendar")}
          style={{ color: accent }}
          className="bg-transparent border-none text-xs cursor-pointer hover:opacity-80 transition-opacity"
        >
          View full calendar →
        </button>
      </div>
      </> }
    </div>
  );
}

// ── Flip Card ─────────────────────────────────────────────────────────────────
function FlipCard({
  label,
  icon,
  content,
  accent,
}: {
  label: string;
  icon: string;
  content: string;
  accent: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{
        cursor: "pointer",
        perspective: "1000px",
        height: "140px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.45s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            border: `1px solid ${accent}30`,
            borderRadius: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "1rem",
          }}
          className="bg-card"
        >
          <span style={{ fontSize: "1.5rem" }}>{icon}</span>
          <span
            style={{
              color: accent,
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {label}
          </span>
          <span className="text-muted-foreground/50 text-xs">
            tap to reveal
          </span>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `${accent}15`,
            border: `1px solid ${accent}40`,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <p className="text-foreground text-sm leading-relaxed m-0 text-center">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [showAuntB, setShowAuntB] = useState(false);
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

  const cfg = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.follicular;
  const accent = cfg.accent;

  const cardIndex = cycleDay ? (cycleDay - 1) % 3 : 0;
  const mindContent = cfg.mind[cardIndex];
  const bodyContent = cfg.body[cardIndex];
  const soulContent = cfg.soul[cardIndex];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── 1. FULL-WIDTH CALENDAR ── */}
      {!isNoPeriod && profile?.lastPeriodStart ? (
        <MonthCalendar
          cycleLength={profile.cycleLength || 28}
          lastPeriodStart={profile.lastPeriodStart}
          accent={accent}
        />
      ) : (
        <div className="px-4 pt-8 pb-4 text-center border-b border-border">
          <p className="text-muted-foreground text-sm">
            Set your last period date in settings to unlock your cycle calendar.
          </p>
        </div>
      )}

      {/* ── Scrollable content ── */}
      <div className="max-w-lg mx-auto px-4 pt-5 pb-24 flex flex-col gap-5">

        {/* ── 2. CURRENT PHASE ── */}
        <div
          className="bg-card rounded-2xl p-6"
          style={{ borderLeft: `4px solid ${accent}` }}
        >
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-2">
            {today}{cycleDay ? ` · Day ${cycleDay}` : ""}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <h1
              className="text-3xl font-bold m-0 tracking-tight"
              style={{ color: accent }}
            >
              {cfg.name}
            </h1>
            <span className="text-muted-foreground text-base italic">
              · {cfg.subtitle}
            </span>
          </div>
        </div>

        {/* ── 3. DAILY DESCRIPTION ── */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-3">
            Today
          </p>
          <p className="text-foreground text-sm leading-relaxed m-0">
            {cfg.description}
          </p>
        </div>

        {/* ── 4. MIND / BODY / SOUL FLIP CARDS ── */}
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-3">
            Your Needs Today
          </p>
          <div className="flex gap-2">
            <FlipCard label="Mind" icon="🧠" content={mindContent} accent={accent} />
            <FlipCard label="Body" icon="🌿" content={bodyContent} accent={accent} />
            <FlipCard label="Soul" icon="✨" content={soulContent} accent={accent} />
          </div>
          <p className="text-muted-foreground/40 text-xs text-center mt-2">
            Tap each card to reveal
          </p>
        </div>

        {/* ── 5. CYNCLINK PROMPT ── */}
        <div
          className="bg-card rounded-2xl p-5"
          style={{ border: `1px solid ${accent}25` }}
        >
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-2">
            CyncLink
          </p>
          <p className="text-foreground text-base font-semibold mb-1">
            Don't make them read your mind.
          </p>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            Share your phase and what you need with the people closest to you.
          </p>
          <button
            onClick={() => setLocation("/partner-support")}
            style={{
              background: `${accent}20`,
              border: `1px solid ${accent}50`,
              color: accent,
            }}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer w-full hover:opacity-90 transition-opacity"
          >
            Share my CyncLink →
          </button>
        </div>

        {/* ── 6. ASK AUNT B ── */}
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-3">
            Ask Aunt B
          </p>
          {!showAuntB ? (
            <button
              onClick={() => setShowAuntB(true)}
              className="bg-card rounded-2xl p-5 w-full text-left cursor-pointer hover:opacity-90 transition-opacity border-0"
              style={{ border: `1px solid ${accent}25` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: `${accent}25`,
                    border: `1px solid ${accent}50`,
                  }}
                >
                  🌙
                </div>
                <div>
                  <p className="text-foreground text-base font-semibold mb-0.5">
                    She's here.
                  </p>
                  <p className="text-muted-foreground text-sm m-0">
                    Ask Aunt B anything about your cycle, your symptoms, or how you're feeling.
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div
              className="bg-card rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${accent}25` }}
            >
              <AskAuntB
                cycleDay={cycleDay}
                currentPhase={currentPhase}
                profileId={profileId || undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
