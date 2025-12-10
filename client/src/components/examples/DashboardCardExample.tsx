import { Users } from "lucide-react";
import DashboardCard from "../DashboardCard";

export default function DashboardCardExample() {
  return (
    <DashboardCard title="Guest Count" icon={Users} onClick={() => console.log("Card clicked")}>
      <div className="text-2xl font-bold">248</div>
      <p className="text-xs text-muted-foreground">Total guests invited</p>
    </DashboardCard>
  );
}
