import AskAuntB from '@/components/AskAuntB';

export default function ChatPage() {
  const handleSendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error sending message:', error);
      return "I'm having trouble connecting right now, love. Can you try again in a moment?";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AskAuntB onSendMessage={handleSendMessage} />
    </div>
  );
}
