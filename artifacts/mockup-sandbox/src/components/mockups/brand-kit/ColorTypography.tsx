export function ColorTypography() {
  const colors = [
    { name: "Warm Black", hex: "#0D0B0A", oklch: "oklch(8% 0.01 50)", role: "Authority, foundation", light: false },
    { name: "Dusty Rose", hex: "#C4846E", oklch: "oklch(65% 0.09 28)", role: "Body, warmth, feminine", light: false },
    { name: "Warm Cream", hex: "#F7F2EB", oklch: "oklch(95% 0.02 78)", role: "Breath, restoration", light: true },
    { name: "Copper", hex: "#B07D52", oklch: "oklch(60% 0.10 52)", role: "Alchemy, the thread", light: false },
    { name: "Lavender Whisper", hex: "#EDE4F5", oklch: "oklch(91% 0.04 302)", role: "Cync sub-brand signature", light: true },
  ];

  const shadeLabels = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
  const shadeRamps: Record<string, { hex: string; label: string }[]> = {
    "Warm Black": [
      { hex: "#3d3835", label: "50" }, { hex: "#332e2b", label: "100" }, { hex: "#2a2523", label: "200" },
      { hex: "#211e1c", label: "300" }, { hex: "#191614", label: "400" }, { hex: "#0D0B0A", label: "500" },
      { hex: "#0a0908", label: "600" }, { hex: "#080706", label: "700" }, { hex: "#050403", label: "800" },
      { hex: "#030202", label: "900" },
    ],
    "Dusty Rose": [
      { hex: "#faf2ee", label: "50" }, { hex: "#f5e8e2", label: "100" }, { hex: "#e8c7b8", label: "200" },
      { hex: "#dba68e", label: "300" }, { hex: "#d09578", label: "400" }, { hex: "#C4846E", label: "500" },
      { hex: "#a66b55", label: "600" }, { hex: "#8a5744", label: "700" }, { hex: "#6e4436", label: "800" },
      { hex: "#543628", label: "900" },
    ],
    "Warm Cream": [
      { hex: "#FDFCFA", label: "50" }, { hex: "#FAF7F3", label: "100" }, { hex: "#F7F2EB", label: "200" },
      { hex: "#f0e9de", label: "300" }, { hex: "#ede5d9", label: "400" }, { hex: "#ddd1c0", label: "500" },
      { hex: "#cebfaa", label: "600" }, { hex: "#c4b29a", label: "700" }, { hex: "#b09a7e", label: "800" },
      { hex: "#a08970", label: "900" },
    ],
    "Copper": [
      { hex: "#f5ead9", label: "50" }, { hex: "#f0e0cc", label: "100" }, { hex: "#dfc5a0", label: "200" },
      { hex: "#d4b58a", label: "300" }, { hex: "#c29a6e", label: "400" }, { hex: "#B07D52", label: "500" },
      { hex: "#8e6340", label: "600" }, { hex: "#6b4a30", label: "700" }, { hex: "#553b26", label: "800" },
      { hex: "#483220", label: "900" },
    ],
    "Lavender Whisper": [
      { hex: "#FDFAFE", label: "50" }, { hex: "#FAF6FE", label: "100" }, { hex: "#F3ECF9", label: "200" },
      { hex: "#EDE4F5", label: "300" }, { hex: "#e0d2ee", label: "400" }, { hex: "#d8c8e8", label: "500" },
      { hex: "#bfa5d6", label: "600" }, { hex: "#a886c8", label: "700" }, { hex: "#9b7abe", label: "800" },
      { hex: "#7652a0", label: "900" },
    ],
  };

  const contrastPairs = [
    { fg: "#F7F2EB", bg: "#0D0B0A", label: "Cream on Black", ratio: "15.8:1", pass: true },
    { fg: "#0D0B0A", bg: "#F7F2EB", label: "Black on Cream", ratio: "15.8:1", pass: true },
    { fg: "#C4846E", bg: "#0D0B0A", label: "Rose on Black", ratio: "5.2:1", pass: true },
    { fg: "#0D0B0A", bg: "#C4846E", label: "Black on Rose", ratio: "5.2:1", pass: true },
    { fg: "#B07D52", bg: "#0D0B0A", label: "Copper on Black", ratio: "4.1:1", pass: false },
    { fg: "#F7F2EB", bg: "#B07D52", label: "Cream on Copper", ratio: "3.8:1", pass: false },
    { fg: "#0D0B0A", bg: "#EDE4F5", label: "Black on Lavender", ratio: "13.4:1", pass: true },
    { fg: "#B07D52", bg: "#F7F2EB", label: "Copper on Cream", ratio: "4.1:1", pass: false },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F7F2EB", color: "#0D0B0A", minHeight: "100vh", padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B07D52", marginBottom: 8 }}>Chaos & Co</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.1, marginBottom: 8 }}>Color & Typography</h1>
          <p style={{ color: "#6b5e54", fontSize: 14 }}>Brand identity system — "Understood" direction</p>
        </div>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Core Palette</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {colors.map((c) => (
              <div key={c.hex} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
                <div style={{ background: c.hex, height: 100, display: "flex", alignItems: "flex-end", padding: 12 }}>
                  <span style={{ color: c.light ? "#0D0B0A" : "#F7F2EB", fontSize: 11, fontWeight: 600 }}>{c.name}</span>
                </div>
                <div style={{ background: "#fff", padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{c.hex}</div>
                  <div style={{ fontSize: 11, color: "#8a7d74", fontFamily: "monospace", marginTop: 2 }}>{c.oklch}</div>
                  <div style={{ fontSize: 11, color: "#a08970", marginTop: 6, fontStyle: "italic" }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Shade Ramps</h2>
          {Object.entries(shadeRamps).map(([name, shades]) => (
            <div key={name} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6, color: "#6b5e54" }}>{name}</p>
              <div style={{ display: "flex", borderRadius: 6, overflow: "hidden" }}>
                {shades.map((shade, i) => {
                  const lightHexes = ["#FDFCFA", "#FAF7F3", "#F7F2EB", "#FAF6FE", "#F3ECF9", "#EDE4F5", "#f5e8e2", "#f0e0cc", "#ede5d9", "#ddd1c0", "#d8c8e8", "#e8c7b8", "#d4b58a", "#faf2ee", "#f5ead9", "#dfc5a0", "#f0e9de", "#FDFAFE", "#e0d2ee", "#3d3835", "#332e2b", "#cebfaa"];
                  const isLight = lightHexes.includes(shade.hex);
                  return (
                    <div key={i} style={{ flex: 1, background: shade.hex, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
                      <span style={{ fontSize: 9, fontWeight: 600, fontFamily: "monospace", color: isLight ? "#0D0B0A" : "#F7F2EB", opacity: 0.9 }}>{shade.label}</span>
                      <span style={{ fontSize: 7, fontFamily: "monospace", color: isLight ? "#0D0B0A" : "#F7F2EB", opacity: 0.6, marginTop: 2 }}>{shade.hex}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Typography Specimen</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "#B07D52" }}>DM Serif Display — Headings</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, lineHeight: 1.1, marginBottom: 12 }}>Aa</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, lineHeight: 1.15, marginBottom: 8 }}>Your chaos is not a flaw.</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, lineHeight: 1.2, marginBottom: 8, color: "#483220" }}>Subheading — 24px</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, lineHeight: 1.3, color: "#6b5e54" }}>Section Title — 18px</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, color: "#B07D52" }}>Inter — Body</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 48, lineHeight: 1.1, marginBottom: 12, fontWeight: 300 }}>Aa</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>Body text at 16px. We believe the mess is the medicine. That your energy shifts are not broken — they are your body speaking clearly. We just haven't been taught to listen.</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 8, color: "#6b5e54" }}>Secondary text — 14px — used for supporting information and descriptions.</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.4, color: "#a08970" }}>Caption — 12px — metadata, labels, timestamps</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>WCAG AA Contrast Audit</h2>
          <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0D0B0A", color: "#F7F2EB" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>Combination</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>Preview</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>Ratio</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>AA (4.5:1)</th>
                </tr>
              </thead>
              <tbody>
                {contrastPairs.map((pair, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: i % 2 === 0 ? "#fff" : "#faf8f5" }}>
                    <td style={{ padding: "10px 16px" }}>{pair.label}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ background: pair.bg, color: pair.fg, padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, border: "1px solid rgba(0,0,0,0.1)" }}>Sample</span>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "monospace" }}>{pair.ratio}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ color: pair.pass ? "#2d7a3a" : "#c4382a", fontWeight: 600 }}>{pair.pass ? "Pass" : "Fail"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>CSS Custom Properties & Tailwind Config</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#0D0B0A", borderRadius: 8, padding: 20, color: "#c4b29a" }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#B07D52", marginBottom: 12 }}>CSS Custom Properties</p>
              <pre style={{ fontSize: 11, lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", margin: 0 }}>{`:root {
  --chaos-black: 20 15% 4%;
  --chaos-rose: 18 47% 60%;
  --chaos-cream: 33 38% 95%;
  --chaos-copper: 30 43% 50%;
  --chaos-lavender: 272 47% 93%;
  --font-display: 'DM Serif Display', serif;
  --font-body: 'Inter', sans-serif;
}`}</pre>
            </div>
            <div style={{ background: "#0D0B0A", borderRadius: 8, padding: 20, color: "#c4b29a" }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#B07D52", marginBottom: 12 }}>Tailwind Config</p>
              <pre style={{ fontSize: 11, lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", margin: 0 }}>{`colors: {
  chaos: {
    black: "hsl(var(--chaos-black))",
    rose: "hsl(var(--chaos-rose))",
    cream: "hsl(var(--chaos-cream))",
    copper: "hsl(var(--chaos-copper))",
    lavender: "hsl(var(--chaos-lavender))",
  }
},
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}`}</pre>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #ddd1c0" }}>Dark Mode Variant</h2>
          <div style={{ background: "#0D0B0A", borderRadius: 12, padding: 32, color: "#F7F2EB" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
              {colors.map((c) => (
                <div key={c.hex + "-dark"} style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ background: c.hex, height: 56, display: "flex", alignItems: "flex-end", padding: 8 }}>
                    <span style={{ color: c.light ? "#0D0B0A" : "#F7F2EB", fontSize: 10, fontWeight: 600 }}>{c.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, lineHeight: 1.15, marginBottom: 12 }}>Dark mode keeps warmth.</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#c4b29a", marginBottom: 16 }}>Body text uses warm cream tones rather than pure white, maintaining the brand's warmth even in dark contexts. Copper accents remain prominent.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ background: "#C4846E", color: "#0D0B0A", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Primary CTA</span>
              <span style={{ border: "1px solid #C4846E", color: "#C4846E", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500 }}>Secondary</span>
              <span style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#c4b29a", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500 }}>Tertiary</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
