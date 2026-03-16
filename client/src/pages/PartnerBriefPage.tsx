import { useQuery } from '@tanstack/react-query';
import PartnerView from '@/components/PartnerView';
import { calculateCycleDay } from '@/lib/cycleUtils';
import { getProfileId, getUserName } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { UserProfile, SpoonEntry } from '@shared/schema';

export default function PartnerBriefPage() {
  const profileId = getProfileId();
  const storedName = getUserName();
  const userId = "demo-user";

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
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

  if (!profileId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2" data-testid="text-no-profile">No Profile Found</h2>
            <p className="text-muted-foreground">
              This partner brief requires an active profile on this device. Ask your partner to share their link from the same browser.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading partner brief...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center mb-6">
          <Badge variant="outline" className="text-xs px-3 py-1" data-testid="badge-demo-mode">
            CyncLink Demo Mode
          </Badge>
        </div>
        <PartnerView
          cycleDay={cycleDay}
          partnerName={partnerName}
          spoonEntry={spoonEntry}
        />
      </div>
    </div>
  );
}
