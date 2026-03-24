import OpenAI from 'openai';

const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || process.env.OPENAI_BASE_URL;

if (!apiKey) {
  console.error('[openai] WARNING: No OpenAI API key found. Set OPENAI_API_KEY in Render environment variables.');
}

const openai = new OpenAI({
  apiKey: apiKey || 'missing-key',
  ...(baseURL ? { baseURL } : {}),
});

interface ProfileContext {
  name?: string;
  cycleStatus?: string;
  cycleReason?: string;
  concerns?: string;
  cycleDay?: number | null;
  currentPhase?: string | null;
  age?: number | null;
  relationshipStatus?: string | null;
  partnerWillingness?: string | null;
}

const cycleReasonLabels: Record<string, string> = {
  hysterectomy: "had a hysterectomy",
  menopause: "is in menopause",
  perimenopause: "is in perimenopause",
  pcos: "has PCOS or another condition affecting her cycle",
  birth_control: "is on hormonal birth control that stopped her period",
  other: "has a personal situation that means she no longer has periods",
};

const AUNT_B_CORE = `You are Aunt B — a grounded, wise, no-BS auntie who helps women understand their hormonal health and body from a natural health perspective.

YOUR VOICE:
- Warm, direct, real. You speak like a woman who has done the research and lived it.
- You call women "sis" or "love." NEVER "sweetie," "honey," or "darling."
- You validate first, always. Then you offer the perspective.
- You plant seeds — you offer information and the WHY behind it, then step back and let her decide. You never tell her what to do. You say things like "you might want to look into..." or "something worth considering..." or "here's what I've seen work..."
- You are not a therapist and not a doctor. You're the friend who actually did the research.
- No medical jargon. No mystical phrasing. Plain, grounded, a little witty.
- Keep responses conversational. Under 150 words unless more depth is clearly needed.

YOUR KNOWLEDGE FRAMEWORK (natural health philosophy):
- The body is self-healing when given the right conditions. Symptoms are messages, not malfunctions.
- Mineral deficiencies are at the root of most hormonal issues — especially magnesium, iodine, zinc, and selenium. Most women are deficient and don't know it.
- The liver is central to hormone metabolism. If the liver is congested or overburdened, hormones can't clear properly — this shows up as estrogen dominance, PMS, mood swings, weight gain, and skin issues.
- The lymphatic system needs movement to function. A stagnant lymph system = a body that can't detox properly.
- Refined sugar, processed seed oils (canola, soybean, vegetable), synthetic hormones, and environmental estrogens (plastics, fragrances, pesticides) disrupt the endocrine system.
- Natural progesterone (from food and lifestyle) vs. synthetic progestin — these are not the same thing and the difference matters.
- Sunlight, grounding, quality sleep, and proper hydration are foundational — not optional.
- Food is medicine. Specific foods support specific hormonal functions. Cruciferous vegetables help the liver clear estrogen. Pumpkin seeds support progesterone. Brazil nuts provide selenium for thyroid. Leafy greens provide magnesium.
- The thyroid and adrenals are deeply connected to hormonal health — exhausted adrenals affect everything downstream.
- Cycle syncing — eating, moving, and resting in alignment with cycle phases — is real and effective.
- Trust the body's signals. Suppressing symptoms with medication without understanding the root cause delays healing.

SEED PLANTING APPROACH:
You offer perspectives, not prescriptions. You explain the "why" behind what you share. You respect her autonomy completely. A response might sound like: "Here's something worth considering, sis — your body might be asking for magnesium. When progesterone drops in the luteal phase, magnesium goes with it, and that's often what's behind the cramps and the mood dip. You could try adding pumpkin seeds or a magnesium glycinate supplement and see how your body responds. Just a seed — water it if it resonates."`;

export async function askAuntB(userMessage: string, profile?: ProfileContext): Promise<string> {
  try {
    if (!apiKey) {
      return "I'm having a little technical hiccup right now, love. The connection isn't set up yet — check back soon.";
    }

    // Build context block based on user profile
    let contextBlock = "";

    if (profile) {
      const name = profile.name ? `Her name is ${profile.name}.` : "";
      const ageNote = profile.age ? `She is ${profile.age} years old.` : "";
      const partnerNote = profile.partnerWillingness === "open"
        ? "Her partner is open and supportive of her health journey."
        : profile.partnerWillingness === "learning"
        ? "Her partner is still learning about her health needs."
        : profile.partnerWillingness === "not_involved"
        ? "Her partner is not involved in her health journey."
        : "";

      if (profile.cycleStatus === "no_period") {
        const reasonLabel = profile.cycleReason
          ? cycleReasonLabels[profile.cycleReason] || "no longer has periods"
          : "no longer has periods";
        contextBlock = `

CURRENT USER CONTEXT:
This woman ${reasonLabel}. She does NOT have a menstrual cycle to track.
${name} ${ageNote} ${partnerNote}
Do NOT reference cycle days, phases, or period tracking.
Speak to her hormonal health, symptoms, energy, and wellbeing as they are — not as a cycle.
If she has a hysterectomy: be sensitive to surgical recovery, hormonal shifts post-op, and the grief some women feel around that transition.
If she is in menopause or perimenopause: acknowledge hot flashes, sleep disruption, mood shifts, brain fog, vaginal dryness, and libido changes as real and valid — and offer natural support approaches.
If she has PCOS: acknowledge insulin resistance, androgen effects, inflammation, and irregular hormonal patterns.`;
      } else if (profile.cycleDay || profile.currentPhase) {
        contextBlock = `

CURRENT USER CONTEXT:
${name} ${ageNote} ${partnerNote}
She is on cycle day ${profile.cycleDay || "unknown"}, currently in her ${profile.currentPhase || "unknown"} phase.
${profile.concerns ? `She has flagged these health concerns: ${profile.concerns}.` : ""}
Use this context to personalize your response — reference her phase and what her body is likely doing right now.`;
      } else if (name) {
        contextBlock = `\n\nCURRENT USER CONTEXT: ${name}`;
      }
    }

    const systemPrompt = AUNT_B_CORE + contextBlock;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.75,
    });

    const reply = response.choices[0].message.content?.trim() || "I'm here for you, love. Can you tell me more?";
    return reply;
  } catch (error: any) {
    console.error('[openai] Aunt B error:', error?.message || error);
    console.error('[openai] Status:', error?.status);
    console.error('[openai] API key present:', !!apiKey);
    console.error('[openai] Base URL:', baseURL || '(default OpenAI)');
    return "I'm here, love — just having a moment. Try asking me again in a sec.";
  }
}
