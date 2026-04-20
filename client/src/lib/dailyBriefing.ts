import { useState } from "react";
// Daily briefing content library
// 4 phases × 6 sections × 6 daily rotations
// Rotation: (dayWithinPhase - 1) % 6 → index 0-5

export type BriefingSection = {
  move: string;
  eat: string;
  drink: string;
  journal: string;
  dontDo: string;
  supplement: string;
};

type PhaseContent = BriefingSection[];

const flow: PhaseContent = [
  {
    move: "Take a slow walk outside — no pace, no goal. Just move your lymph and let the air do something.",
    eat: "Eat something warm and cooked today — soup, stew, roasted roots. Raw food is harder on your digestion right now.",
    drink: "Make a cup of raspberry leaf tea. It tones the uterus and eases cramping.",
    journal: "Write this: what am I ready to release this cycle — not just physically, but emotionally?",
    dontDo: "Don't start anything new today. This is not the time to launch, pitch, or begin. Let things settle.",
    supplement: "Take magnesium glycinate tonight. It reduces cramping, supports sleep, and calms your nervous system.",
  },
  {
    move: "Spend 10 minutes stretching your hips, lower back, and inner thighs. Your body is literally opening right now.",
    eat: "Add one iron-rich food to your next meal — lentils, dark leafy greens, or grass-fed beef if you eat it. You're losing iron.",
    drink: "Make ginger tea with lemon. It's anti-inflammatory and helps with nausea and cramping.",
    journal: "Write this: where have I been overextending? What has been costing more than it gives back?",
    dontDo: "Don't push through fatigue today. Your body is doing significant internal work — fatigue is signal, not weakness.",
    supplement: "Take omega-3s today. They're anti-inflammatory and help balance the compounds that cause cramping.",
  },
  {
    move: "Rest is a move today. Horizontal counts. If you need to lie down, lie down without guilt.",
    eat: "Eat beets or dark berries with your next meal. They support liver clearance during the hormonal shift.",
    drink: "Make nettle tea. It has iron, magnesium, and minerals — one of the most underrated things you can drink right now.",
    journal: "Write this: what does my body actually feel like today — not what I think it should feel like, but what it does?",
    dontDo: "Don't eat cold, raw, or processed food today if you can help it. Your digestion is slower and your body needs warmth.",
    supplement: "Take vitamin D3 + K2 today. It supports mood, immune function, and the hormonal reset happening right now.",
  },
  {
    move: "Go for a light walk or do restorative yoga. Nothing that spikes cortisol — your adrenals are already working.",
    eat: "Add pumpkin seeds or sesame seeds to something today. Zinc and selenium support what your body is rebuilding.",
    drink: "Start your morning with warm water, a pinch of sea salt, and lemon. It replenishes electrolytes lost during bleeding.",
    journal: "Write this: what would I do differently this cycle if I could? What patterns am I noticing?",
    dontDo: "Don't schedule hard conversations or high-stakes decisions today if you can avoid it. Your emotional processing is heightened.",
    supplement: "Take a B-complex today. B6 specifically helps with mood and PMS carryover — energy support without caffeine.",
  },
  {
    move: "Do legs up the wall for 10 minutes. It reduces pelvic pressure, calms your nervous system, and drains the lymph.",
    eat: "Have bone broth or a mineral-rich broth today. Your body needs electrolytes and collagen more than it needs a salad right now.",
    drink: "Make dandelion root tea. It supports liver clearance of the hormones your body is releasing.",
    journal: "Write this: what am I grieving right now, even quietly? Flow is a release — what else is moving through you?",
    dontDo: "Don't ignore pain today. Cramping that stops you is not normal — it's a message. Note it.",
    supplement: "If you bleed heavily, consider iron — but get your levels checked first. Too much iron is its own problem.",
  },
  {
    move: "Do a slow, intentional stretch in the morning. Five minutes. No performance.",
    eat: "Eat dark chocolate (70%+) and something magnesium-rich — almonds, spinach, black beans. Your magnesium drops during Flow.",
    drink: "Make chamomile tea tonight. It calms your nervous system, reduces cramping, and helps you actually sleep.",
    journal: "Write this: what does rest actually look like for me? Not sleep — rest. What fills me back up?",
    dontDo: "Don't compare your output to last week. You are in a completely different hormonal environment right now.",
    supplement: "Take zinc today. It supports immune function and the follicular development that's about to begin.",
  },
];

