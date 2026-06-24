import { useState, useEffect } from "react";
import { useRoute } from "wouter";

interface CyncLinkData {
  partnerName: string;
  privacyTier: "surface" | "deep";
  lastPeriodStart: string | null;
  cycleLength: number;
  cycleStatus?: string;
  label: string;
  linkId: string;
  spoons: {
    totalSpoons: number;
    usedSpoons: number;
    note?: string;
  } | null;
  latestCheckIn: {
    energy: string;
    mood: string;
    symptoms: string[];
    notes?: string;
    phase?: string;
    createdAt: string;
  } | null;
  claimedActions?: { action_text: string; claimed_at: string }[];
  pendingCareRequests?: { id: string; type: string; message: string | null; status: string; created_at: string }[];
}

// ── Updated phase names: Flow / Bloom / Spark / Recharge ──────────────────────
const PHASE_SUPPORT_TIPS: Record<string, string[]> = {
  Flow: [
    "Pick up food so she doesn't have to think about dinner",
    "Bring a heating pad or hot water bottle without being asked",
    "Handle one thing on the household list — quietly, without a report",
    "Give her uninterrupted quiet time, no check-ins needed",
    "Sit with her with no agenda — just be there",
  ],
  Bloom: [
    "Ask about something she's been working on and actually listen",
    "Plan something low-key together — even a walk counts",
    "Try one new thing together this week, anything",
    "Tell her you noticed something she did well lately",
    "Be available — she's in a talkative phase and she wants you",
  ],
  Spark: [
    "Make real time today — put the phone down, be present",
    "Tell her something specific you appreciate about her",
    "Plan a date or quality time — she'll remember this phase",
    "Match her energy — she's feeling good and wants company",
    "Say yes to something she suggests without negotiating it down",
  ],
  Recharge: [
    "Give her grace if she seems quiet — it's not about you",
    "Ask 'what do you need?' instead of guessing",
    "Take on more household tasks this week without announcing it",
    "Bring her favorite snack or comfort food without being asked",
    "Don't push for resolution on anything — just be steady",
  ],
};

function getPhaseInfo(lastPeriodStart: string, cycleLength: number) {
  let start: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(lastPeriodStart)) {
    const [year, month, day] = lastPeriodStart.split('-').map(Number);
    start = new Date(year, month - 1, day);
  } else {
    start = new Date(lastPeriodStart);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayInCycle = (daysSince % cycleLength) + 1;
  const menstrualEnd = 5;
  const follicularEnd = Math.round(cycleLength * 0.45);
  const ovulatoryEnd = Math.round(cycleLength * 0.55);

  let phase: string;
  let emoji: string;
  let color: string;
  let partnerTip: string;

  if (dayInCycle <= menstrualEnd) {
    phase = "Flow";
    emoji = "🌑";
    color = "#8B4A6B";
    partnerTip = "She's in Flow — her rest phase. Her body is doing significant internal work and her energy is at its lowest point of the cycle. This isn't a mood — it's biology. Warmth, quiet, and taking things off her plate is the whole playbook today.";
  } else if (dayInCycle <= follicularEnd) {
    phase = "Bloom";
    emoji = "🌱";
    color = "#5B8A6B";
    partnerTip = "She's in Bloom — energy is building and she's feeling more like herself. She's curious, more optimistic, and open to connecting. Good time for plans, real conversations, or just being present together.";
  } else if (dayInCycle <= ovulatoryEnd) {
    phase = "Spark";
    emoji = "🌕";
    color = "#C4846E";
    partnerTip = "She's in Spark — peak energy, peak connection. She's likely feeling confident and wants real time with you. This is the shortest phase of the cycle. Don't waste it being half-present.";
  } else {
    phase = "Recharge";
    emoji = "🍂";
    color = "#7A6B8A";
    partnerTip = "She's in Recharge — more inward, more sensitive, easier to overwhelm. Her nervous system is running hot right now. This is not personal. Be steady, keep things low-demand, and don't add to her mental load.";
  }

  return { phase, emoji, color, partnerTip, dayInCycle };
}

