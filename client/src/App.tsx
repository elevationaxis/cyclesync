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
import { useState, useEffect } from "react";

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

  return <LandingPage onGetStarted={handleGetStarted} />;
}

function ProtectedApp() {
  const [isPartnerView, setIsPartnerView] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasProfile = localStorage.getItem("cycleSync_profileId");
    if (!hasProfile) {
      setLocation("/onboarding");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation 
        isPartnerView={isPartnerView}
        onTogglePartnerView={() => setIsPartnerView(!isPartnerView)}
      />
      <AppRouter isPartnerView={isPartnerView} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={LandingWrapper} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route>
            <ProtectedApp />
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