const bloom: PhaseContent = [
  {
    move: "Go for a run, a bike ride, or a dance class today. Your body can handle it — this is your cardio window.",
    eat: "Add a fermented food to your next meal — kimchi, sauerkraut, yogurt, or kefir. Your gut microbiome shapes your estrogen metabolism.",
    drink: "Make green tea today. It supports estrogen metabolism and gives you a clean, focused energy.",
    journal: "Write this: what do I want to build this cycle? What am I ready to begin?",
    dontDo: "Don't waste this window on things that don't matter. Your energy and focus are at their peak — protect them.",
    supplement: "Take a B-complex today. B6 and B12 support energy metabolism and estrogen processing.",
  },
  {
    move: "Try something new today — a new class, a new route, a new workout. Your brain is primed for novelty right now.",
    eat: "Eat cruciferous vegetables today — broccoli, cauliflower, Brussels sprouts, or kale. They help your liver process rising estrogen.",
    drink: "Make spearmint tea. It naturally lowers androgens — helpful if you deal with acne or PCOS symptoms.",
    journal: "Write this: what would I do if I knew I couldn't fail? Your brain is literally more optimistic right now.",
    dontDo: "Don't skip sleep to get more done. Your body is rebuilding during Bloom — sleep is part of the process.",
    supplement: "Take vitamin C today — 500–1000mg. It supports follicular development and progesterone production.",
  },
  {
    move: "Do strength training today. Your muscles recover faster during Bloom — build while the building is good.",
    eat: "Add flaxseeds to something today — smoothie, oatmeal, or yogurt. They support healthy estrogen metabolism.",
    drink: "Start your morning with lemon water. It supports your liver and digestion.",
    journal: "Write this: what has been sitting on my to-do list that I've been avoiding? What would it take to start?",
    dontDo: "Don't overcommit just because you feel good. You won't feel this way in two weeks — plan accordingly.",
    supplement: "Take maca root today. It's an adaptogen that supports hormonal balance and energy during Bloom.",
  },
  {
    move: "Do high-energy movement today — HIIT, spin, or a long run. Estrogen is building and your endurance is higher than usual.",
    eat: "Eat fresh, light foods today — salads, sprouts, raw vegetables. Your digestion is stronger now and your body is ready for them.",
    drink: "Add beet juice or beet to a smoothie today. It supports your liver and gives you nitric oxide for circulation and energy.",
    journal: "Write this: who do I want to be this cycle? What version of myself am I moving toward?",
    dontDo: "Don't ignore the creative ideas that come up right now. Write them down — they'll be harder to access in Alchemy.",
    supplement: "Take a probiotic today. Gut health directly affects estrogen metabolism — a good probiotic supports the whole system.",
  },
  {
    move: "Dance today. Your coordination and mood are both elevated right now — use it.",
    eat: "Eat eggs and lean protein today. They support the follicular development happening right now — your body is building.",
    drink: "Make matcha today instead of coffee. Sustained energy without the cortisol spike.",
    journal: "Write this: what lights me up right now? What feels exciting, not just obligatory?",
    dontDo: "Don't eat too much sugar or processed food today. Estrogen metabolism depends on a clean liver.",
    supplement: "Take DIM (diindolylmethane) today. It supports healthy estrogen metabolism — especially useful if you have estrogen dominance symptoms.",
  },
  {
    move: "Do whatever sounds fun today. Your body is saying yes right now — let it lead.",
    eat: "Eat berries and citrus today. Antioxidants protect the eggs maturing this phase and vitamin C supports progesterone production later.",
    drink: "Make hibiscus tea. It's antioxidant-rich, supports circulation, and actually tastes good.",
    journal: "Write this: what seeds do I want to plant — in my work, my relationships, my body?",
    dontDo: "Don't compare yourself to others today. You're in your season of building — stay in your lane.",
    supplement: "Take magnesium malate today. It supports energy production and muscle function during higher-intensity workouts.",
  },
];

