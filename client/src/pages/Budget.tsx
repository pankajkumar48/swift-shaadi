import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import BudgetCard from "@/components/BudgetCard";
import EmptyState from "@/components/EmptyState";
import BudgetFormDialog from "@/components/BudgetFormDialog";

interface BudgetItem {
  id: string;
  category: string;
  planned: number;
  actual: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Budget() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [showTotalDialog, setShowTotalDialog] = useState(false);

  // todo: remove mock data - replace with real API data
  const [totalBudget, setTotalBudget] = useState(2500000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: "1", category: "Venue & Decor", planned: 500000, actual: 350000 },
    { id: "2", category: "Catering", planned: 400000, actual: 320000 },
    { id: "3", category: "Photography & Video", planned: 200000, actual: 180000 },
    { id: "4", category: "Bridal Wear", planned: 300000, actual: 280000 },
    { id: "5", category: "Groom's Wear", planned: 150000, actual: 120000 },
    { id: "6", category: "Jewelry", planned: 400000, actual: 350000 },
    { id: "7", category: "Entertainment & Music", planned: 150000, actual: 100000 },
    { id: "8", category: "Invitations & Stationery", planned: 50000, actual: 45000 },
  ]);

  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isOverBudget = totalSpent > totalBudget;

  const handleDelete = (id: string) => {
    setBudgetItems(budgetItems.filter(b => b.id !== id));
  };

  const handleAddItem = (item: Omit<BudgetItem, "id">) => {
    const newItem: BudgetItem = { ...item, id: Date.now().toString() };
    setBudgetItems([...budgetItems, newItem]);
    setShowAddDialog(false);
  };

  const handleEditItem = (item: Omit<BudgetItem, "id">) => {
    if (editingItem) {
      setBudgetItems(budgetItems.map(b => b.id === editingItem.id ? { ...item, id: editingItem.id } : b));
      setEditingItem(null);
    }
  };

  return (
    <div className="p-4 pb-20" data-testid="page-budget">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Budget</h2>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-budget-item">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card className="mb-6" data-testid="card-budget-overview">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Wedding Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{formatCurrency(totalBudget)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => setShowTotalDialog(true)}
              data-testid="button-edit-total-budget"
            >
              Edit
            </Button>
          </div>

          <Progress 
            value={percentage} 
            className={`h-3 mt-4 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="font-semibold">{formatCurrency(totalSpent)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className={`font-semibold ${isOverBudget ? "text-destructive" : ""}`}>
                {isOverBudget ? `-${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Planned</p>
              <p className="font-semibold">{formatCurrency(totalPlanned)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {budgetItems.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No budget items yet"
          description="Add budget categories to track your wedding expenses."
          actionLabel="Add First Item"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {budgetItems.length} categor{budgetItems.length !== 1 ? "ies" : "y"}
          </p>
          {budgetItems.map((item) => (
            <BudgetCard
              key={item.id}
              {...item}
              onEdit={(id) => {
                const b = budgetItems.find(x => x.id === id);
                if (b) setEditingItem(b);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BudgetFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddItem}
      />

      <BudgetFormDialog
        open={!!editingItem}
        onOpenChange={(open: boolean) => !open && setEditingItem(null)}
        onSubmit={handleEditItem}
        initialData={editingItem || undefined}
        isEditing
      />

      <BudgetFormDialog
        open={showTotalDialog}
        onOpenChange={setShowTotalDialog}
        onSubmit={(data: { category: string; planned: number; actual: number }) => {
          setTotalBudget(data.planned);
          setShowTotalDialog(false);
        }}
        initialData={{ category: "Total Budget", planned: totalBudget, actual: 0 }}
        isTotalBudget
      />
    </div>
  );
}
