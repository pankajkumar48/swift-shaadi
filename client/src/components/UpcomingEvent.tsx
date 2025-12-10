import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format, differenceInDays, differenceInHours, isPast } from "date-fns";

interface UpcomingEventProps {
  name: string;
  dateTime: Date;
  location: string;
  onClick?: () => void;
}

export default function UpcomingEvent({
  name,
  dateTime,
  location,
  onClick,
}: UpcomingEventProps) {
  const now = new Date();
  const daysUntil = differenceInDays(dateTime, now);
  const hoursUntil = differenceInHours(dateTime, now);
  const isEventPast = isPast(dateTime);

  let countdown = "";
  if (isEventPast) {
    countdown = "Event passed";
  } else if (daysUntil === 0) {
    countdown = hoursUntil <= 1 ? "Starting soon" : `${hoursUntil} hours`;
  } else if (daysUntil === 1) {
    countdown = "Tomorrow";
  } else {
    countdown = `${daysUntil} days`;
  }

  return (
    <Card 
      className={onClick ? "cursor-pointer hover-elevate" : ""}
      onClick={onClick}
      data-testid="card-upcoming-event"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Next Event
        </CardTitle>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{countdown}</div>
        <p className="text-sm font-medium mt-1">{name}</p>
        
        <div className="flex flex-col gap-1 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {format(dateTime, "EEEE, MMM d 'at' h:mm a")}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {location}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
