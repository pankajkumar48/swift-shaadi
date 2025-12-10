import TaskCard from "../TaskCard";

export default function TaskCardExample() {
  return (
    <div className="space-y-3">
      <TaskCard
        id="1"
        title="Finalize catering menu"
        description="Review and confirm the menu options with the caterer"
        dueDate={new Date("2025-01-20")}
        status="in_progress"
        assignee={{ name: "Priya", initials: "PS" }}
        linkedEvent="Wedding Reception"
        onStatusChange={(id, status) => console.log("Status change", id, status)}
        onEdit={(id) => console.log("Edit", id)}
        onDelete={(id) => console.log("Delete", id)}
      />
      <TaskCard
        id="2"
        title="Book photographer"
        dueDate={new Date("2024-12-01")}
        status="todo"
        onStatusChange={(id, status) => console.log("Status change", id, status)}
      />
      <TaskCard
        id="3"
        title="Send save-the-dates"
        status="done"
        assignee={{ name: "Rahul", initials: "RS" }}
        onStatusChange={(id, status) => console.log("Status change", id, status)}
      />
    </div>
  );
}
