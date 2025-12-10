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
import { Plus, Search, Filter } from "lucide-react";
import GuestCard, { RsvpStatus, Side } from "@/components/GuestCard";
import EmptyState from "@/components/EmptyState";
import GuestFormDialog from "@/components/GuestFormDialog";

interface Guest {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  side: Side;
  group?: string;
  rsvpStatus: RsvpStatus;
}

export default function Guests() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // todo: remove mock data - replace with real API data
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", name: "Amit Sharma", phone: "+91 98765 43210", email: "amit@example.com", side: "groom", group: "Family", rsvpStatus: "going" },
    { id: "2", name: "Priya Patel", phone: "+91 87654 32109", side: "bride", group: "Friends", rsvpStatus: "maybe" },
    { id: "3", name: "Raj Mehta", phone: "+91 76543 21098", side: "groom", group: "College Friends", rsvpStatus: "invited" },
    { id: "4", name: "Anita Desai", email: "anita@example.com", side: "bride", group: "Family", rsvpStatus: "going" },
    { id: "5", name: "Vikram Singh", phone: "+91 65432 10987", side: "groom", group: "Work", rsvpStatus: "not_going" },
  ]);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSide = sideFilter === "all" || guest.side === sideFilter;
    const matchesStatus = statusFilter === "all" || guest.rsvpStatus === statusFilter;
    return matchesSearch && matchesSide && matchesStatus;
  });

  const handleStatusChange = (id: string, status: RsvpStatus) => {
    setGuests(guests.map(g => g.id === id ? { ...g, rsvpStatus: status } : g));
  };

  const handleDelete = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const handleAddGuest = (guest: Omit<Guest, "id">) => {
    const newGuest: Guest = { ...guest, id: Date.now().toString() };
    setGuests([...guests, newGuest]);
    setShowAddDialog(false);
  };

  const handleEditGuest = (guest: Omit<Guest, "id">) => {
    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? { ...guest, id: editingGuest.id } : g));
      setEditingGuest(null);
    }
  };

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
