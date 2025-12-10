import { Users } from "lucide-react";
import EmptyState from "../EmptyState";

export default function EmptyStateExample() {
  return (
    <EmptyState
      icon={Users}
      title="No guests yet"
      description="Start adding your wedding guests to manage RSVPs and send invitations."
      actionLabel="Add First Guest"
      onAction={() => console.log("Add guest clicked")}
    />
  );
}
