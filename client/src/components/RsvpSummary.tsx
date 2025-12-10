import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface RsvpSummaryProps {
  total: number;
  going: number;
  notGoing: number;
  maybe: number;
  pending: number;
  onClick?: () => void;
}

export default function RsvpSummary({
  total,
  going,
  notGoing,
  maybe,
  pending,
  onClick,
}: RsvpSummaryProps) {
  const stats = [
    { label: "Going", value: going, color: "bg-emerald-500" },
    { label: "Not Going", value: notGoing, color: "bg-gray-400" },
    { label: "Maybe", value: maybe, color: "bg-purple-500" },
    { label: "Pending", value: pending, color: "bg-amber-500" },
  ];

  const goingPercentage = total > 0 ? Math.round((going / total) * 100) : 0;

  return (
    <Card 
      className={onClick ? "cursor-pointer hover-elevate" : ""}
      onClick={onClick}
      data-testid="card-rsvp-summary"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Guest RSVPs
        </CardTitle>
        <Users className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total} Guests</div>
        <p className="text-xs text-muted-foreground mb-3">
          {going} confirmed ({goingPercentage}% response rate)
        </p>

        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
          {stats.map((stat) => (
            stat.value > 0 && (
              <div
                key={stat.label}
                className={`${stat.color}`}
                style={{ width: `${(stat.value / total) * 100}%` }}
              />
            )
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-xs text-muted-foreground">
                {stat.label}: {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
