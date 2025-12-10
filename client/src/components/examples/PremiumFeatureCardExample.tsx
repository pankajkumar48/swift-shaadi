import { Store, BarChart3, FileText, Download } from "lucide-react";
import PremiumFeatureCard from "../PremiumFeatureCard";

export default function PremiumFeatureCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <PremiumFeatureCard
        title="Vendor Marketplace"
        description="Browse and book verified wedding vendors"
        icon={Store}
      />
      <PremiumFeatureCard
        title="Analytics"
        description="Detailed insights and reports"
        icon={BarChart3}
      />
    </div>
  );
}
