import BudgetCard from "../BudgetCard";

export default function BudgetCardExample() {
  return (
    <div className="space-y-3">
      <BudgetCard
        id="1"
        category="Venue & Decor"
        planned={500000}
        actual={350000}
        onEdit={(id) => console.log("Edit", id)}
        onDelete={(id) => console.log("Delete", id)}
      />
      <BudgetCard
        id="2"
        category="Catering"
        planned={300000}
        actual={320000}
        onEdit={(id) => console.log("Edit", id)}
      />
      <BudgetCard
        id="3"
        category="Photography"
        planned={150000}
        actual={75000}
        onEdit={(id) => console.log("Edit", id)}
      />
    </div>
  );
}
