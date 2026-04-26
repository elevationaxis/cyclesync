import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { calculateCycleDay, getPhaseForCycleLength } from "@/lib/cycleUtils";
import type { UserProfile, SpoonEntry } from "@shared/schema";

// ── Partner phase config ──────────────────────────────────────────────────────
const PARTNER_PHASE_CONFIG: Record<
  string,
  {
    name: string;
    icon: string;
    accent: string;
    headline: string;
    context: string;
    howToShowUp: string[];
    avoid: string[];
    whyExplainer: string;
  }
> = {
  menstrual: {
    name: "Flow",
    icon: "🌊",
    accent: "#8B4A6B",
    headline: "She's in her lowest energy phase right now.",
    context: "Think rest, quiet, and no pressure. This isn't personal — it's biology.",
    howToShowUp: [
      "Be patient and gentle",
      "Take things off her plate if you can",
      "Keep the environment calm",
    ],
    avoid: [
      "Expecting high energy",
      "Taking distance personally",
      "Pushing plans or decisions",
    ],
    whyExplainer:
      "Her body is releasing and resetting right now. Hormones are at their lowest point. What looks like withdrawal is actually her body doing significant internal work. The best thing you can do is be steady and low-demand.",
  },
  follicular: {
    name: "Bloom",
    icon: "🌱",
    accent: "#5B8A6B",
    headline: "Her energy is coming back online.",
    context: "She's more open, curious, and ready to engage. Good time to connect.",
    howToShowUp: [
      "Talk things out with her",
      "Support new ideas she brings up",
      "Be present and engaged",
    ],
    avoid: [
      "Shutting ideas down too quickly",
      "Being distant or unavailable",
    ],
    whyExplainer:
      "Estrogen is rising and her brain is literally more optimistic and creative right now. She's coming out of her reset and opening back up. Conversations go well in this phase — use it.",
  },
  ovulatory: {
    name: "Spark",
    icon: "⚡",
    accent: "#C4846E",
    headline: "This is her highest energy and most social phase.",
    context: "She's more expressive, connected, and confident. Match her energy.",
    howToShowUp: [
      "Spend quality time together",
      "Be attentive and engaged",
      "Match her energy — she's feeling good",
    ],
    avoid: [
      "Being distracted or disconnected",
      "Taking her effort for granted",
    ],
    whyExplainer:
      "She's at peak hormonal output right now — estrogen and LH are both high. She's magnetic, communicative, and outward-facing. This is the best time for important conversations and quality connection.",
  },
  luteal: {
    name: "Recharge",
    icon: "🔋",
    accent: "#7A6B8A",
    headline: "She's more inward right now and easier to overwhelm.",
    context: "She's not upset at you — she's just in a lower energy phase. Think calm, steady, low pressure.",
    howToShowUp: [
      "Keep things simple and steady",
      "Give space when she needs it",
      "Don't take things personally",
    ],
    avoid: [
      "Pushing decisions",
      "Overloading her with questions",
      "Escalating small things",
    ],
    whyExplainer:
      "Progesterone is dropping and her nervous system is more sensitive. Clarity is actually high right now — she notices everything. The best move is to be steady and low-demand. You don't need to fix anything. Just don't make it heavier.",
  },
};

