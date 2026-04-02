// Daily Briefing Content Library
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
    move: "A slow walk outside — no pace, no goal. Just move your lymph and let the air do something.",
    eat: "Warm, cooked foods — soups, stews, roasted root vegetables. Your digestion slows during Flow; raw foods are harder right now.",
    drink: "Raspberry leaf tea — tones the uterus, eases cramping, supports the whole process.",
    journal: "What do I need to let go of this cycle? Not just physically — emotionally, mentally. What is ready to be released?",
    dontDo: "Don't start anything new. This is not the time to launch, pitch, or begin. Let things settle.",
    supplement: "Magnesium glycinate — reduces cramping, supports sleep, calms the nervous system. Take it at night.",
  },
  {
    move: "Gentle yoga or stretching — hips, lower back, inner thighs. Your body is literally opening right now.",
    eat: "Iron-rich foods: lentils, dark leafy greens, grass-fed beef if you eat it. You're losing iron. Replace it.",
    drink: "Ginger tea with lemon — anti-inflammatory, warms the belly, helps with nausea and cramping.",
    journal: "Where have I been overextending? What has been costing me more than it's giving back?",
    dontDo: "Don't push through fatigue. Your body is doing significant internal work. Fatigue is not weakness — it's signal.",
    supplement: "Omega-3s — anti-inflammatory, supports prostaglandin balance (the compounds that cause cramping).",
  },
  {
    move: "Rest is a move. Horizontal counts. If you need to lie down, lie down.",
    eat: "Beets and dark berries — they support liver clearance and help your body process the hormonal shift.",
    drink: "Nettle tea — iron, magnesium, and minerals in one cup. One of the most underrated things you can drink right now.",
    journal: "What does my body feel like today — not what I think it should feel like, but what it actually feels like?",
    dontDo: "Don't eat cold, raw, or processed food if you can help it. Your digestion is slower and your body needs warmth.",
    supplement: "Vitamin D3 + K2 — supports mood, immune function, and the hormonal reset happening right now.",
  },
  {
    move: "Light walking or restorative yoga. Nothing that spikes cortisol — your adrenals are already working hard.",
    eat: "Pumpkin seeds and sesame seeds — zinc and selenium to support what your body is rebuilding right now.",
    drink: "Warm water with a pinch of sea salt and lemon first thing. Replenishes electrolytes lost during bleeding.",
    journal: "What would I do differently this cycle if I could? What patterns am I noticing?",
    dontDo: "Don't schedule hard conversations or high-stakes decisions if you can avoid it. Your emotional processing is heightened right now.",
    supplement: "B-complex — energy support without caffeine. B6 specifically helps with mood and PMS carryover.",
  },
  {
    move: "Legs up the wall for 10 minutes. Reduces pelvic pressure, calms the nervous system, drains the lymph.",
    eat: "Bone broth or mineral-rich broth. Your body needs electrolytes and collagen right now more than it needs a salad.",
    drink: "Dandelion root tea — supports liver clearance of the hormones your body is releasing right now.",
    journal: "What am I grieving right now, even quietly? Flow is a release — what else is moving through you?",
    dontDo: "Don't ignore pain. Cramping that stops you in your tracks is not normal — it's a message. Note it.",
    supplement: "Iron (if you bleed heavily) — but get your levels checked first. Too much iron is its own problem.",
  },
  {
    move: "A slow, intentional stretch in the morning. Five minutes. No performance.",
    eat: "Dark chocolate (70%+) and magnesium-rich foods — almonds, spinach, black beans. Your magnesium drops during Flow and it affects everything.",
    drink: "Chamomile tea in the evening — calms the nervous system, reduces cramping, helps you actually sleep.",
    journal: "What does rest actually look like for me? Not sleep — rest. What fills me back up?",
    dontDo: "Don't compare your output to last week. You are in a completely different hormonal environment. Different phase, different capacity.",
    supplement: "Zinc — supports immune function and the follicular development that's about to begin. Pumpkin seeds are a great food source.",
  },
];

