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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { TaskStatus } from "@/components/TaskCard";

interface TaskFormData {
  title: string;
  description: string;
  dueDate?: Date;
  status: TaskStatus;
  assigneeName: string;
  linkedEvent: string;
}

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: Date;
    status: TaskStatus;
    assignee?: { name: string; initials: string };
    linkedEvent?: string;
  }) => void;
  initialData?: Partial<{
    title: string;
    description?: string;
    dueDate?: Date;
    status: TaskStatus;
    assignee?: { name: string; initials: string };
    linkedEvent?: string;
  }>;
  isEditing?: boolean;
}

export default function TaskFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: TaskFormDialogProps) {
  const form = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      assigneeName: "",
      linkedEvent: "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate,
        status: initialData.status || "todo",
        assigneeName: initialData.assignee?.name || "",
        linkedEvent: initialData.linkedEvent || "",
      });
    } else if (open && !initialData) {
      form.reset({
        title: "",
        description: "",
        status: "todo",
        assigneeName: "",
        linkedEvent: "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: TaskFormData) => {
    const taskData = {
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate,
      status: data.status,
      assignee: data.assigneeName ? {
        name: data.assigneeName,
        initials: data.assigneeName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      } : undefined,
      linkedEvent: data.linkedEvent || undefined,
    };
    onSubmit(taskData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-task-form">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Task title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Book photographer" {...field} data-testid="input-task-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add more details..." 
                      className="resize-none" 
                      {...field} 
                      data-testid="input-task-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        data-testid="input-task-duedate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-task-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assigneeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Priya" {...field} data-testid="input-task-assignee" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Linked Event (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wedding" {...field} data-testid="input-task-event" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-task">
                {isEditing ? "Save Changes" : "Add Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
