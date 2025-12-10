import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type RsvpStatus = "invited" | "going" | "not_going" | "maybe";
export type Side = "bride" | "groom";

interface GuestCardProps {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  side: Side;
  group?: string;
  rsvpStatus: RsvpStatus;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: RsvpStatus) => void;
}

const statusConfig: Record<RsvpStatus, { label: string; className: string }> = {
  invited: { label: "Invited", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  going: { label: "Going", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" },
  not_going: { label: "Not Going", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  maybe: { label: "Maybe", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
};

const sideConfig: Record<Side, { label: string; className: string }> = {
  bride: { label: "Bride's Side", className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" },
  groom: { label: "Groom's Side", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
};

export default function GuestCard({
  id,
  name,
  phone,
  email,
  side,
  group,
  rsvpStatus,
  onEdit,
  onDelete,
  onStatusChange,
}: GuestCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-4" data-testid={`card-guest-${id}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium truncate" data-testid={`text-guest-name-${id}`}>
                {name}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${sideConfig[side].className}`}
                >
                  {sideConfig[side].label}
                </Badge>
                {group && (
                  <Badge variant="outline" className="text-xs">
                    {group}
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" data-testid={`button-guest-menu-${id}`}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  Edit Guest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(id, "going")}>
                  Mark as Going
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(id, "not_going")}>
                  Mark as Not Going
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(id, "maybe")}>
                  Mark as Maybe
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(id)}
                  className="text-destructive"
                >
                  Delete Guest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {phone}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3" />
                {email}
              </span>
            )}
          </div>

          <div className="mt-3">
            <Badge className={`${statusConfig[rsvpStatus].className}`}>
              {statusConfig[rsvpStatus].label}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
