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
    headline: "She's in her rest phase. Her body is doing a lot right now.",
    context: "This isn't a mood — it's biology. Low energy, inward focus, and needing warmth are all exactly on schedule.",
    howToShowUp: [
      "Take something off her plate without asking",
      "Bring warmth — a blanket, a hot drink, food she doesn't have to think about",
      "Sit with her without needing her to perform",
    ],
    avoid: [
      "Expecting her to show up at full capacity",
      "Making her explain why she's tired",
      "Planning anything that requires her to be 'on'",
    ],
    whyExplainer:
      "Her hormones just dropped to their lowest point of the entire cycle. Her body is releasing and resetting — physically and emotionally. What looks like withdrawal is actually her conserving energy for something important happening under the surface. She doesn't need to be fixed. She needs to be held steady. Your job right now is to be the least demanding thing in her day.",
  },
  follicular: {
    name: "Bloom",
    icon: "🌱",
    accent: "#5B8A6B",
    headline: "She's coming back online. This is a good window.",
    context: "Energy is building. She's more curious, more open, more herself. Meet her there.",
    howToShowUp: [
      "Ask what she's been thinking about — and actually listen",
      "Make a plan together, even something small",
      "Be present and engaged, not distracted",
    ],
    avoid: [
      "Shutting down ideas before she finishes the sentence",
      "Being checked out when she's trying to connect",
      "Wasting the window on small arguments",
    ],
    whyExplainer:
      "Estrogen is rising and her brain is literally running more optimistically right now. She's coming out of the inward pull of her rest phase and opening back up. Conversations go better in this phase. Ideas come easier. She's more forgiving and more curious. If there's something you've been wanting to talk about or plan together, now is a good time.",
  },
  ovulatory: {
    name: "Spark",
    icon: "⚡",
    accent: "#C4846E",
    headline: "She's at her best right now. Match her energy.",
    context: "This is her most social, expressive, and connected phase. She wants real time with you.",
    howToShowUp: [
      "Make real time for her — not just proximity",
      "Tell her something specific you appreciate about her",
      "Say yes to plans, dates, or anything that involves being together",
    ],
    avoid: [
      "Being on your phone when she's trying to connect",
      "Taking her effort for granted because she makes it look easy",
      "Missing this window — it's the shortest phase",
    ],
    whyExplainer:
      "Estrogen and LH are both peaking. She's magnetic, communicative, and outward-facing — this is the phase where she's most naturally herself at full volume. She wants connection, not just coexistence. If you're present right now, she'll feel it deeply. If you're checked out, she'll feel that too. This is the phase where small gestures land the biggest.",
  },
  luteal: {
    name: "Recharge",
    icon: "🔋",
    accent: "#7A6B8A",
    headline: "She's more inward right now. This is not about you.",
    context: "Her nervous system is more sensitive. She notices everything. The best move is steady and low-demand.",
    howToShowUp: [
      "Be consistent — predictability feels like safety right now",
      "Ask 'what do you need?' instead of guessing or fixing",
      "Handle things without waiting to be asked",
    ],
    avoid: [
      "Taking her quiet or irritability personally",
      "Pushing big decisions or heavy conversations",
      "Adding to her mental load — she's already carrying a lot",
    ],
    whyExplainer:
      "Progesterone is dropping and her nervous system is running hot. She's not being dramatic — she's actually more sensitive to stress, noise, and emotional weight right now. The frustrating part: her clarity is also high, which means she's noticing everything, including what you're not doing. You don't need to be perfect. You need to be steady. Don't make it heavier. Don't add noise. Just show up consistently and let her have her space.",
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
          {partnerName} gave you access to this so you don't have to guess anymore. Here's where she is right now.
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
                  ? "Running on empty — low-demand only today"
                  : spoonsLeft <= 6
                  ? "Some energy, but don't push it"
                  : "She's got energy today — good time to connect"}
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
