import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CheckSquare } from "lucide-react";
import TaskCard, { TaskStatus } from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";
import TaskFormDialog from "@/components/TaskFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWedding, useTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from "@/hooks/use-wedding";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  assignee?: { name: string; initials: string };
  linkedEvent?: string;
}

export default function Tasks() {
  const { toast } = useToast();
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: tasksData, isLoading } = useTasksQuery(weddingId);
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const tasks: Task[] = (tasksData || []).map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
    dueDate: t.due_date ? new Date(t.due_date) : undefined,
    status: t.status as TaskStatus,
    assignee: t.assignee_name ? { name: t.assignee_name, initials: t.assignee_name.split(" ").map(n => n[0]).join("").toUpperCase() } : undefined,
    linkedEvent: t.linked_event,
  }));

  const filteredTasks = tasks.filter((task) => {
    return statusFilter === "all" || task.status === statusFilter;
  });

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    if (!weddingId) return;
    try {
      await updateTaskMutation.mutateAsync({ id, weddingId, status });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!weddingId) return;
    try {
      await deleteTaskMutation.mutateAsync({ id, weddingId });
      toast({ title: "Task deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
    }
  };

  const handleAddTask = async (task: Omit<Task, "id">) => {
    if (!weddingId) return;
    try {
      await createTaskMutation.mutateAsync({
        weddingId,
        title: task.title,
        description: task.description,
        due_date: task.dueDate?.toISOString().split("T")[0],
        status: task.status,
        assignee_name: task.assignee?.name,
        linked_event: task.linkedEvent,
      });
      setShowAddDialog(false);
      toast({ title: "Task added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add task", variant: "destructive" });
    }
  };

  const handleEditTask = async (task: Omit<Task, "id">) => {
    if (!weddingId || !editingTask) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: editingTask.id,
        weddingId,
        title: task.title,
        description: task.description,
        due_date: task.dueDate?.toISOString().split("T")[0],
        status: task.status,
        assignee_name: task.assignee?.name,
        linked_event: task.linkedEvent,
      });
      setEditingTask(null);
      toast({ title: "Task updated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  };

  const todoTasks = filteredTasks.filter(t => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(t => t.status === "in_progress");
  const doneTasks = filteredTasks.filter(t => t.status === "done");

  if (isLoading) {
    return (
      <div className="p-4 pb-20" data-testid="page-tasks">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20" data-testid="page-tasks">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-task">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-task-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create tasks to keep track of everything you need to do for your wedding."
          actionLabel="Add First Task"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="space-y-6">
          {todoTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">To Do ({todoTasks.length})</h3>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onEdit={(id) => {
                      const t = tasks.find(x => x.id === id);
                      if (t) setEditingTask(t);
                    }}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {inProgressTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">In Progress ({inProgressTasks.length})</h3>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onEdit={(id) => {
                      const t = tasks.find(x => x.id === id);
                      if (t) setEditingTask(t);
                    }}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}

          {doneTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Completed ({doneTasks.length})</h3>
              <div className="space-y-3">
                {doneTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    onEdit={(id) => {
                      const t = tasks.find(x => x.id === id);
                      if (t) setEditingTask(t);
                    }}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <TaskFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddTask}
      />

      <TaskFormDialog
        open={!!editingTask}
        onOpenChange={(open: boolean) => !open && setEditingTask(null)}
        onSubmit={handleEditTask}
        initialData={editingTask || undefined}
        isEditing
      />
    </div>
  );
}
