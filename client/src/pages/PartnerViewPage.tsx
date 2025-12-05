import { useQuery } from '@tanstack/react-query';
import PartnerView from '@/components/PartnerView';
import { calculateCycleDay } from '@/lib/cycleUtils';
import type { UserProfile, SpoonEntry } from '@shared/schema';

export default function PartnerViewPage() {
  const profileId = localStorage.getItem('cycleSync_profileId');
  const storedName = localStorage.getItem('cycleSync_userName');
  const userId = "demo-user";

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ['/api/profile', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error('No profile');
      const response = await fetch(`/api/profile/${profileId}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!profileId,
  });

  const { data: spoonEntry } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch spoon entry");
      return response.json();
    },
  });

  const cycleDay = profile?.lastPeriodStart 
    ? calculateCycleDay(profile.lastPeriodStart, profile.cycleLength || 28)
    : 12;

  const partnerName = profile?.name || storedName || "Your Partner";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PartnerView 
        cycleDay={cycleDay} 
        partnerName={partnerName}
        spoonEntry={spoonEntry}
      />
    </div>
  );
}
