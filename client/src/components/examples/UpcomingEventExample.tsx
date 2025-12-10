import UpcomingEvent from "../UpcomingEvent";

export default function UpcomingEventExample() {
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 45);
  eventDate.setHours(18, 0, 0, 0);
  
  return (
    <UpcomingEvent
      name="Haldi Ceremony"
      dateTime={eventDate}
      location="Sharma Villa, Mumbai"
      onClick={() => console.log("Navigate to timeline")}
    />
  );
}
