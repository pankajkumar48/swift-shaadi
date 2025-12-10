import RsvpSummary from "@/components/RsvpSummary";
import UpcomingEvent from "@/components/UpcomingEvent";
import TasksSummary from "@/components/TasksSummary";
import BudgetSummary from "@/components/BudgetSummary";
import { useWedding, useWeddingStatsQuery, useEventsQuery } from "@/hooks/use-wedding";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const { data: stats, isLoading: statsLoading } = useWeddingStatsQuery(weddingId);
  const { data: events, isLoading: eventsLoading } = useEventsQuery(weddingId);

  const upcomingEvent = events && events.length > 0 
    ? events.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())[0]
    : null;

  if (statsLoading || eventsLoading) {
    return (
      <div className="p-4 pb-20 space-y-4" data-testid="page-dashboard">
        <h2 className="text-xl font-semibold mb-4">Wedding Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const rsvpData = {
    total: stats?.guests.total || 0,
    going: stats?.guests.going || 0,
    notGoing: stats?.guests.not_going || 0,
    maybe: stats?.guests.maybe || 0,
    pending: stats?.guests.pending || 0,
  };

  const tasksData = {
    total: stats?.tasks.total || 0,
    completed: stats?.tasks.completed || 0,
    overdue: stats?.tasks.overdue || 0,
  };

  const budgetData = {
    totalBudget: stats?.budget.total_budget || wedding?.total_budget || 0,
    totalSpent: stats?.budget.total_spent || 0,
  };

  return (
    <div className="p-4 pb-20 space-y-4" data-testid="page-dashboard">
      <h2 className="text-xl font-semibold mb-4">Wedding Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RsvpSummary
          {...rsvpData}
          onClick={() => onNavigate("/guests")}
        />
        
        {upcomingEvent ? (
          <UpcomingEvent
            name={upcomingEvent.name}
            dateTime={new Date(upcomingEvent.date_time)}
            location={upcomingEvent.location}
            onClick={() => onNavigate("/timeline")}
          />
        ) : (
          <UpcomingEvent
            name="No upcoming events"
            dateTime={new Date()}
            location="Add events to your timeline"
            onClick={() => onNavigate("/timeline")}
          />
        )}
        
        <TasksSummary
          {...tasksData}
          onClick={() => onNavigate("/tasks")}
        />
        
        <BudgetSummary
          {...budgetData}
          onClick={() => onNavigate("/budget")}
        />
      </div>
    </div>
  );
}
