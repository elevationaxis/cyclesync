import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppNavigation from "@/components/AppNavigation";
import Dashboard from "@/pages/Dashboard";
import CheckInPage from "@/pages/CheckInPage";
import ChatPage from "@/pages/ChatPage";
import LearnPage from "@/pages/LearnPage";
import PartnerViewPage from "@/pages/PartnerViewPage";
import RitualsPage from "@/pages/RitualsPage";
import PartnerSupportPage from "@/pages/PartnerSupportPage";
import CommunityPage from "@/pages/CommunityPage";
import CalendarPage from "@/pages/CalendarPage";
import SettingsPage from "@/pages/SettingsPage";
import SpoonTrackerPage from "@/pages/SpoonTrackerPage";
import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import PartnerBriefPage from "@/pages/PartnerBriefPage";
import CyncLinkPage from "@/pages/CyncLinkPage";
import AdminPage from "@/pages/AdminPage";
import QuoteSplash from "@/components/QuoteSplash";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState, useEffect } from "react";

// Splash fires on every app open — no session gating

function AppRouter({ isPartnerView }: { isPartnerView: boolean }) {
  if (isPartnerView) {
    return <PartnerViewPage />;
  }

  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/check-in" component={CheckInPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/rituals" component={RitualsPage} />
      <Route path="/partner-support" component={PartnerSupportPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/spoons" component={SpoonTrackerPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function LandingWrapper() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If there's already a real (non-guest) session, skip the landing page
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(async (user) => {
        if (user && !user.isGuest) {
          // Real returning user — check they have a profile then send to dashboard
          const profileRes = await fetch(`/api/profile/user/${user.id}`, { credentials: "include" });
          if (profileRes.ok) {
            setLocation("/dashboard");
            return;
          }
        }
        // Guest session or no session — clear stale guest localStorage and show landing
        if (user?.isGuest) {
          // Destroy the stale guest session so the next "Try as Guest" gets a fresh one
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        }
        localStorage.removeItem("cycleSync_profileId");
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [setLocation]);

  const handleGetStarted = () => {
    setLocation("/onboarding");
  };

  const handleTryAsGuest = async () => {
    try {
      const res = await fetch("/api/auth/guest", { method: "POST", credentials: "include" });
      if (res.ok) {
        localStorage.setItem("cycleSync_profileId", "guest");
        setLocation("/dashboard");
      }
    } catch (e) {
      console.error("Guest login failed", e);
    }
  };

  const handleSignIn = async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setLocation("/dashboard");
        return null;
      }
      const data = await res.json();
      return data.error || "Invalid username or password";
    } catch {
      return "Something went wrong. Please try again.";
    }
  };

  if (checking) {
    // Brief blank screen while we check session — avoids flash of landing for returning users
    return null;
  }

  return (
    <LandingPage
      onGetStarted={handleGetStarted}
      onTryAsGuest={handleTryAsGuest}
      onSignIn={handleSignIn}
    />
  );
}

function ProtectedApp() {
  const [isPartnerView, setIsPartnerView] = useState(false);
  const [profileData, setProfileData] = useState<{ lastPeriodStart?: string | null; cycleLength?: number } | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check session first — works for both real users and guests
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(async (user) => {
        if (!user) {
          // No session — check localStorage for legacy profile
          const hasProfile = localStorage.getItem("cycleSync_profileId");
          if (!hasProfile || hasProfile === "guest") {
            setLocation("/onboarding");
            return;
          }
          // Legacy: fetch by profile id
          const profileRes = await fetch(`/api/profile/${hasProfile}`);
          if (profileRes.ok) {
            const data = await profileRes.json();
            setProfileData({ lastPeriodStart: data.lastPeriodStart, cycleLength: data.cycleLength });
          } else {
            setLocation("/onboarding");
          }
        } else {
          // Authenticated user (real or guest) — fetch profile by userId
          const profileRes = await fetch(`/api/profile/user/${user.id}`);
          if (profileRes.ok) {
            const data = await profileRes.json();
            setProfileData({ lastPeriodStart: data.lastPeriodStart, cycleLength: data.cycleLength });
          } else if (!user.isGuest) {
            setLocation("/onboarding");
          }
        }
      })
      .catch(() => setLocation("/onboarding"));
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Transparent logo watermarks — real brand mark */}
      <div className="fixed top-[-80px] right-[-80px] pointer-events-none select-none z-0" style={{ opacity: 0.06 }}>
        <img src="/logo-mark.png" alt="" width={340} height={340} style={{ objectFit: 'contain' }} />
      </div>
      <div className="fixed bottom-[-100px] left-[-100px] pointer-events-none select-none z-0" style={{ opacity: 0.04 }}>
        <img src="/logo-mark.png" alt="" width={420} height={420} style={{ objectFit: 'contain' }} />
      </div>
      <div className="fixed top-[45%] right-[2%] pointer-events-none select-none z-0" style={{ opacity: 0.03 }}>
        <img src="/logo-mark.png" alt="" width={160} height={160} style={{ objectFit: 'contain' }} />
      </div>

      <div className="relative z-10">
        <AppNavigation 
          isPartnerView={isPartnerView}
          onTogglePartnerView={() => setIsPartnerView(!isPartnerView)}
        />
        <AppRouter isPartnerView={isPartnerView} />
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* ScrollToTop fires on every route change — lands at top of every page */}
          <ScrollToTop />
          {/* Splash always fires first on every open, before any routing */}
          {showSplash && (
            <QuoteSplash
              onDismiss={() => setShowSplash(false)}
            />
          )}
          {!showSplash && (
            <Switch>
              <Route path="/" component={LandingWrapper} />
              <Route path="/onboarding" component={OnboardingPage} />
              <Route path="/partner-brief" component={PartnerBriefPage} />
              <Route path="/cynclink/:token" component={CyncLinkPage} />
              <Route path="/admin" component={AdminPage} />
              <Route>
                <ProtectedApp />
              </Route>
            </Switch>
          )}
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
