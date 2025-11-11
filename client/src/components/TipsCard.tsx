import { Card } from '@/components/ui/card';
import { Brain, Activity, Utensils, Wind, type LucideIcon } from 'lucide-react';

interface TipsCardProps {
  category: 'Mind' | 'Body' | 'Food' | 'Flow';
  tips: string[];
}

const categoryConfig: Record<string, { icon: LucideIcon; color: string }> = {
  Mind: { icon: Brain, color: 'hsl(280, 50%, 55%)' },
  Body: { icon: Activity, color: 'hsl(120, 50%, 50%)' },
  Food: { icon: Utensils, color: 'hsl(30, 85%, 55%)' },
  Flow: { icon: Wind, color: 'hsl(200, 70%, 55%)' },
};

export default function TipsCard({ category, tips }: TipsCardProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Card className="p-6 space-y-4 hover-elevate transition-all">
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <h3 className="text-lg font-semibold">{category}</h3>
      </div>

      <ul className="space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="text-primary mt-1">•</span>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
