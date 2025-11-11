import { getCurrentPhase, PHASE_INFO, getPhaseProgress } from '@/lib/cycleUtils';
import { Card } from '@/components/ui/card';
import { Circle } from 'lucide-react';

interface CycleCompassProps {
  cycleDay: number;
  cycleLength?: number;
}

export default function CycleCompass({ cycleDay, cycleLength = 28 }: CycleCompassProps) {
  const phase = getCurrentPhase(cycleDay);
  const phaseInfo = PHASE_INFO[phase];
  const progress = (cycleDay / cycleLength) * 100;

  return (
    <Card className="p-8 text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={phaseInfo.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Circle className="w-6 h-6 mb-2" style={{ color: phaseInfo.color }} fill={phaseInfo.color} />
            <div className="text-2xl font-semibold">Day {cycleDay}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold" style={{ color: phaseInfo.color }}>{phaseInfo.name}</h2>
        <p className="text-sm text-muted-foreground">{phaseInfo.dayRange}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-base leading-relaxed text-foreground">{phaseInfo.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Energy</p>
          <p className="font-medium">{phaseInfo.energy.split(';')[0]}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Focus</p>
          <p className="font-medium">{phaseInfo.focus.split(',')[0]}</p>
        </div>
      </div>
    </Card>
  );
}
