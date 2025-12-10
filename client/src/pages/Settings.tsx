import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Heart, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onNavigate: (path: string) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { toast } = useToast();

  // todo: remove mock data - replace with real wedding data
  const [weddingData, setWeddingData] = useState({
    coupleNames: "Priya & Rahul",
    date: "2025-02-15",
    city: "Mumbai",
    haldiDateTime: "2025-02-14T10:00",
    sangeetDateTime: "2025-02-14T19:00",
    weddingDateTime: "2025-02-15T18:00",
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your wedding details have been updated.",
    });
  };

  return (
    <div className="p-4 pb-20" data-testid="page-settings">
      <div className="flex items-center gap-3 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onNavigate("/more")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <Card className="mb-4" data-testid="card-wedding-details">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Wedding Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coupleNames">Couple Names</Label>
            <Input
              id="coupleNames"
              value={weddingData.coupleNames}
              onChange={(e) => setWeddingData({ ...weddingData, coupleNames: e.target.value })}
              placeholder="e.g., Priya & Rahul"
              data-testid="input-couple-names"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Wedding Date</Label>
              <Input
                id="date"
                type="date"
                value={weddingData.date}
                onChange={(e) => setWeddingData({ ...weddingData, date: e.target.value })}
                data-testid="input-wedding-date"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={weddingData.city}
                onChange={(e) => setWeddingData({ ...weddingData, city: e.target.value })}
                placeholder="e.g., Mumbai"
                data-testid="input-city"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4" data-testid="card-event-times">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Event Times (for Invitations)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="haldiDateTime">Haldi Ceremony</Label>
            <Input
              id="haldiDateTime"
              type="datetime-local"
              value={weddingData.haldiDateTime}
              onChange={(e) => setWeddingData({ ...weddingData, haldiDateTime: e.target.value })}
              data-testid="input-haldi-datetime"
            />
          </div>

          <div>
            <Label htmlFor="sangeetDateTime">Sangeet Night</Label>
            <Input
              id="sangeetDateTime"
              type="datetime-local"
              value={weddingData.sangeetDateTime}
              onChange={(e) => setWeddingData({ ...weddingData, sangeetDateTime: e.target.value })}
              data-testid="input-sangeet-datetime"
            />
          </div>

          <div>
            <Label htmlFor="weddingDateTime">Wedding Ceremony</Label>
            <Input
              id="weddingDateTime"
              type="datetime-local"
              value={weddingData.weddingDateTime}
              onChange={(e) => setWeddingData({ ...weddingData, weddingDateTime: e.target.value })}
              data-testid="input-wedding-datetime"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" data-testid="button-save-settings">
        Save Changes
      </Button>
    </div>
  );
}
