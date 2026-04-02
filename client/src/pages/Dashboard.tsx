import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import HormoneChart from '@/components/HormoneChart';
import AskAuntB from '@/components/AskAuntB';
import { getCurrentPhase, getPhaseInfo, calculateCycleDay, getPhaseForCycleLength } from '@/lib/cycleUtils';
import { getDailyBriefing, getPhaseStartDay } from '@/lib/dailyBriefing';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle, Wind, Heart, ArrowRight, Users, Zap,
  Battery, BatteryLow, BatteryMedium, BatteryFull,
  ChevronDown, ChevronUp, Dumbbell, Utensils, Coffee,
  BookOpen, XCircle, Pill, ClipboardCheck
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SpoonEntry, UserProfile } from "@shared/schema";
import { saveMoods, loadMoods, getProfileId, getUserName } from "@/lib/storage";

// ── Phase accent colors ──────────────────────────────────────────────────────
const phaseAccent: Record<string, string> = {
  menstrual: '#8B4A6B',
  follicular: '#5B8A6B',
  ovulatory: '#C4846E',
  luteal: '#7A6B8A',
};

const phaseDisplayName: Record<string, string> = {
  menstrual: 'Flow',
  follicular: 'Bloom',
  ovulatory: 'Spark',
  luteal: 'Alchemy',
};

const phaseExpect: Record<string, string> = {
  menstrual: "Low energy, inward focus, heightened intuition. Rest is the work right now.",
  follicular: "Energy building, mental clarity rising, creativity opening up. Good time to begin.",
  ovulatory: "Peak energy, magnetic, communicative. Your most outward and connected phase.",
  luteal: "Turning inward, discernment sharp, emotions closer to the surface. Honor the slowdown.",
};

// ── Mood options ─────────────────────────────────────────────────────────────
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

