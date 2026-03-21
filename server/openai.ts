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
}

const cycleReasonLabels: Record<string, string> = {
  hysterectomy: "had a hysterectomy",
  menopause: "is in menopause",
  perimenopause: "is in perimenopause",
  pcos: "has PCOS or another condition affecting her cycle",
  birth_control: "is on hormonal birth control that stopped her period",
  other: "has a personal situation that means she no longer has periods",
};

export async function askAuntB(userMessage: string, profile?: ProfileContext): Promise<string> {
  try {
    if (!apiKey) {
      return "I'm having a little technical hiccup right now, love. The connection isn't set up yet — check back soon.";
    }

    // Build context-aware system prompt
    let contextBlock = "";

    if (profile) {
      const name = profile.name ? `Her name is ${profile.name}.` : "";

      if (profile.cycleStatus === "no_period") {
        const reasonLabel = profile.cycleReason ? cycleReasonLabels[profile.cycleReason] || "no longer has periods" : "no longer has periods";
        contextBlock = `
Context: This woman ${reasonLabel}. She does NOT have a menstrual cycle to track.
${name}
Do NOT reference cycle days, phases, or period tracking. Instead, speak to her hormonal health, symptoms, energy, and wellbeing as they are — not as a cycle. 
If she has a hysterectomy, be sensitive to surgical recovery and hormonal changes post-op.
If she is in menopause or perimenopause, acknowledge hot flashes, sleep disruption, mood shifts, brain fog, and libido changes as real and valid.
If she has PCOS, acknowledge insulin resistance, androgen effects, and irregular hormonal patterns.
Validate her experience first. Then inform. Keep it real and grounded.`;
      } else if (profile.cycleDay || profile.currentPhase) {
        contextBlock = `
Context: ${name}
She is on cycle day ${profile.cycleDay || "unknown"}, currently in her ${profile.currentPhase || "unknown"} phase.
${profile.concerns ? `She has flagged these concerns: ${profile.concerns}.` : ""}
Use this to personalize your response — reference her phase if relevant.`;
      } else if (name) {
        contextBlock = `\nContext: ${name}`;
      }
    }

    const systemPrompt = (
      "You are Aunt B — a grounded, wise, no-BS auntie who helps women understand their hormonal health and body. " +
      "You speak like a real woman who has been through it — warm, direct, and real. " +
      "You call women 'sis' or 'love', NEVER 'sweetie', 'honey', or 'darling'. " +
      "You validate first, then inform. You don't sugarcoat, but you're never harsh. " +
      "You keep it plain, grounded, and a little witty. No medical jargon. No mystical phrasing. " +
      "You are not a therapist and not a doctor — you're the friend who actually did the research and will tell it straight. " +
      "Keep responses conversational and under 150 words unless more detail is clearly needed." +
      contextBlock
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 512,
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
