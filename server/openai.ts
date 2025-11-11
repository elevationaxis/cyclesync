import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askAuntB(userMessage: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
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
    temperature: 0.8,
  });

  const reply = response.choices[0].message.content?.trim() || "I'm here for you, love. Can you tell me more?";
  return reply;
}
