import { useEffect, useState } from "react";
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
}

const PHASE_SUPPORT_TIPS: Record<string, string[]> = {
  Reset: [
    "Pick up dinner so she doesn't have to cook",
    "Bring her a heating pad or hot water bottle",
    "Handle one household task without being asked",
    "Give her uninterrupted quiet time",
    "Watch something comforting together",
  ],
  Spark: [
    "Plan something fun — she has the energy for it",
    "Ask about her ideas and actually listen",
    "Try something new together this week",
    "Encourage her projects and goals",
    "Be spontaneous — she'll love it right now",
  ],
  Radiance: [
    "Make time for real connection today",
    "Tell her something you genuinely appreciate about her",
    "Plan a date or quality time together",
    "Be present — put the phone down",
    "Match her energy — she's feeling good",
  ],
  Alchemy: [
    "Give her extra grace if she seems quiet or withdrawn",
    "Ask 'what do you need?' instead of guessing",
    "Handle more household tasks this week",
    "Don't take her quiet personally — it's not about you",
    "Bring her favorite snack without being asked",
  ],
};

function getPhaseInfo(lastPeriodStart: string, cycleLength: number) {
  // Parse date-only strings as local time to avoid UTC offset shifting the date
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
    phase = "Reset";
    emoji = "🌑";
    color = "#8B4A6B";
    partnerTip = "She's in her Reset phase — her body needs rest and warmth. Low energy is normal right now. A heating pad, her favorite comfort food, or just sitting quietly together goes a long way.";
  } else if (dayInCycle <= follicularEnd) {
    phase = "Spark";
    emoji = "🌱";
    color = "#5B8A6B";
    partnerTip = "She's in her Spark phase — energy is building and she's feeling more social and optimistic. Great time for new plans, conversations, or trying something new together.";
  } else if (dayInCycle <= ovulatoryEnd) {
    phase = "Radiance";
    emoji = "🌕";
    color = "#C4846E";
    partnerTip = "She's in her Radiance phase — peak energy and connection. She's likely feeling confident and communicative. Make time for quality connection.";
  } else {
    phase = "Alchemy";
    emoji = "🍂";
    color = "#8B6A3E";
    partnerTip = "She's in her Alchemy phase — introspective and sensitive. She may need more space or reassurance. This isn't personal. Check in gently, don't take quiet personally.";
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

  useEffect(() => {
    if (!token) return;
    fetch(`/api/cynclink/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else {
          setData(d);
          // Pre-populate already-claimed actions from server
          if (d.claimedActions) {
            setClaimedActions(new Set(d.claimedActions.map((a: any) => a.action_text)));
          }
        }
      })
      .catch(() => setError("Could not load CyncLink. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

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
        setClaimedActions(prev => new Set([...prev, actionText]));
        setClaimSuccess(actionText);
        setTimeout(() => setClaimSuccess(null), 3000);
      }
    } catch (e) {
      // silent fail
    } finally {
      setClaimingAction(null);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0B0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#F7F2EB", fontFamily: "Inter, sans-serif", fontSize: "1rem" }}>Loading CyncLink…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0B0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", color: "#F7F2EB", fontFamily: "Inter, sans-serif" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔗</div>
          <h2 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            {error === "This CyncLink has expired" ? "This CyncLink has expired" : "CyncLink not found"}
          </h2>
          <p style={{ color: "#C4846E", fontSize: "0.9rem" }}>
            {error || "This link may have been deactivated. Ask your partner to generate a new one."}
          </p>
        </div>
      </div>
    );
  }

  const spoonsLeft = data.spoons ? data.spoons.totalSpoons - data.spoons.usedSpoons : null;

  // Surface tier — minimal view
  if (data.privacyTier === "surface") {
    const spoonPercent = spoonsLeft !== null && data.spoons ? (spoonsLeft / data.spoons.totalSpoons) * 100 : 0;
    const spoonColor = spoonsLeft !== null && spoonsLeft > 6 ? "#5B8A6B" : spoonsLeft !== null && spoonsLeft > 3 ? "#C4846E" : "#8B4A6B";
    const vibe = spoonsLeft === null ? "Unknown" : spoonsLeft > 8 ? "Feeling good today" : spoonsLeft > 5 ? "Moderate energy" : spoonsLeft > 2 ? "Running low" : "Very low energy today";

    return (
      <div style={{ minHeight: "100vh", background: "#0D0B0A", color: "#F7F2EB", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#1A1614", padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid #2A2420" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🔗</span>
            <span style={{ color: "#B07D52", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>CyncLink</span>
          </div>
          <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.6rem", margin: 0, color: "#F7F2EB" }}>
            {data.partnerName}'s Day
          </h1>
          <p style={{ color: "#9A8A7A", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>Shared with {data.label}</p>
        </div>
        <div style={{ padding: "1.5rem", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Energy Today</div>
            <div style={{ background: "#0D0B0A", borderRadius: "8px", height: "12px", overflow: "hidden", marginBottom: "0.75rem" }}>
              <div style={{ background: spoonColor, height: "100%", width: `${spoonPercent}%`, borderRadius: "8px", transition: "width 0.3s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#C4B8A8", fontSize: "0.9rem" }}>{vibe}</div>
              {data.spoons && <div style={{ color: "#F7F2EB", fontSize: "1rem", fontWeight: 600 }}>{spoonsLeft}/{data.spoons.totalSpoons}</div>}
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
            <div style={{ color: "#4A3A2A", fontSize: "0.7rem" }}>Powered by</div>
            <div style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "#B07D52", fontSize: "1rem", letterSpacing: "0.05em" }}>Cync</div>
          </div>
        </div>
      </div>
    );
  }

  // Deep tier — full view
  const phaseInfo = data.lastPeriodStart
    ? getPhaseInfo(data.lastPeriodStart, data.cycleLength)
    : null;

  const supportTips = phaseInfo ? (PHASE_SUPPORT_TIPS[phaseInfo.phase] || []) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B0A", color: "#F7F2EB", fontFamily: "Inter, sans-serif", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "#1A1614", padding: "1.5rem 1.5rem 1rem", borderBottom: "1px solid #2A2420" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🔗</span>
          <span style={{ color: "#B07D52", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>CyncLink</span>
        </div>
        <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.6rem", margin: 0, color: "#F7F2EB" }}>
          {data.partnerName}'s Day
        </h1>
        <p style={{ color: "#9A8A7A", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>Shared with {data.label}</p>
      </div>

      <div style={{ padding: "1.5rem", maxWidth: "480px", margin: "0 auto" }}>

        {/* Phase Card (cycling users only) */}
        {phaseInfo && data.cycleStatus !== "no_period" && (
          <div style={{
            background: `${phaseInfo.color}18`,
            border: `1px solid ${phaseInfo.color}40`,
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "2rem" }}>{phaseInfo.emoji}</span>
              <div>
                <div style={{ color: "#9A8A7A", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Current Phase — Day {phaseInfo.dayInCycle}
                </div>
                <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.4rem", color: "#F7F2EB" }}>
                  {phaseInfo.phase}
                </div>
              </div>
            </div>
            <p style={{ color: "#C4B8A8", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              {phaseInfo.partnerTip}
            </p>
          </div>
        )}

        {/* No-period vibe card */}
        {data.cycleStatus === "no_period" && (
          <div style={{
            background: "#8B6A3E18",
            border: "1px solid #8B6A3E40",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "2rem" }}>🌿</span>
              <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.2rem", color: "#F7F2EB" }}>
                Her Energy Today
              </div>
            </div>
            <p style={{ color: "#C4B8A8", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              She's navigating her body on her own terms. Check in with her energy level below — that's your best guide today.
            </p>
          </div>
        )}

        {/* Today's Check-in */}
        {data.latestCheckIn && (
          <div style={{
            background: "#1A1614",
            border: "1px solid #2A2420",
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              Today's Check-in
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ background: "#0D0B0A", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                  {data.latestCheckIn.energy === "high" ? "⚡" : data.latestCheckIn.energy === "medium" ? "🌤" : "🌙"}
                </div>
                <div style={{ color: "#9A8A7A", fontSize: "0.7rem" }}>Energy</div>
                <div style={{ color: "#F7F2EB", fontSize: "0.85rem", textTransform: "capitalize" }}>{data.latestCheckIn.energy}</div>
              </div>
              <div style={{ background: "#0D0B0A", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                  {data.latestCheckIn.mood === "happy" ? "😊" : data.latestCheckIn.mood === "anxious" ? "😰" : data.latestCheckIn.mood === "sad" ? "😔" : data.latestCheckIn.mood === "irritable" ? "😤" : "😌"}
                </div>
                <div style={{ color: "#9A8A7A", fontSize: "0.7rem" }}>Mood</div>
                <div style={{ color: "#F7F2EB", fontSize: "0.85rem", textTransform: "capitalize" }}>{data.latestCheckIn.mood}</div>
              </div>
            </div>
            {data.latestCheckIn.symptoms && data.latestCheckIn.symptoms.length > 0 && (
              <div style={{ marginBottom: "0.5rem" }}>
                <div style={{ color: "#9A8A7A", fontSize: "0.7rem", marginBottom: "0.4rem" }}>Symptoms</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {data.latestCheckIn.symptoms.map((s: string, i: number) => (
                    <span key={i} style={{
                      background: "#2A2420",
                      color: "#C4B8A8",
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "20px",
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
            {data.latestCheckIn.notes && (
              <div style={{ background: "#0D0B0A", borderRadius: "10px", padding: "0.75rem", marginTop: "0.5rem" }}>
                <div style={{ color: "#9A8A7A", fontSize: "0.7rem", marginBottom: "0.25rem" }}>Note</div>
                <div style={{ color: "#C4B8A8", fontSize: "0.85rem", fontStyle: "italic" }}>"{data.latestCheckIn.notes}"</div>
              </div>
            )}
          </div>
        )}

        {/* Spoon Energy */}
        {data.spoons && (
          <div style={{
            background: "#1A1614",
            border: "1px solid #2A2420",
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              Energy Spoons Today
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ background: "#0D0B0A", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    background: spoonsLeft !== null && spoonsLeft > 6 ? "#5B8A6B" : spoonsLeft !== null && spoonsLeft > 3 ? "#C4846E" : "#8B4A6B",
                    height: "100%",
                    width: `${spoonsLeft !== null ? (spoonsLeft / data.spoons!.totalSpoons) * 100 : 0}%`,
                    borderRadius: "8px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              </div>
              <div style={{ color: "#F7F2EB", fontSize: "1rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {spoonsLeft}/{data.spoons.totalSpoons} left
              </div>
            </div>
            {spoonsLeft !== null && spoonsLeft <= 3 && (
              <p style={{ color: "#C4846E", fontSize: "0.8rem", marginTop: "0.5rem", margin: "0.5rem 0 0" }}>
                She's running low on energy today. Low-demand support is best.
              </p>
            )}
          </div>
        )}

        {/* I Got This — Support Actions */}
        {supportTips.length > 0 && (
          <div style={{
            background: "#1A1614",
            border: "1px solid #2A2420",
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
              Ways to Support Her
            </div>
            <p style={{ color: "#9A8A7A", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
              Tap "I got this" to let her know you're on it.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {supportTips.map((tip, i) => {
                const isClaimed = claimedActions.has(tip);
                const isClaiming = claimingAction === tip;
                const justClaimed = claimSuccess === tip;
                return (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    background: isClaimed ? "#5B8A6B18" : "#0D0B0A",
                    border: `1px solid ${isClaimed ? "#5B8A6B40" : "#1A1614"}`,
                    borderRadius: "10px",
                    padding: "0.75rem",
                  }}>
                    <span style={{ color: isClaimed ? "#5B8A6B" : "#C4B8A8", fontSize: "0.85rem", flex: 1 }}>
                      {isClaimed && "✓ "}{tip}
                    </span>
                    {!isClaimed && (
                      <button
                        onClick={() => claimAction(tip)}
                        disabled={isClaiming}
                        style={{
                          background: "#C4846E",
                          color: "#0D0B0A",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.4rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: isClaiming ? "wait" : "pointer",
                          whiteSpace: "nowrap",
                          opacity: isClaiming ? 0.7 : 1,
                        }}
                      >
                        {isClaiming ? "…" : "I got this"}
                      </button>
                    )}
                    {isClaimed && justClaimed && (
                      <span style={{ color: "#5B8A6B", fontSize: "0.75rem", fontWeight: 600 }}>She'll see this 💚</span>
                    )}
                    {isClaimed && !justClaimed && (
                      <span style={{ color: "#5B8A6B", fontSize: "0.75rem" }}>Claimed ✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "1rem 0 2rem" }}>
          <div style={{ color: "#4A3A2A", fontSize: "0.7rem" }}>Powered by</div>
          <div style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "#B07D52", fontSize: "1rem", letterSpacing: "0.05em" }}>Cync</div>
          <div style={{ color: "#4A3A2A", fontSize: "0.65rem", marginTop: "0.25rem" }}>Cycle intelligence for real life</div>
        </div>
      </div>
    </div>
  );
}
