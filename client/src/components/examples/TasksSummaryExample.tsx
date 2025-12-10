import TasksSummary from "../TasksSummary";

export default function TasksSummaryExample() {
  return (
    <TasksSummary
      total={24}
      completed={16}
      overdue={2}
      onClick={() => console.log("Navigate to tasks")}
    />
  );
}
