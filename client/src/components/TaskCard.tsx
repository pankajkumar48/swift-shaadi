import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Calendar, Link as LinkIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isPast, isToday } from "date-fns";

export type TaskStatus = "todo" | "in_progress" | "done";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  assignee?: { name: string; initials: string };
  linkedEvent?: string;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: "To Do", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  in_progress: { label: "In Progress", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  done: { label: "Done", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
};

export default function TaskCard({
  id,
  title,
  description,
  dueDate,
  status,
  assignee,
  linkedEvent,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isDone = status === "done";
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !isDone;

  return (
    <Card className={`p-4 ${isDone ? "opacity-60" : ""}`} data-testid={`card-task-${id}`}>
      <div className="flex gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) => {
            onStatusChange?.(id, checked ? "done" : "todo");
          }}
          className="mt-0.5"
          data-testid={`checkbox-task-${id}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-task-title-${id}`}
              >
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" data-testid={`button-task-menu-${id}`}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(id, "in_progress")}>
                  Mark In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.(id, "done")}>
                  Mark Complete
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(id)}
                  className="text-destructive"
                >
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className={statusConfig[status].className}>
              {statusConfig[status].label}
            </Badge>

            {dueDate && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                <Calendar className="w-3 h-3" />
                {format(dueDate, "MMM d")}
                {isOverdue && " (Overdue)"}
              </span>
            )}

            {linkedEvent && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <LinkIcon className="w-3 h-3" />
                {linkedEvent}
              </span>
            )}

            {assignee && (
              <div className="flex items-center gap-1 ml-auto">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-[10px] bg-secondary">
                    {assignee.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{assignee.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
