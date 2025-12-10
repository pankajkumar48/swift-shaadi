import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BudgetFormData {
  category: string;
  planned: number;
  actual: number;
}

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: Partial<BudgetFormData>;
  isEditing?: boolean;
  isTotalBudget?: boolean;
}

export default function BudgetFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
  isTotalBudget = false,
}: BudgetFormDialogProps) {
  const form = useForm<BudgetFormData>({
    defaultValues: {
      category: "",
      planned: 0,
      actual: 0,
      ...initialData,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        category: "",
        planned: 0,
        actual: 0,
        ...initialData,
      });
    } else if (open && !initialData) {
      form.reset({
        category: "",
        planned: 0,
        actual: 0,
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: BudgetFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-budget-form">
        <DialogHeader>
          <DialogTitle>
            {isTotalBudget 
              ? "Set Total Budget" 
              : isEditing 
                ? "Edit Budget Item" 
                : "Add Budget Item"
            }
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {!isTotalBudget && (
              <FormField
                control={form.control}
                name="category"
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Catering" {...field} data-testid="input-budget-category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="planned"
              rules={{ required: "Amount is required", min: { value: 0, message: "Amount must be positive" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isTotalBudget ? "Total Budget Amount" : "Planned Amount"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 500000" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      data-testid="input-budget-planned"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isTotalBudget && (
              <FormField
                control={form.control}
                name="actual"
                rules={{ min: { value: 0, message: "Amount must be positive" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Spent</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 350000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-budget-actual"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-budget">
                {isTotalBudget ? "Save" : isEditing ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
