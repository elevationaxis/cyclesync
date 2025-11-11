import { Card } from '@/components/ui/card';
import { getCurrentPhase, PHASE_INFO } from '@/lib/cycleUtils';
import { Heart, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PartnerViewProps {
  cycleDay: number;
  partnerName?: string;
}

const supportTips = {
  menstrual: [
    'Offer comfort without trying to fix',
    'Warm beverages and cozy environments help',
    'Give extra space if needed',
    'Handle more of the household tasks',
  ],
  follicular: [
    'Great time for planning adventures together',
    'Energy is returning - suggest activities',
    'Support new ideas and projects',
    'Enjoy the optimistic mood',
  ],
  ovulatory: [
    'Schedule date nights or social events',
    'Listen when they want to talk',
    'Appreciate the confidence boost',
    'Be present for meaningful conversations',
  ],
  luteal: [
    'Respect boundaries - they need them now',
    'Help create quiet, cozy spaces',
    'Don\'t take mood shifts personally',
    'Offer magnesium-rich snacks',
  ],
};

export default function PartnerView({ cycleDay, partnerName = 'Your Partner' }: PartnerViewProps) {
  const phase = getCurrentPhase(cycleDay);
  const phaseInfo = PHASE_INFO[phase];
  const tips = supportTips[phase];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Understanding {partnerName}'s Cycle</h1>
          <p className="text-muted-foreground">Supporting through hormonal rhythms</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${phaseInfo.color}20` }}
          >
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: phaseInfo.color }}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-1">{phaseInfo.name}</h2>
            <p className="text-muted-foreground">Day {cycleDay} • {phaseInfo.dayRange}</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {phaseInfo.energy.split(';')[0]} Energy
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">What's Happening</h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {phaseInfo.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Ways to Support</h3>
            <ul className="space-y-2">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-base">
                  <span className="text-primary mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-accent/50">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Ask Before Assuming</h3>
            <p className="text-sm leading-relaxed">
              Everyone experiences their cycle differently. The best support you can offer is asking "What do you need right now?" and really listening to the answer.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
