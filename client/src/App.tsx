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

const SPLASH_SESSION_KEY = "cync_splash_shown";

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
  const [showSplash, setShowSplash] = useState(false);
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

        // Show splash once per session
        const splashShown = sessionStorage.getItem(SPLASH_SESSION_KEY);
        if (!splashShown) {
          setShowSplash(true);
          sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
        }
      })
      .catch(() => setLocation("/onboarding"));
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Transparent logo watermarks — background texture */}
      <div className="fixed top-[-80px] right-[-80px] pointer-events-none select-none z-0" style={{ opacity: 0.035 }}>
        <svg width="340" height="340" viewBox="0 0 120 120" fill="none" className="text-foreground" style={{ color: 'currentColor' }}>
          <path d="M60 20 C60 20, 72 35, 68 50 C66 58, 70 62, 70 62 C70 62, 80 52, 76 38 C74 30, 78 22, 78 22 C78 22, 90 38, 86 55 C82 70, 70 78, 60 80 C50 78, 38 70, 34 55 C30 38, 42 22, 42 22 C42 22, 46 30, 44 38 C40 52, 50 62, 50 62 C50 62, 54 58, 52 50 C48 35, 60 20, 60 20Z" fill="currentColor" />
          <path d="M60 80 C60 80, 48 88, 44 98 C52 94, 60 96, 60 96 C60 96, 68 94, 76 98 C72 88, 60 80, 60 80Z" fill="currentColor" />
          <path d="M44 98 C38 92, 30 94, 28 100 C34 98, 44 98, 44 98Z" fill="currentColor" opacity="0.7" />
          <path d="M76 98 C82 92, 90 94, 92 100 C86 98, 76 98, 76 98Z" fill="currentColor" opacity="0.7" />
          <path d="M60 96 L60 112" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 104 C56 108, 50 110, 46 112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M60 104 C64 108, 70 110, 74 112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fixed bottom-[-100px] left-[-100px] pointer-events-none select-none z-0" style={{ opacity: 0.025 }}>
        <svg width="420" height="420" viewBox="0 0 120 120" fill="none" className="text-foreground">
          <path d="M60 20 C60 20, 72 35, 68 50 C66 58, 70 62, 70 62 C70 62, 80 52, 76 38 C74 30, 78 22, 78 22 C78 22, 90 38, 86 55 C82 70, 70 78, 60 80 C50 78, 38 70, 34 55 C30 38, 42 22, 42 22 C42 22, 46 30, 44 38 C40 52, 50 62, 50 62 C50 62, 54 58, 52 50 C48 35, 60 20, 60 20Z" fill="currentColor" />
          <path d="M60 80 C60 80, 48 88, 44 98 C52 94, 60 96, 60 96 C60 96, 68 94, 76 98 C72 88, 60 80, 60 80Z" fill="currentColor" />
          <path d="M60 96 L60 112" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 104 C56 108, 50 110, 46 112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M60 104 C64 108, 70 110, 74 112" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fixed top-[45%] right-[2%] pointer-events-none select-none z-0" style={{ opacity: 0.02 }}>
        <svg width="160" height="160" viewBox="0 0 120 120" fill="none" className="text-foreground">
          <path d="M60 20 C60 20, 72 35, 68 50 C66 58, 70 62, 70 62 C70 62, 80 52, 76 38 C74 30, 78 22, 78 22 C78 22, 90 38, 86 55 C82 70, 70 78, 60 80 C50 78, 38 70, 34 55 C30 38, 42 22, 42 22 C42 22, 46 30, 44 38 C40 52, 50 62, 50 62 C50 62, 54 58, 52 50 C48 35, 60 20, 60 20Z" fill="currentColor" />
          <path d="M60 80 C60 80, 48 88, 44 98 C52 94, 60 96, 60 96 C60 96, 68 94, 76 98 C72 88, 60 80, 60 80Z" fill="currentColor" />
          <path d="M60 96 L60 112" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showSplash && (
        <QuoteSplash
          onDismiss={() => setShowSplash(false)}
          lastPeriodStart={profileData?.lastPeriodStart}
          cycleLength={profileData?.cycleLength}
        />
      )}
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
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>
            <Route path="/" component={LandingWrapper} />
            <Route path="/onboarding" component={OnboardingPage} />
            <Route path="/partner-brief" component={PartnerBriefPage} />
            <Route path="/cynclink/:token" component={CyncLinkPage} />
            <Route>
              <ProtectedApp />
            </Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
