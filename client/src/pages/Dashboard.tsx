import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import CycleCompass from '@/components/CycleCompass';
import PhaseCard from '@/components/PhaseCard';
import TipsCard from '@/components/TipsCard';
import GentleWins from '@/components/GentleWins';
import { getCurrentPhase, getPhaseInfo, calculateCycleDay, getPhaseForCycleLength } from '@/lib/cycleUtils';
import { getNutritionForDay } from '@/lib/nutritionData';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ClipboardCheck, Wind, Heart, Utensils, Calendar, ArrowRight, Users, Zap, Battery, BatteryLow, BatteryMedium, BatteryFull, Brain, Flower2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SpoonEntry, UserProfile } from "@shared/schema";
import { saveMoods, loadMoods, getProfileId, getUserName } from "@/lib/storage";

const phaseMessages: Record<string, string[]> = {
  menstrual: [
    "Hey sis, take it easy today. Your body is doing important work.",
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
    "Be gentle with yourself, love. This phase asks for softness.",
  ],
};

const spoonMessages = {
  low: "Move slow today, love. Hydrate. One thing at a time.",
  medium: "You've got enough to get one meaningful thing done. Don't overspend.",
  high: "Protect your spoons, sis — not everyone deserves them.",
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

// Section header component with quick-glance summary and expand toggle
function SectionAccordion({
  icon: Icon,
  title,
  accent,
  glance,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent: string;
  glance: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-border/40 overflow-hidden shadow-sm">
      {/* Header / quick glance — always visible */}
      <button
        className="w-full text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-4 px-6 py-5" style={{ background: `${accent}10` }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}22` }}>
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-display font-medium italic text-lg" style={{ color: accent }}>{title}</span>
            </div>
            <div className="text-sm text-muted-foreground truncate">{glance}</div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {open
              ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
              : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-6 pb-6 pt-2 space-y-5 bg-background">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  useEffect(() => {
    loadMoods().then(setSelectedMoods);
  }, []);

  const profileId = getProfileId();
  const userName = getUserName();

  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ["/api/profile", profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const response = await fetch(`/api/profile/${profileId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!profileId,
  });

  const isNoPeriod = profile?.cycleStatus === 'no_period';

  const { cycleDay, currentPhase, phaseInfo } = useMemo(() => {
    if (isNoPeriod) {
      // No-period users: use a neutral 'follicular' baseline — symptom-based, not cycle-day-based
      return {
        cycleDay: null,
        currentPhase: 'follicular' as const,
        phaseInfo: getPhaseInfo('follicular'),
      };
    }
    if (profile?.lastPeriodStart) {
      const day = calculateCycleDay(profile.lastPeriodStart, profile.cycleLength || 28);
      const phase = getPhaseForCycleLength(day, profile.cycleLength || 28);
      return { cycleDay: day, currentPhase: phase, phaseInfo: getPhaseInfo(phase) };
    }
    return {
      cycleDay: 12,
      currentPhase: getCurrentPhase(12),
      phaseInfo: getPhaseInfo(getCurrentPhase(12)),
    };
  }, [profile, isNoPeriod]);

  const userId = profileId || "demo-user";

  const toggleMood = (value: string) => {
    setSelectedMoods(prev => {
      const next = prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value];
      saveMoods(next);
      return next;
    });
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
  const nutrition = getNutritionForDay(cycleDay);

  const remainingSpoons = spoonEntry ? spoonEntry.totalSpoons - spoonEntry.usedSpoons : null;

  const getSpoonLevel = (remaining: number | null, total: number | undefined) => {
    if (remaining === null || !total) return null;
    const pct = (remaining / total) * 100;
    if (pct <= 30) return 'low';
    if (pct <= 60) return 'medium';
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

  // Phase accent colors
  const phaseAccent: Record<string, string> = {
    menstrual: '#8B4A6B',
    follicular: '#5B8A6B',
    ovulatory: '#C4846E',
    luteal: '#7A6B8A',
  };
  const accent = phaseAccent[currentPhase] || '#8B4A6B';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Pinned header: always visible ── */}
      <div className="text-center pb-2">
        <h1 className="font-display text-3xl md:text-4xl font-normal italic text-foreground mb-1">
          {userName ? `Welcome back, ${userName.split(' ')[0]}` : 'Your Daily Cync'}
        </h1>
        <p className="font-label text-base text-muted-foreground tracking-wide">
          {isNoPeriod ? 'Hormone Tracking Mode' : `${phaseInfo.name} · Day ${cycleDay}`}
        </p>
      </div>

      {/* ── Pinned phase + cycle glance card ── */}
      <Card className="border-0 shadow-sm rounded-3xl" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <span className="text-2xl">{nutrition.emoji}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-medium italic text-lg capitalize">
                    {isNoPeriod ? 'How are you feeling?' : currentPhase}
                  </span>
                  {!isNoPeriod && cycleDay && (
                    <Badge variant="outline" className="text-xs rounded-full" style={{ borderColor: `${accent}50`, color: accent }}>Day {cycleDay}</Badge>
                  )}
                  {isNoPeriod && (
                    <Badge variant="outline" className="text-xs rounded-full" style={{ borderColor: `${accent}50`, color: accent }}>Symptom-Based</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isNoPeriod
                    ? 'Tracking your body by how you feel, not cycle day'
                    : `${phaseInfo.energy} energy · ${phaseInfo.supportTone}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {remainingSpoons !== null && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <SpoonIcon className="w-4 h-4" />
                  <span>{remainingSpoons} spoons</span>
                </div>
              )}
              <Link href="/check-in">
                <Button size="sm" className="rounded-full" style={{ background: accent, color: '#fff' }}>
                  Check In <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── MIND ── */}
      <SectionAccordion
        icon={Brain}
        title="Mind"
        accent="#7A6B8A"
        glance={
          <span className="italic">"{todaysMessage}"</span>
        }
      >
        {/* Aunt B message */}
        <Card className="border-0 bg-gradient-to-br from-[hsl(var(--brand-copper)/0.12)] to-[hsl(var(--brand-sage)/0.08)] rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--brand-copper)/0.15)] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-display font-medium italic">Aunt B</span>
                <p className="font-display font-normal italic text-foreground leading-relaxed mt-1">
                  &ldquo;{todaysMessage}&rdquo;
                </p>
                <Link href="/chat">
                  <Button variant="secondary" size="sm" className="rounded-full mt-3">
                    Chat with Aunt B <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood check-in */}
        <div>
          <h3 className="font-display font-medium italic mb-3 text-muted-foreground">How are you feeling?</h3>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map((mood) => (
              <Badge
                key={mood.value}
                variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
                className={`cursor-pointer font-label text-sm py-2 px-4 rounded-full transition-all tracking-wide ${
                  selectedMoods.includes(mood.value) ? 'bg-primary text-primary-foreground' : 'border-border/60'
                }`}
                onClick={() => toggleMood(mood.value)}
              >
                {mood.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mind tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipsCard category="Mind" tips={tips.Mind} />
          <TipsCard category="Flow" tips={tips.Flow} />
        </div>

        {/* Gentle wins */}
        <GentleWins />
      </SectionAccordion>

      {/* ── BODY ── */}
      <SectionAccordion
        icon={Flower2}
        title="Body"
        accent="#5B8A6B"
        glance={
          spoonLevel
            ? <span>{spoonMessages[spoonLevel as keyof typeof spoonMessages]}</span>
            : <span>{phaseInfo.focus}</span>
        }
      >
        {/* Spoon tracker */}
        {spoonLevel && (
          <Card className="border-0 rounded-2xl" style={{ background: 'hsl(var(--brand-lavender)/0.3)' }}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  spoonLevel === 'low' ? 'bg-rose-100 dark:bg-rose-900/30' :
                  spoonLevel === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-emerald-100 dark:bg-emerald-900/30'
                }`}>
                  <SpoonIcon className={`w-6 h-6 ${
                    spoonLevel === 'low' ? 'text-rose-600' :
                    spoonLevel === 'medium' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium capitalize">{spoonLevel} Spoons</span>
                    <span className="text-xs text-muted-foreground">({remainingSpoons} of {spoonEntry?.totalSpoons})</span>
                  </div>
                  <p className="text-muted-foreground italic text-sm">"{spoonMessages[spoonLevel as keyof typeof spoonMessages]}"</p>
                </div>
                <Link href="/spoons">
                  <Button size="sm" variant="outline" className="rounded-full">Track</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Energy focus */}
        <Card className="border-0 bg-sage-soft rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display font-medium italic mb-1">Energy Focus</h3>
                <p className="text-muted-foreground text-sm">{phaseInfo.focus}</p>
                <p className="text-xs text-muted-foreground/80 italic mt-1">{phaseInfo.supportTone} energy this phase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nourish */}
        <Card className="border-0 rounded-2xl overflow-hidden" style={{ background: `${nutrition.color}15`, border: `1px solid ${nutrition.color}25` }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{nutrition.emoji}</span>
                <span className="font-display font-medium italic">Nourish{!isNoPeriod ? ` — ${nutrition.phase}` : ""}</span>
              </div>
              <Link href="/learn">
                <Button variant="ghost" size="sm" className="text-xs rounded-full" style={{ color: nutrition.color }}>
                  Full recipes <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: `${nutrition.color}12` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span>🥤</span>
                  <span className="font-medium text-sm">{nutrition.smoothie.name}</span>
                </div>
                <ul className="space-y-1">
                  {nutrition.smoothie.ingredients.slice(0, 4).map((ing, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span style={{ color: nutrition.accent }} className="flex-shrink-0">·</span>
                      {ing.split('(')[0].trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-3" style={{ background: `${nutrition.color}12` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span>🥜</span>
                  <span className="font-medium text-sm">{nutrition.trailMix.name}</span>
                </div>
                <ul className="space-y-1">
                  {nutrition.trailMix.ingredients.slice(0, 4).map((ing, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span style={{ color: nutrition.accent }} className="flex-shrink-0">·</span>
                      {ing.split('(')[0].trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">{nutrition.smoothie.tip}</p>
          </CardContent>
        </Card>

        {/* Body tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipsCard category="Body" tips={tips.Body} />
          <TipsCard category="Food" tips={tips.Food} />
        </div>
      </SectionAccordion>

      {/* ── SOUL ── */}
      <SectionAccordion
        icon={Sparkles}
        title="Soul"
        accent="#C4846E"
        glance={
          <span>{phaseInfo.description}</span>
        }
      >
        {/* Partner support */}
        <Card className="border-0 bg-rose-soft rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--brand-rose)/0.25)] flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-medium italic mb-2">Partner Support Today</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {currentPhase === 'menstrual' && "Be extra gentle. She needs rest and comfort right now."}
                  {currentPhase === 'follicular' && "Great time to plan something fun together. Her energy is rising!"}
                  {currentPhase === 'ovulatory' && "She's feeling social and communicative. Quality time matters."}
                  {currentPhase === 'luteal' && "Be extra patient. Luteal energy is winding down."}
                </p>
                <Link href="/partner-support">
                  <Button size="sm" variant="outline" className="rounded-full">
                    Open Partner View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cycle compass — hidden for no-period users */}
        {!isNoPeriod && <CycleCompass cycleDay={cycleDay} />}

        {/* Rituals */}
        <Card className="border-0 rounded-2xl" style={{ background: 'hsl(var(--brand-lavender)/0.2)' }}>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wind className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-display font-medium italic">Breath Reset</h3>
                <p className="text-xs text-muted-foreground">Quick calm-down ritual</p>
              </div>
            </div>
            <Link href="/rituals">
              <Button size="sm" variant="outline" className="rounded-full">Open</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Phase cards — hidden for no-period users */}
        {!isNoPeriod && (
          <div>
            <h3 className="font-display font-medium italic mb-3 text-muted-foreground">Understanding the Phases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhaseCard phase="menstrual" />
              <PhaseCard phase="follicular" />
              <PhaseCard phase="ovulatory" />
              <PhaseCard phase="luteal" />
            </div>
          </div>
        )}
      </SectionAccordion>

    </div>
  );
}
