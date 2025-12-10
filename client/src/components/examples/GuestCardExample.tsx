import GuestCard from "../GuestCard";

export default function GuestCardExample() {
  return (
    <div className="space-y-3">
      <GuestCard
        id="1"
        name="Amit Sharma"
        phone="+91 98765 43210"
        email="amit@example.com"
        side="groom"
        group="Family"
        rsvpStatus="going"
        onEdit={(id) => console.log("Edit", id)}
        onDelete={(id) => console.log("Delete", id)}
        onStatusChange={(id, status) => console.log("Status", id, status)}
      />
      <GuestCard
        id="2"
        name="Priya Patel"
        phone="+91 87654 32109"
        side="bride"
        group="Friends"
        rsvpStatus="maybe"
        onEdit={(id) => console.log("Edit", id)}
      />
    </div>
  );
}
