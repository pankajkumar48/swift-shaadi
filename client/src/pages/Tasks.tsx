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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // todo: remove mock data - replace with real API data
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Finalize catering menu", description: "Review and confirm the menu options with the caterer", dueDate: new Date("2025-01-20"), status: "in_progress", assignee: { name: "Priya", initials: "PS" }, linkedEvent: "Wedding Reception" },
    { id: "2", title: "Book photographer", dueDate: new Date("2024-12-01"), status: "todo" },
    { id: "3", title: "Send save-the-dates", status: "done", assignee: { name: "Rahul", initials: "RS" } },
    { id: "4", title: "Finalize guest list", description: "Collect RSVPs and confirm final headcount", dueDate: new Date("2025-01-15"), status: "in_progress", assignee: { name: "Priya", initials: "PS" } },
    { id: "5", title: "Order wedding invitations", dueDate: new Date("2025-01-10"), status: "todo", linkedEvent: "Wedding Ceremony" },
  ]);

  const filteredTasks = tasks.filter((task) => {
    return statusFilter === "all" || task.status === statusFilter;
  });

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
    setShowAddDialog(false);
  };

  const handleEditTask = (task: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
      setEditingTask(null);
    }
  };

  const todoTasks = filteredTasks.filter(t => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(t => t.status === "in_progress");
  const doneTasks = filteredTasks.filter(t => t.status === "done");

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