const bloom: PhaseContent = [
  {
    move: "This is your window for cardio — running, cycling, dancing, anything that feels good and gets your heart rate up. Your body can handle it now.",
    eat: "Fermented foods — kimchi, sauerkraut, yogurt, kefir. Your gut microbiome shapes your estrogen metabolism. Feed it well.",
    drink: "Green tea — antioxidants, light caffeine, supports estrogen metabolism. One of the best things you can drink during Bloom.",
    journal: "What do I want to build this cycle? What am I ready to begin?",
    dontDo: "Don't waste this window on things that don't matter. Your energy and focus are at their peak — protect them.",
    supplement: "B-complex — supports energy metabolism and estrogen processing. Especially B6 and B12.",
  },
  {
    move: "Try something new. A new class, a new route, a new workout. Your brain is primed for novelty right now.",
    eat: "Cruciferous vegetables — broccoli, cauliflower, Brussels sprouts, kale. They help the liver process the rising estrogen so it doesn't accumulate.",
    drink: "Spearmint tea — naturally lowers androgens (helpful if you deal with acne or PCOS symptoms).",
    journal: "What would I do if I knew I couldn't fail? Your brain is literally more optimistic right now — use it.",
    dontDo: "Don't skip sleep to get more done. Your body is rebuilding during Bloom — sleep is part of the process.",
    supplement: "Vitamin C — supports follicular development and progesterone production. 500–1000mg daily.",
  },
  {
    move: "Strength training — your muscles recover faster during Bloom. Build while the building is good.",
    eat: "Flaxseeds — lignans that support healthy estrogen metabolism. Add them to smoothies, oatmeal, or yogurt.",
    drink: "Lemon water first thing — liver support, digestion, and a gentle way to start the day.",
    journal: "What has been sitting on my to-do list that I've been avoiding? What would it take to start?",
    dontDo: "Don't overcommit just because you feel good. You won't feel this way in two weeks. Plan accordingly.",
    supplement: "Maca root — adaptogen that supports hormonal balance and energy during the follicular phase.",
  },
  {
    move: "High-energy movement: HIIT, spin, a long run. Estrogen is building and your endurance is higher than usual.",
    eat: "Fresh, light foods — salads, sprouts, raw vegetables. Your digestion is stronger now and your body is ready for them.",
    drink: "Beet juice or beet in a smoothie — liver support and nitric oxide for circulation and energy.",
    journal: "Who do I want to be this cycle? What version of myself am I moving toward?",
    dontDo: "Don't ignore the creative ideas that come up right now. Write them down — they're real, and they'll be harder to access in Alchemy.",
    supplement: "Probiotics — gut health directly affects estrogen metabolism. A good probiotic supports the whole system.",
  },
  {
    move: "Dance. Seriously. Your coordination and mood are both elevated right now — use it.",
    eat: "Eggs and lean protein — support the follicular development happening right now. Your body is building.",
    drink: "Matcha — sustained energy without the cortisol spike of coffee. Your adrenals will thank you.",
    journal: "What lights me up right now? What feels exciting, not just obligatory?",
    dontDo: "Don't eat too much sugar or processed food. Estrogen metabolism depends on a clean liver — don't burden it.",
    supplement: "DIM (diindolylmethane) — from cruciferous vegetables, supports healthy estrogen metabolism. Especially useful if you have estrogen dominance symptoms.",
  },
  {
    move: "Whatever sounds fun. Your body is saying yes right now — let it lead.",
    eat: "Berries and citrus — antioxidants that protect the eggs maturing this phase. Vitamin C supports progesterone production later.",
    drink: "Hibiscus tea — antioxidant-rich, supports circulation, and tastes like something you'd actually want to drink.",
    journal: "What seeds do I want to plant — in my work, my relationships, my body?",
    dontDo: "Don't compare yourself to others. You're in your season of building — stay in your lane.",
    supplement: "Magnesium malate — supports energy production and muscle function during higher-intensity workouts.",
  },
];

