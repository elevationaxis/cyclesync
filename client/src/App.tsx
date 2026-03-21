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
import SpoonTrackerPage from "@/pages/SpoonTrackerPage";
import LandingPage from "@/pages/LandingPage";
import OnboardingPage from "@/pages/OnboardingPage";
import PartnerBriefPage from "@/pages/PartnerBriefPage";
import CyncLinkPage from "@/pages/CyncLinkPage";
import QuoteSplash from "@/components/QuoteSplash";
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
      <Route component={NotFound} />
    </Switch>
  );
}

function LandingWrapper() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/onboarding");
  };

  const handleTryAsGuest = async () => {
    try {
      const res = await fetch("/api/auth/guest", { method: "POST", credentials: "include" });
      if (res.ok) {
        // Mark profile as set so ProtectedApp doesn't redirect to onboarding
        localStorage.setItem("cycleSync_profileId", "guest");
        setLocation("/dashboard");
      }
    } catch (e) {
      console.error("Guest login failed", e);
    }
  };

  return <LandingPage onGetStarted={handleGetStarted} onTryAsGuest={handleTryAsGuest} />;
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
      {/* Transparent logo watermarks — correct brand mark */}
      <div className="fixed top-[-80px] right-[-80px] pointer-events-none select-none z-0" style={{ opacity: 0.035 }}>
        <svg width="340" height="370" viewBox="0 0 120 130" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="text-foreground" style={{ color: 'currentColor' }}>
          <path d="M60 8 C57 16 52 24 52 34 C52 42 55 47 60 48 C65 47 68 42 68 34 C68 24 63 16 60 8Z" fill="currentColor" />
          <path d="M60 20 C58 26 57 32 58 38 C59 43 61 43 62 38 C63 32 62 26 60 20Z" fill="currentColor" opacity="0.4" />
          <path d="M52 36 C46 36 36 40 30 48 C25 55 28 65 37 66 C44 67 51 59 52 50 C53 45 53 40 52 36Z" fill="currentColor" />
          <path d="M68 36 C74 36 84 40 90 48 C95 55 92 65 83 66 C76 67 69 59 68 50 C67 45 67 40 68 36Z" fill="currentColor" />
          <path d="M52 50 C54 56 57 61 60 63 C63 61 66 56 68 50" />
          <path d="M60 63 L60 73" />
          <path d="M57 68 C50 72 40 77 24 88" />
          <path d="M58 70 C53 76 46 82 36 96" />
          <path d="M59 72 C57 79 55 87 53 102" />
          <path d="M60 73 C60 81 60 90 60 104" />
          <path d="M61 72 C63 79 65 87 67 102" />
          <path d="M62 70 C67 76 74 82 84 96" />
          <path d="M63 68 C70 72 80 77 96 88" />
        </svg>
      </div>
      <div className="fixed bottom-[-100px] left-[-100px] pointer-events-none select-none z-0" style={{ opacity: 0.025 }}>
        <svg width="420" height="455" viewBox="0 0 120 130" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
          <path d="M60 8 C57 16 52 24 52 34 C52 42 55 47 60 48 C65 47 68 42 68 34 C68 24 63 16 60 8Z" fill="currentColor" />
          <path d="M52 36 C46 36 36 40 30 48 C25 55 28 65 37 66 C44 67 51 59 52 50 C53 45 53 40 52 36Z" fill="currentColor" />
          <path d="M68 36 C74 36 84 40 90 48 C95 55 92 65 83 66 C76 67 69 59 68 50 C67 45 67 40 68 36Z" fill="currentColor" />
          <path d="M52 50 C54 56 57 61 60 63 C63 61 66 56 68 50" />
          <path d="M60 63 L60 73" />
          <path d="M57 68 C50 72 40 77 24 88" />
          <path d="M58 70 C53 76 46 82 36 96" />
          <path d="M59 72 C57 79 55 87 53 102" />
          <path d="M60 73 C60 81 60 90 60 104" />
          <path d="M61 72 C63 79 65 87 67 102" />
          <path d="M62 70 C67 76 74 82 84 96" />
          <path d="M63 68 C70 72 80 77 96 88" />
        </svg>
      </div>
      <div className="fixed top-[45%] right-[2%] pointer-events-none select-none z-0" style={{ opacity: 0.02 }}>
        <svg width="160" height="174" viewBox="0 0 120 130" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
          <path d="M60 8 C57 16 52 24 52 34 C52 42 55 47 60 48 C65 47 68 42 68 34 C68 24 63 16 60 8Z" fill="currentColor" />
          <path d="M52 36 C46 36 36 40 30 48 C25 55 28 65 37 66 C44 67 51 59 52 50 C53 45 53 40 52 36Z" fill="currentColor" />
          <path d="M68 36 C74 36 84 40 90 48 C95 55 92 65 83 66 C76 67 69 59 68 50 C67 45 67 40 68 36Z" fill="currentColor" />
          <path d="M60 63 L60 73" />
          <path d="M57 68 C50 72 40 77 24 88" />
          <path d="M60 73 C60 81 60 90 60 104" />
          <path d="M63 68 C70 72 80 77 96 88" />
        </svg>
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
