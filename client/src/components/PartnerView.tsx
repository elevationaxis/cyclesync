import { Card } from '@/components/ui/card';
import { getCurrentPhase, PHASE_INFO } from '@/lib/cycleUtils';
import { Heart, Info, Utensils, Battery, BatteryLow, BatteryMedium, BatteryFull, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SpoonEntry } from '@shared/schema';

interface PartnerViewProps {
  cycleDay: number;
  partnerName?: string;
  spoonEntry?: SpoonEntry | null;
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

export default function PartnerView({ cycleDay, partnerName = 'Your Partner', spoonEntry }: PartnerViewProps) {
  const phase = getCurrentPhase(cycleDay);
  const phaseInfo = PHASE_INFO[phase];
  const tips = supportTips[phase];

  const getSpoonStatus = () => {
    if (!spoonEntry) return null;
    const remaining = spoonEntry.totalSpoons - spoonEntry.usedSpoons;
    const percentage = (remaining / spoonEntry.totalSpoons) * 100;
    
    if (percentage >= 70) return { 
      label: "Plenty of energy", 
      description: "They have good reserves today - a great time for activities together",
      icon: BatteryFull, 
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    };
    if (percentage >= 40) return { 
      label: "Moderate energy", 
      description: "They're managing energy carefully - check in before suggesting activities",
      icon: BatteryMedium, 
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      borderColor: "border-amber-200 dark:border-amber-800"
    };
    if (percentage >= 15) return { 
      label: "Running low", 
      description: "Energy is limited - offer to take over tasks and give them space to rest",
      icon: BatteryLow, 
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "border-orange-200 dark:border-orange-800"
    };
    return { 
      label: "Recharge needed", 
      description: "Very low energy - be extra gentle, handle tasks, and protect their rest time",
      icon: Battery, 
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
      borderColor: "border-rose-200 dark:border-rose-800"
    };
  };

  const spoonStatus = getSpoonStatus();

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

      {spoonEntry && spoonStatus && (
        <Card className={`p-6 border-2 ${spoonStatus.borderColor} bg-gradient-to-br ${spoonStatus.bgColor}`} data-testid="card-partner-spoon-status">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center shadow-sm flex-shrink-0">
              <spoonStatus.icon className={`w-7 h-7 ${spoonStatus.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-lg font-semibold ${spoonStatus.color}`}>{spoonStatus.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {spoonEntry.totalSpoons - spoonEntry.usedSpoons} / {spoonEntry.totalSpoons} spoons remaining
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{spoonStatus.description}</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: spoonEntry.totalSpoons }).map((_, i) => {
                  const isUsed = i < spoonEntry.usedSpoons;
                  return (
                    <Utensils
                      key={i}
                      className={`w-4 h-4 ${isUsed ? 'text-muted-foreground/30' : 'text-orange-500'}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-900/10 dark:to-purple-900/10" data-testid="card-spoon-theory-explanation">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">What is Spoon Theory?</h3>
            <p className="text-sm text-muted-foreground">Understanding your partner's energy levels</p>
          </div>
        </div>
        
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>Spoon theory</strong> is a way to explain limited energy, especially helpful for those with chronic illness, 
            disabilities, or neurodivergent conditions. Created by Christine Miserandino, it helps you understand when your partner 
            may have less capacity than usual.
          </p>
          
          <p>
            Imagine starting each day with a set number of <strong>"spoons"</strong> representing available energy. 
            Every activity costs spoons:
          </p>
          
          <div className="grid gap-2 py-2">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>Getting dressed might cost 1 spoon</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>A difficult conversation might cost 2 spoons</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-500" />
              <Utensils className="w-4 h-4 text-orange-500" />
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>A full workday might cost 3+ spoons</span>
            </div>
          </div>
          
          <div className="bg-background/70 rounded-lg p-4 border">
            <p className="font-medium mb-2">How you can help:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• When spoons are low, offer to take over tasks</li>
              <li>• Don't take it personally if they need quiet time</li>
              <li>• Ask "What would help right now?" instead of assuming</li>
              <li>• Celebrate the days when energy is high</li>
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
