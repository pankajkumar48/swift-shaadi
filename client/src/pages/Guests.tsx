import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import GuestCard, { RsvpStatus, Side } from "@/components/GuestCard";
import EmptyState from "@/components/EmptyState";
import GuestFormDialog from "@/components/GuestFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWedding, useGuestsQuery, useCreateGuestMutation, useUpdateGuestMutation, useDeleteGuestMutation } from "@/hooks/use-wedding";

interface Guest {
  id: string;
  name: string;
  accompanyingCount: number;
  phone?: string;
  email?: string;
  side: Side;
  group?: string;
  rsvpStatus: RsvpStatus;
}

export default function Guests() {
  const { toast } = useToast();
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: guestsData, isLoading } = useGuestsQuery(weddingId);
  const createGuestMutation = useCreateGuestMutation();
  const updateGuestMutation = useUpdateGuestMutation();
  const deleteGuestMutation = useDeleteGuestMutation();

  const guests: Guest[] = (guestsData || []).map(g => ({
    id: g.id,
    name: g.name,
    accompanyingCount: g.accompanying_count || 0,
    phone: g.phone,
    email: g.email,
    side: g.side as Side,
    group: g.group,
    rsvpStatus: g.rsvp_status as RsvpStatus,
  }));

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSide = sideFilter === "all" || guest.side === sideFilter;
    const matchesStatus = statusFilter === "all" || guest.rsvpStatus === statusFilter;
    return matchesSearch && matchesSide && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: RsvpStatus) => {
    if (!weddingId) return;
    try {
      await updateGuestMutation.mutateAsync({ id, weddingId, rsvp_status: status });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!weddingId) return;
    try {
      await deleteGuestMutation.mutateAsync({ id, weddingId });
      toast({ title: "Guest deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete guest", variant: "destructive" });
    }
  };

  const handleAddGuest = async (guest: Omit<Guest, "id">) => {
    if (!weddingId) return;
    try {
      await createGuestMutation.mutateAsync({
        weddingId,
        name: guest.name,
        accompanying_count: guest.accompanyingCount,
        phone: guest.phone,
        email: guest.email,
        side: guest.side,
        group: guest.group,
        rsvp_status: guest.rsvpStatus,
      });
      setShowAddDialog(false);
      toast({ title: "Guest added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add guest", variant: "destructive" });
    }
  };

  const handleEditGuest = async (guest: Omit<Guest, "id">) => {
    if (!weddingId || !editingGuest) return;
    try {
      await updateGuestMutation.mutateAsync({
        id: editingGuest.id,
        weddingId,
        name: guest.name,
        accompanying_count: guest.accompanyingCount,
        phone: guest.phone,
        email: guest.email,
        side: guest.side,
        group: guest.group,
        rsvp_status: guest.rsvpStatus,
      });
      setEditingGuest(null);
      toast({ title: "Guest updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update guest", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20" data-testid="page-guests">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Guests</h2>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20" data-testid="page-guests">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Guests</h2>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-guest">
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-guests"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={sideFilter} onValueChange={setSideFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-side-filter">
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sides</SelectItem>
              <SelectItem value="bride">Bride's Side</SelectItem>
              <SelectItem value="groom">Groom's Side</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="going">Going</SelectItem>
              <SelectItem value="not_going">Not Going</SelectItem>
              <SelectItem value="maybe">Maybe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <EmptyState
          title="No guests found"
          description={guests.length === 0 
            ? "Start adding your wedding guests to manage RSVPs and send invitations."
            : "No guests match your current filters."
          }
          actionLabel={guests.length === 0 ? "Add First Guest" : undefined}
          onAction={guests.length === 0 ? () => setShowAddDialog(true) : undefined}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {filteredGuests.length} guest{filteredGuests.length !== 1 ? "s" : ""}
          </p>
          {filteredGuests.map((guest) => (
            <GuestCard
              key={guest.id}
              {...guest}
              onEdit={(id) => {
                const g = guests.find(x => x.id === id);
                if (g) setEditingGuest(g);
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <GuestFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddGuest}
      />

      <GuestFormDialog
        open={!!editingGuest}
        onOpenChange={(open: boolean) => !open && setEditingGuest(null)}
        onSubmit={handleEditGuest}
        initialData={editingGuest || undefined}
        isEditing
      />
    </div>
  );
}