export default function CyncLinkPage() {
  const [, params] = useRoute("/cynclink/:token");
  const token = params?.token;
  const [data, setData] = useState<CyncLinkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimedActions, setClaimedActions] = useState<Set<string>>(new Set());
  const [claimingAction, setClaimingAction] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [claimedCareRequests, setClaimedCareRequests] = useState<Set<string>>(new Set());
  const [claimingCareRequest, setClaimingCareRequest] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/cynclink/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else {
          setData(d);
          if (d.claimedActions) {
            setClaimedActions(new Set(d.claimedActions.map((a: any) => a.action_text)));
          }
        }
      })
      .catch(() => setError("Could not load CyncLink. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  const claimCareRequest = async (requestId: string) => {
    if (!token || claimedCareRequests.has(requestId)) return;
    setClaimingCareRequest(requestId);
    try {
      const res = await fetch(`/api/cynclink/${token}/care-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setClaimedCareRequests(prev => new Set(Array.from(prev).concat(requestId)));
      }
    } catch (e) {
      // silent fail — button stays active for retry
    } finally {
      setClaimingCareRequest(null);
    }
  };

  const claimAction = async (actionText: string) => {
    if (!token || claimedActions.has(actionText)) return;
    setClaimingAction(actionText);
    try {
      const res = await fetch(`/api/cynclink/${token}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionText }),
      });
      if (res.ok) {
        setClaimedActions(prev => new Set(Array.from(prev).concat(actionText)));
        setClaimSuccess(actionText);
        setTimeout(() => setClaimSuccess(null), 3000);
      }
    } catch (e) {
      // Show a visible error so the user knows something went wrong
      setClaimSuccess("__error__");
      setTimeout(() => setClaimSuccess(null), 3000);
    } finally {
      setClaimingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-base">Loading CyncLink…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            {error === "This CyncLink has expired" ? "This CyncLink has expired" : "CyncLink not found"}
          </h2>
          <p className="text-sm" style={{ color: "#C4846E" }}>
            {error || "This link may have been deactivated. Ask your partner to generate a new one."}
          </p>
        </div>
      </div>
    );
  }

  const spoonsLeft = data.spoons ? data.spoons.totalSpoons - data.spoons.usedSpoons : null;

  // ── Surface tier — minimal view ──────────────────────────────────────────────
  if (data.privacyTier === "surface") {
    const spoonPercent = spoonsLeft !== null && data.spoons ? (spoonsLeft / data.spoons.totalSpoons) * 100 : 0;
    const spoonColor = spoonsLeft !== null && spoonsLeft > 6 ? "#5B8A6B" : spoonsLeft !== null && spoonsLeft > 3 ? "#C4846E" : "#8B4A6B";
    const vibe = spoonsLeft === null ? "Unknown" : spoonsLeft > 8 ? "Feeling good today" : spoonsLeft > 5 ? "Moderate energy" : spoonsLeft > 2 ? "Running low" : "Very low energy today";

    return (
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔗</span>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#B07D52" }}>CyncLink</span>
          </div>
          <h1 className="font-display text-2xl text-foreground m-0">
            {data.partnerName}'s Day
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Shared with {data.label}</p>
        </div>

        <div className="px-6 pt-6 max-w-lg mx-auto">
          {/* Energy bar */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-4">
            <div className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "#B07D52" }}>Energy Today</div>
            <div className="bg-muted rounded-full h-3 overflow-hidden mb-3">
              <div
                style={{ background: spoonColor, height: "100%", width: `${spoonPercent}%`, borderRadius: "9999px", transition: "width 0.3s ease" }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-foreground text-sm">{vibe}</div>
              {data.spoons && <div className="text-foreground font-semibold">{spoonsLeft}/{data.spoons.totalSpoons}</div>}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <div className="text-muted-foreground/40 text-xs">Powered by</div>
            <div className="font-display text-base tracking-wide" style={{ color: "#B07D52" }}>Cync</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Deep tier — full view ────────────────────────────────────────────────────
  const phaseInfo = data.lastPeriodStart
    ? getPhaseInfo(data.lastPeriodStart, data.cycleLength)
    : null;

  const supportTips = phaseInfo ? (PHASE_SUPPORT_TIPS[phaseInfo.phase] || []) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🔗</span>
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#B07D52" }}>CyncLink</span>
        </div>
        <h1 className="font-display text-2xl text-foreground m-0">
          {data.partnerName}'s Day
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Shared with {data.label}</p>
      </div>

      <div className="px-6 pt-6 pb-24 max-w-lg mx-auto flex flex-col gap-4">

        {/* Phase Card (cycling users only) */}
        {phaseInfo && data.cycleStatus !== "no_period" && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: `${phaseInfo.color}18`,
              border: `1px solid ${phaseInfo.color}40`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{phaseInfo.emoji}</span>
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">
                  Current Phase — Day {phaseInfo.dayInCycle}
                </div>
                <div className="font-display text-2xl text-foreground">
                  {phaseInfo.phase}
                </div>
              </div>
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed m-0">
              {phaseInfo.partnerTip}
            </p>
          </div>
        )}

        {/* No-period vibe card */}
        {data.cycleStatus === "no_period" && (
          <div
            className="rounded-2xl p-6"
            style={{ background: "#8B6A3E18", border: "1px solid #8B6A3E40" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🌿</span>
              <div className="font-display text-xl text-foreground">Her Energy Today</div>
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed m-0">
              She's navigating her body on her own terms. Check in with her energy level below — that's your best guide today.
            </p>
          </div>
        )}

        {/* Today's Check-in */}
        {data.latestCheckIn && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#B07D52" }}>
              Today's Check-in
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">
                  {data.latestCheckIn.energy === "high" ? "⚡" : data.latestCheckIn.energy === "medium" ? "🌤" : "🌙"}
                </div>
                <div className="text-muted-foreground text-xs">Energy</div>
                <div className="text-foreground text-sm capitalize">{data.latestCheckIn.energy}</div>
              </div>
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">
                  {data.latestCheckIn.mood === "happy" ? "😊" : data.latestCheckIn.mood === "anxious" ? "😰" : data.latestCheckIn.mood === "sad" ? "😔" : data.latestCheckIn.mood === "irritable" ? "😤" : "😌"}
                </div>
                <div className="text-muted-foreground text-xs">Mood</div>
                <div className="text-foreground text-sm capitalize">{data.latestCheckIn.mood}</div>
              </div>
            </div>
            {data.latestCheckIn.symptoms && data.latestCheckIn.symptoms.length > 0 && (
              <div className="mb-2">
                <div className="text-muted-foreground text-xs mb-1">Symptoms</div>
                <div className="flex flex-wrap gap-1.5">
                  {data.latestCheckIn.symptoms.map((s: string, i: number) => (
                    <span key={i} className="bg-muted text-foreground/80 text-xs px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.latestCheckIn.notes && (
              <div className="bg-background rounded-xl p-3 mt-2">
                <div className="text-muted-foreground text-xs mb-1">Note</div>
                <div className="text-foreground/80 text-sm italic">"{data.latestCheckIn.notes}"</div>
              </div>
            )}
          </div>
        )}

        {/* Spoon Energy */}
        {data.spoons && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#B07D52" }}>
              Energy Spoons Today
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div style={{
                    background: spoonsLeft !== null && spoonsLeft > 6 ? "#5B8A6B" : spoonsLeft !== null && spoonsLeft > 3 ? "#C4846E" : "#8B4A6B",
                    height: "100%",
                    width: `${spoonsLeft !== null ? (spoonsLeft / data.spoons!.totalSpoons) * 100 : 0}%`,
                    borderRadius: "9999px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
              <div className="text-foreground font-semibold whitespace-nowrap">
                {spoonsLeft}/{data.spoons.totalSpoons} left
              </div>
            </div>
            {spoonsLeft !== null && spoonsLeft <= 3 && (
              <p className="text-sm mt-2 m-0" style={{ color: "#C4846E" }}>
                She's running low on energy today. Low-demand support is best.
              </p>
            )}
          </div>
        )}

        {/* She Needs Right Now — Care Requests */}
        {data.pendingCareRequests && data.pendingCareRequests.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5" style={{ borderColor: "#8B4A6B40" }}>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "#8B4A6B" }}>
              She Needs Right Now
            </div>
            <p className="text-muted-foreground text-xs mb-3">
              She sent these directly. Tap "I got this" to let her know.
            </p>
            <div className="flex flex-col gap-2">
              {data.pendingCareRequests.map((req) => {
                const isClaimed = claimedCareRequests.has(req.id);
                const isClaiming = claimingCareRequest === req.id;
                const typeLabels: Record<string, { label: string; emoji: string }> = {
                  snack: { label: "Snack Run", emoji: "☕" },
                  touch: { label: "Physical Touch", emoji: "💗" },
                  chill: { label: "Quiet Time", emoji: "✨" },
                  encouragement: { label: "Encouragement", emoji: "🤝" },
                  custom: { label: req.message || "Custom Request", emoji: "📝" },
                };
                const typeInfo = typeLabels[req.type] || { label: req.type, emoji: "💌" };
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-3"
                    style={{
                      background: isClaimed ? "#5B8A6B18" : "hsl(var(--muted))",
                      border: `1px solid ${isClaimed ? "#5B8A6B40" : "#8B4A6B20"}`,
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-lg">{typeInfo.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: isClaimed ? "#5B8A6B" : undefined }}>
                          {isClaimed && "✓ "}{typeInfo.label}
                        </div>
                        {req.message && req.type !== "custom" && (
                          <div className="text-xs text-muted-foreground">{req.message}</div>
                        )}
                      </div>
                    </div>
                    {!isClaimed ? (
                      <button
                        onClick={() => claimCareRequest(req.id)}
                        disabled={isClaiming}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap border-none"
                        style={{
                          background: "#8B4A6B",
                          color: "#F7F2EB",
                          opacity: isClaiming ? 0.7 : 1,
                          cursor: isClaiming ? "wait" : "pointer",
                        }}
                      >
                        {isClaiming ? "…" : "I got this"}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold" style={{ color: "#5B8A6B" }}>On it ✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ways to Support Her */}
        {supportTips.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "#B07D52" }}>
              Ways to Support Her
            </div>
            <p className="text-muted-foreground text-xs mb-3">
              Tap "I got this" to let her know you're on it.
            </p>
            <div className="flex flex-col gap-2">
              {supportTips.map((tip, i) => {
                const isClaimed = claimedActions.has(tip);
                const isClaiming = claimingAction === tip;
                const justClaimed = claimSuccess === tip;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-3"
                    style={{
                      background: isClaimed ? "#5B8A6B18" : "hsl(var(--muted))",
                      border: `1px solid ${isClaimed ? "#5B8A6B40" : "transparent"}`,
                    }}
                  >
                    <span
                      className="text-sm flex-1"
                      style={{ color: isClaimed ? "#5B8A6B" : undefined }}
                    >
                      {isClaimed && "✓ "}{tip}
                    </span>
                    {!isClaimed && (
                      <button
                        onClick={() => claimAction(tip)}
                        disabled={isClaiming}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap border-none"
                        style={{
                          background: "#C4846E",
                          color: "#0D0B0A",
                          opacity: isClaiming ? 0.7 : 1,
                          cursor: isClaiming ? "wait" : "pointer",
                        }}
                      >
                        {isClaiming ? "…" : "I got this"}
                      </button>
                    )}
                    {isClaimed && justClaimed && (
                      <span className="text-xs font-semibold" style={{ color: "#5B8A6B" }}>She'll see this 💚</span>
                    )}
                    {isClaimed && !justClaimed && (
                      <span className="text-xs" style={{ color: "#5B8A6B" }}>Claimed ✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6">
          <div className="text-muted-foreground/40 text-xs mb-1">Powered by</div>
          <div className="font-display text-base tracking-wide" style={{ color: "#B07D52" }}>Cync</div>
          <div className="text-muted-foreground/30 text-xs mt-1">Cycle intelligence for real life</div>
          {claimSuccess === "__error__" && (
            <p className="text-xs mt-3" style={{ color: "#8B4A6B" }}>Couldn't save — please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
