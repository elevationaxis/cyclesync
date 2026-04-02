import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProfileId } from "@/lib/storage";
import { Settings, Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const profileId = getProfileId();

  const [profile, setProfile] = useState<{
    name?: string;
    lastPeriodStart?: string | null;
    cycleLength?: number;
    cycleStatus?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [periodDate, setPeriodDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/profile/${profileId}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        if (data.lastPeriodStart) {
          // Format as YYYY-MM-DD for the date input
          const d = new Date(data.lastPeriodStart);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          setPeriodDate(`${yyyy}-${mm}-${dd}`);
        }
        if (data.cycleLength) {
          setCycleLength(String(data.cycleLength));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  const handleSave = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      if (periodDate) body.lastPeriodStart = periodDate;
      if (cycleLength) body.cycleLength = parseInt(cycleLength, 10);

      const res = await fetch(`/api/profile/${profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast({
          title: "Saved",
          description: "Your cycle info has been updated.",
        });
        // Refresh the page so dashboard picks up new data
        window.location.reload();
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Couldn't save your changes. Try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0B0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#C4B8A8", fontFamily: "Inter, sans-serif" }}>Loading...</div>
      </div>
    );
  }

  const isCycling = profile?.cycleStatus !== "no_period";

  return (
    <div style={{ minHeight: "100vh", background: "#0D0B0A", color: "#F7F2EB", fontFamily: "Inter, sans-serif", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "#1A1614", borderBottom: "1px solid #2A2420", padding: "1.5rem" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Settings style={{ width: "20px", height: "20px", color: "#B07D52" }} />
            <h1 style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: "1.6rem", margin: 0 }}>
              Settings
            </h1>
          </div>
          {profile?.name && (
            <p style={{ color: "#9A8A7A", fontSize: "0.85rem", margin: "0.25rem 0 0 2rem" }}>
              {profile.name}'s profile
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "1.5rem" }}>

        {/* Cycle Info Section */}
        {isCycling && (
          <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
              Cycle Info
            </div>

            {/* Last Period Start */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#C4B8A8", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                First day of last period
              </label>
              <input
                type="date"
                value={periodDate}
                onChange={e => setPeriodDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  background: "#0D0B0A",
                  border: "1px solid #3A3028",
                  borderRadius: "10px",
                  color: "#F7F2EB",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  fontFamily: "Inter, sans-serif",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ color: "#6A5A4A", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                This is day 1 of your cycle. Update it whenever your period starts.
              </p>
            </div>

            {/* Cycle Length */}
            <div>
              <label style={{ display: "block", color: "#C4B8A8", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                Average cycle length (days)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="range"
                  min="21"
                  max="45"
                  value={cycleLength}
                  onChange={e => setCycleLength(e.target.value)}
                  style={{ flex: 1, accentColor: "#B07D52" }}
                />
                <span style={{
                  background: "#B07D52",
                  color: "#0D0B0A",
                  borderRadius: "8px",
                  padding: "0.25rem 0.75rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  minWidth: "3rem",
                  textAlign: "center",
                }}>
                  {cycleLength}
                </span>
              </div>
              <p style={{ color: "#6A5A4A", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                Most cycles are 21–35 days. The average is 28.
              </p>
            </div>
          </div>
        )}

        {/* No-period users */}
        {!isCycling && (
          <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ color: "#B07D52", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
              Cycle Status
            </div>
            <p style={{ color: "#C4B8A8", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Your profile is set to track without a period. If this has changed, re-run onboarding to update your cycle status.
            </p>
          </div>
        )}

        {/* Save Button */}
        {isCycling && (
          <button
            onClick={handleSave}
            disabled={saving || !periodDate}
            style={{
              width: "100%",
              background: saving ? "#3A3028" : "#B07D52",
              color: saving ? "#6A5A4A" : "#0D0B0A",
              border: "none",
              borderRadius: "12px",
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {saving ? (
              <>
                <RefreshCw style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : (
              <>
                <Save style={{ width: "16px", height: "16px" }} />
                Save Changes
              </>
            )}
          </button>
        )}

        {/* Danger Zone — re-onboard */}
        <div style={{ background: "#1A1614", border: "1px solid #2A2420", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ color: "#8B4A6B", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            Start Over
          </div>
          <p style={{ color: "#9A8A7A", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1rem" }}>
            If you want to change your cycle status, health concerns, or other profile details, you can re-run the full setup.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("cycleSync_profileId");
              window.location.href = "/onboarding";
            }}
            style={{
              background: "transparent",
              border: "1px solid #8B4A6B",
              borderRadius: "10px",
              color: "#8B4A6B",
              padding: "0.6rem 1.25rem",
              fontSize: "0.85rem",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            Re-run Setup
          </button>
        </div>

      </div>
    </div>
  );
}
