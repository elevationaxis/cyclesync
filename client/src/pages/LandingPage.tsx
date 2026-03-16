import { Button } from "@/components/ui/button";
import { ArrowRight, CircleDot, MessageCircle, Utensils, Users, Calendar, BookOpen } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

function BrandMark({ size = 32, color = "#F7F2EB" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" />
      <path d="M14 28 C14 28, 18 14, 24 20 C30 26, 34 12, 34 12" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="28" r="3" fill={color} opacity="0.8" />
      <circle cx="34" cy="12" r="3" fill={color} opacity="0.4" />
    </svg>
  );
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: CircleDot,
      title: "Four-Phase Tracking",
      description: "Know exactly where you are in your cycle and what your body needs right now — not what an app tells you to feel.",
    },
    {
      icon: MessageCircle,
      title: "Aunt B — Your Guide",
      description: "AI-powered wisdom that sounds like the woman you wish you'd had in your corner all along. Grounded, warm, zero judgment.",
    },
    {
      icon: Utensils,
      title: "Spoon Theory Energy",
      description: "Track your actual capacity, not the one the world expects. Know when to push and when to protect your energy.",
    },
    {
      icon: Users,
      title: "CyncLink",
      description: "Give your partner a way in — not all the way in. Share what they need to know so they can show up for you.",
    },
    {
      icon: Calendar,
      title: "Cycle Calendar",
      description: "Plan your week around your biology, not against it. See what's coming so you can stop being blindsided.",
    },
    {
      icon: BookOpen,
      title: "Ritual Library",
      description: "Phase-specific practices that actually work. Movement, breath, rest — matched to where your body is today.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0D0B0A", color: "#F7F2EB" }}>
      <nav className="flex items-center justify-between px-6 md:px-12 py-5" style={{ borderBottom: "1px solid rgba(247,242,235,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <span className="font-serif text-lg" data-testid="text-brand-name">Chaos <span style={{ opacity: 0.4 }}>&</span> Co</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGetStarted}
          className="border-[#C4846E]/40 text-[#C4846E] bg-transparent"
          data-testid="button-nav-get-started"
        >
          Get Started
        </Button>
      </nav>

      <section className="px-6 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24 max-w-[900px] mx-auto text-center">
        <p
          className="text-xs font-medium tracking-[0.25em] uppercase mb-8"
          style={{ color: "#B07D52" }}
        >
          For the women who feel everything
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.05] mb-7">
          Your body's been trying to tell you something.{" "}
          <span style={{ color: "#C4846E" }}>We'll help you hear it.</span>
        </h1>
        <p
          className="text-lg md:text-xl leading-relaxed max-w-[600px] mx-auto mb-10"
          style={{ color: "#c4b29a" }}
        >
          Cync is a cycle intelligence companion that turns your hormonal patterns into daily power moves. Track your phases, manage your energy, and finally stop fighting your own biology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-base px-8 bg-[#C4846E] text-[#0D0B0A] font-semibold"
            data-testid="button-get-started"
          >
            Start with Cync — Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ background: "#F7F2EB", color: "#0D0B0A", borderTop: "1px solid rgba(13,11,10,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: "#B07D52" }}>
              What Cync Does
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4">
              We didn't build another period tracker.
            </h2>
            <p className="max-w-[500px] mx-auto" style={{ color: "#6b5e54" }}>
              Period trackers count days. We decode patterns. Your body already knows — we just help you hear it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-md p-7"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(176,125,82,0.15)" }}
                  data-testid={`card-feature-${index}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "#B07D52" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#F7F2EB" }} />
                  </div>
                  <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b5e54" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: "#B07D52" }}>
              The Ecosystem
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal mb-4">
              Three layers. One knowing.
            </h2>
            <p className="max-w-[500px] mx-auto" style={{ color: "#c4b29a" }}>
              From your phone to your body to your community — we built the full stack of cyclical living.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-md p-8" style={{ background: "rgba(237,228,245,0.06)", border: "1px solid rgba(237,228,245,0.12)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: "#EDE4F5" }}>
                <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
                  <path d="M4 10 C4 10, 6 4, 8 7 C10 10, 12 3, 12 3" stroke="#0D0B0A" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-2">Cync</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#c4b29a" }}>
                Your daily cycle companion. Four-phase tracking, AI check-ins with Aunt B, spoon theory energy, and CyncLink partner sharing.
              </p>
              <span className="text-xs font-medium" style={{ color: "#EDE4F5" }} data-testid="text-cync-cta">Try Cync Free</span>
            </div>

            <div className="rounded-md p-8" style={{ background: "rgba(196,132,110,0.06)", border: "1px solid rgba(196,132,110,0.12)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: "#C4846E" }}>
                <svg width={18} height={18} viewBox="0 0 20 20" fill="none">
                  <path d="M10 3 L10 17 M3 10 L17 10 M5 5 L15 15 M15 5 L5 15" stroke="#0D0B0A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-2">The Sanctuary</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#c4b29a" }}>
                Where digital meets physical. Phase-aligned workshops, cycle-synced retreats, and a space that understands why you need to cancel sometimes.
              </p>
              <span className="text-xs font-medium" style={{ color: "#C4846E" }}>Coming Soon</span>
            </div>

            <div className="rounded-md p-8" style={{ background: "rgba(176,125,82,0.06)", border: "1px solid rgba(176,125,82,0.12)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ background: "#B07D52" }}>
                <svg width={18} height={18} viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#0D0B0A" strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="10" r="3" fill="#0D0B0A" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-2">The Thread</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#c4b29a" }}>
                Premium membership connecting all of it. Exclusive content, personal cycle coaching, and a private community of women who get it.
              </p>
              <span className="text-xs font-medium" style={{ color: "#B07D52" }}>Join the Waitlist</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-normal mb-5">
            The four phases. <span style={{ color: "#C4846E" }}>Your roadmap.</span>
          </h2>
          <p className="mb-10" style={{ color: "#c4b29a" }}>
            Every phase has a purpose. Once you see the pattern, you stop fighting yourself and start working with the system you were born with.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-md overflow-hidden" style={{ border: "1px solid rgba(247,242,235,0.1)" }}>
            {[
              { phase: "Menstrual", desc: "Rest & reflect", color: "#C4846E" },
              { phase: "Follicular", desc: "Build & begin", color: "#B07D52" },
              { phase: "Ovulatory", desc: "Connect & shine", color: "#F7F2EB" },
              { phase: "Luteal", desc: "Slow & protect", color: "#EDE4F5" },
            ].map((p, i) => (
              <div key={p.phase} className="p-6 text-center" style={{ borderRight: i < 3 ? "1px solid rgba(247,242,235,0.1)" : "none" }} data-testid={`phase-card-${p.phase.toLowerCase()}`}>
                <div className="w-2 h-2 rounded-full mx-auto mb-3" style={{ background: p.color }} />
                <p className="font-serif text-base mb-1">{p.phase}</p>
                <p className="text-xs" style={{ color: "#8a7d74" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-20" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(196,132,110,0.1)" }}>
            <MessageCircle className="w-7 h-7" style={{ color: "#C4846E" }} />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-normal mb-4">
            A word from Aunt B
          </h2>
          <blockquote className="text-lg md:text-xl leading-relaxed italic mb-2" style={{ color: "#c4b29a" }}>
            "Honey, your cycle isn't a problem to solve. It's a language your body speaks fluently. I'm just here to help you translate."
          </blockquote>
          <p className="text-xs tracking-wider uppercase mt-4" style={{ color: "#B07D52" }}>Your AI cycle companion</p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24" style={{ borderTop: "1px solid rgba(247,242,235,0.06)", background: "rgba(196,132,110,0.04)" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-serif text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#B07D52" }}>Ready?</p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight mb-4">
            Stop explaining yourself.{" "}
            <span style={{ color: "#C4846E" }}>Start understanding yourself.</span>
          </h2>
          <p className="leading-relaxed mb-8" style={{ color: "#c4b29a" }}>
            Join women using cyclical intelligence to reclaim their energy, their relationships, and their calm.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-base px-10 bg-[#C4846E] text-[#0D0B0A] font-semibold"
            data-testid="button-start-journey"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-10" style={{ borderTop: "1px solid rgba(247,242,235,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandMark size={18} color="#6b5e54" />
            <span className="font-serif text-sm" style={{ color: "#6b5e54" }}>Chaos & Co</span>
          </div>
          <p className="text-xs" style={{ color: "#483220" }} data-testid="text-footer">
            Cync — part of Chaos & Co. Made with intention.
          </p>
        </div>
      </footer>
    </div>
  );
}
