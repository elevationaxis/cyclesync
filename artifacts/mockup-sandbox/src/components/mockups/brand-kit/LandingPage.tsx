export function LandingPage() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#F7F2EB", background: "#0D0B0A" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(247,242,235,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width={32} height={32} viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#F7F2EB" strokeWidth="2" />
            <path d="M14 28 C14 28, 18 14, 24 20 C30 26, 34 12, 34 12" stroke="#F7F2EB" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="14" cy="28" r="3" fill="#F7F2EB" opacity="0.8" />
            <circle cx="34" cy="12" r="3" fill="#F7F2EB" opacity="0.4" />
          </svg>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>Chaos <span style={{ opacity: 0.4 }}>&</span> Co</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14 }}>
          <a href="#" style={{ color: "#c4b29a", textDecoration: "none" }}>Cync App</a>
          <a href="#" style={{ color: "#c4b29a", textDecoration: "none" }}>The Sanctuary</a>
          <a href="#" style={{ color: "#c4b29a", textDecoration: "none" }}>About</a>
          <span style={{ background: "#C4846E", color: "#0D0B0A", padding: "8px 24px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Join the Waitlist</span>
        </div>
      </nav>

      <section style={{ padding: "120px 48px 100px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "#B07D52", marginBottom: 32, fontWeight: 500 }}>For the women who feel everything</p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, lineHeight: 1.05, fontWeight: 400, marginBottom: 28 }}>
          Your rage makes sense.{" "}
          <span style={{ color: "#C4846E" }}>So does your joy.</span>
        </h1>
        <p style={{ fontSize: 20, lineHeight: 1.6, color: "#c4b29a", maxWidth: 600, margin: "0 auto 40px" }}>
          We'll teach you the difference. Chaos & Co is a cycle intelligence platform that turns your hormonal patterns into daily power moves.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <span style={{ background: "#C4846E", color: "#0D0B0A", padding: "14px 36px", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Start with Cync — Free</span>
          <span style={{ border: "1px solid rgba(247,242,235,0.2)", color: "#F7F2EB", padding: "14px 36px", borderRadius: 6, fontSize: 16, fontWeight: 500, cursor: "pointer" }}>Explore The Sanctuary</span>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(247,242,235,0.06)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 12 }}>The Ecosystem</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, fontWeight: 400, marginBottom: 16 }}>Three layers. One knowing.</h2>
            <p style={{ fontSize: 16, color: "#c4b29a", maxWidth: 500, margin: "0 auto" }}>From your phone to your body to your community — we built the full stack of cyclical living.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div style={{ background: "rgba(237,228,245,0.06)", border: "1px solid rgba(237,228,245,0.12)", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EDE4F5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width={20} height={20} viewBox="0 0 16 16" fill="none">
                  <path d="M4 10 C4 10, 6 4, 8 7 C10 10, 12 3, 12 3" stroke="#0D0B0A" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 8 }}>Cync</h3>
              <p style={{ fontSize: 13, color: "#c4b29a", lineHeight: 1.6, marginBottom: 16 }}>Your daily cycle companion. Four-phase tracking, AI-powered check-ins with Aunt B, spoon theory energy management, and CyncLink partner sharing.</p>
              <span style={{ fontSize: 12, color: "#EDE4F5", fontWeight: 500 }}>Download the App</span>
            </div>

            <div style={{ background: "rgba(196,132,110,0.06)", border: "1px solid rgba(196,132,110,0.12)", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#C4846E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <path d="M10 3 L10 17 M3 10 L17 10 M5 5 L15 15 M15 5 L5 15" stroke="#0D0B0A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 8 }}>The Sanctuary</h3>
              <p style={{ fontSize: 13, color: "#c4b29a", lineHeight: 1.6, marginBottom: 16 }}>Where digital meets physical. Phase-aligned workshops, cycle-synced retreats, and a space that understands why you need to cancel sometimes.</p>
              <span style={{ fontSize: 12, color: "#C4846E", fontWeight: 500 }}>Find a Sanctuary</span>
            </div>

            <div style={{ background: "rgba(176,125,82,0.06)", border: "1px solid rgba(176,125,82,0.12)", borderRadius: 12, padding: 32 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#B07D52", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#0D0B0A" strokeWidth="1.5" fill="none" />
                  <circle cx="10" cy="10" r="3" fill="#0D0B0A" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 8 }}>The Thread</h3>
              <p style={{ fontSize: 13, color: "#c4b29a", lineHeight: 1.6, marginBottom: 16 }}>Premium membership connecting all of it. Exclusive content, early Sanctuary access, personal cycle coaching, and a private community of women who get it.</p>
              <span style={{ fontSize: 12, color: "#B07D52", fontWeight: 500 }}>Join the Inner Circle</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(247,242,235,0.06)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, marginBottom: 16 }}>
            We didn't build another <span style={{ color: "#C4846E" }}>period tracker.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#c4b29a", marginBottom: 40 }}>
            Period trackers count days. We decode patterns. Cync translates your hormonal rhythms into real guidance — what to eat, how to move, what to say yes to, and when to let the world wait. Your body already knows. We just help you hear it.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, border: "1px solid rgba(247,242,235,0.1)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { phase: "Menstrual", desc: "Rest & reflect", color: "#C4846E" },
              { phase: "Follicular", desc: "Build & begin", color: "#B07D52" },
              { phase: "Ovulatory", desc: "Connect & shine", color: "#F7F2EB" },
              { phase: "Luteal", desc: "Slow & protect", color: "#EDE4F5" },
            ].map((p, i) => (
              <div key={p.phase} style={{ padding: 24, borderRight: i < 3 ? "1px solid rgba(247,242,235,0.1)" : "none", textAlign: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, margin: "0 auto 12px" }} />
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, marginBottom: 4 }}>{p.phase}</p>
                <p style={{ fontSize: 12, color: "#8a7d74" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(247,242,235,0.06)", background: "rgba(196,132,110,0.04)", padding: "80px 48px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 16 }}>Ready?</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
            Stop explaining yourself.{" "}
            <span style={{ color: "#C4846E" }}>Start understanding yourself.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#c4b29a", lineHeight: 1.6, marginBottom: 32 }}>
            Join thousands of women using cyclical intelligence to reclaim their energy, their relationships, and their calm.
          </p>
          <span style={{ display: "inline-block", background: "#C4846E", color: "#0D0B0A", padding: "16px 48px", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Get Started Free</span>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(247,242,235,0.06)", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width={20} height={20} viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#6b5e54" strokeWidth="2" />
              <path d="M14 28 C14 28, 18 14, 24 20 C30 26, 34 12, 34 12" stroke="#6b5e54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "#6b5e54" }}>Chaos & Co</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#6b5e54" }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
          <p style={{ fontSize: 12, color: "#483220" }}>Made with intention.</p>
        </div>
      </footer>
    </div>
  );
}
