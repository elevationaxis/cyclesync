import DailyCheckIn from '@/components/DailyCheckIn';
import { useToast } from '@/hooks/use-toast';

export default function CheckInPage() {
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log('Check-in data:', data);
    toast({
      title: "Thanks for sharing!",
      description: "Your body's wisdom is noted. Take care of yourself today.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DailyCheckIn onSubmit={handleSubmit} />
    </div>
  );
}
