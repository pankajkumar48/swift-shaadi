import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Wallet, Pencil } from "lucide-react";
import BudgetCard from "@/components/BudgetCard";
import EmptyState from "@/components/EmptyState";
import BudgetFormDialog from "@/components/BudgetFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWedding, useBudgetQuery, useCreateBudgetItemMutation, useUpdateBudgetItemMutation, useDeleteBudgetItemMutation, useUpdateWeddingMutation } from "@/hooks/use-wedding";

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
  const { toast } = useToast();
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [showTotalDialog, setShowTotalDialog] = useState(false);

  const { data: budgetData, isLoading } = useBudgetQuery(weddingId);
  const createBudgetItemMutation = useCreateBudgetItemMutation();
  const updateBudgetItemMutation = useUpdateBudgetItemMutation();
  const deleteBudgetItemMutation = useDeleteBudgetItemMutation();
  const updateWeddingMutation = useUpdateWeddingMutation();

  const budgetItems: BudgetItem[] = (budgetData || []).map(b => ({
    id: b.id,
    category: b.category,
    planned: b.planned,
    actual: b.actual,
  }));

  const totalBudget = wedding?.total_budget || 0;
  const totalPlanned = budgetItems.reduce((sum, item) => sum + item.planned, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const isOverBudget = totalSpent > totalBudget;

  const handleDelete = async (id: string) => {
    if (!weddingId) return;
    try {
      await deleteBudgetItemMutation.mutateAsync({ id, weddingId });
      toast({ title: "Budget item deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const handleAddItem = async (item: Omit<BudgetItem, "id">) => {
    if (!weddingId) return;
    try {
      await createBudgetItemMutation.mutateAsync({
        weddingId,
        category: item.category,
        planned: item.planned,
        actual: item.actual,
      });
      setShowAddDialog(false);
      toast({ title: "Budget item added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
    }
  };

  const handleEditItem = async (item: Omit<BudgetItem, "id">) => {
    if (!weddingId || !editingItem) return;
    try {
      await updateBudgetItemMutation.mutateAsync({
        id: editingItem.id,
        weddingId,
        category: item.category,
        planned: item.planned,
        actual: item.actual,
      });
      setEditingItem(null);
      toast({ title: "Budget item updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update item", variant: "destructive" });
    }
  };

  const handleUpdateTotalBudget = async (data: { category: string; planned: number; actual: number }) => {
    if (!wedding) return;
    try {
      await updateWeddingMutation.mutateAsync({
        id: wedding.id,
        total_budget: data.planned,
      });
      setShowTotalDialog(false);
      toast({ title: "Total budget updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update budget", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20" data-testid="page-budget">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Budget</h2>
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-40 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{formatCurrency(totalBudget)}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTotalDialog(true)}
              data-testid="button-edit-total-budget"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit Budget
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
        onSubmit={handleUpdateTotalBudget}
        initialData={{ category: "Total Budget", planned: totalBudget, actual: 0 }}
        isTotalBudget
      />
    </div>
  );
}
