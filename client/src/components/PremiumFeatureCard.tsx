import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PremiumFeatureCard({
  title,
  description,
  icon: Icon,
}: PremiumFeatureCardProps) {
  return (
    <Card className="p-6 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20" data-testid={`card-premium-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        
        <Badge className="mb-3 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 gap-1">
          <Crown className="w-3 h-3" />
          Premium
        </Badge>

        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">Coming Soon</span>
        </div>
      </div>
    </Card>
  );
}
