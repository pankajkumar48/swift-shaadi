import EventCard from "../EventCard";

export default function EventCardExample() {
  return (
    <div className="space-y-3">
      <EventCard
        id="1"
        name="Haldi Ceremony"
        dateTime={new Date("2025-02-14T10:00:00")}
        location="Sharma Villa, Mumbai"
        notes="Traditional turmeric ceremony for the bride and groom"
        onEdit={(id) => console.log("Edit event", id)}
        onDelete={(id) => console.log("Delete event", id)}
      />
      <EventCard
        id="2"
        name="Wedding Ceremony"
        dateTime={new Date("2025-02-15T18:00:00")}
        location="Grand Ballroom, Taj Palace"
        onEdit={(id) => console.log("Edit event", id)}
      />
    </div>
  );
}
