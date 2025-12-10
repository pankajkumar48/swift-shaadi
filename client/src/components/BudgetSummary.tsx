import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet } from "lucide-react";

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  onClick?: () => void;
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BudgetSummary({
  totalBudget,
  totalSpent,
  onClick,
}: BudgetSummaryProps) {
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const remaining = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;

  return (
    <Card 
      className={onClick ? "cursor-pointer hover-elevate" : ""}
      onClick={onClick}
      data-testid="card-budget-summary"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Budget
        </CardTitle>
        <Wallet className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
        <p className="text-xs text-muted-foreground mb-3">
          Total wedding budget
        </p>

        <Progress 
          value={percentage} 
          className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
        />

        <div className="flex justify-between mt-2 text-xs">
          <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
            {isOverBudget 
              ? `Over by ${formatCurrency(Math.abs(remaining))}`
              : `${formatCurrency(remaining)} remaining`
            }
          </span>
          <span className="text-muted-foreground">
            Spent: {formatCurrency(totalSpent)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
