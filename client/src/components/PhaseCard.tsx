import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { type CyclePhase, PHASE_INFO } from '@/lib/cycleUtils';

interface PhaseCardProps {
  phase: CyclePhase;
  tips?: string[];
}

export default function PhaseCard({ phase, tips = [] }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const info = PHASE_INFO[phase];

  const defaultTips = {
    menstrual: [
      'Warm meals and cozy blankets',
      'Gentle movement or rest',
      'Journal your thoughts',
      'Limit screen time before bed',
    ],
    follicular: [
      'Try new creative projects',
      'Organize and plan ahead',
      'Move your body with joy',
      'Explore new ideas',
    ],
    ovulatory: [
      'Schedule important conversations',
      'Connect with loved ones',
      'Share your voice',
      'Enjoy lighter meals',
    ],
    luteal: [
      'Set clear boundaries',
      'Wrap up ongoing projects',
      'Eat magnesium-rich foods',
      'Say no when needed',
    ],
  };

  const displayTips = tips.length > 0 ? tips : defaultTips[phase];

  return (
    <Card className="p-6 space-y-4 hover-elevate transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: info.color }}
            />
            <h3 className="text-xl font-semibold">{info.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{info.dayRange}</p>
          <p className="text-base mb-4">{info.focus}</p>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pt-2 border-t">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">What to know:</p>
            <ul className="space-y-1">
              {displayTips.map((tip, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="w-full"
        data-testid={`button-toggle-${phase}`}
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            Learn more
          </>
        )}
      </Button>
    </Card>
  );
}