const spark: PhaseContent = [
  {
    move: "Push hard today if you want to. This is your peak performance window — your body can take it.",
    eat: "Eat anti-inflammatory foods today — salmon, walnuts, flaxseeds, or olive oil. Support the ovulation process.",
    drink: "Make raspberry leaf tea today. It continues to tone and support your reproductive system through ovulation.",
    journal: "Write this: what do I want to say that I've been holding back? Who needs to hear it?",
    dontDo: "Don't make permanent decisions based on how good you feel right now. Spark is real — but it's temporary.",
    supplement: "Take zinc today — 15–25mg. It's critical for ovulation itself. Pumpkin seeds are a great food source.",
  },
  {
    move: "Do something social and physical today — a group class, a team sport, a workout with a friend. Your social energy is highest right now.",
    eat: "Eat zinc-rich foods today — pumpkin seeds, chickpeas, or cashews. Zinc is essential for ovulation.",
    drink: "Drink water with electrolytes today. Your body temperature rises slightly during ovulation — stay hydrated.",
    journal: "Write this: what am I most proud of right now? What have I built this cycle?",
    dontDo: "Don't overbook yourself for the next two weeks. Alchemy is coming and you'll need that space.",
    supplement: "Take vitamin E today — 200–400 IU. It supports egg quality and cervical health.",
  },
  {
    move: "Go for a long run, a hard ride, or lift heavy today. Your pain tolerance is actually higher during ovulation.",
    eat: "Eat light, fresh, colorful foods today. Your digestion is strong and your appetite may be lower — eat what sounds good.",
    drink: "Make a green smoothie with flaxseeds. Liver support, fiber, and hormone-balancing lignans in one.",
    journal: "Write this: what does connection feel like for me right now? Who do I want more of in my life?",
    dontDo: "Don't ignore the signals your body is giving you about ovulation — they're information.",
    supplement: "Take CoQ10 today. It supports mitochondrial energy and egg quality — especially important if you're 35+.",
  },
  {
    move: "Dance, swim, or move in a way that feels joyful today. This is your most embodied phase — be in your body.",
    eat: "Eat fiber-rich foods today — beans, lentils, or vegetables. Support your liver in clearing the estrogen peak happening right now.",
    drink: "Drink coconut water today. Natural electrolytes, supports hydration during peak physical output.",
    journal: "Write this: what am I ready to commit to — out loud, to myself?",
    dontDo: "Don't skip liver support today. Estrogen is peaking and it needs to clear cleanly or it carries into Alchemy.",
    supplement: "Take omega-3s today. Anti-inflammatory support during ovulation, which is an inflammatory process.",
  },
  {
    move: "Do high-intensity intervals today. Your recovery is fast and your energy is high — go for it.",
    eat: "Eat vitamin E foods today — sunflower seeds, almonds, or avocado. They support egg quality and cervical mucus.",
    drink: "Make chamomile or lemon balm tea today. It calms any ovulation-related cramping.",
    journal: "Write this: what does my body feel like at its best? Describe it. Remember it.",
    dontDo: "Don't neglect sleep tonight. High energy doesn't mean you need less sleep — it means your body is working hard.",
    supplement: "Take selenium today. Brazil nuts — just 2 — are the easiest source. Supports thyroid and antioxidant protection.",
  },
  {
    move: "Do the thing you've been putting off because it felt like too much. Right now it probably isn't.",
    eat: "Eat leafy greens and cruciferous vegetables today. Keep your liver clearing estrogen so it doesn't accumulate after ovulation.",
    drink: "Start your morning with warm lemon water. Keeps the liver moving during the estrogen peak.",
    journal: "Write this: what would I do today if I were operating from my fullest self?",
    dontDo: "Don't say yes to everything just because you feel like you can handle it. Future you is in Alchemy — be kind to her.",
    supplement: "Take magnesium glycinate tonight. It supports smooth muscle relaxation and reduces ovulation cramping.",
  },
];