// ── Briefing row component ───────────────────────────────────────────────────
function BriefingRow({
  icon: Icon,
  label,
  text,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${accent}18` }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium tracking-widest uppercase block mb-0.5" style={{ color: `${accent}99` }}>
          {label}
        </span>
        <p className="text-sm leading-relaxed text-foreground/85">{text}</p>
      </div>
    </div>
  );
}

// ── Collapsible check-in section ─────────────────────────────────────────────
function CheckInSection({
  accent,
  selectedMoods,
  onToggleMood,
  spoonEntry,
  remainingSpoons,
  spoonLevel,
}: {
  accent: string;
  selectedMoods: string[];
  onToggleMood: (v: string) => void;
  spoonEntry: SpoonEntry | null | undefined;
  remainingSpoons: number | null;
  spoonLevel: 'low' | 'medium' | 'high' | null;
}) {
  const [open, setOpen] = useState(false);

  const SpoonIcon = spoonLevel === 'low' ? BatteryLow : spoonLevel === 'medium' ? BatteryMedium : BatteryFull;
  const spoonColor = spoonLevel === 'low' ? '#e57373' : spoonLevel === 'medium' ? '#ffb74d' : '#81c784';

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${accent}20` }}>
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between"
        style={{ background: `${accent}08` }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-4 h-4" style={{ color: accent }} />
          <span className="text-sm font-medium" style={{ color: accent }}>
            How are you feeling today?
          </span>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4 space-y-5 bg-background">
          {/* Mood */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: `${accent}80` }}>Mood</p>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map(mood => (
                <Badge
                  key={mood.value}
                  variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-3 rounded-full transition-all"
                  style={
                    selectedMoods.includes(mood.value)
                      ? { background: accent, color: '#fff', borderColor: accent }
                      : { borderColor: `${accent}40` }
                  }
                  onClick={() => onToggleMood(mood.value)}
                >
                  {mood.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Spoons */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: `${accent}80` }}>Energy (Spoons)</p>
            {remainingSpoons !== null && spoonEntry ? (
              <div className="flex items-center gap-3">
                <SpoonIcon className="w-5 h-5" style={{ color: spoonColor }} />
                <span className="text-sm">{remainingSpoons} of {spoonEntry.totalSpoons} spoons remaining</span>
                <Link href="/spoons">
                  <Button size="sm" variant="outline" className="rounded-full h-7 text-xs px-3 ml-auto">Update</Button>
                </Link>
              </div>
            ) : (
              <Link href="/spoons">
                <Button size="sm" variant="outline" className="rounded-full" style={{ borderColor: `${accent}40`, color: accent }}>
                  Track your spoons <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
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

  const remainingSpoons = spoonEntry ? spoonEntry.totalSpoons - spoonEntry.usedSpoons : null;

  const getSpoonLevel = (remaining: number | null, total: number | undefined): 'low' | 'medium' | 'high' | null => {
    if (remaining === null || !total) return null;
    const pct = (remaining / total) * 100;
    if (pct <= 30) return 'low';
    if (pct <= 60) return 'medium';
    return 'high';
  };

  const spoonLevel = getSpoonLevel(remainingSpoons, spoonEntry?.totalSpoons);

  // Daily briefing — rotates by day within phase
  const phaseStartDay = cycleDay ? getPhaseStartDay(cycleDay, profile?.cycleLength || 28) : 1;
  const briefing = getDailyBriefing(currentPhase, cycleDay, phaseStartDay);

  const accent = phaseAccent[currentPhase] || '#8B4A6B';
  const phaseName = phaseDisplayName[currentPhase] || currentPhase;
  const expectText = phaseExpect[currentPhase] || '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="text-center pb-2">
        <h1 className="font-display text-3xl font-normal italic text-foreground mb-1">
          {userName ? `${userName.split(' ')[0]}'s Day` : 'Your Daily Cync'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── 1. Phase Card ── */}
      <Card
        className="border-0 shadow-sm rounded-3xl"
        style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-display font-medium italic text-2xl"
                  style={{ color: accent }}
                >
                  {isNoPeriod ? 'Your Body Today' : phaseName}
                </span>
                {!isNoPeriod && cycleDay && (
                  <Badge
                    variant="outline"
                    className="text-xs rounded-full"
                    style={{ borderColor: `${accent}50`, color: accent }}
                  >
                    Day {cycleDay}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isNoPeriod
                  ? 'Tracking by how you feel, not cycle day.'
                  : expectText}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}22` }}
            >
              <Heart className="w-6 h-6" style={{ color: accent }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Hormone Chart ── */}
      {!isNoPeriod && (
        <HormoneChart
          cycleDay={cycleDay}
          cycleLength={profile?.cycleLength || 28}
        />
      )}

      {/* ── 3. Daily Briefing ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-display font-medium italic text-lg" style={{ color: accent }}>
            Today's Briefing
          </h2>
          {!isNoPeriod && cycleDay && (
            <span className="text-xs text-muted-foreground">
              {phaseName} · Day {cycleDay}
            </span>
          )}
        </div>

        <Card className="border-0 rounded-3xl shadow-sm" style={{ border: `1px solid ${accent}15` }}>
          <CardContent className="p-5">
            <BriefingRow icon={Dumbbell} label="Move" text={briefing.move} accent={accent} />
            <BriefingRow icon={Utensils} label="Eat This" text={briefing.eat} accent={accent} />
            <BriefingRow icon={Coffee} label="Drink This" text={briefing.drink} accent={accent} />
            <BriefingRow icon={BookOpen} label="Journal This" text={briefing.journal} accent={accent} />
            <BriefingRow icon={XCircle} label="Don't Do" text={briefing.dontDo} accent={accent} />
            <BriefingRow icon={Pill} label="Supplement" text={briefing.supplement} accent={accent} />
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Optional Check-In ── */}
      <CheckInSection
        accent={accent}
        selectedMoods={selectedMoods}
        onToggleMood={toggleMood}
        spoonEntry={spoonEntry}
        remainingSpoons={remainingSpoons}
        spoonLevel={spoonLevel}
      />

      {/* ── 5. Ask Cync / Aunt B ── */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <MessageCircle className="w-4 h-4" style={{ color: accent }} />
          <h2 className="font-display font-medium italic text-lg" style={{ color: accent }}>
            Ask Cync
          </h2>
        </div>
        <AskAuntB
          cycleDay={cycleDay}
          currentPhase={currentPhase}
          profileId={profileId || undefined}
        />
      </div>

      {/* ── CyncLink quick link ── */}
      {profile?.partnerWillingness && profile.partnerWillingness !== 'not_involved' && (
        <Card className="border-0 rounded-2xl" style={{ background: `${accent}08`, border: `1px solid ${accent}15` }}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" style={{ color: accent }} />
              <div>
                <p className="text-sm font-medium">CyncLink</p>
                <p className="text-xs text-muted-foreground">Share today's briefing with your partner</p>
              </div>
            </div>
            <Link href="/partner-support">
              <Button size="sm" variant="outline" className="rounded-full" style={{ borderColor: `${accent}40` }}>
                Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
