import { useState, useEffect } from "react";

const DARK = "#0d0d0d";
const CARD = "#1a1a1a";
const BORDER = "#2a2a2a";
const BLUSH = "#c9a99a";
const GOLD = "#b8956a";
const CREAM = "#f5ede4";
const MUTED = "#888";

interface AdminStats {
  totalUsers: number;
  totalGuests: number;
  totalProfiles: number;
  recentUsers: Array<{
    id: string;
    username: string;
    email?: string;
    createdAt?: string;
  }>;
  signupsByDay: Record<string, number>;
  profiles: Array<{
    id: string;
    name: string;
    cycleStatus?: string;
    cycleReason?: string;
    concerns?: string[];
    age?: number;
    relationshipStatus?: string;
    createdAt?: string;
  }>;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "profiles">("overview");

  const fetchStats = async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?secret=${encodeURIComponent(s)}`);
      if (res.status === 401) {
        setError("Wrong secret key. Try again.");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setStats(data);
      setSecret(s);
      localStorage.setItem("cync_admin_secret", s);
    } catch (e) {
      setError("Could not connect. Check that the server is running.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("cync_admin_secret");
    if (saved) fetchStats(saved);
  }, []);

  const formatDate = (d?: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const maxSignups = stats ? Math.max(...Object.values(stats.signupsByDay), 1) : 1;

  if (!stats) {
    return (
      <div style={{ minHeight: "100vh", background: DARK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "48px 40px", width: 360, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌿</div>
          <h1 style={{ color: CREAM, fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Cync Admin</h1>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>Enter your admin secret key to continue</p>
          {error && <p style={{ color: "#e07070", fontSize: 13, marginBottom: 16 }}>{error}</p>}
          <input
            type="password"
            placeholder="Admin secret key"
            value={inputSecret}
            onChange={e => setInputSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchStats(inputSecret)}
            style={{ width: "100%", padding: "12px 16px", background: "#111", border: `1px solid ${BORDER}`, borderRadius: 8, color: CREAM, fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
          />
          <button
            onClick={() => fetchStats(inputSecret)}
            disabled={loading || !inputSecret}
            style={{ width: "100%", padding: "12px 0", background: BLUSH, color: "#1a0f0a", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: DARK, fontFamily: "Georgia, serif", color: CREAM }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <span style={{ fontSize: 20, fontWeight: 600 }}>Cync Admin</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => fetchStats(secret)} style={{ padding: "8px 16px", background: "#222", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, fontSize: 13, cursor: "pointer" }}>↻ Refresh</button>
          <button onClick={() => { setStats(null); setSecret(""); localStorage.removeItem("cync_admin_secret"); }} style={{ padding: "8px 16px", background: "#222", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, fontSize: 13, cursor: "pointer" }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Registered Users", value: stats.totalUsers, color: BLUSH },
            { label: "Guest Sessions", value: stats.totalGuests, color: GOLD },
            { label: "Profiles Created", value: stats.totalProfiles, color: "#9ab8a0" },
          ].map(card => (
            <div key={card.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: card.color }}>{card.value}</div>
              <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Signups chart (last 30 days) */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 20px", marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: CREAM, marginBottom: 20 }}>Signups — Last 30 Days</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
            {Object.entries(stats.signupsByDay).map(([day, count]) => (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  title={`${day}: ${count} signup${count !== 1 ? "s" : ""}`}
                  style={{
                    width: "100%",
                    height: count === 0 ? 4 : Math.max(8, (count / maxSignups) * 72),
                    background: count === 0 ? BORDER : BLUSH,
                    borderRadius: 3,
                    transition: "height 0.3s",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: MUTED, fontSize: 11 }}>
            <span>{Object.keys(stats.signupsByDay)[0]}</span>
            <span>{Object.keys(stats.signupsByDay)[Object.keys(stats.signupsByDay).length - 1]}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["overview", "users", "profiles"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px",
                background: activeTab === tab ? BLUSH : "#222",
                color: activeTab === tab ? "#1a0f0a" : MUTED,
                border: `1px solid ${activeTab === tab ? BLUSH : BORDER}`,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users table */}
        {activeTab === "users" && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Username", "Email", "Joined"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 13, color: MUTED, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.filter(u => !u.username.startsWith("guest_")).map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < stats.recentUsers.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: CREAM }}>{u.username}</td>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: MUTED }}>{u.email || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED }}>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
                {stats.recentUsers.filter(u => !u.username.startsWith("guest_")).length === 0 && (
                  <tr><td colSpan={3} style={{ padding: "32px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>No registered users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Profiles table */}
        {activeTab === "profiles" && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Name", "Cycle Status", "Concerns", "Age", "Created"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 13, color: MUTED, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.profiles.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < stats.profiles.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ padding: "14px 20px", fontSize: 14, color: CREAM }}>{p.name || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, background: p.cycleStatus === "no_period" ? "#2a1a1a" : "#1a2a1a", color: p.cycleStatus === "no_period" ? "#e07070" : "#9ab8a0", fontSize: 12 }}>
                        {p.cycleStatus === "no_period" ? (p.cycleReason || "No period") : "Cycling"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: MUTED }}>{Array.isArray(p.concerns) ? p.concerns.slice(0, 2).join(", ") : "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED }}>{p.age || "—"}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED }}>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
                {stats.profiles.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "32px 20px", textAlign: "center", color: MUTED, fontSize: 14 }}>No profiles yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}>
              <h3 style={{ fontSize: 15, color: CREAM, marginBottom: 16 }}>Recent Signups</h3>
              {stats.recentUsers.filter(u => !u.username.startsWith("guest_")).slice(0, 8).map(u => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, color: CREAM }}>{u.username}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{formatDate(u.createdAt)}</span>
                </div>
              ))}
              {stats.recentUsers.filter(u => !u.username.startsWith("guest_")).length === 0 && (
                <p style={{ color: MUTED, fontSize: 14 }}>No registered users yet</p>
              )}
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}>
              <h3 style={{ fontSize: 15, color: CREAM, marginBottom: 16 }}>Cycle Status Breakdown</h3>
              {(() => {
                const cycling = stats.profiles.filter(p => p.cycleStatus !== "no_period").length;
                const noPeriod = stats.profiles.filter(p => p.cycleStatus === "no_period").length;
                const total = stats.profiles.length || 1;
                return (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: CREAM }}>Cycling</span>
                        <span style={{ fontSize: 13, color: MUTED }}>{cycling} ({Math.round(cycling / total * 100)}%)</span>
                      </div>
                      <div style={{ height: 8, background: BORDER, borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${cycling / total * 100}%`, background: "#9ab8a0", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: CREAM }}>No period</span>
                        <span style={{ fontSize: 13, color: MUTED }}>{noPeriod} ({Math.round(noPeriod / total * 100)}%)</span>
                      </div>
                      <div style={{ height: 8, background: BORDER, borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${noPeriod / total * 100}%`, background: BLUSH, borderRadius: 4 }} />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
