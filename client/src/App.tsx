import { Switch, Route } from "wouter";
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
import { useState, useEffect } from "react";

function Router({ isPartnerView }: { isPartnerView: boolean }) {
  if (isPartnerView) {
    return <PartnerViewPage />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
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

function App() {
  const [isPartnerView, setIsPartnerView] = useState(false);
  const [hasEntered, setHasEntered] = useState(() => {
    return localStorage.getItem("cycle-sync-entered") === "true";
  });

  useEffect(() => {
    if (hasEntered) {
      localStorage.setItem("cycle-sync-entered", "true");
    }
  }, [hasEntered]);

  const handleGetStarted = () => {
    setHasEntered(true);
  };

  if (!hasEntered) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LandingPage onGetStarted={handleGetStarted} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <AppNavigation 
            isPartnerView={isPartnerView}
            onTogglePartnerView={() => setIsPartnerView(!isPartnerView)}
          />
          <Router isPartnerView={isPartnerView} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
