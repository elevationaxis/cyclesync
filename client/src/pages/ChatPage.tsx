import AskAuntB from '@/components/AskAuntB';
import { useQuery } from '@tanstack/react-query';
import { calculateCycleDay, getPhaseForCycleLength } from '@/lib/cycleUtils';

function getProfileId(): string | null {
  return localStorage.getItem('cycleSync_profileId');
}

interface UserProfile {
  id: string;
  name: string;
  cycleStatus?: string;
  cycleReason?: string;
  lastPeriodStart?: string | null;
  cycleLength?: number;
  concerns?: string;
  age?: number;
  relationshipStatus?: string;
  partnerWillingness?: string;
}

export default function ChatPage() {
  const profileId = getProfileId();

  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ['/api/profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const res = await fetch(`/api/profile/${profileId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!profileId,
  });

  // Compute cycle day and phase from the same source as the dashboard
  let cycleDay: number | null = null;
  let currentPhase: string | null = null;
  if (profile?.cycleStatus !== 'no_period' && profile?.lastPeriodStart) {
    cycleDay = calculateCycleDay(profile.lastPeriodStart, profile.cycleLength || 28);
    currentPhase = getPhaseForCycleLength(cycleDay, profile.cycleLength || 28);
  }

  const handleSendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          profileId: profileId || undefined,
          cycleDay: cycleDay,
          currentPhase: currentPhase,
        }),
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
