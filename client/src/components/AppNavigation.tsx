import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, MessageCircle, BookOpen, Users, Music, HandHeart, MessagesSquare, CalendarDays, Utensils } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface AppNavigationProps {
  isPartnerView?: boolean;
  onTogglePartnerView?: () => void;
}

export default function AppNavigation({ isPartnerView = false, onTogglePartnerView }: AppNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Heart },
    { path: '/check-in', label: 'Check-In', icon: Calendar },
    { path: '/chat', label: 'Ask Aunt B', icon: MessageCircle },
    { path: '/spoons', label: 'Spoons', icon: Utensils },
    { path: '/rituals', label: 'Rituals', icon: Music },
    { path: '/partner-support', label: 'Partner Care', icon: HandHeart },
    { path: '/community', label: 'Community', icon: MessagesSquare },
    { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 hover-elevate px-2 py-1 rounded-lg transition-all cursor-pointer" data-testid="link-home">
                <Heart className="w-6 h-6 text-primary fill-primary" />
                <span className="text-xl font-semibold">Cycle Sync</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={isActive ? 'toggle-elevate toggle-elevated' : ''}
                      data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onTogglePartnerView && (
              <Button
                variant={isPartnerView ? 'default' : 'outline'}
                size="sm"
                onClick={onTogglePartnerView}
                data-testid="button-partner-toggle"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                {isPartnerView ? 'Partner View' : 'Switch to Partner'}
              </Button>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={isActive ? 'toggle-elevate toggle-elevated' : ''}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
