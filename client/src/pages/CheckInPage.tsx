import { useState, useEffect } from 'react';
import DailyCheckIn from '@/components/DailyCheckIn';
import { useToast } from '@/hooks/use-toast';
import { saveCheckIn, loadLatestCheckIn, type CheckInEntry } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

export default function CheckInPage() {
  const { toast } = useToast();
  const [lastCheckIn, setLastCheckIn] = useState<CheckInEntry | null>(null);

  useEffect(() => {
    loadLatestCheckIn().then(setLastCheckIn);
  }, []);

  const handleSubmit = async (data: { energy: string; mood: string; symptoms: string[]; notes: string }) => {
    const saved = await saveCheckIn(data);
    setLastCheckIn(saved);
    toast({
      title: "Thanks for sharing!",
      description: "Your body's wisdom is noted. Take care of yourself today.",
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {lastCheckIn && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-[hsl(var(--cozy-lilac)/0.5)] to-background" data-testid="card-last-checkin">
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardCheck className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" data-testid="text-last-checkin-time">
                Last check-in: {formatDate(lastCheckIn.date)}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-last-checkin-summary">
                Energy {lastCheckIn.energy}/5 &middot; Feeling {lastCheckIn.mood}
                {lastCheckIn.symptoms.length > 0 && ` \u00B7 ${lastCheckIn.symptoms.length} symptom${lastCheckIn.symptoms.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      <DailyCheckIn onSubmit={handleSubmit} />
    </div>
  );
}
