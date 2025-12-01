import { useState } from "react";
import { Link } from "wouter";
import CycleCompass from '@/components/CycleCompass';
import PhaseCard from '@/components/PhaseCard';
import TipsCard from '@/components/TipsCard';
import GentleWins from '@/components/GentleWins';
import { getCurrentPhase, getPhaseInfo } from '@/lib/cycleUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ClipboardCheck, Wind, Heart, Utensils, Calendar, ArrowRight, Users, Zap, Battery, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SpoonEntry } from "@shared/schema";

const phaseMessages: Record<string, string[]> = {
  menstrual: [
    "Hey honey, take it easy today. Your body is doing important work.",
    "Rest isn't lazy, love. It's necessary. Let me know if you need anything.",
    "Some days are for doing less, and that's more than okay.",
  ],
  follicular: [
    "Good morning, sunshine! Your energy is building — what feels exciting today?",
    "This is your fresh start energy. Dream a little, plan a little.",
    "I see that spark in you. Let's make today count.",
  ],
  ovulatory: [
    "You're glowing, love. This is your time to shine if you want to.",
    "Your energy is at its peak. Use it for what matters most to you.",
    "Connection feels good right now, doesn't it? Reach out if you need to.",
  ],
  luteal: [
    "Winding down is wisdom, not weakness. Listen to what you need.",
    "It's okay to slow down now. Your body knows what's coming.",
    "Be gentle with yourself, honey. This phase asks for softness.",
  ],
};

const spoonMessages = {
  low: "Baby, move slow today. Hydrate. One thing at a time.",
  medium: "You've got enough to get one meaningful thing done. Don't overspend.",
  high: "Protect your spoons, honey — not everyone deserves them.",
};

const moodOptions = [
  { label: "Overwhelmed", value: "overwhelmed" },
  { label: "Tired", value: "tired" },
  { label: "Irritated", value: "irritated" },
  { label: "Motivated", value: "motivated" },
  { label: "Soft day", value: "soft" },
  { label: "Anxious", value: "anxious" },
  { label: "Calm", value: "calm" },
  { label: "Grateful", value: "grateful" },
];

