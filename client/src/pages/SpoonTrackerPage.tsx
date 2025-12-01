import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Utensils, Minus, Plus, Info, ChevronDown, Sparkles, Battery, BatteryLow, BatteryMedium, BatteryFull, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SpoonEntry } from "@shared/schema";
import { getCurrentPhase } from "@/lib/cycleUtils";

export default function SpoonTrackerPage() {
  const { toast } = useToast();
  const userId = "demo-user";
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [localSpoons, setLocalSpoons] = useState({ total: 12, used: 0 });
  const [note, setNote] = useState("");

  const { data: todayEntry, isLoading } = useQuery<SpoonEntry | null>({
    queryKey: ["/api/spoon-entries/today", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries/today?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch today's spoon entry");
      return response.json();
    },
  });

  const { data: history = [] } = useQuery<SpoonEntry[]>({
    queryKey: ["/api/spoon-entries", userId],
    queryFn: async () => {
      const response = await fetch(`/api/spoon-entries?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch spoon history");
      return response.json();
    },
  });

  useEffect(() => {
    if (todayEntry) {
      setLocalSpoons({ total: todayEntry.totalSpoons, used: todayEntry.usedSpoons });
      setNote(todayEntry.note || "");
    }
  }, [todayEntry]);

  const createEntry = useMutation({
    mutationFn: async () => {
      const phase = getCurrentPhase(Date.now());
      return await apiRequest("POST", "/api/spoon-entries", {
        userId,
        date: new Date().toISOString(),
        totalSpoons: localSpoons.total,
        usedSpoons: localSpoons.used,
        note: note || null,
        phase,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spoon-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/spoon-entries/today"] });
      toast({
        title: "Spoons tracked",
        description: "Your energy level has been saved",
      });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async () => {
      if (!todayEntry) throw new Error("No entry to update");
      return await apiRequest("PATCH", `/api/spoon-entries/${todayEntry.id}`, {
        usedSpoons: localSpoons.used,
        totalSpoons: localSpoons.total,
        note: note || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spoon-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/spoon-entries/today"] });
      toast({
        title: "Updated",
        description: "Your spoon count has been updated",
      });
    },
  });

  const handleSave = () => {
    if (todayEntry) {
      updateEntry.mutate();
    } else {
      createEntry.mutate();
    }
  };

  const useSpoon = () => {
    if (localSpoons.used < localSpoons.total) {
      setLocalSpoons({ ...localSpoons, used: localSpoons.used + 1 });
    }
  };

  const restoreSpoon = () => {
    if (localSpoons.used > 0) {
      setLocalSpoons({ ...localSpoons, used: localSpoons.used - 1 });
    }
  };

  const remainingSpoons = localSpoons.total - localSpoons.used;
  const spoonPercentage = (remainingSpoons / localSpoons.total) * 100;

  const getEnergyStatus = () => {
    if (spoonPercentage >= 70) return { label: "Plenty of energy", icon: BatteryFull, color: "text-emerald-600 dark:text-emerald-400" };
    if (spoonPercentage >= 40) return { label: "Moderate energy", icon: BatteryMedium, color: "text-amber-600 dark:text-amber-400" };
    if (spoonPercentage >= 15) return { label: "Running low", icon: BatteryLow, color: "text-orange-600 dark:text-orange-400" };
    return { label: "Recharge needed", icon: Battery, color: "text-rose-600 dark:text-rose-400" };
  };

  const energyStatus = getEnergyStatus();
  const EnergyIcon = energyStatus.icon;

  const sortedHistory = [...history]
    .filter(e => e.id !== todayEntry?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 mb-4">
          <Utensils className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Spoon Tracker
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Track your daily energy using spoon theory
        </p>
      </div>

      <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen} className="mb-6">
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-lg">What is Spoon Theory?</CardTitle>
                    <CardDescription>Tap to learn about this energy management tool</CardDescription>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExplanationOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="bg-background/70 rounded-xl p-4 border">
                <p className="text-sm leading-relaxed mb-4">
                  <strong>Spoon theory</strong> is a way to explain limited energy to people who don't experience it. 
                  Created by Christine Miserandino, it's especially helpful for those with chronic illness, disabilities, 
                  or neurodivergent conditions.
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  Imagine you start each day with a set number of <strong>"spoons"</strong> representing your available energy. 
                  Every activity costs spoons:
                </p>
                <div className="grid gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <span>Getting dressed might cost 1 spoon</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <span>A difficult conversation might cost 2 spoons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <Utensils className="w-4 h-4 text-orange-500" />
                    <span>A full workday might cost 3+ spoons</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">
                  When you're out of spoons, you're out of energy — it's that simple. 
                  Tracking spoons helps you pace yourself and helps loved ones understand your capacity.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Heart className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>For partners:</strong> When someone says "I don't have any spoons left," 
                  they mean they've used all their energy for the day. This is a signal to offer rest, 
                  take over tasks, or just be present without expectations.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card className="mb-6 border-2 overflow-visible">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2">
            <EnergyIcon className={`w-6 h-6 ${energyStatus.color}`} />
            Today's Spoons
          </CardTitle>
          <CardDescription className={`text-base font-medium ${energyStatus.color}`}>
            {energyStatus.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" data-testid="text-remaining-spoons">
              {remainingSpoons}
              <span className="text-2xl text-muted-foreground font-normal"> / {localSpoons.total}</span>
            </div>
            <p className="text-muted-foreground">spoons remaining</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 py-4">
            {Array.from({ length: localSpoons.total }).map((_, i) => {
              const isUsed = i < localSpoons.used;
              return (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isUsed
                      ? "bg-muted/50 text-muted-foreground/30"
                      : "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg"
                  }`}
                  data-testid={`spoon-${i}`}
                >
                  <Utensils className="w-5 h-5" />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={restoreSpoon}
              disabled={localSpoons.used === 0}
              className="gap-2"
              data-testid="button-restore-spoon"
            >
              <Plus className="w-5 h-5" />
              Restore Spoon
            </Button>
            <Button
              size="lg"
              onClick={useSpoon}
              disabled={localSpoons.used >= localSpoons.total}
              className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              data-testid="button-use-spoon"
            >
              <Minus className="w-5 h-5" />
              Use a Spoon
            </Button>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-base">Starting spoons today</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[localSpoons.total]}
                  onValueChange={([value]) => setLocalSpoons({ ...localSpoons, total: value, used: Math.min(localSpoons.used, value) })}
                  min={1}
                  max={20}
                  step={1}
                  className="flex-1"
                  data-testid="slider-total-spoons"
                />
                <span className="w-8 text-center font-semibold">{localSpoons.total}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust based on how you feel today. Some days you start with fewer spoons.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-base">Notes (optional)</Label>
              <Textarea
                id="note"
                placeholder="What's affecting your energy today? (cycle phase, sleep, stress...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="resize-none"
                data-testid="input-spoon-note"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={createEntry.isPending || updateEntry.isPending}
              className="w-full h-12 text-base"
              data-testid="button-save-spoons"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {createEntry.isPending || updateEntry.isPending ? "Saving..." : todayEntry ? "Update Spoons" : "Save Today's Spoons"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {sortedHistory.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent History</CardTitle>
            <CardDescription>Your energy patterns over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedHistory.map((entry) => {
                const remaining = entry.totalSpoons - entry.usedSpoons;
                const percentage = (remaining / entry.totalSpoons) * 100;
                let barColor = "bg-emerald-500";
                if (percentage < 40) barColor = "bg-amber-500";
                if (percentage < 15) barColor = "bg-rose-500";
                
                return (
                  <div key={entry.id} className="space-y-1" data-testid={`history-entry-${entry.id}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-muted-foreground">
                        {remaining} / {entry.totalSpoons} remaining
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {entry.note && (
                      <p className="text-xs text-muted-foreground">{entry.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
