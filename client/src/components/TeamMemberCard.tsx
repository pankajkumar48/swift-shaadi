import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Crown, Shield, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TeamRole = "owner" | "family_admin" | "helper";

interface TeamMemberCardProps {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  isCurrentUser?: boolean;
  onChangeRole?: (id: string, role: TeamRole) => void;
  onRemove?: (id: string) => void;
}

const roleConfig: Record<TeamRole, { label: string; icon: typeof Crown; className: string; description: string }> = {
  owner: { 
    label: "Owner", 
    icon: Crown, 
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    description: "Full access to all features"
  },
  family_admin: { 
    label: "Family Admin", 
    icon: Shield, 
    className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    description: "Can manage guests, timeline, tasks & budget"
  },
  helper: { 
    label: "Helper", 
    icon: Eye, 
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    description: "Can view timeline & update tasks"
  },
};

export default function TeamMemberCard({
  id,
  name,
  email,
  role,
  isCurrentUser = false,
  onChangeRole,
  onRemove,
}: TeamMemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const RoleIcon = roleConfig[role].icon;

  return (
    <Card className="p-4" data-testid={`card-team-member-${id}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                {name}
                {isCurrentUser && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>

            {!isCurrentUser && role !== "owner" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" data-testid={`button-team-menu-${id}`}>
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onChangeRole?.(id, "family_admin")}>
                    Make Family Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeRole?.(id, "helper")}>
                    Make Helper
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onRemove?.(id)}
                    className="text-destructive"
                  >
                    Remove from Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Badge className={`${roleConfig[role].className} gap-1`}>
              <RoleIcon className="w-3 h-3" />
              {roleConfig[role].label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {roleConfig[role].description}
          </p>
        </div>
      </div>
    </Card>
  );
}
