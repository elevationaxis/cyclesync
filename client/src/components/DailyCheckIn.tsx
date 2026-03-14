import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface CheckInData {
  energy: string;
  mood: string;
  symptoms: string[];
  notes: string;
}

interface DailyCheckInProps {
  onSubmit?: (data: CheckInData) => void;
}

export default function DailyCheckIn({ onSubmit }: DailyCheckInProps) {
  const [formData, setFormData] = useState<CheckInData>({
    energy: '',
    mood: '',
    symptoms: [],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const symptoms = [
    'Cramps', 'Headache', 'Bloating', 'Fatigue',
    'Tender breasts', 'Acne', 'Mood swings', 'Cravings',
  ];

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold">Daily Check-In</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base">How's your energy today?</Label>
          <RadioGroup
            value={formData.energy}
            onValueChange={(value) => setFormData(prev => ({ ...prev, energy: value }))}
            className="flex gap-2"
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="flex flex-col items-center gap-2">
                <RadioGroupItem
                  value={level.toString()}
                  id={`energy-${level}`}
                  data-testid={`radio-energy-${level}`}
                  className="w-12 h-12"
                />
                <Label htmlFor={`energy-${level}`} className="text-xs text-muted-foreground">
                  {level === 1 && 'Low'}
                  {level === 3 && 'Medium'}
                  {level === 5 && 'High'}
                  {(level === 2 || level === 4) && level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base">How are you feeling?</Label>
          <RadioGroup
            value={formData.mood}
            onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {['Calm', 'Happy', 'Anxious', 'Irritable', 'Sad', 'Energized'].map((mood) => (
              <div key={mood} className="flex items-center space-x-2">
                <RadioGroupItem value={mood} id={`mood-${mood}`} data-testid={`radio-mood-${mood}`} />
                <Label htmlFor={`mood-${mood}`} className="cursor-pointer">{mood}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base">Any symptoms?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {symptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={`symptom-${symptom}`}
                  checked={formData.symptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                  data-testid={`checkbox-${symptom.toLowerCase().replace(' ', '-')}`}
                />
                <Label htmlFor={`symptom-${symptom}`} className="cursor-pointer text-sm">
                  {symptom}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="notes" className="text-base">Anything else on your mind?</Label>
          <Textarea
            id="notes"
            placeholder="Your thoughts, observations, or anything you'd like to remember..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="min-h-24 resize-none"
            data-testid="textarea-notes"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" data-testid="button-submit-checkin">
          Share with Aunt B
        </Button>
      </form>
    </Card>
  );
}
