import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BudgetCardProps {
  id: string;
  category: string;
  planned: number;
  actual: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BudgetCard({
  id,
  category,
  planned,
  actual,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const percentage = planned > 0 ? Math.min((actual / planned) * 100, 100) : 0;
  const isOverBudget = actual > planned;
  const remaining = planned - actual;

  return (
    <Card className="p-4" data-testid={`card-budget-${id}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="font-medium" data-testid={`text-budget-category-${id}`}>
            {category}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(actual)} of {formatCurrency(planned)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" data-testid={`button-budget-menu-${id}`}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(id)}>
              Edit Budget Item
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Progress 
        value={percentage} 
        className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
      />

      <div className="flex justify-between mt-2 text-xs">
        <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
          {isOverBudget ? `Over by ${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} remaining`}
        </span>
        <span className="text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
    </Card>
  );
}
