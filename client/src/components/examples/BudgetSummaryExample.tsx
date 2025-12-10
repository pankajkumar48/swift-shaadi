import BudgetSummary from "../BudgetSummary";

export default function BudgetSummaryExample() {
  return (
    <BudgetSummary
      totalBudget={2500000}
      totalSpent={1850000}
      onClick={() => console.log("Navigate to budget")}
    />
  );
}
