import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const BLUSH = "#E8B4A0";
const SAGE = "#7A9E7E";
const CREAM = "#F7F2EB";
const BLACK = "#0D0B0A";
const CREAM_MUTED = "#c4b29a";
const CREAM_DIM = "#8a7d74";

// Day 10 = Bloom phase (follicular)
const GUEST_PHASE = {
  name: "Bloom",
  icon: "🌱",
  tagline: "Your energy is coming back online.",
  focus: "Start small. Stay curious.",
  do: ["Try something new", "Pitch that idea", "Make the plan"],
  avoid: ["Overcommitting", "Skipping rest", "Saying yes to everything"],
  color: SAGE,
};

const ENERGY_OPTIONS = [
  { label: "Running on empty", value: 2, emoji: "🪫" },
  { label: "Getting by", value: 5, emoji: "🔋" },
  { label: "Actually okay", value: 8, emoji: "⚡" },
];

const MOOD_OPTIONS = [
  { label: "Anxious", emoji: "😰" },
  { label: "Foggy", emoji: "🌫️" },
  { label: "Okay", emoji: "😌" },
  { label: "Hopeful", emoji: "🌱" },
  { label: "Wired", emoji: "⚡" },
];

function getAuntBMessage(energy: number | null): string {
  if (energy === null) return "";
  if (energy <= 3) {
    return "Hey love. Running low today — that's real data, not a character flaw. Bloom season wants to move forward but your body's asking for something gentler first. Honor that. Even five minutes of doing nothing on purpose counts.";
  }
  if (energy <= 6) {
    return "Bloom doesn't always feel like energy. Sometimes it feels like the fog starting to lift. You don't have to be firing on all cylinders — just notice what's trying to surface today.";
  }
  return "That's Bloom doing its thing. Channel it somewhere intentional or it'll spend itself on everyone else's to-do list. What's one thing that's actually yours today?";
}

interface GuestPreviewPageProps {
  onSignUp: (energy: number | null, mood: string | null) => void;
}

