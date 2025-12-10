import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import EventCard from "@/components/EventCard";
import EmptyState from "@/components/EmptyState";
import EventFormDialog from "@/components/EventFormDialog";

interface TimelineEvent {
  id: string;
  name: string;
  dateTime: Date;
  location: string;
  notes?: string;
}

export default function Timeline() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  // todo: remove mock data - replace with real API data
  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: "1", name: "Haldi Ceremony", dateTime: new Date("2025-02-14T10:00:00"), location: "Sharma Villa, Mumbai", notes: "Traditional turmeric ceremony for the bride and groom" },
    { id: "2", name: "Sangeet Night", dateTime: new Date("2025-02-14T19:00:00"), location: "Grand Ballroom, Taj Palace", notes: "Musical evening with performances from both families" },
    { id: "3", name: "Wedding Ceremony", dateTime: new Date("2025-02-15T18:00:00"), location: "Grand Ballroom, Taj Palace" },
    { id: "4", name: "Reception", dateTime: new Date("2025-02-16T19:00:00"), location: "Rooftop Garden, Taj Palace", notes: "Cocktails and dinner reception for all guests" },
  ]);

  const sortedEvents = [...events].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleAddEvent = (event: Omit<TimelineEvent, "id">) => {
    const newEvent: TimelineEvent = { ...event, id: Date.now().toString() };
    setEvents([...events, newEvent]);
    setShowAddDialog(false);
  };

  const handleEditEvent = (event: Omit<TimelineEvent, "id">) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...event, id: editingEvent.id } : e));
      setEditingEvent(null);
    }
  };

  return (
    <div className="p-4 pb-20" data-testid="page-timeline">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Timeline</h2>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-event">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Plan your wedding timeline by adding ceremonies, parties, and other events."
          actionLabel="Add First Event"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4 pl-12">
            {sortedEvents.map((event) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[2.625rem] top-6 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <EventCard
                  {...event}
                  onEdit={(id) => {
                    const e = events.find(x => x.id === id);
                    if (e) setEditingEvent(e);
                  }}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <EventFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddEvent}
      />

      <EventFormDialog
        open={!!editingEvent}
        onOpenChange={(open: boolean) => !open && setEditingEvent(null)}
        onSubmit={handleEditEvent}
        initialData={editingEvent || undefined}
        isEditing
      />
    </div>
  );
}
