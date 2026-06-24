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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-8 bg-background/95">
      <div className="bg-card border border-border rounded-2xl p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🔗</div>
        <h2 className="font-display text-2xl text-foreground mb-3">
          Welcome to Partner View
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {partnerName} gave you access to this so you don't have to guess anymore. Here's where she is right now.
        </p>
        <button
          onClick={onDismiss}
          className="w-full rounded-xl py-3.5 text-base font-bold cursor-pointer border-none"
          style={{ background: "#B07D52", color: "#0D0B0A" }}
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
    <div className="min-h-screen bg-background text-foreground">
      {showWelcome && (
        <WelcomeOverlay
          partnerName={partnerName}
          onDismiss={handleWelcomeDismiss}
        />
      )}

      <div className="max-w-lg mx-auto px-4 pt-6 pb-24 flex flex-col gap-4">

        {/* Header */}
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">
            Partner View
          </p>
          <h1 className="font-display text-2xl text-foreground m-0">
            {partnerName}'s Day
          </h1>
        </div>

        {/* TODAY CARD */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}35`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{cfg.icon}</span>
            <span className="font-display text-2xl text-foreground">
              {cfg.name}
            </span>
            <span
              className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${accent}30`, color: accent }}
            >
              Day {cycleDay}
            </span>
          </div>

          <p className="text-foreground text-base font-semibold mb-1.5 leading-snug">
            {cfg.headline}
          </p>

          <p className="text-foreground/70 text-sm leading-relaxed mb-5">
            {cfg.context}
          </p>

          <button
            onClick={() => setShowWhyExplainer((v) => !v)}
            className="w-full rounded-xl py-3.5 text-base font-bold cursor-pointer border-none text-white"
            style={{ background: accent }}
          >
            {showWhyExplainer ? "Got it ↑" : "Why is she like this today? →"}
          </button>
        </div>

        {/* Why explainer */}
        {showWhyExplainer && (
          <div
            className="bg-card rounded-2xl p-5"
            style={{ border: `1px solid ${accent}25` }}
          >
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-3">
              What's happening
            </p>
            <p className="text-foreground/80 text-sm leading-relaxed m-0">
              {cfg.whyExplainer}
            </p>
          </div>
        )}

        {/* HOW TO SHOW UP */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-4">
            How to Show Up
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#5B8A6B" }}>
                Do
              </p>
              {cfg.howToShowUp.map((item, i) => (
                <div key={i} className="flex gap-1.5 mb-2 items-start">
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
                <div key={i} className="flex gap-1.5 mb-2 items-start">
                  <span className="text-sm flex-shrink-0" style={{ color: "#8B4A6B" }}>✖</span>
                  <span className="text-foreground/80 text-sm leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SPOON ENERGY */}
        {spoonEntry && spoonsLeft !== null && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-3">
              Her Energy Today
            </p>
            <div className="bg-muted rounded-full h-2 overflow-hidden mb-2">
              <div
                style={{
                  background: spoonColor,
                  height: "100%",
                  width: `${spoonPct}%`,
                  borderRadius: "9999px",
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">
                {spoonsLeft <= 3
                  ? "Running on empty — low-demand only today"
                  : spoonsLeft <= 6
                  ? "Some energy, but don't push it"
                  : "She's got energy today — good time to connect"}
              </span>
              <span className="text-sm font-bold" style={{ color: spoonColor }}>
                {spoonsLeft}/{spoonEntry.totalSpoons}
              </span>
            </div>
          </div>
        )}

        {/* VIEW CALENDAR */}
        <button
          onClick={() => setLocation("/calendar")}
          className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer w-full text-left hover:opacity-90 transition-opacity"
        >
          <span className="text-foreground/80 text-sm">See the full cycle calendar</span>
          <span style={{ color: accent }}>→</span>
        </button>

        {/* Footer */}
        <div className="text-center py-2">
          <div className="font-display text-sm tracking-wide" style={{ color: "#B07D52" }}>
            Cync
          </div>
          <div className="text-muted-foreground/30 text-xs mt-1">
            Cycle intelligence for real life
          </div>
        </div>
      </div>
    </div>
  );
}
