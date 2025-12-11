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
    <Card className="p-6 border-yellow-100 dark:border-yellow-900/30 bg-gradient-to-br from-yellow-50/30 to-transparent dark:from-yellow-950/10" data-testid={`card-premium-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
        </div>
        
        <Badge className="mb-3 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 gap-1">
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