export default function Dashboard() {
  const cycleDay = 12;
  const currentPhase = getCurrentPhase(cycleDay);
  const phaseInfo = getPhaseInfo(currentPhase);
  const userId = "demo-user";
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const toggleMood = (value: string) => {
    setSelectedMoods(prev => 
      prev.includes(value) 
        ? prev.filter(m => m !== value) 
        : [...prev, value]
    );
  };

  const { data: spoonEntry } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch spoon entry");
      return response.json();
    },
  });

  const messages = phaseMessages[currentPhase];
  const todaysMessage = messages[Math.floor(Date.now() / 86400000) % messages.length];

  const phaseTips = {
    menstrual: {
      Mind: ['Journal without judgment', 'Allow yourself to feel', 'Practice self-compassion'],
      Body: ['Warm baths', 'Gentle stretching', 'Extra rest'],
      Food: ['Warm soups', 'Iron-rich greens', 'Comfort foods'],
      Flow: ['Light schedule', 'Cozy environments', 'Less screen time'],
    },
    follicular: {
      Mind: ['Start new projects', 'Brainstorm ideas', 'Learn something new'],
      Body: ['Try new workouts', 'Dance or move', 'Explore outdoors'],
      Food: ['Fresh vegetables', 'Light proteins', 'Energizing smoothies'],
      Flow: ['Plan ahead', 'Organize spaces', 'Social connections'],
    },
    ovulatory: {
      Mind: ['Have important talks', 'Share your voice', 'Make decisions'],
      Body: ['High-intensity workouts', 'Team sports', 'Active adventures'],
      Food: ['Light, fresh meals', 'Cooling foods', 'Hydrating options'],
      Flow: ['Schedule meetings', 'Social events', 'Presentations'],
    },
    luteal: {
      Mind: ['Set boundaries', 'Complete projects', 'Reflect inward'],
      Body: ['Moderate exercise', 'Yoga', 'Restorative movement'],
      Food: ['Magnesium-rich foods', 'Dark chocolate', 'Complex carbs'],
      Flow: ['Wrap up tasks', 'Nest at home', 'Say no freely'],
    },
  };

  const tips = phaseTips[currentPhase];

  const quickActions = [
    { label: "Daily Check-In", icon: ClipboardCheck, href: "/check-in", description: "Log how you're feeling" },
    { label: "Ask Aunt B", icon: MessageCircle, href: "/chat", description: "Get support and guidance" },
    { label: "Breath Reset", icon: Wind, href: "/rituals", description: "Quick calm-down ritual" },
    { label: "Partner Brief", icon: Heart, href: "/partner-support", description: "Share with your partner" },
  ];

  const remainingSpoons = spoonEntry 
    ? spoonEntry.totalSpoons - spoonEntry.usedSpoons 
    : null;

  const getSpoonLevel = (remaining: number | null, total: number | undefined) => {
    if (remaining === null || !total) return null;
    const percentage = (remaining / total) * 100;
    if (percentage <= 30) return 'low';
    if (percentage <= 60) return 'medium';
    return 'high';
  };

  const spoonLevel = getSpoonLevel(remainingSpoons, spoonEntry?.totalSpoons);

  const getSpoonIcon = (level: string | null) => {
    switch (level) {
      case 'low': return BatteryLow;
      case 'medium': return BatteryMedium;
      case 'high': return BatteryFull;
      default: return Battery;
    }
  };

  const SpoonIcon = getSpoonIcon(spoonLevel);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-[hsl(var(--cozy-lilac))] to-background" data-testid="card-today-glance">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Today at a Glance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cycle Day</span>
                <span className="text-2xl font-bold text-primary">{cycleDay}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Phase</span>
                <span className="font-semibold capitalize">{currentPhase}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Energy Level</span>
                <span className="font-medium">{phaseInfo.energy}</span>
              </div>
              
              {remainingSpoons !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Utensils className="w-4 h-4" />
                    Spoons Today
                  </span>
                  <Link href="/spoons">
                    <span className="font-semibold text-primary cursor-pointer hover:underline">
                      {remainingSpoons} remaining
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {phaseInfo.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-[hsl(var(--cozy-lilac))]" data-testid="card-aunt-b-message">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-semibold text-lg">Aunt B</span>
                  <span className="text-xs text-muted-foreground">Check-In</span>
                </div>
                <p className="text-foreground leading-relaxed text-lg">
                  "{todaysMessage}"
                </p>
                <div className="mt-6">
                  <Link href="/chat">
                    <Button variant="secondary" className="rounded-full" data-testid="button-chat-with-aunt-b">
                      Chat with Aunt B
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {spoonLevel && (
        <section>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-[hsl(var(--cozy-lilac)/0.5)] to-background" data-testid="card-spoon-message">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    spoonLevel === 'low' ? 'bg-rose-100 dark:bg-rose-900/30' :
                    spoonLevel === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                    'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    <SpoonIcon className={`w-6 h-6 ${
                      spoonLevel === 'low' ? 'text-rose-600 dark:text-rose-400' :
                      spoonLevel === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                      'text-emerald-600 dark:text-emerald-400'
                    }`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium capitalize">{spoonLevel} Spoons</span>
                    <span className="text-xs text-muted-foreground">({remainingSpoons} of {spoonEntry?.totalSpoons})</span>
                  </div>
                  <p className="text-muted-foreground italic">
                    "{spoonMessages[spoonLevel as keyof typeof spoonMessages]}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
        <div className="flex flex-wrap gap-2" data-testid="mood-chips-container">
          {moodOptions.map((mood) => (
            <Badge
              key={mood.value}
              variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
              className={`cursor-pointer text-sm py-2 px-4 transition-all ${
                selectedMoods.includes(mood.value) 
                  ? 'bg-[hsl(var(--cozy-plum))] hover:bg-[hsl(var(--cozy-plum)/0.9)] text-white' 
                  : 'hover:bg-[hsl(var(--cozy-lilac))]'
              }`}
              onClick={() => toggleMood(mood.value)}
              data-testid={`mood-chip-${mood.value}`}
            >
              {mood.label}
            </Badge>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm bg-[hsl(var(--cozy-peach)/0.3)]" data-testid="card-partner-preview">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--cozy-peach))] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[hsl(var(--cozy-plum))]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Partner Support Today</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {currentPhase === 'menstrual' && "Be extra gentle. She needs rest and comfort right now."}
                  {currentPhase === 'follicular' && "Great time to plan something fun together. Her energy is rising!"}
                  {currentPhase === 'ovulatory' && "She's feeling social and communicative. Quality time matters."}
                  {currentPhase === 'luteal' && "Be extra patient. Luteal energy is winding down."}
                </p>
                <Link href="/partner-support">
                  <Button size="sm" variant="outline" className="rounded-full" data-testid="button-partner-view">
                    Open Partner View
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm" data-testid="card-energy-summary">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--cozy-lilac))] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[hsl(var(--cozy-plum))]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Energy Focus</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {phaseInfo.focus}
                </p>
                <p className="text-xs text-muted-foreground/80 italic">
                  {phaseInfo.supportTone} energy this phase
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full" data-testid={`card-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CardContent className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[hsl(var(--cozy-lilac))] mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <CycleCompass cycleDay={cycleDay} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Today's Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TipsCard category="Mind" tips={tips.Mind} />
          <TipsCard category="Body" tips={tips.Body} />
          <TipsCard category="Food" tips={tips.Food} />
          <TipsCard category="Flow" tips={tips.Flow} />
        </div>
      </section>

      <section>
        <GentleWins />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Understanding the Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhaseCard phase="menstrual" />
          <PhaseCard phase="follicular" />
          <PhaseCard phase="ovulatory" />
          <PhaseCard phase="luteal" />
        </div>
      </section>
    </div>
  );
}
