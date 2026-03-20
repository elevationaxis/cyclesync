import PhaseCard from '@/components/PhaseCard';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { phaseNutrition } from '@/lib/nutritionData';
import { useState } from 'react';

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

      <section id="nourish">
        <h2 className="text-2xl font-semibold mb-2">Nourish by Phase</h2>
        <p className="text-muted-foreground mb-6">Smoothies and trail mix variations tuned to what your body actually needs each phase. Your cravings are data — here's how to work with them.</p>
        <div className="space-y-6">
          {phaseNutrition.map((nutrition) => {
            const [open, setOpen] = useState(false);
            return (
              <Card key={nutrition.phase} className="border-0 shadow-sm rounded-3xl overflow-hidden" style={{ background: `${nutrition.color}12`, border: `1px solid ${nutrition.color}25` }}>
                <CardContent className="p-6">
                  {/* Header */}
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setOpen(!open)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{nutrition.emoji}</span>
                      <div>
                        <h3 className="font-display font-medium italic text-lg">{nutrition.phase} Phase</h3>
                        <p className="text-xs text-muted-foreground">{nutrition.days}</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-sm">{open ? '▲ less' : '▼ more'}</span>
                  </button>

                  {/* Why this phase */}
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{nutrition.why}</p>

                  {/* Key nutrients */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {nutrition.keyNutrients.map((n, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: `${nutrition.color}20`, color: nutrition.color }}>{n}</span>
                    ))}
                  </div>

                  {open && (
                    <div className="mt-5 space-y-5">
                      {/* Smoothie */}
                      <div className="rounded-2xl p-5" style={{ background: `${nutrition.color}15` }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🥤</span>
                          <div>
                            <h4 className="font-semibold">{nutrition.smoothie.name}</h4>
                            <p className="text-xs text-muted-foreground">Phase Smoothie</p>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {nutrition.smoothie.ingredients.map((ing, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span style={{ color: nutrition.accent }} className="mt-1 flex-shrink-0">·</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${nutrition.color}25` }}>
                          <p className="text-xs italic text-muted-foreground">💡 {nutrition.smoothie.tip}</p>
                        </div>
                      </div>

                      {/* Trail Mix */}
                      <div className="rounded-2xl p-5" style={{ background: `${nutrition.color}15` }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">🥜</span>
                          <div>
                            <h4 className="font-semibold">{nutrition.trailMix.name}</h4>
                            <p className="text-xs text-muted-foreground">Trail Mix Variation</p>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {nutrition.trailMix.ingredients.map((ing, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span style={{ color: nutrition.accent }} className="mt-1 flex-shrink-0">·</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${nutrition.color}25` }}>
                          <p className="text-xs italic text-muted-foreground">💡 {nutrition.trailMix.tip}</p>
                        </div>
                      </div>

                      {/* Avoid */}
                      <div className="rounded-2xl p-4" style={{ background: 'rgba(139,74,107,0.08)' }}>
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Limit or avoid this phase</p>
                        <ul className="space-y-1">
                          {nutrition.avoidOrLimit.map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-rose-400 mt-0.5 flex-shrink-0">↓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
