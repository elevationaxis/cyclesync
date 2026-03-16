export function LogoConcepts() {
  const WordmarkSVG = ({ color, size = 1 }: { color: string; size?: number }) => (
    <svg width={220 * size} height={40 * size} viewBox="0 0 220 40" fill="none">
      <text x="0" y="32" fontFamily="'DM Serif Display', serif" fontSize="34" fill={color} fontWeight="400">Chaos</text>
      <text x="108" y="32" fontFamily="'DM Serif Display', serif" fontSize="34" fill={color} fontWeight="400" opacity="0.5">&</text>
      <text x="130" y="32" fontFamily="'DM Serif Display', serif" fontSize="34" fill={color} fontWeight="400">Co</text>
    </svg>
  );

  const IconMark = ({ color, size = 1 }: { color: string; size?: number }) => (
    <svg width={48 * size} height={48 * size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" />
      <path d="M14 28 C14 28, 18 14, 24 20 C30 26, 34 12, 34 12" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="28" r="3" fill={color} opacity="0.8" />
      <circle cx="34" cy="12" r="3" fill={color} opacity="0.4" />
    </svg>
  );

  const IconWordmark = ({ color, bgColor, size = 1 }: { color: string; bgColor?: string; size?: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12 * size }}>
      <IconMark color={color} size={size} />
      <WordmarkSVG color={color} size={size} />
    </div>
  );

  const CyncWordmark = ({ color, size = 1 }: { color: string; size?: number }) => (
    <svg width={100 * size} height={36 * size} viewBox="0 0 100 36" fill="none">
      <text x="0" y="28" fontFamily="Inter, sans-serif" fontSize="28" fill={color} fontWeight="300" letterSpacing="-0.02em">cync</text>
    </svg>
  );

  const CyncLockup = ({ color, accentColor, size = 1 }: { color: string; accentColor: string; size?: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 * size }}>
      <div style={{ width: 28 * size, height: 28 * size, borderRadius: "50%", background: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={16 * size} height={16 * size} viewBox="0 0 16 16" fill="none">
          <path d="M4 10 C4 10, 6 4, 8 7 C10 10, 12 3, 12 3" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <CyncWordmark color={color} size={size} />
    </div>
  );

  const LogoDisplay = ({ label, children, bg, padding = 40 }: { label: string; children: any; bg: string; padding?: number }) => (
    <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ background: bg, padding, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 100 }}>
        {children}
      </div>
      <div style={{ background: "#fff", padding: "8px 16px", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize: 11, color: "#8a7d74" }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F7F2EB", color: "#0D0B0A", minHeight: "100vh", padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 8 }}>Chaos & Co</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Logo Concepts</h1>
          <p style={{ color: "#6b5e54", fontSize: 14 }}>Four variations — wordmark, icon+wordmark, icon-only, and Cync sub-brand lockup</p>
        </div>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>1. Primary Wordmark</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <LogoDisplay label="On Cream" bg="#F7F2EB">
              <WordmarkSVG color="#0D0B0A" size={1.2} />
            </LogoDisplay>
            <LogoDisplay label="On Warm Black" bg="#0D0B0A">
              <WordmarkSVG color="#F7F2EB" size={1.2} />
            </LogoDisplay>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <LogoDisplay label="Small — 0.7x" bg="#F7F2EB" padding={24}>
              <WordmarkSVG color="#0D0B0A" size={0.7} />
            </LogoDisplay>
            <LogoDisplay label="Small — On Dark" bg="#0D0B0A" padding={24}>
              <WordmarkSVG color="#F7F2EB" size={0.7} />
            </LogoDisplay>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>2. Icon + Wordmark Lockup</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <LogoDisplay label="On Cream" bg="#F7F2EB">
              <IconWordmark color="#0D0B0A" size={1.1} />
            </LogoDisplay>
            <LogoDisplay label="On Warm Black" bg="#0D0B0A">
              <IconWordmark color="#F7F2EB" size={1.1} />
            </LogoDisplay>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <LogoDisplay label="With Copper accent" bg="#F7F2EB">
              <IconWordmark color="#B07D52" size={1.1} />
            </LogoDisplay>
            <LogoDisplay label="With Rose accent" bg="#0D0B0A">
              <IconWordmark color="#C4846E" size={1.1} />
            </LogoDisplay>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>3. Icon-Only Mark</h2>
          <p style={{ fontSize: 13, color: "#6b5e54", marginBottom: 20 }}>Abstract symbol: the journey from chaos (scattered energy) to order (focused point). A wave within a circle — cyclical energy finding its rhythm.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <LogoDisplay label="On Cream" bg="#F7F2EB">
              <IconMark color="#0D0B0A" size={1.4} />
            </LogoDisplay>
            <LogoDisplay label="On Black" bg="#0D0B0A">
              <IconMark color="#F7F2EB" size={1.4} />
            </LogoDisplay>
            <LogoDisplay label="Copper" bg="#F7F2EB">
              <IconMark color="#B07D52" size={1.4} />
            </LogoDisplay>
            <LogoDisplay label="Rose" bg="#0D0B0A">
              <IconMark color="#C4846E" size={1.4} />
            </LogoDisplay>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>4. Cync Sub-Brand Lockup</h2>
          <p style={{ fontSize: 13, color: "#6b5e54", marginBottom: 20 }}>The Cync app wordmark uses Inter Light to signal digital/modern within the Chaos & Co ecosystem. The lavender circle ties it to the sub-brand signature color.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <LogoDisplay label="On Cream" bg="#F7F2EB">
              <CyncLockup color="#0D0B0A" accentColor="#EDE4F5" size={1.3} />
            </LogoDisplay>
            <LogoDisplay label="On Warm Black" bg="#0D0B0A">
              <CyncLockup color="#F7F2EB" accentColor="#EDE4F5" size={1.3} />
            </LogoDisplay>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <LogoDisplay label="Standalone Cync wordmark — Cream" bg="#F7F2EB" padding={24}>
              <CyncWordmark color="#0D0B0A" size={1.2} />
            </LogoDisplay>
            <LogoDisplay label="Standalone Cync wordmark — Dark" bg="#0D0B0A" padding={24}>
              <CyncWordmark color="#F7F2EB" size={1.2} />
            </LogoDisplay>
          </div>
        </section>
      </div>
    </div>
  );
}
