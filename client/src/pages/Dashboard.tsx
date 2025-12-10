import RsvpSummary from "@/components/RsvpSummary";
import UpcomingEvent from "@/components/UpcomingEvent";
import TasksSummary from "@/components/TasksSummary";
import BudgetSummary from "@/components/BudgetSummary";

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  // todo: remove mock data - replace with real API data
  const mockRsvpData = {
    total: 248,
    going: 156,
    notGoing: 32,
    maybe: 28,
    pending: 32,
  };

  const mockEventDate = new Date();
  mockEventDate.setDate(mockEventDate.getDate() + 45);
  mockEventDate.setHours(18, 0, 0, 0);

  const mockTasksData = {
    total: 24,
    completed: 16,
    overdue: 2,
  };

  const mockBudgetData = {
    totalBudget: 2500000,
    totalSpent: 1850000,
  };

  return (
    <div className="p-4 pb-20 space-y-4" data-testid="page-dashboard">
      <h2 className="text-xl font-semibold mb-4">Wedding Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RsvpSummary
          {...mockRsvpData}
          onClick={() => onNavigate("/guests")}
        />
        
        <UpcomingEvent
          name="Haldi Ceremony"
          dateTime={mockEventDate}
          location="Sharma Villa, Mumbai"
          onClick={() => onNavigate("/timeline")}
        />
        
        <TasksSummary
          {...mockTasksData}
          onClick={() => onNavigate("/tasks")}
        />
        
        <BudgetSummary
          {...mockBudgetData}
          onClick={() => onNavigate("/budget")}
        />
      </div>
    </div>
  );
}
