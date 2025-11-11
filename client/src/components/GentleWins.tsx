import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface GentleWinsProps {
  habits?: string[];
}

const defaultHabits = [
  'Moved my body for 10 minutes',
  'Chose rest without guilt',
  'Drank water when I needed it',
  'Checked in with how I feel',
  'Set a boundary',
  'Ate something nourishing',
  'Asked for what I need',
  'Honored my energy level',
];

export default function GentleWins({ habits = defaultHabits }: GentleWinsProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggleHabit = (index: number) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const reset = () => {
    setCompleted(new Set());
  };

  const completionRate = Math.round((completed.size / habits.length) * 100);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold">Gentle Wins</h2>
        </div>
        {completed.size > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-primary">
              {completed.size} / {habits.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {completionRate > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {habits.map((habit, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover-elevate transition-all">
            <Checkbox
              id={`habit-${index}`}
              checked={completed.has(index)}
              onCheckedChange={() => toggleHabit(index)}
              className="w-6 h-6"
              data-testid={`checkbox-habit-${index}`}
            />
            <Label
              htmlFor={`habit-${index}`}
              className={`flex-1 cursor-pointer text-base ${
                completed.has(index) ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {habit}
            </Label>
          </div>
        ))}
      </div>

      {completed.size === habits.length && (
        <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
          <p className="text-base font-medium text-primary">
            You're doing amazing! Every small step counts.
          </p>
        </div>
      )}
    </Card>
  );
}