// ── Welcome Overlay ───────────────────────────────────────────────────────────
function WelcomeOverlay({
  partnerName,
  onDismiss,
}: {
  partnerName: string;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,11,10,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#1A1614",
          border: "1px solid #2A2420",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          maxWidth: "380px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔗</div>
        <h2
          style={{
            fontFamily: "DM Serif Display, Georgia, serif",
            fontSize: "1.5rem",
            color: "#F7F2EB",
            margin: "0 0 0.75rem",
          }}
        >
          Welcome to Partner View
        </h2>
        <p
          style={{
            color: "#9A8A7A",
            fontSize: "0.9rem",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          This helps you understand {partnerName}'s cycle in real time — so you
          can show up for her without guessing.
        </p>
        <button
          onClick={onDismiss}
          style={{
            background: "#B07D52",
            color: "#0D0B0A",
            border: "none",
            borderRadius: "12px",
            padding: "0.9rem 2rem",
            fontSize: "1rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            width: "100%",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ── Main PartnerViewPage ──────────────────────────────────────────────────────
export default function PartnerViewPage() {
  const profileId = localStorage.getItem("cycleSync_profileId");
  const storedName = localStorage.getItem("cycleSync_userName");
  const userId = profileId || "demo-user";
  const [, setLocation] = useLocation();

  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem("cync_partner_welcomed");
  });
  const [showWhyExplainer, setShowWhyExplainer] = useState(false);

  const handleWelcomeDismiss = () => {
    sessionStorage.setItem("cync_partner_welcomed", "1");
    setShowWelcome(false);
  };

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile", profileId],
    queryFn: async () => {
      if (!profileId) throw new Error("No profile");
      const response = await fetch(`/api/profile/${profileId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!profileId,
  });

  const { data: spoonEntry } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) return null;
      return response.json();
    },
  });

  const { cycleDay, internalPhase } = useMemo(() => {
    if (!profile?.lastPeriodStart) {
      return { cycleDay: 12, internalPhase: "follicular" };
    }
    const day = calculateCycleDay(
      profile.lastPeriodStart,
      profile.cycleLength || 28
    );
    const phase = getPhaseForCycleLength(day, profile.cycleLength || 28);
    return { cycleDay: day, internalPhase: phase };
  }, [profile]);

  const partnerName = (profile as any)?.name || storedName || "Your Partner";
  const cfg = PARTNER_PHASE_CONFIG[internalPhase] || PARTNER_PHASE_CONFIG.follicular;
  const accent = cfg.accent;

  const spoonsLeft = spoonEntry
    ? spoonEntry.totalSpoons - spoonEntry.usedSpoons
    : null;
  const spoonPct = spoonEntry
    ? ((spoonsLeft! / spoonEntry.totalSpoons) * 100)
    : 0;
  const spoonColor =
    spoonsLeft !== null
      ? spoonsLeft > 6
        ? "#5B8A6B"
        : spoonsLeft > 3
        ? "#C4846E"
        : "#8B4A6B"
      : "#6A5A4A";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0B0A",
        color: "#F7F2EB",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {showWelcome && (
        <WelcomeOverlay
          partnerName={partnerName}
          onDismiss={handleWelcomeDismiss}
        />
      )}

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
        {/* Header */}
        <div>
          <p
            style={{
              color: "#6A5A4A",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "0.25rem",
            }}
          >
            Partner View
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, Georgia, serif",
              fontSize: "1.6rem",
              margin: 0,
            }}
          >
            {partnerName}'s Day
          </h1>
        </div>

        {/* TODAY CARD */}
        <div
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}35`,
            borderRadius: "20px",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{cfg.icon}</span>
            <span
              style={{
                fontFamily: "DM Serif Display, Georgia, serif",
                fontSize: "1.4rem",
                color: "#F7F2EB",
              }}
            >
              {cfg.name}
            </span>
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
          </div>

          <p
            style={{
              color: "#F7F2EB",
              fontSize: "1rem",
              fontWeight: 600,
              margin: "0 0 0.4rem",
              lineHeight: 1.4,
            }}
          >
            {cfg.headline}
          </p>

          <p
            style={{
              color: "#C4B8A8",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              margin: "0 0 1.25rem",
            }}
          >
            {cfg.context}
          </p>

          <button
            onClick={() => setShowWhyExplainer((v) => !v)}
            style={{
              width: "100%",
              background: accent,
              color: "#F7F2EB",
              border: "none",
              borderRadius: "12px",
              padding: "0.85rem",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {showWhyExplainer ? "Got it ↑" : "Why is she like this today? →"}
          </button>
        </div>

        {/* Why explainer */}
        {showWhyExplainer && (
          <div
            style={{
              background: "#1A1614",
              border: `1px solid ${accent}25`,
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
                marginBottom: "0.75rem",
              }}
            >
              What's happening
            </p>
            <p
              style={{
                color: "#C4B8A8",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {cfg.whyExplainer}
            </p>
          </div>
        )}

        {/* HOW TO SHOW UP */}
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
            How to Show Up
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
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
                  marginBottom: "0.6rem",
                }}
              >
                Do
              </p>
              {cfg.howToShowUp.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.4rem",
                    marginBottom: "0.5rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#5B8A6B", fontSize: "0.85rem" }}>✔</span>
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
                  fontSize: "0.7rem",
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
                    gap: "0.4rem",
                    marginBottom: "0.5rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "#8B4A6B", fontSize: "0.85rem" }}>✖</span>
                  <span style={{ color: "#C4B8A8", fontSize: "0.85rem", lineHeight: 1.4 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SPOON ENERGY */}
        {spoonEntry && spoonsLeft !== null && (
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
                marginBottom: "0.75rem",
              }}
            >
              Her Energy Today
            </p>
            <div
              style={{
                background: "#0D0B0A",
                borderRadius: "8px",
                height: "8px",
                overflow: "hidden",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  background: spoonColor,
                  height: "100%",
                  width: `${spoonPct}%`,
                  borderRadius: "8px",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#9A8A7A", fontSize: "0.8rem" }}>
                {spoonsLeft <= 3
                  ? "Running low — keep it simple today"
                  : spoonsLeft <= 6
                  ? "Moderate energy"
                  : "Good energy today"}
              </span>
              <span style={{ color: spoonColor, fontSize: "0.85rem", fontWeight: 700 }}>
                {spoonsLeft}/{spoonEntry.totalSpoons}
              </span>
            </div>
          </div>
        )}

        {/* VIEW CALENDAR */}
        <button
          onClick={() => setLocation("/calendar")}
          style={{
            background: "#1A1614",
            border: "1px solid #2A2420",
            borderRadius: "16px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            color: "#C4B8A8",
            fontSize: "0.9rem",
            width: "100%",
            textAlign: "left",
          }}
        >
          <span>See the full cycle calendar</span>
          <span style={{ color: accent }}>→</span>
        </button>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
          <div
            style={{
              fontFamily: "DM Serif Display, Georgia, serif",
              color: "#B07D52",
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
            }}
          >
            Cync
          </div>
          <div style={{ color: "#4A3A2A", fontSize: "0.65rem", marginTop: "0.2rem" }}>
            Cycle intelligence for real life
          </div>
        </div>
      </div>
    </div>
  );
}
