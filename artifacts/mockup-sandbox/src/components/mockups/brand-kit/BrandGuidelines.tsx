export function BrandGuidelines() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F7F2EB", color: "#0D0B0A", minHeight: "100vh", padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 8 }}>Chaos & Co</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Brand Guidelines</h1>
          <p style={{ color: "#6b5e54", fontSize: 14 }}>Usage rules, voice & tone, and brand architecture</p>
        </div>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Color Usage Rules</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Primary Surfaces</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, background: "#0D0B0A" }} />
                <div style={{ width: 32, height: 32, borderRadius: 4, background: "#F7F2EB", border: "1px solid rgba(0,0,0,0.1)" }} />
              </div>
              <p style={{ fontSize: 12, color: "#6b5e54", lineHeight: 1.5 }}>Warm Black for hero sections, headers, and premium areas. Warm Cream for body/content backgrounds. Never use pure white (#FFF) or pure black (#000).</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Accent Usage</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, background: "#C4846E" }} />
                <div style={{ width: 32, height: 32, borderRadius: 4, background: "#B07D52" }} />
              </div>
              <p style={{ fontSize: 12, color: "#6b5e54", lineHeight: 1.5 }}>Dusty Rose for primary CTAs, links, and key highlights. Copper for secondary accents, labels, and supporting elements. Neither should be used as backgrounds for large areas.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Sub-brand Color</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 4, background: "#EDE4F5", border: "1px solid rgba(0,0,0,0.06)" }} />
              </div>
              <p style={{ fontSize: 12, color: "#6b5e54", lineHeight: 1.5 }}>Lavender Whisper is reserved for the Cync sub-brand. Used for Cync icon backgrounds, badges, and UI accents within the app. Not used in parent-brand Chaos & Co materials.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Ratio Guidance</p>
              <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ flex: 5, background: "#0D0B0A" }} />
                <div style={{ flex: 3, background: "#F7F2EB" }} />
                <div style={{ flex: 1.5, background: "#C4846E" }} />
                <div style={{ flex: 0.5, background: "#B07D52" }} />
              </div>
              <p style={{ fontSize: 12, color: "#6b5e54", lineHeight: 1.5 }}>50% Warm Black, 30% Warm Cream, 15% Dusty Rose, 5% Copper. This ratio creates the premium, editorial feel. Lavender enters only in Cync contexts.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Typography Hierarchy</h2>
          <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ede5d9" }}>
                  <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600, width: "22%" }}>Level</th>
                  <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600, width: "28%" }}>Font</th>
                  <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600, width: "15%" }}>Size</th>
                  <th style={{ padding: "8px 0", textAlign: "left", fontWeight: 600, width: "35%" }}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Display", "DM Serif Display, 400", "48-64px", "Hero headlines, landing page titles"],
                  ["H1", "DM Serif Display, 400", "36-40px", "Page titles, section headings"],
                  ["H2", "DM Serif Display, 400", "24-28px", "Sub-section headings"],
                  ["H3", "DM Serif Display, 400", "18-20px", "Card titles, feature labels"],
                  ["Body", "Inter, 400", "16px", "Primary body copy"],
                  ["Body Small", "Inter, 400", "14px", "Secondary text, descriptions"],
                  ["Caption", "Inter, 400", "12px", "Metadata, labels, timestamps"],
                  ["Overline", "Inter, 500", "11-12px", "Section labels (uppercase, tracked)"],
                ].map(([level, font, size, usage], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0ece6" }}>
                    <td style={{ padding: "10px 0", fontWeight: 600 }}>{level}</td>
                    <td style={{ padding: "10px 0", color: "#6b5e54", fontFamily: "monospace", fontSize: 11 }}>{font}</td>
                    <td style={{ padding: "10px 0", color: "#8a7d74" }}>{size}</td>
                    <td style={{ padding: "10px 0", color: "#6b5e54" }}>{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Voice & Tone</h2>
          <div style={{ background: "#0D0B0A", borderRadius: 12, padding: 32, color: "#F7F2EB", marginBottom: 24 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 16 }}>Brand Voice Attributes</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              {["Knowing", "Warm", "Direct", "Unhurried", "Slightly Conspiratorial", "Honest"].map(attr => (
                <span key={attr} style={{ border: "1px solid rgba(196,132,110,0.3)", color: "#C4846E", padding: "6px 16px", borderRadius: 20, fontSize: 13 }}>{attr}</span>
              ))}
            </div>
            <p style={{ fontSize: 14, color: "#c4b29a", lineHeight: 1.6 }}>Think: a wise older friend who's been through it, speaks plainly, and doesn't sugarcoat. Not clinical. Not spiritual. Not performative. She's the person who says the thing everyone's thinking but no one will say out loud.</p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Sample Headlines</p>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Your rage makes sense. So does your joy. We'll teach you the difference.",
                "Your body has been trying to tell you something. We're the translator.",
                "Stop apologizing for your energy. Start understanding it.",
              ].map((line, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 8, padding: 20, border: "1px solid rgba(0,0,0,0.06)" }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, lineHeight: 1.3, color: "#0D0B0A" }}>{line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Do / Don't</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ background: "#1a3a1e", color: "#b8dabb", borderRadius: "8px 8px 0 0", padding: "8px 16px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Do</div>
              <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", border: "1px solid rgba(0,0,0,0.06)", borderTop: "none" }}>
                {[
                  "Use warm, knowing language that validates the reader's experience",
                  "Lead with empathy, follow with action",
                  'Say "your body" not "a body" — make it personal',
                  "Use DM Serif Display for all headings, Inter for body text",
                  "Keep Warm Black as the dominant visual weight",
                  "Use the conspiratorial tone: 'between you and me' energy",
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid #f0ece6" : "none", fontSize: 13, display: "flex", gap: 8 }}>
                    <span style={{ color: "#2d7a3a", fontWeight: 700 }}>+</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ background: "#3a1a1e", color: "#dab8b8", borderRadius: "8px 8px 0 0", padding: "8px 16px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Don't</div>
              <div style={{ background: "#fff", borderRadius: "0 0 8px 8px", border: "1px solid rgba(0,0,0,0.06)", borderTop: "none" }}>
                {[
                  "Use clinical or medical language (\"menstruation\" → \"your period\")",
                  "Be preachy, prescriptive, or lecture-y",
                  "Use pure white (#FFF) or pure black (#000) in any surface",
                  "Mix DM Serif Display into body copy or small text",
                  "Use Lavender outside of Cync sub-brand contexts",
                  "Use witchy, woo-woo, or overly spiritual framing",
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderTop: i > 0 ? "1px solid #f0ece6" : "none", fontSize: 13, display: "flex", gap: 8 }}>
                    <span style={{ color: "#c4382a", fontWeight: 700 }}>-</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Brand Architecture</h2>
          <div style={{ background: "#0D0B0A", borderRadius: 12, padding: 40, color: "#F7F2EB" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ border: "2px solid #C4846E", borderRadius: 12, padding: "16px 40px", marginBottom: 8 }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24 }}>Chaos <span style={{ opacity: 0.4 }}>&</span> Co</p>
                </div>
                <p style={{ fontSize: 11, color: "#8a7d74", textTransform: "uppercase", letterSpacing: "0.15em" }}>Parent Brand</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
              <div style={{ width: 1, height: 40, background: "rgba(247,242,235,0.2)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 700, margin: "0 auto" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ border: "2px solid #EDE4F5", borderRadius: 12, padding: "16px 32px", marginBottom: 8, display: "inline-block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#EDE4F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
                        <path d="M4 10 C4 10, 6 4, 8 7 C10 10, 12 3, 12 3" stroke="#0D0B0A" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 300 }}>cync</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#8a7d74", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Digital Product</p>
                <div style={{ border: "1px solid rgba(237,228,245,0.2)", borderRadius: 8, padding: "12px 20px", display: "inline-block" }}>
                  <p style={{ fontSize: 13, color: "#EDE4F5" }}>CyncLink</p>
                  <p style={{ fontSize: 10, color: "#6b5e54" }}>Partner Feature</p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ border: "2px solid #C4846E", borderRadius: 12, padding: "16px 32px", marginBottom: 8, display: "inline-block" }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>The Sanctuary</p>
                </div>
                <p style={{ fontSize: 11, color: "#8a7d74", textTransform: "uppercase", letterSpacing: "0.15em" }}>Physical Space</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
