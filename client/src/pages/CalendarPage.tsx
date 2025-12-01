import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus, Trash2, Heart, Flower2, Sun, Cloud, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CalendarEvent } from "@shared/schema";
import { getCurrentPhase } from "@/lib/cycleUtils";

const phaseIcons: Record<string, typeof Heart> = {
  menstrual: Heart,
  follicular: Flower2,
  ovulatory: Sun,
  luteal: Cloud,
};

const phaseInfo: Record<string, { name: string; energy: string; color: string }> = {
  menstrual: { name: "Menstrual", energy: "Rest & reflect", color: "rose" },
  follicular: { name: "Follicular", energy: "Rising energy", color: "emerald" },
  ovulatory: { name: "Ovulatory", energy: "Peak energy", color: "amber" },
  luteal: { name: "Luteal", energy: "Winding down", color: "sky" },
};

export default function CalendarPage() {
  const { toast } = useToast();
  const userId = "demo-user";
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
  });

  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ["/api/calendar-events", userId],
    queryFn: async () => {
      const response = await fetch(`/api/calendar-events?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch calendar events");
      return response.json();
    },
  });

  const createEvent = useMutation({
    mutationFn: async () => {
      const eventDate = new Date(newEvent.date);
      const phase = getCurrentPhase(eventDate.getTime());

      return await apiRequest("POST", "/api/calendar-events", {
        title: newEvent.title,
        date: eventDate.toISOString(),
        phase,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      toast({
        title: "Event created",
        description: "Your event has been added to the calendar",
      });
      setNewEvent({ title: "", date: "" });
      setIsAdding(false);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/calendar-events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events"] });
      toast({
        title: "Event deleted",
        description: "The event has been removed from your calendar",
      });
    },
  });

  const phaseColors: Record<string, { bg: string; border: string; gradient: string; text: string }> = {
    menstrual: {
      bg: "bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
      border: "border-l-4 border-l-rose-500",
      gradient: "from-rose-500 to-red-600",
      text: "text-rose-700 dark:text-rose-300"
    },
    follicular: {
      bg: "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      border: "border-l-4 border-l-emerald-500",
      gradient: "from-emerald-500 to-green-600",
      text: "text-emerald-700 dark:text-emerald-300"
    },
    ovulatory: {
      bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      border: "border-l-4 border-l-amber-500",
      gradient: "from-amber-500 to-yellow-600",
      text: "text-amber-700 dark:text-amber-300"
    },
    luteal: {
      bg: "bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20",
      border: "border-l-4 border-l-sky-500",
      gradient: "from-sky-500 to-blue-600",
      text: "text-sky-700 dark:text-sky-300"
    },
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date());
  const pastEvents = sortedEvents.filter(e => new Date(e.date) < new Date());

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
          <CalendarIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Cycle Calendar
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Plan your events with awareness of your energy levels
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {Object.entries(phaseInfo).map(([phase, info]) => {
          const colors = phaseColors[phase];
          return (
            <div 
              key={phase} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border.replace('border-l-4 border-l-', 'border-')}`}
            >
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} />
              <span className={`text-xs font-medium ${colors.text}`}>{info.name}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        {isAdding ? (
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Event
              </CardTitle>
              <CardDescription>
                Your event will be automatically color-coded based on your predicted cycle phase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Important meeting, Date night, Self-care day"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="h-12"
                  data-testid="input-event-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-base">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="h-12"
                  data-testid="input-event-date"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => createEvent.mutate()}
                  disabled={!newEvent.title || !newEvent.date || createEvent.isPending}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80"
                  data-testid="button-save-event"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {createEvent.isPending ? "Adding..." : "Add Event"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewEvent({ title: "", date: "" });
                  }}
                  className="h-12"
                  data-testid="button-cancel-event"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="w-full h-12 text-base"
            data-testid="button-add-event"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Event
          </Button>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20" />
              <p className="text-muted-foreground">Loading your calendar...</p>
            </div>
          </div>
        ) : sortedEvents.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-2">No events yet</p>
              <p className="text-muted-foreground">
                Add your first event to see it color-coded by your cycle phase
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Upcoming
                </h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const phase = event.phase || "menstrual";
                    const colors = phaseColors[phase];
                    const info = phaseInfo[phase];
                    const PhaseIcon = phaseIcons[phase] || Heart;
                    return (
                      <Card
                        key={event.id}
                        className={`${colors.bg} ${colors.border} overflow-visible transition-all duration-300 hover:shadow-md`}
                        data-testid={`event-${event.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                              <PhaseIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg" data-testid={`text-event-title-${event.id}`}>
                                {event.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(event.date).toLocaleString(undefined, {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs font-medium ${colors.text} capitalize`}>
                                  {info.name} Phase
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {info.energy}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEvent.mutate(event.id)}
                              disabled={deleteEvent.isPending}
                              className="opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                              data-testid={`button-delete-event-${event.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Past Events</h2>
                <div className="space-y-2">
                  {pastEvents.slice(0, 5).map((event) => {
                    const phase = event.phase || "menstrual";
                    const colors = phaseColors[phase];
                    const PhaseIcon = phaseIcons[phase] || Heart;
                    return (
                      <Card
                        key={event.id}
                        className="bg-muted/30 border-muted"
                        data-testid={`event-${event.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.gradient} opacity-60 flex items-center justify-center`}>
                              <PhaseIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm text-muted-foreground" data-testid={`text-event-title-${event.id}`}>
                                {event.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEvent.mutate(event.id)}
                              disabled={deleteEvent.isPending}
                              className="opacity-40 hover:opacity-100 h-8 w-8"
                              data-testid={`button-delete-event-${event.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
