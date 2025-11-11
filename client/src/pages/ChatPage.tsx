import AskAuntB from '@/components/AskAuntB';

export default function ChatPage() {
  const handleSendMessage = async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "That makes sense — your body's in its own rhythm right now. What would feel most supportive?",
      "You're not broken, just human. Your hormones are teachers, not enemies.",
      "If you need extra rest, that's data — not failure. Listen to what your body's asking for.",
      "Your body's not working against you — it's trying to communicate. Take a breath and tune in.",
      "You're allowed to ebb and flow. Productivity doesn't mean pushing. Be gentle with yourself.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AskAuntB onSendMessage={handleSendMessage} />
    </div>
  );
}
