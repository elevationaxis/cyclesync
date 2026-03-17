import { useEffect, useState } from "react";

// Phase-aware quotes from Aunt B
const PHASE_QUOTES: Record<string, { quote: string; attribution: string }[]> = {
  reset: [
    {
      quote: "Rest is not a reward for finishing. It is the work itself.",
      attribution: "Aunt B",
    },
    {
      quote: "Your body is not betraying you. It is asking you to come home.",
      attribution: "Aunt B",
    },
    {
      quote: "The moon does not apologize for disappearing. Neither should you.",
      attribution: "Aunt B",
    },
  ],
  spark: [
    {
      quote: "Something in you is waking up. Let it stretch before it runs.",
      attribution: "Aunt B",
    },
    {
      quote: "This is the season of beginnings. Plant something you actually want to grow.",
      attribution: "Aunt B",
    },
    {
      quote: "Your energy is returning. Spend it on things that deserve it.",
      attribution: "Aunt B",
    },
  ],
  radiance: [
    {
      quote: "You are at your most magnetic right now. The world can feel it.",
      attribution: "Aunt B",
    },
    {
      quote: "This is not performance. This is you, fully arrived.",
      attribution: "Aunt B",
    },
    {
      quote: "Say the thing. Do the thing. You have the energy for it today.",
      attribution: "Aunt B",
    },
  ],
  alchemy: [
    {
      quote: "What feels heavy right now is asking to be transformed, not carried.",
      attribution: "Aunt B",
    },
    {
      quote: "Your sensitivity is not a flaw. It is the instrument.",
      attribution: "Aunt B",
    },
    {
      quote: "The alchemist does her best work in the dark. So do you.",
      attribution: "Aunt B",
    },
  ],
  default: [
    {
      quote: "Your body has always known. Now you can too.",
      attribution: "Aunt B",
    },
    {
      quote: "You are not too much. You are exactly enough, in the right season.",
      attribution: "Aunt B",
    },
    {
      quote: "Cycle intelligence is not about control. It is about coming home to yourself.",
      attribution: "Aunt B",
    },
  ],
};

function getCurrentPhase(lastPeriodStart?: string | null, cycleLength = 28): string {
  if (!lastPeriodStart) return "default";
  const start = new Date(lastPeriodStart);
  const today = new Date();
  const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const dayInCycle = (daysSince % cycleLength) + 1;

  if (dayInCycle <= 5) return "reset";
  if (dayInCycle <= Math.round(cycleLength * 0.45)) return "spark";
  if (dayInCycle <= Math.round(cycleLength * 0.55)) return "radiance";
  return "alchemy";
}

const PHASE_COLORS: Record<string, { bg: string; accent: string; moon: string }> = {
  reset: { bg: "#0D0B0A", accent: "#8B4A6B", moon: "🌑" },
  spark: { bg: "#0A0D0B", accent: "#7A9E7E", moon: "🌱" },
  radiance: { bg: "#0D0A08", accent: "#C4846E", moon: "🌕" },
  alchemy: { bg: "#0B0A08", accent: "#B07D52", moon: "🍂" },
  default: { bg: "#0D0B0A", accent: "#B07D52", moon: "🌙" },
};

interface QuoteSplashProps {
  onDismiss: () => void;
  lastPeriodStart?: string | null;
  cycleLength?: number;
}

export default function QuoteSplash({ onDismiss, lastPeriodStart, cycleLength = 28 }: QuoteSplashProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  const phase = getCurrentPhase(lastPeriodStart, cycleLength);
  const quotes = PHASE_QUOTES[phase] || PHASE_QUOTES.default;
  const { quote, attribution } = quotes[Math.floor(Math.random() * quotes.length)];
  const colors = PHASE_COLORS[phase];

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 4 seconds
    const autoDismiss = setTimeout(() => {
      setFading(true);
      setTimeout(onDismiss, 600);
    }, 4000);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(autoDismiss);
    };
  }, [onDismiss]);

  const handleTap = () => {
    setFading(true);
    setTimeout(onDismiss, 600);
  };

  return (
    <div
      onClick={handleTap}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem",
        cursor: "pointer",
        opacity: fading ? 0 : visible ? 1 : 0,
        transition: fading ? "opacity 0.6s ease" : "opacity 0.8s ease",
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${colors.accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Moon / phase icon */}
      <div
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          opacity: 0.8,
          transform: visible && !fading ? "translateY(0)" : "translateY(8px)",
          transition: "transform 1s ease",
        }}
      >
        {colors.moon}
      </div>

      {/* Quote */}
      <blockquote
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.3rem, 5vw, 1.75rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#F7F2EB",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "480px",
          margin: "0 0 1.5rem",
          transform: visible && !fading ? "translateY(0)" : "translateY(12px)",
          transition: "transform 1s ease 0.1s",
        }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.95rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: colors.accent,
          margin: 0,
          transform: visible && !fading ? "translateY(0)" : "translateY(8px)",
          transition: "transform 1s ease 0.2s",
        }}
      >
        — {attribution}
      </p>

      {/* Tap to continue hint */}
      <p
        style={{
          position: "absolute",
          bottom: "2rem",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#F7F2EB30",
          margin: 0,
        }}
      >
        tap to continue
      </p>

      {/* Cync wordmark */}
      <p
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Playfair Display', serif",
          fontSize: "1rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: colors.accent,
          margin: 0,
          opacity: 0.7,
        }}
      >
        Cync
      </p>
    </div>
  );
}
