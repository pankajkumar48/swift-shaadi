import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import EventCard from "@/components/EventCard";
import EmptyState from "@/components/EmptyState";
import EventFormDialog from "@/components/EventFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWedding, useEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation } from "@/hooks/use-wedding";

interface TimelineEvent {
  id: string;
  name: string;
  dateTime: Date;
  location: string;
  notes?: string;
}

export default function Timeline() {
  const { toast } = useToast();
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const { data: eventsData, isLoading } = useEventsQuery(weddingId);
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();

  const events: TimelineEvent[] = (eventsData || []).map(e => ({
    id: e.id,
    name: e.name,
    dateTime: new Date(e.date_time),
    location: e.location,
    notes: e.notes,
  }));

  const sortedEvents = [...events].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const handleDelete = async (id: string) => {
    if (!weddingId) return;
    try {
      await deleteEventMutation.mutateAsync({ id, weddingId });
      toast({ title: "Event deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  const handleAddEvent = async (event: Omit<TimelineEvent, "id">) => {
    if (!weddingId) return;
    try {
      await createEventMutation.mutateAsync({
        weddingId,
        name: event.name,
        date_time: event.dateTime.toISOString(),
        location: event.location,
        notes: event.notes,
      });
      setShowAddDialog(false);
      toast({ title: "Event added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add event", variant: "destructive" });
    }
  };

  const handleEditEvent = async (event: Omit<TimelineEvent, "id">) => {
    if (!weddingId || !editingEvent) return;
    try {
      await updateEventMutation.mutateAsync({
        id: editingEvent.id,
        weddingId,
        name: event.name,
        date_time: event.dateTime.toISOString(),
        location: event.location,
        notes: event.notes,
      });
      setEditingEvent(null);
      toast({ title: "Event updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update event", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20" data-testid="page-timeline">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Timeline</h2>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

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
