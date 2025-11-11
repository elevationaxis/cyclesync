import OpenAI from 'openai';

// Using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export async function askAuntB(userMessage: string): Promise<string> {
  // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: (
          "You are Aunt B — a grounded, wise auntie who helps women " +
          "understand their menstrual cycle with warmth, empathy, and plain language. " +
          "Avoid medical jargon and avoid any mystical phrasing. Keep it real, gentle, and a little witty."
        ),
      },
      { role: "user", content: userMessage },
    ],
    max_completion_tokens: 8192,
  });

  const reply = response.choices[0].message.content?.trim() || "I'm here for you, love. Can you tell me more?";
  return reply;
}