const spark: PhaseContent = [
  {
    move: "Your peak performance window. Push hard if you want to — your body can take it right now.",
    eat: "Anti-inflammatory foods — salmon, walnuts, flaxseeds, olive oil. Support the ovulation process and reduce inflammation.",
    drink: "Raspberry leaf tea — continues to tone and support the reproductive system through ovulation.",
    journal: "What do I want to say that I've been holding back? Who needs to hear it?",
    dontDo: "Don't make permanent decisions based on how good you feel right now. Spark is real — but it's temporary.",
    supplement: "Zinc — critical for ovulation itself. Pumpkin seeds are a great food source, or supplement 15–25mg.",
  },
  {
    move: "Group fitness, team sports, anything social and physical. Your social energy is highest during Spark.",
    eat: "Zinc-rich foods — pumpkin seeds, chickpeas, cashews. Zinc is essential for ovulation itself.",
    drink: "Water with electrolytes — your body temperature rises slightly during ovulation. Stay hydrated.",
    journal: "What am I most proud of right now? What have I built this cycle?",
    dontDo: "Don't overbook yourself for the next two weeks. Alchemy is coming and you'll need that space.",
    supplement: "Vitamin E — supports egg quality and cervical health. 200–400 IU daily.",
  },
  {
    move: "Long runs, hard rides, heavy lifts. Your pain tolerance is actually higher during ovulation. Use it.",
    eat: "Light, fresh, colorful foods. Your digestion is strong and your appetite may be lower — eat what sounds good.",
    drink: "Green smoothie with flaxseeds — liver support, fiber, and hormone-balancing lignans in one.",
    journal: "What does connection feel like for me right now? Who do I want more of in my life?",
    dontDo: "Don't ignore the signals your body is giving you about ovulation — they're information.",
    supplement: "CoQ10 — supports mitochondrial energy and egg quality. Especially important if you're 35+.",
  },
  {
    move: "Dance, swim, move in ways that feel joyful. This is your most embodied phase — be in your body.",
    eat: "Fiber-rich foods — beans, lentils, vegetables. Support the liver in clearing the estrogen peak happening right now.",
    drink: "Coconut water — natural electrolytes, supports hydration during peak physical output.",
    journal: "What am I ready to commit to — out loud, to myself?",
    dontDo: "Don't skip the liver support. Estrogen is peaking and it needs to clear cleanly or it carries into Alchemy as estrogen dominance.",
    supplement: "Omega-3s — anti-inflammatory support during ovulation, which is an inflammatory process.",
  },
  {
    move: "High-intensity interval training — your recovery is fast and your energy is high. Go for it.",
    eat: "Vitamin E foods — sunflower seeds, almonds, avocado. Supports egg quality and cervical mucus.",
    drink: "Chamomile or lemon balm tea — calms any ovulation-related cramping and supports the nervous system.",
    journal: "What does my body feel like at its best? Describe it. Remember it.",
    dontDo: "Don't neglect sleep. High energy doesn't mean you need less sleep — it means your body is working hard.",
    supplement: "Selenium — supports thyroid function and antioxidant protection during ovulation. Brazil nuts (2/day) are the easiest source.",
  },
  {
    move: "Whatever you've been putting off because it felt like too much. Right now it probably isn't.",
    eat: "Leafy greens and cruciferous vegetables — keep the liver clearing estrogen so it doesn't accumulate after ovulation.",
    drink: "Warm lemon water — keeps the liver moving during the estrogen peak.",
    journal: "What would I do today if I were operating from my fullest self?",
    dontDo: "Don't say yes to everything just because you feel like you can handle it. Future you is in Alchemy. Be kind to her.",
    supplement: "Magnesium glycinate — supports smooth muscle relaxation and reduces ovulation cramping.",
  },
];

