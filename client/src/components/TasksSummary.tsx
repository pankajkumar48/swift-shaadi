import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

interface TasksSummaryProps {
  total: number;
  completed: number;
  overdue: number;
  onClick?: () => void;
}

export default function TasksSummary({
  total,
  completed,
  overdue,
  onClick,
}: TasksSummaryProps) {
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card 
      className={onClick ? "cursor-pointer hover-elevate" : ""}
      onClick={onClick}
      data-testid="card-tasks-summary"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Tasks
        </CardTitle>
        <CheckSquare className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{pending} Open</div>
        <p className="text-xs text-muted-foreground mb-3">
          {completed} of {total} completed ({percentage}%)
        </p>

        <div className="flex gap-4 text-xs">
          <span className="text-muted-foreground">
            Completed: {completed}
          </span>
          {overdue > 0 && (
            <span className="text-destructive font-medium">
              Overdue: {overdue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
