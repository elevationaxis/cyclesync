import PhaseCard from '@/components/PhaseCard';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Body Cues Library</h1>
          <p className="text-muted-foreground">Understanding what your body's telling you</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">The Four Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhaseCard phase="menstrual" />
          <PhaseCard phase="follicular" />
          <PhaseCard phase="ovulatory" />
          <PhaseCard phase="luteal" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Common Questions</h2>
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Why am I so tired this week?</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you're in your menstrual or late luteal phase, low energy is totally normal. Your hormones are recalibrating, and your body's asking for rest. It's not laziness—it's biology. Drink water, eat something warm, and lower the bar a little.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Why do I feel snappy before my period?</h3>
            <p className="text-muted-foreground leading-relaxed">
              That's your luteal phase talking. Your progesterone is dropping, and your nervous system is more sensitive. You're not a bad person—your hormones are asking for alone time and boundaries. Honor that need.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Why am I craving chocolate?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your progesterone's rising, and your body's asking for magnesium. Go for it—preferably dark chocolate. Your body knows what it needs, and cravings are data, not weakness.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Why do I feel so confident mid-cycle?</h3>
            <p className="text-muted-foreground leading-relaxed">
              You're in your ovulatory phase! Estrogen is peaking, and your brain's firing on all cylinders. This is a great time for important conversations, presentations, or anything that requires your voice to be heard. Ride that wave.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
