import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InviteTemplateCardProps {
  id: string;
  name: string;
  category: string;
  preview: string;
  isSelected?: boolean;
  onClick?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Traditional: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Modern: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Regional: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export default function InviteTemplateCard({
  id,
  name,
  category,
  preview,
  isSelected = false,
  onClick,
}: InviteTemplateCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? "ring-2 ring-primary bg-primary/5" 
          : "hover-elevate"
      }`}
      onClick={() => onClick?.(id)}
      data-testid={`card-template-${id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-sm">{name}</h3>
        <Badge className={`text-xs ${categoryColors[category] || "bg-gray-100 text-gray-700"}`}>
          {category}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-3">
        {preview}
      </p>
    </Card>
  );
}
