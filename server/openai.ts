import OpenAI from 'openai';

// Using environment-provided OpenAI-compatible API access
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || process.env.OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export async function askAuntB(userMessage: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
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
}
