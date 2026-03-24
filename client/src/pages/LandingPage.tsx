import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CircleDot, MessageCircle, Utensils, Users, Calendar, BookOpen, ChevronDown, Heart, Moon, X } from "lucide-react";

const BLUSH = "#E8B4A0";
const SAGE = "#7A9E7E";
const CREAM = "#F7F2EB";
const BLACK = "#0D0B0A";
const CREAM_MUTED = "#c4b29a";
const CREAM_DIM = "#8a7d74";

interface LandingPageProps {
  onGetStarted: () => void;
  onTryAsGuest?: () => void;
  onSignIn?: (username: string, password: string) => Promise<string | null>;
}

const features = [
  {
    icon: CircleDot,
    title: "Four-Phase Tracking",
    description: "Know exactly where you are in your cycle and what your body needs right now — not what an app tells you to feel.",
    color: BLUSH,
  },
  {
    icon: MessageCircle,
    title: "Aunt B — Your Guide",
    description: "Wisdom that sounds like the woman you wish you'd had in your corner all along. Grounded, warm, zero judgment.",
    color: SAGE,
  },
  {
    icon: Utensils,
    title: "Spoon Theory Energy",
    description: "Track your actual capacity, not the one the world expects. Know when to push and when to protect your energy.",
    color: BLUSH,
  },
  {
    icon: Users,
    title: "CyncLink",
    description: "Give your partner a way in — not all the way in. Share what they need to know so they can show up for you.",
    color: SAGE,
  },
  {
    icon: Calendar,
    title: "Cycle Calendar",
    description: "Plan your week around your biology, not against it. See what's coming so you can stop being blindsided.",
    color: BLUSH,
  },
  {
    icon: BookOpen,
    title: "Ritual Library",
    description: "Phase-specific practices that actually work. Movement, breath, rest — matched to where your body is today.",
    color: SAGE,
  },
];

const phases = [
  { phase: "Menstrual", desc: "Rest & reflect", days: "Days 1–5", color: BLUSH },
  { phase: "Follicular", desc: "Build & begin", days: "Days 6–13", color: SAGE },
  { phase: "Ovulatory", desc: "Connect & shine", days: "Days 14–17", color: CREAM },
  { phase: "Luteal", desc: "Slow & protect", days: "Days 18–28", color: CREAM_MUTED },
];

