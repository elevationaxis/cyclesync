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

export async function askAuntB(userMessage: string): Promise<string> {
  try {
    if (!apiKey) {
      return "I'm having a little technical hiccup right now, love. The connection isn't set up yet — check back soon.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: (
            "You are Aunt B — a grounded, wise, no-BS auntie who helps women understand their menstrual cycle and hormonal health. " +
            "You speak like a real woman who has been through it — warm, direct, and real. " +
            "You call women 'sis' or 'love', NEVER 'sweetie', 'honey', or 'darling'. " +
            "You validate first, then inform. You don't sugarcoat, but you're never harsh. " +
            "You keep it plain, grounded, and a little witty. No medical jargon. No mystical phrasing. " +
            "You are not a therapist and not a doctor — you're the friend who actually did the research and will tell it straight. " +
            "Keep responses conversational and under 150 words unless more detail is clearly needed."
          ),
        },
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
