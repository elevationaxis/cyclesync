import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CalendarEvent } from "@shared/schema";
import { getCurrentPhase } from "@/lib/cycleUtils";

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

  const phaseColors: Record<string, string> = {
    menstrual: "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10",
    follicular: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10",
    ovulatory: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10",
    luteal: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10",
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cycle Calendar</h1>
        <p className="text-muted-foreground">
          Track events with phase-based color coding
        </p>
      </div>

      <div className="space-y-6">
        {isAdding ? (
          <Card>
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
              <CardDescription>
                Your event will be automatically color-coded by cycle phase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Doctor's Appointment"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  data-testid="input-event-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  data-testid="input-event-date"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => createEvent.mutate()}
                  disabled={!newEvent.title || !newEvent.date || createEvent.isPending}
                  className="flex-1"
                  data-testid="button-save-event"
                >
                  {createEvent.isPending ? "Adding..." : "Add Event"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewEvent({ title: "", date: "" });
                  }}
                  data-testid="button-cancel-event"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} data-testid="button-add-event">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading events...</div>
        ) : sortedEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No events yet. Add your first event to see it color-coded by phase!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <Card
                key={event.id}
                className={event.phase ? phaseColors[event.phase] : ""}
                data-testid={`event-${event.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid={`text-event-title-${event.id}`}>
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(event.date).toLocaleString()}
                      </p>
                      {event.phase && (
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {event.phase} phase
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteEvent.mutate(event.id)}
                      disabled={deleteEvent.isPending}
                      data-testid={`button-delete-event-${event.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