export default function GuestPreviewPage({ onSignUp }: GuestPreviewPageProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"quote" | "preview" | "checkin" | "reveal">("quote");
  const [energy, setEnergy] = useState<number | null>(null);
  const [mood, setMood] = useState<string | null>(null);

  if (step === "quote") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ background: BLACK, color: CREAM }}
      >
        <div className="max-w-sm space-y-8">
          <div className="text-5xl">🌱</div>
          <p className="font-display text-2xl leading-relaxed" style={{ color: CREAM }}>
            Your body isn't working against you.
          </p>
          <p className="text-base leading-relaxed" style={{ color: CREAM_MUTED }}>
            It's been trying to tell you something. Let's find out what.
          </p>
          <Button
            onClick={() => setStep("preview")}
            className="w-full py-6 text-base font-semibold rounded-xl"
            style={{ background: BLUSH, color: BLACK }}
          >
            Show me
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div
        className="min-h-screen flex flex-col px-6 py-12"
        style={{ background: BLACK, color: CREAM }}
      >
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="text-center mb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: SAGE }}>
              Right now you're in
            </p>
          </div>

          {/* Phase card */}
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: `${SAGE}12`,
              border: `1px solid ${SAGE}40`,
            }}
          >
            <div className="text-5xl mb-4">{GUEST_PHASE.icon}</div>
            <h2 className="font-display text-3xl mb-2">{GUEST_PHASE.name}</h2>
            <p className="text-base mb-1" style={{ color: CREAM_MUTED }}>
              {GUEST_PHASE.tagline}
            </p>
            <p className="text-sm font-medium mt-3" style={{ color: SAGE }}>
              {GUEST_PHASE.focus}
            </p>
          </div>

          {/* Do / Avoid */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(247,242,235,0.04)", border: "1px solid rgba(247,242,235,0.08)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: SAGE }}>Do</p>
              <ul className="space-y-2">
                {GUEST_PHASE.do.map((item) => (
                  <li key={item} className="text-sm flex items-center gap-2" style={{ color: CREAM_MUTED }}>
                    <span style={{ color: SAGE }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(247,242,235,0.04)", border: "1px solid rgba(247,242,235,0.08)" }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: BLUSH }}>Avoid</p>
              <ul className="space-y-2">
                {GUEST_PHASE.avoid.map((item) => (
                  <li key={item} className="text-sm flex items-center gap-2" style={{ color: CREAM_MUTED }}>
                    <span style={{ color: BLUSH }}>×</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: CREAM_DIM }}>
            This is a preview based on cycle day 10. Your actual phase will be different.
          </p>

          <Button
            onClick={() => setStep("checkin")}
            className="w-full py-6 text-base font-semibold rounded-xl"
            style={{ background: BLUSH, color: BLACK }}
          >
            Check in with Aunt B
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <button
            onClick={() => setLocation("/dashboard")}
            className="w-full text-center text-sm"
            style={{ color: CREAM_DIM }}
          >
            Skip to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "checkin") {
    return (
      <div
        className="min-h-screen flex flex-col px-6 py-12"
        style={{ background: BLACK, color: CREAM }}
      >
        <div className="max-w-md mx-auto w-full space-y-8">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: `${BLUSH}18` }}
            >
              <span className="text-xl">💬</span>
            </div>
            <h2 className="font-display text-2xl mb-2">Quick check-in</h2>
            <p style={{ color: CREAM_MUTED }}>How are you actually doing today?</p>
          </div>

          {/* Energy */}
          <div className="space-y-3">
            <p className="text-sm font-medium" style={{ color: CREAM_MUTED }}>Energy level</p>
            <div className="space-y-2">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEnergy(opt.value)}
                  className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
                  style={{
                    background: energy === opt.value ? `${BLUSH}18` : "rgba(247,242,235,0.04)",
                    border: `1px solid ${energy === opt.value ? BLUSH + "60" : "rgba(247,242,235,0.1)"}`,
                  }}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-sm" style={{ color: CREAM }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-3">
            <p className="text-sm font-medium" style={{ color: CREAM_MUTED }}>What mood is loudest?</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setMood(opt.label)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: mood === opt.label ? `${BLUSH}22` : "rgba(247,242,235,0.06)",
                    border: `1px solid ${mood === opt.label ? BLUSH + "60" : "rgba(247,242,235,0.12)"}`,
                    color: mood === opt.label ? CREAM : CREAM_MUTED,
                  }}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setStep("reveal")}
            disabled={!energy || !mood}
            className="w-full py-6 text-base font-semibold rounded-xl"
            style={{
              background: BLUSH,
              color: BLACK,
              opacity: energy && mood ? 1 : 0.5,
            }}
          >
            See what Aunt B says
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Reveal step
  const auntBMessage = getAuntBMessage(energy);

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{ background: BLACK, color: CREAM }}
    >
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${BLUSH}18` }}
          >
            <span className="text-xl">💬</span>
          </div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: SAGE }}>
            Aunt B
          </p>
        </div>

        <div
          className="rounded-3xl p-7"
          style={{ background: "rgba(247,242,235,0.05)", border: "1px solid rgba(247,242,235,0.1)" }}
        >
          <p className="text-base leading-relaxed italic" style={{ color: CREAM_MUTED }}>
            "{auntBMessage}"
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: `${BLUSH}08`, border: `1px solid ${BLUSH}25` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" style={{ color: BLUSH }} />
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: BLUSH }}>
              Want the real thing?
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: CREAM_MUTED }}>
            This is a preview. The real Aunt B knows your actual cycle, tracks your patterns over time, and gets more useful the longer you use her.
          </p>
        </div>

        <Button
          onClick={() => onSignUp(energy, mood)}
          className="w-full py-6 text-base font-semibold rounded-xl"
          style={{ background: BLUSH, color: BLACK }}
        >
          Create my account — it's free
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <button
          onClick={() => setLocation("/dashboard")}
          className="w-full text-center text-sm py-2"
          style={{ color: CREAM_DIM }}
        >
          Keep exploring as guest
        </button>
      </div>
    </div>
  );
}
