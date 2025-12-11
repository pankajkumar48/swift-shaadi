import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  Users, 
  Store, 
  BarChart3, 
  FileText, 
  Download,
  Settings,
  LogOut,
  Crown
} from "lucide-react";
import PremiumFeatureCard from "@/components/PremiumFeatureCard";

interface MoreProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  icon: typeof MessageSquare;
  label: string;
  path: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  { icon: MessageSquare, label: "Invitations", path: "/app/invitations", description: "Generate invitation messages" },
  { icon: Users, label: "Team", path: "/app/team", description: "Manage team members & roles" },
  { icon: Settings, label: "Settings", path: "/app/settings", description: "Wedding settings & profile" },
];

const premiumFeatures = [
  { icon: Store, title: "Vendor Marketplace", description: "Browse and book verified wedding vendors" },
  { icon: BarChart3, title: "Analytics", description: "Detailed insights and reports" },
  { icon: FileText, title: "Contracts", description: "Store and manage vendor contracts" },
  { icon: Download, title: "Export Tools", description: "Export guest lists, budgets & more" },
];

export default function More({ onNavigate, onLogout }: MoreProps) {
  return (
    <div className="p-4 pb-20" data-testid="page-more">
      <h2 className="text-xl font-semibold mb-4">More</h2>

      <div className="space-y-2 mb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.path}
              className="p-4 cursor-pointer hover-elevate"
              onClick={() => onNavigate(item.path)}
              data-testid={`card-menu-${item.label.toLowerCase()}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-amber-500" />
          <h3 className="font-medium text-sm">Premium Features</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {premiumFeatures.map((feature) => (
            <PremiumFeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>

      <Card
        className="p-4 cursor-pointer hover-elevate border-destructive/20"
        onClick={onLogout}
        data-testid="card-logout"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-medium text-destructive">Log Out</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}
