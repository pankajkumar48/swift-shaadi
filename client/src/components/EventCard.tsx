import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, MoreVertical, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  name: string;
  dateTime: Date;
  location: string;
  notes?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function EventCard({
  id,
  name,
  dateTime,
  location,
  notes,
  onEdit,
  onDelete,
}: EventCardProps) {
  const dayNum = format(dateTime, "d");
  const month = format(dateTime, "MMM");
  const time = format(dateTime, "h:mm a");
  const dayName = format(dateTime, "EEEE");

  return (
    <Card className="p-4" data-testid={`card-event-${id}`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary shrink-0">
          <span className="text-xl font-bold leading-none">{dayNum}</span>
          <span className="text-xs uppercase font-medium">{month}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold" data-testid={`text-event-name-${id}`}>
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{dayName}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" data-testid={`button-event-menu-${id}`}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(id)}
                  className="text-destructive"
                >
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          </div>

          {notes && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