const alchemy: PhaseContent = [
  {
    move: "Go for a walk, swim, or do yoga today — lower intensity, longer duration. Your body is in a different gear.",
    eat: "Add a magnesium-rich food to your next meal — dark chocolate, leafy greens, almonds, or black beans. Magnesium drops in Alchemy and it affects everything.",
    drink: "Make dandelion root tea today. It's one of the most important things you can drink right now for liver support.",
    journal: "Write this: what is this phase trying to show me? What keeps coming up that I keep pushing down?",
    dontDo: "Don't make major decisions from the low point of Alchemy. Write it down and revisit it in Bloom.",
    supplement: "Take magnesium glycinate tonight — 300–400mg. It's the single most important supplement for Alchemy.",
  },
  {
    move: "Do gentle strength training today — lighter weights, more reps. Keep moving but don't push for PRs.",
    eat: "Eat complex carbohydrates today — sweet potatoes, brown rice, or oats. Your body craves carbs in Alchemy for serotonin. Feed it real ones.",
    drink: "Make chamomile tea tonight. It reduces anxiety, supports sleep, and calms your nervous system during the hormonal shift.",
    journal: "Write this: what am I actually feeling right now — underneath the irritability, the heaviness, the fog?",
    dontDo: "Don't skip magnesium today. Most of what feels like PMS is magnesium deficiency.",
    supplement: "Take Vitex (chaste tree berry) today. It supports progesterone and reduces PMS symptoms — takes 2–3 cycles to build up.",
  },
  {
    move: "Do yin yoga or restorative yoga today. Your nervous system needs downregulation, not stimulation.",
    eat: "Eat pumpkin seeds and sunflower seeds today. Zinc and vitamin E support progesterone and reduce PMS symptoms.",
    drink: "Mix magnesium powder (like Natural Calm) into warm water and drink it tonight. It replaces what you're losing.",
    journal: "Write this: what boundaries have I been letting slide? What needs to be said or changed?",
    dontDo: "Don't fight the inward pull today. Alchemy is not a malfunction — it's a season. Let yourself go inward.",
    supplement: "Take B6 today. It supports progesterone and serotonin production — reduces mood symptoms significantly.",
  },
  {
    move: "Take a slow walk outside this morning. It regulates cortisol and supports progesterone.",
    eat: "Eat beets, artichokes, or bitter greens today. They support liver clearance during the progesterone drop.",
    drink: "Make lemon balm tea tonight. It calms your nervous system, reduces cortisol, and helps you sleep.",
    journal: "Write this: what does my body need that I haven't been giving it?",
    dontDo: "Don't overcommit socially today. Your energy for people is lower right now and that's okay — protect it.",
    supplement: "Take evening primrose oil today. It reduces breast tenderness, bloating, and mood symptoms. Take through Alchemy only.",
  },
  {
    move: "Spend 10 minutes stretching and foam rolling today. Your muscles hold more tension in Alchemy — release it intentionally.",
    eat: "Eat warm, cooked foods today — soup, stew, or roasted vegetables. Your digestion slows in Alchemy. Make it easy on yourself.",
    drink: "Make ginger tea today. It's anti-inflammatory, supports digestion, and reduces the bloating that often comes with Alchemy.",
    journal: "Write this: what am I holding onto that's ready to be released with this cycle?",
    dontDo: "Don't eat sugar or processed food today. They spike cortisol and make everything worse — this is the phase where food choices matter most.",
    supplement: "Take ashwagandha today. It reduces cortisol and supports your adrenals during the hormonal drop.",
  },
  {
    move: "Rest if that's what your body is asking for today. Take 10 minutes to fully stop — no phone.",
    eat: "Add one iron-rich food to your next meal — dark leafy greens, lentils, or legumes. Your body is building toward the next release.",
    drink: "Drink something warm today — tea, broth, or warm water with lemon. Your body needs warmth right now.",
    journal: "Write this: what would I tell myself right now if I were my own best friend?",
    dontDo: "Don't ignore the signals. If Alchemy is consistently brutal, that's information — not just 'bad PMS.' Note the patterns.",
    supplement: "Take DIM today. It supports healthy estrogen clearance during the progesterone drop — reduces bloating, mood swings, and breast tenderness.",
  },
];

const phaseMap: Record<string, PhaseContent> = {
  menstrual: flow,
  follicular: bloom,
  ovulatory: spark,
  luteal: alchemy,
};

export function getDailyBriefing(
  phase: string,
  cycleDay: number | null,
  phaseStartDay: number = 1
): BriefingSection {
  const content = phaseMap[phase] ?? flow;
  const dayWithinPhase = cycleDay !== null ? Math.max(1, cycleDay - phaseStartDay + 1) : 1;
  const index = (dayWithinPhase - 1) % content.length;
  return content[index];
}

// Get the approximate start day of the current phase
export function getPhaseStartDay(cycleDay: number, cycleLength: number = 28): number {
  const scale = cycleLength / 28;
  const flowEnd = Math.round(5 * scale);
  const bloomEnd = Math.round(13 * scale);
  const sparkEnd = Math.round(17 * scale);

  if (cycleDay <= flowEnd) return 1;
  if (cycleDay <= bloomEnd) return flowEnd + 1;
  if (cycleDay <= sparkEnd) return bloomEnd + 1;
  return sparkEnd + 1;
}
