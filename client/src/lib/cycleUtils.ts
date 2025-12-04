export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface PhaseInfo {
  name: string;
  dayRange: string;
  focus: string;
  energy: string;
  supportTone: string;
  color: string;
  description: string;
}

export function calculateCycleDay(lastPeriodStart: Date | string, cycleLength: number = 28): number {
  const startDate = typeof lastPeriodStart === 'string' ? new Date(lastPeriodStart) : lastPeriodStart;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const cycleDay = (diffDays % cycleLength) + 1;
  return cycleDay;
}

export function getPhaseForCycleLength(cycleDay: number, cycleLength: number = 28): CyclePhase {
  const menstrualEnd = 5;
  const follicularEnd = Math.floor(cycleLength * 0.46);
  const ovulatoryEnd = Math.floor(cycleLength * 0.60);
  
  if (cycleDay >= 1 && cycleDay <= menstrualEnd) return 'menstrual';
  if (cycleDay >= menstrualEnd + 1 && cycleDay <= follicularEnd) return 'follicular';
  if (cycleDay >= follicularEnd + 1 && cycleDay <= ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}

export const PHASE_INFO: Record<CyclePhase, PhaseInfo> = {
  menstrual: {
    name: 'Menstrual Phase',
    dayRange: 'Days 1-5',
    focus: 'Rest, release, reflection',
    energy: 'Low; inward',
    supportTone: 'Comforting, validating',
    color: 'hsl(340, 60%, 55%)',
    description: "You're in your menstrual phase, so it's totally normal to want quiet and comfort. Your body's clearing the slate. Today's a good day to keep things soft.",
  },
  follicular: {
    name: 'Follicular Phase',
    dayRange: 'Days 6-13',
    focus: 'Rebirth, creativity, energy returning',
    energy: 'Rising; optimistic',
    supportTone: 'Encouraging, curious',
    color: 'hsl(120, 50%, 50%)',
    description: "Your energy's coming back online! This is a great time to plan or brainstorm — your brain's more flexible and open. Don't overthink, just explore.",
  },
  ovulatory: {
    name: 'Ovulatory Phase',
    dayRange: 'Days 14-17',
    focus: 'Connection, communication, confidence',
    energy: 'High; outward',
    supportTone: 'Empowering but grounded',
    color: 'hsl(45, 85%, 55%)',
    description: "Your words hit different this week. If you've got something to say, now's the time. Just remember — rest still counts as confidence.",
  },
  luteal: {
    name: 'Luteal Phase',
    dayRange: 'Days 18-28',
    focus: 'Boundaries, completion, introspection',
    energy: 'Declining; inward',
    supportTone: 'Protective, wise, cozy',
    color: 'hsl(280, 50%, 55%)',
    description: "You're in your luteal phase, which means it's okay to say no more often. This is your time to nest, slow down, and get cozy before your next reset.",
  },
};

export function getCurrentPhase(cycleDay: number): CyclePhase {
  if (cycleDay >= 1 && cycleDay <= 5) return 'menstrual';
  if (cycleDay >= 6 && cycleDay <= 13) return 'follicular';
  if (cycleDay >= 14 && cycleDay <= 17) return 'ovulatory';
  return 'luteal';
}

export function getPhaseProgress(cycleDay: number): number {
  const phase = getCurrentPhase(cycleDay);
  const ranges = {
    menstrual: { start: 1, end: 5 },
    follicular: { start: 6, end: 13 },
    ovulatory: { start: 14, end: 17 },
    luteal: { start: 18, end: 28 },
  };
  
  const range = ranges[phase];
  return ((cycleDay - range.start) / (range.end - range.start + 1)) * 100;
}

export function getPhaseInfo(phase: CyclePhase): PhaseInfo {
  return PHASE_INFO[phase];
}
