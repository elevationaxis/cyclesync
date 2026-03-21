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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Medical Disclaimer */}
      <div
        className="mb-4 px-4 py-3 rounded-lg text-xs text-center"
        style={{
          background: 'rgba(247,242,235,0.05)',
          border: '1px solid rgba(247,242,235,0.1)',
          color: 'rgba(247,242,235,0.45)',
          lineHeight: '1.5',
        }}
      >
        <span style={{ color: 'rgba(247,242,235,0.6)', fontWeight: 600 }}>For informational purposes only.</span>{' '}
        Aunt B is not a doctor and nothing here is medical advice. Always consult a qualified healthcare provider before making changes to your health routine.
      </div>

      <AskAuntB onSendMessage={handleSendMessage} />
    </div>
  );
}
