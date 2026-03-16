import { db } from "./db";
import { communityPosts, rituals } from "@shared/schema";

const SEED_COMMUNITY_POSTS = [
  {
    question: "How do you manage extreme fatigue during your period?",
    answer: "I keep a heating pad at my desk and switch to lighter tasks on days 1-2. Giving myself permission to rest instead of pushing through actually helps me recover faster and feel more productive by day 3.",
    phase: "menstrual",
    upvotes: 14,
  },
  {
    question: "Best comfort foods that actually help with cramps?",
    answer: "Dark chocolate with magnesium, ginger tea, and warm bone broth are my go-tos. I meal prep a big batch of anti-inflammatory soup before my period starts so I don't have to cook when I'm in pain.",
    phase: "menstrual",
    upvotes: 21,
  },
  {
    question: "Does anyone else feel a huge burst of motivation during follicular phase?",
    answer: "Yes! I use this window to start new projects, have difficult conversations, and batch-create content. I literally schedule my most ambitious work for days 6-12 because my brain is on fire.",
    phase: "follicular",
    upvotes: 18,
  },
  {
    question: "What workouts work best during follicular phase?",
    answer: "This is when I go hardest — HIIT, heavy lifting, dance cardio. My body recovers so much faster during this phase. I tried matching my workout intensity to my cycle and the difference in results was wild.",
    phase: "follicular",
    upvotes: 12,
  },
  {
    question: "How do you harness ovulatory energy without burning out?",
    answer: "I schedule all my social events, presentations, and networking during ovulation because I'm naturally more charismatic. But I also set a hard stop at 9pm — that energy feels infinite but it's not.",
    phase: "ovulatory",
    upvotes: 16,
  },
  {
    question: "Tips for managing heightened emotions around ovulation?",
    answer: "Journaling for 10 minutes in the morning helps me process the emotional intensity. I also tell my partner 'I'm in my feeling-everything phase' so they know I might need extra patience with big conversations.",
    phase: "ovulatory",
    upvotes: 9,
  },
  {
    question: "How do you deal with luteal phase brain fog?",
    answer: "Lists are everything. I write down even obvious things because my working memory drops. I also batch simple, repetitive tasks for this phase instead of trying to be creative — save the big ideas for follicular.",
    phase: "luteal",
    upvotes: 23,
  },
  {
    question: "Anyone else get intense cravings during luteal phase?",
    answer: "My nutritionist told me the cravings are real — your body needs 100-300 extra calories during luteal. I stopped fighting it and started eating more healthy fats and complex carbs. The guilt-free approach actually reduced my binging.",
    phase: "luteal",
    upvotes: 19,
  },
  {
    question: "What helps with PMS-related anxiety?",
    answer: "Magnesium glycinate before bed has been a game-changer for me. I also cut caffeine in half during my luteal phase. The anxiety used to blindside me until I started tracking — now I can tell myself 'this is hormonal, it will pass.'",
    phase: "luteal",
    upvotes: 27,
  },
  {
    question: "How do you explain cycle syncing to a skeptical partner?",
    answer: "I started by just sharing how I felt each week without using the terminology. After a month my partner noticed the patterns himself and asked to learn more. Showing instead of telling worked way better than a lecture.",
    phase: "follicular",
    upvotes: 15,
  },
];

const SEED_RITUALS = [
  {
    title: "Gentle Body Scan Meditation",
    description: "A soothing 10-minute guided meditation designed for your menstrual phase. Focus on releasing tension and honoring your body's need for rest.",
    phase: "menstrual",
    fileType: "audio",
    filePath: "",
    duration: "10 minutes",
  },
  {
    title: "Restorative Yoga Flow",
    description: "Slow, grounding poses to ease cramps and calm your nervous system. Perfect for days when movement feels good but intensity doesn't.",
    phase: "menstrual",
    fileType: "video",
    filePath: "",
    duration: "15 minutes",
  },
  {
    title: "Morning Energy Activation",
    description: "A high-energy breathwork and movement sequence to channel your rising follicular energy. Great for starting creative projects.",
    phase: "follicular",
    fileType: "audio",
    filePath: "",
    duration: "8 minutes",
  },
  {
    title: "Strength & Confidence Flow",
    description: "Dynamic yoga sequence that builds on your follicular phase strength. Includes power poses and affirmations for self-belief.",
    phase: "follicular",
    fileType: "video",
    filePath: "",
    duration: "20 minutes",
  },
  {
    title: "Radiance Breathwork",
    description: "Energizing breathwork practice designed for your most social and expressive phase. Builds presence and vocal clarity before big moments.",
    phase: "ovulatory",
    fileType: "audio",
    filePath: "",
    duration: "7 minutes",
  },
  {
    title: "Heart-Opening Movement",
    description: "Flowing movement practice that channels ovulatory confidence into connection. Combines chest-opening stretches with gratitude prompts.",
    phase: "ovulatory",
    fileType: "video",
    filePath: "",
    duration: "12 minutes",
  },
  {
    title: "Calm & Ground Meditation",
    description: "A grounding meditation to ease luteal phase restlessness and anxiety. Uses body-based techniques to soothe your nervous system.",
    phase: "luteal",
    fileType: "audio",
    filePath: "",
    duration: "12 minutes",
  },
  {
    title: "Slow Stretch & Release",
    description: "Gentle stretching focused on hip and lower back tension common in the luteal phase. Ends with a guided relaxation to prepare for rest.",
    phase: "luteal",
    fileType: "video",
    filePath: "",
    duration: "18 minutes",
  },
];

export async function seedStarterContent(): Promise<void> {
  try {
    const existingPosts = await db.select().from(communityPosts);
    if (existingPosts.length === 0) {
      await db.insert(communityPosts).values(SEED_COMMUNITY_POSTS);
      console.log(`Seeded ${SEED_COMMUNITY_POSTS.length} community posts`);
    }

    const existingRituals = await db.select().from(rituals);
    if (existingRituals.length === 0) {
      await db.insert(rituals).values(SEED_RITUALS);
      console.log(`Seeded ${SEED_RITUALS.length} rituals`);
    }
  } catch (error) {
    console.error("Failed to seed starter content:", error);
  }
}
