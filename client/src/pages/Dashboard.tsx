import CycleCompass from '@/components/CycleCompass';
import PhaseCard from '@/components/PhaseCard';
import TipsCard from '@/components/TipsCard';
import GentleWins from '@/components/GentleWins';
import { getCurrentPhase } from '@/lib/cycleUtils';

export default function Dashboard() {
  const cycleDay = 12;
  const currentPhase = getCurrentPhase(cycleDay);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <section>
        <CycleCompass cycleDay={cycleDay} />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Today's Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <h2 className="text-2xl font-semibold mb-6">Understanding the Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhaseCard phase="menstrual" />
          <PhaseCard phase="follicular" />
          <PhaseCard phase="ovulatory" />
          <PhaseCard phase="luteal" />
        </div>
      </section>
    </div>
  );
}