export default function LandingPage({ onGetStarted, onTryAsGuest, onSignIn }: LandingPageProps) {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number>(0);

  // Sign-in modal state
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSignIn) return;
    setSignInError(null);
    setSignInLoading(true);
    const error = await onSignIn(signInUsername, signInPassword);
    setSignInLoading(false);
    if (error) setSignInError(error);
  };

  return (
    <div className="min-h-screen" style={{ background: BLACK, color: CREAM }}>

      {/* Sign-in modal overlay */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(13,11,10,0.85)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false); }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 relative"
            style={{ background: "#1a1614", border: "1px solid rgba(247,242,235,0.1)" }}
          >
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-5 right-5 opacity-40 hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" style={{ color: CREAM }} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <img src="/logo-mark.png" alt="Cync" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <span className="font-display text-base" style={{ color: CREAM }}>Welcome back</span>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: CREAM_DIM }}>
                  Username
                </label>
                <Input
                  type="text"
                  value={signInUsername}
                  onChange={e => setSignInUsername(e.target.value)}
                  placeholder="your username"
                  autoComplete="username"
                  className="bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 text-base"
                  style={{
                    borderBottom: `1px solid rgba(247,242,235,0.2)`,
                    color: CREAM,
                    caretColor: BLUSH,
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: CREAM_DIM }}>
                  Password
                </label>
                <Input
                  type="password"
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="bg-transparent border-0 border-b rounded-none px-0 focus-visible:ring-0 text-base"
                  style={{
                    borderBottom: `1px solid rgba(247,242,235,0.2)`,
                    color: CREAM,
                    caretColor: BLUSH,
                  }}
                />
              </div>

              {signInError && (
                <p className="text-sm" style={{ color: "#e87070" }}>{signInError}</p>
              )}

              <Button
                type="submit"
                disabled={signInLoading || !signInUsername || !signInPassword}
                className="w-full py-6 text-base font-semibold rounded-xl mt-2"
                style={{ background: BLUSH, color: BLACK }}
              >
                {signInLoading ? "Signing in..." : "Take me home"}
              </Button>
            </form>

            <p className="text-center text-xs mt-5" style={{ color: CREAM_DIM }}>
              New here?{" "}
              <button
                onClick={() => { setShowSignIn(false); onGetStarted(); }}
                className="underline underline-offset-2"
                style={{ color: BLUSH }}
              >
                Start with Cync
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5" style={{ borderBottom: "1px solid rgba(247,242,235,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="Cync" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span className="font-display text-lg" data-testid="text-brand-name">Cync</span>
        </div>
        <div className="flex items-center gap-3">
          {onSignIn && (
            <button
              onClick={() => setShowSignIn(true)}
              className="text-sm"
              style={{ color: CREAM_DIM }}
              data-testid="button-sign-in"
            >
              Sign in
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onGetStarted}
            className="bg-transparent"
            style={{ borderColor: `${BLUSH}66`, color: BLUSH }}
            data-testid="button-nav-get-started"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24 max-w-[900px] mx-auto text-center">
        <p className="text-xs font-medium tracking-[0.25em] uppercase mb-8" style={{ color: SAGE }}>
          For the women who feel everything
        </p>
        <p className="text-sm font-semibold tracking-wide mb-5" style={{ color: BLUSH }}>
          You're not inconsistent. You've been misaligned.
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-7">
          Your body's been trying to tell you something.{" "}
          <span style={{ color: BLUSH }}>We'll help you hear it.</span>
        </h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-[600px] mx-auto mb-10" style={{ color: CREAM_MUTED }}>
          Cync turns your hormonal patterns into daily power moves. Track your phases, manage your energy, and finally stop fighting your own biology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-base px-8 font-semibold"
            style={{ background: BLUSH, color: BLACK }}
            data-testid="button-get-started"
          >
            Start with Cync — Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {onTryAsGuest && (
            <Button
              size="lg"
              variant="outline"
              onClick={onTryAsGuest}
              className="text-base px-8 bg-transparent"
              style={{ borderColor: "rgba(247,242,235,0.2)", color: "rgba(247,242,235,0.7)" }}
              data-testid="button-guest"
            >
              Try as Guest
            </Button>
          )}
        </div>
        {onSignIn && (
          <p className="text-sm mt-6" style={{ color: CREAM_DIM }}>
            Already have an account?{" "}
            <button
              onClick={() => setShowSignIn(true)}
              className="underline underline-offset-2"
              style={{ color: BLUSH }}
            >
              Sign in
            </button>
          </p>
        )}
      </section>

      {/* Features — Interactive Accordion */}
      <section className="px-6 md:px-12 py-16 md:py-24" style={{ background: CREAM, color: BLACK, borderTop: "1px solid rgba(13,11,10,0.06)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: SAGE }}>
              What Cync Does
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
              We didn't build another period tracker.
            </h2>
            <p className="max-w-[480px] mx-auto text-sm leading-relaxed" style={{ color: "#6b5e54" }}>
              Period trackers count days. We decode patterns. Your body already knows — we just help you hear it.
            </p>
          </div>

          {/* Accordion */}
          <div style={{ borderTop: "1px solid rgba(13,11,10,0.08)", borderBottom: "1px solid rgba(13,11,10,0.08)" }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isOpen = openFeature === index;
              return (
                <div key={index} style={{ borderBottom: index < features.length - 1 ? "1px solid rgba(13,11,10,0.08)" : "none" }}>
                  <button
                    className="w-full flex items-center justify-between py-5 text-left"
                    onClick={() => setOpenFeature(isOpen ? null : index)}
                    data-testid={`card-feature-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{ background: isOpen ? feature.color : `${feature.color}22` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: isOpen ? BLACK : feature.color }} />
                      </div>
                      <span className="font-display text-lg font-normal" style={{ color: "#2a1f1a" }}>
                        {feature.title}
                      </span>
                    </div>
                    <ChevronDown
                      className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                      style={{ color: CREAM_DIM, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pl-12">
                      <p className="text-sm leading-relaxed" style={{ color: "#6b5e54" }}>
                        {feature.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: SAGE }}>
              The Ecosystem
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
              Three layers. One knowing.
            </h2>
            <p className="max-w-[480px] mx-auto text-sm leading-relaxed" style={{ color: CREAM_MUTED }}>
              From your phone to your body to your community — we built the full stack of cyclical living.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="rounded-3xl p-8 cursor-pointer"
              style={{ background: `${BLUSH}0A`, border: `1px solid ${BLUSH}33` }}
              onClick={onGetStarted}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: `${BLUSH}22` }}>
                <Moon className="w-5 h-5" style={{ color: BLUSH }} />
              </div>
              <h3 className="font-display text-xl mb-2">Cync</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: CREAM_MUTED }}>
                Your daily companion. Four-phase tracking, daily check-ins with Aunt B, spoon theory energy, and CyncLink partner sharing.
              </p>
              <span className="text-xs font-medium" style={{ color: BLUSH }} data-testid="text-cync-cta">Try Cync Free →</span>
            </div>

            <div className="rounded-3xl p-8" style={{ background: `${SAGE}0A`, border: `1px solid ${SAGE}33` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: `${SAGE}22` }}>
                <Heart className="w-5 h-5" style={{ color: SAGE }} />
              </div>
              <h3 className="font-display text-xl mb-2">The Sanctuary</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: CREAM_MUTED }}>
                Where digital meets physical. Phase-aligned workshops, cycle-synced retreats, and a space that understands why you need to cancel sometimes.
              </p>
              <span className="text-xs font-medium" style={{ color: CREAM_DIM }}>Coming Soon</span>
            </div>

            <div className="rounded-3xl p-8" style={{ background: "rgba(247,242,235,0.04)", border: "1px solid rgba(247,242,235,0.12)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(247,242,235,0.08)" }}>
                <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
                  <circle cx="10" cy="10" r="7" stroke={CREAM} strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="10" r="3" fill={CREAM} />
                </svg>
              </div>
              <h3 className="font-display text-xl mb-2">The Thread</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: CREAM_MUTED }}>
                Premium membership connecting all of it. Exclusive content, personal cycle coaching, and a private community of women who get it.
              </p>
              <span className="text-xs font-medium" style={{ color: CREAM_DIM }}>Join the Waitlist</span>
            </div>
          </div>
        </div>
      </section>

      {/* Four Phases — Interactive Toggle */}
      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-normal mb-4">
              The four phases. <span style={{ color: BLUSH }}>Your roadmap.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: CREAM_MUTED }}>
              Every phase has a purpose. Tap to explore.
            </p>
          </div>

          {/* Phase tabs */}
          <div className="flex rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid rgba(247,242,235,0.1)" }}>
            {phases.map((p, i) => (
              <button
                key={p.phase}
                className="flex-1 py-4 text-center transition-all"
                style={{
                  background: activePhase === i ? "rgba(247,242,235,0.08)" : "transparent",
                  borderRight: i < 3 ? "1px solid rgba(247,242,235,0.08)" : "none",
                }}
                onClick={() => setActivePhase(i)}
                data-testid={`phase-card-${p.phase.toLowerCase()}`}
              >
                <div
                  className="w-2 h-2 rounded-full mx-auto mb-2 transition-all"
                  style={{ background: activePhase === i ? p.color : "rgba(247,242,235,0.2)" }}
                />
                <p className="font-display text-sm" style={{ color: activePhase === i ? CREAM : CREAM_DIM }}>
                  {p.phase}
                </p>
              </button>
            ))}
          </div>

          {/* Active phase detail */}
          <div
            className="rounded-3xl p-8 text-center transition-all"
            style={{ background: "rgba(247,242,235,0.04)", border: `1px solid ${phases[activePhase].color}33` }}
          >
            <div className="w-3 h-3 rounded-full mx-auto mb-4" style={{ background: phases[activePhase].color }} />
            <h3 className="font-display text-2xl mb-2">{phases[activePhase].phase}</h3>
            <p className="text-sm mb-3" style={{ color: phases[activePhase].color }}>{phases[activePhase].days}</p>
            <p className="text-base" style={{ color: CREAM_MUTED }}>{phases[activePhase].desc}</p>
          </div>
        </div>
      </section>

      {/* Aunt B */}
      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: `${BLUSH}18` }}>
            <MessageCircle className="w-7 h-7" style={{ color: BLUSH }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-normal mb-6">
            A word from Aunt B
          </h2>
          <blockquote className="text-lg md:text-xl leading-relaxed italic mb-4" style={{ color: CREAM_MUTED }}>
            "Sis, your cycle isn't a problem to solve. It's a language your body speaks fluently. I'm just here to help you translate."
          </blockquote>
          <p className="text-xs tracking-wider uppercase" style={{ color: SAGE }}>Your cycle companion</p>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-6 md:px-12 py-16 md:py-24"
        style={{ borderTop: "1px solid rgba(247,242,235,0.06)", background: `${BLUSH}08` }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p className="font-display text-xs tracking-[0.2em] uppercase mb-4" style={{ color: SAGE }}>Ready?</p>
          <h2 className="font-display text-3xl md:text-4xl font-normal leading-tight mb-4">
            Stop explaining yourself.{" "}
            <span style={{ color: BLUSH }}>Start understanding yourself.</span>
          </h2>
          <p className="leading-relaxed mb-8 text-sm" style={{ color: CREAM_MUTED }}>
            Join women using cyclical intelligence to reclaim their energy, their relationships, and their calm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-base px-10 font-semibold"
              style={{ background: BLUSH, color: BLACK }}
              data-testid="button-start-journey"
            >
              Get Started Free
            </Button>
            {onTryAsGuest && (
              <Button
                size="lg"
                variant="outline"
                onClick={onTryAsGuest}
                className="text-base px-8 bg-transparent"
                style={{ borderColor: "rgba(247,242,235,0.2)", color: "rgba(247,242,235,0.7)" }}
              >
                Try as Guest
              </Button>
            )}
          </div>
          {onSignIn && (
            <p className="text-sm mt-6" style={{ color: CREAM_DIM }}>
              Already have an account?{" "}
              <button
                onClick={() => setShowSignIn(true)}
                className="underline underline-offset-2"
                style={{ color: BLUSH }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-10" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-mark.png" alt="Cync" style={{ width: 18, height: 18, objectFit: 'contain', opacity: 0.6 }} />
            <span className="font-display text-sm" style={{ color: "#6b5e54" }}>Cync</span>
          </div>
          <p className="text-xs" style={{ color: "#483220" }} data-testid="text-footer">
            Cync by Chaos & Co. Made with intention.
          </p>
        </div>
      </footer>
    </div>
  );
}