const alchemy: PhaseContent = [
  {
    move: "Walking, swimming, yoga — lower intensity, longer duration. Your body is in a different gear now.",
    eat: "Magnesium-rich foods — dark chocolate, leafy greens, almonds, black beans. Magnesium drops in Alchemy and it affects everything: sleep, mood, cramping, anxiety.",
    drink: "Dandelion root tea — liver support during the progesterone drop. One of the most important things you can drink right now.",
    journal: "What is this phase trying to show me? What keeps coming up that I keep pushing down?",
    dontDo: "Don't make major decisions from the low point of Alchemy. Write it down, revisit it in Bloom.",
    supplement: "Magnesium glycinate — the single most important supplement for Alchemy. Take 300–400mg at night.",
  },
  {
    move: "Gentle strength training — lighter weights, more reps. Keep moving but don't push for PRs right now.",
    eat: "Complex carbohydrates — sweet potatoes, brown rice, oats. Your body craves carbs in Alchemy for a reason — serotonin production. Feed it real ones.",
    drink: "Chamomile tea in the evening — reduces anxiety, supports sleep, calms the nervous system during the hormonal shift.",
    journal: "What am I actually feeling right now — underneath the irritability, the heaviness, the fog?",
    dontDo: "Don't skip magnesium. Seriously. Most of what feels like PMS is magnesium deficiency.",
    supplement: "Vitex (chaste tree berry) — supports progesterone production and reduces PMS symptoms over time. Takes 2-3 cycles to build up.",
  },
  {
    move: "Yin yoga or restorative yoga — your nervous system needs downregulation, not stimulation.",
    eat: "Pumpkin seeds and sunflower seeds — zinc and vitamin E to support progesterone and reduce PMS symptoms.",
    drink: "Warm water with magnesium powder (like Natural Calm) — replaces what you're losing and reduces cramping and anxiety.",
    journal: "What boundaries have I been letting slide? What needs to be said or changed?",
    dontDo: "Don't fight the inward pull. Alchemy is not a malfunction — it's a season. Let yourself go inward.",
    supplement: "B6 — supports progesterone and serotonin production. Reduces mood symptoms significantly for many women.",
  },
  {
    move: "A slow walk outside, especially in the morning. Regulates cortisol and supports progesterone.",
    eat: "Beets, artichokes, and bitter greens — liver support to clear the progesterone drop cleanly and reduce estrogen dominance symptoms.",
    drink: "Lemon balm tea — calms the nervous system, reduces cortisol, supports sleep. Especially good if you're wired but tired.",
    journal: "What does my body need that I haven't been giving it?",
    dontDo: "Don't overcommit socially. Your energy for people is lower right now and that's okay. Protect it.",
    supplement: "Evening primrose oil — reduces breast tenderness, bloating, and mood symptoms. Take through Alchemy only.",
  },
  {
    move: "Stretching and foam rolling — your muscles hold more tension in Alchemy. Release it intentionally.",
    eat: "Warm, cooked foods — soups, stews, roasted vegetables. Your digestion slows in Alchemy. Make it easy on yourself.",
    drink: "Ginger tea — anti-inflammatory, supports digestion, reduces bloating that often comes with Alchemy.",
    journal: "What am I holding onto that's ready to be released with this cycle?",
    dontDo: "Don't eat sugar and processed food — they spike cortisol and make everything worse. This is the phase where food choices matter most.",
    supplement: "Ashwagandha — adaptogen that reduces cortisol and supports the adrenals during the hormonal drop.",
  },
  {
    move: "Rest if that's what your body is asking for. Movement that costs more than it gives is not movement — it's stress.",
    eat: "Dark leafy greens and legumes — B vitamins, iron, and magnesium all in one. Your body is building toward the next release.",
    drink: "Bone broth — minerals, collagen, and warmth. Your body is preparing for release and needs the building blocks.",
    journal: "What would I tell myself right now if I were my own best friend?",
    dontDo: "Don't ignore the signals. If Alchemy is consistently brutal, that's information — not just 'bad PMS.' Note the patterns.",
    supplement: "DIM — supports healthy estrogen clearance during the progesterone drop. Reduces estrogen dominance symptoms like bloating, mood swings, and breast tenderness.",
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
