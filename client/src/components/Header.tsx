import { Bell, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  weddingName?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

export default function Header({ 
  weddingName = "Swift Shaadi", 
  showSettings = true,
  onSettingsClick,
  onNotificationsClick 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border" data-testid="header-main">
      <div className="flex items-center justify-between gap-4 h-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-serif text-lg font-medium truncate" data-testid="text-wedding-name">
            {weddingName}
          </h1>
        </div>
        
        {showSettings && (
          <div className="flex items-center gap-1">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onNotificationsClick}
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={onSettingsClick}
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
