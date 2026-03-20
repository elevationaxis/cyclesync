export interface PhaseNutrition {
  phase: string;
  days: string;
  color: string;
  accent: string;
  emoji: string;
  why: string;
  smoothie: {
    name: string;
    ingredients: string[];
    tip: string;
  };
  trailMix: {
    name: string;
    ingredients: string[];
    tip: string;
  };
  keyNutrients: string[];
  avoidOrLimit: string[];
}

export const phaseNutrition: PhaseNutrition[] = [
  {
    phase: "Menstrual",
    days: "Days 1–5",
    color: "#8B4A6B",
    accent: "#C4846E",
    emoji: "🌑",
    why: "Your body is shedding and rebuilding. Iron, zinc, and anti-inflammatory foods help replenish what you're losing and ease cramping. Warm, cooked foods are easier to digest when your body is already working hard.",
    smoothie: {
      name: "The Restore",
      ingredients: [
        "1 cup tart cherry juice (anti-inflammatory, natural melatonin)",
        "1 cup spinach or beet greens (iron)",
        "½ cup frozen dark cherries",
        "½ banana (potassium, reduces cramping)",
        "1 tbsp blackstrap molasses (iron + magnesium)",
        "1 tsp ginger (reduces prostaglandins that cause cramps)",
        "1 cup coconut milk or oat milk",
        "Optional: pinch of cinnamon (blood sugar balance)"
      ],
      tip: "Drink warm or at room temperature if you're having cramps — cold drinks can tighten muscles."
    },
    trailMix: {
      name: "The Replenisher",
      ingredients: [
        "Pumpkin seeds (zinc + magnesium — the MVPs of menstruation)",
        "Dark chocolate chips 70%+ (magnesium, iron, mood)",
        "Dried tart cherries (anti-inflammatory)",
        "Walnuts (omega-3s reduce inflammation)",
        "Sunflower seeds (vitamin E, reduces breast tenderness)",
        "Dried ginger pieces (cramp relief)",
        "A few Brazil nuts (selenium, thyroid support)"
      ],
      tip: "Keep this one in your bag during your period. Pumpkin seeds + dark chocolate is the cramp-fighting combo your body is literally asking for."
    },
    keyNutrients: ["Iron", "Magnesium", "Zinc", "Omega-3s", "Vitamin C (helps absorb iron)"],
    avoidOrLimit: ["Alcohol (worsens cramping + depletes magnesium)", "Excess caffeine (constricts blood vessels)", "Salty processed foods (bloating)", "Dairy if you're sensitive (can increase prostaglandins)"]
  },
  {
    phase: "Follicular",
    days: "Days 6–13",
    color: "#5B8A6B",
    accent: "#8BAF7A",
    emoji: "🌱",
    why: "Estrogen is rising and so is your energy. Your gut microbiome is especially active in processing estrogen — fermented foods and fiber help keep that in balance. Light, fresh foods match your body's upward momentum.",
    smoothie: {
      name: "The Rise",
      ingredients: [
        "1 cup frozen mango or pineapple (vitamin C, enzyme-rich)",
        "½ cup plain kefir or coconut yogurt (probiotics for estrogen metabolism)",
        "1 cup spinach (folate, iron)",
        "½ cucumber (hydration, anti-bloat)",
        "1 tbsp flaxseed (lignans support healthy estrogen levels)",
        "Juice of ½ lemon (liver support, vitamin C)",
        "1 cup coconut water",
        "Optional: 1 tsp spirulina (protein, B vitamins)"
      ],
      tip: "This is your highest energy phase — a lighter smoothie works because your digestion is stronger. Add protein powder if you're working out more."
    },
    trailMix: {
      name: "The Builder",
      ingredients: [
        "Almonds (vitamin E, healthy fats for estrogen production)",
        "Flaxseeds or hemp seeds (lignans, omega-3s)",
        "Dried mango pieces (vitamin C, beta-carotene)",
        "Pistachios (B6, protein)",
        "Dried cranberries (antioxidants, urinary health)",
        "Cashews (zinc, magnesium)",
        "Pumpkin seeds (zinc continues to support follicle development)"
      ],
      tip: "Your appetite may be lower this phase — this mix is nutrient-dense without being heavy. Great for snacking between bigger creative work sessions."
    },
    keyNutrients: ["Folate", "B vitamins", "Vitamin E", "Probiotics", "Lignans (flaxseed)"],
    avoidOrLimit: ["Excess sugar (can spike then crash energy)", "Heavily processed foods (disrupt gut microbiome)", "Too much alcohol (liver has to process both alcohol and estrogen)"]
  },
  {
    phase: "Ovulatory",
    days: "Days 14–16",
    color: "#C4846E",
    accent: "#D4A574",
    emoji: "🌕",
    why: "Estrogen peaks and then drops sharply. Your liver works overtime to clear excess estrogen — cruciferous vegetables and fiber are your best friends here. Anti-inflammatory foods help prevent the post-ovulation crash.",
    smoothie: {
      name: "The Peak",
      ingredients: [
        "1 cup frozen strawberries (vitamin C, antioxidants)",
        "½ cup raw cauliflower or frozen broccoli (DIM — helps liver clear estrogen)",
        "1 cup coconut water",
        "½ avocado (healthy fats, hormone production)",
        "1 tbsp chia seeds (fiber, omega-3s)",
        "1 tsp turmeric (anti-inflammatory)",
        "Pinch of black pepper (activates turmeric)",
        "Optional: 1 scoop collagen peptides (skin is most receptive to collagen this phase)"
      ],
      tip: "The cauliflower blends in without tasting like vegetables. This is the best phase to sneak in cruciferous veggies because your energy is high and digestion is strong."
    },
    trailMix: {
      name: "The Glow",
      ingredients: [
        "Sunflower seeds (vitamin E, selenium)",
        "Dried apricots (beta-carotene, iron)",
        "Macadamia nuts (healthy fats, anti-inflammatory)",
        "Pumpkin seeds (zinc supports corpus luteum after ovulation)",
        "Dark chocolate chips (flavonoids, antioxidants)",
        "Dried blueberries or goji berries (antioxidants)",
        "Coconut flakes (medium-chain fatty acids)"
      ],
      tip: "You're at your most social and energetic right now. This mix is great for on-the-go days when you're out and doing the most."
    },
    keyNutrients: ["DIM (from cruciferous veggies)", "Fiber", "Vitamin C", "Zinc", "Antioxidants"],
    avoidOrLimit: ["Excess refined carbs (can worsen post-ovulation energy drop)", "Inflammatory oils (canola, soybean)", "Excess alcohol (liver is already busy clearing estrogen)"]
  },
  {
    phase: "Luteal",
    days: "Days 17–28",
    color: "#7A6B8A",
    accent: "#9A8AAA",
    emoji: "🌘",
    why: "Progesterone rises and your metabolism speeds up — you actually need more calories (about 200–300 more) in the second half of luteal. Magnesium and B6 are critical for mood and reducing PMS. Complex carbs reduce serotonin crashes. Your cravings are real and they're data.",
    smoothie: {
      name: "The Steady",
      ingredients: [
        "1 frozen banana (potassium, natural sweetness for cravings)",
        "2 tbsp cacao powder (magnesium, mood — not cocoa, actual cacao)",
        "1 tbsp almond butter (B6, healthy fats, protein)",
        "1 cup oat milk (complex carbs, B vitamins)",
        "1 tbsp flaxseed (fiber, lignans help clear excess estrogen)",
        "½ tsp cinnamon (blood sugar balance — reduces PMS mood swings)",
        "Optional: 1 scoop protein powder (reduces bloating, stabilizes blood sugar)",
        "Optional: pinch of sea salt (electrolytes, reduces bloating)"
      ],
      tip: "This smoothie is basically a PMS prevention tool. The cacao + banana + almond butter combo hits magnesium, potassium, and B6 all at once — the trifecta for reducing cramps and mood swings before they start."
    },
    trailMix: {
      name: "The Anchor",
      ingredients: [
        "Dark chocolate chips 70%+ (magnesium — your body is literally craving this)",
        "Cashews (magnesium, B6, tryptophan for serotonin)",
        "Dried dates (natural sugar, iron, fiber — satisfies sweet cravings cleanly)",
        "Walnuts (omega-3s, reduces inflammation and mood swings)",
        "Pumpkin seeds (magnesium, zinc)",
        "Sunflower seeds (B6, vitamin E)",
        "Dried banana chips (potassium, complex carbs)"
      ],
      tip: "If you're craving chocolate and carbs in your luteal phase, your body is asking for magnesium and serotonin support. This mix gives you both without the crash. Don't fight the cravings — redirect them."
    },
    keyNutrients: ["Magnesium", "B6", "Complex carbohydrates", "Tryptophan", "Calcium"],
    avoidOrLimit: ["Alcohol (worsens anxiety, depletes B vitamins and magnesium)", "Excess caffeine (spikes cortisol, worsens anxiety and breast tenderness)", "Refined sugar (blood sugar spikes worsen mood crashes)", "Excess sodium (bloating)"]
  }
];

export function getNutritionForPhase(phase: string): PhaseNutrition | undefined {
  return phaseNutrition.find(p => p.phase.toLowerCase() === phase.toLowerCase());
}

export function getNutritionForDay(dayOfCycle: number, cycleLength = 28): PhaseNutrition {
  if (dayOfCycle <= 5) return phaseNutrition[0]; // Menstrual
  if (dayOfCycle <= 13) return phaseNutrition[1]; // Follicular
  if (dayOfCycle <= 16) return phaseNutrition[2]; // Ovulatory
  return phaseNutrition[3]; // Luteal
}
