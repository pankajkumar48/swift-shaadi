import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Calendar, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateWeddingProps {
  onComplete: () => void;
}

export default function CreateWedding({ onComplete }: CreateWeddingProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    coupleNames: "",
    date: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // todo: replace with real API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Wedding created!",
        description: "Let's start planning your special day.",
      });
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background" data-testid="page-create-wedding">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Create Your Wedding</h1>
          <p className="text-muted-foreground mt-1">Let's set up your wedding details</p>
        </div>

        <Card data-testid="card-create-wedding">
          <CardHeader>
            <CardTitle>Wedding Details</CardTitle>
            <CardDescription>
              Enter the basic information about your wedding
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="coupleNames">Couple Names</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="coupleNames"
                    type="text"
                    placeholder="e.g., Priya & Rahul"
                    className="pl-9"
                    value={formData.coupleNames}
                    onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                    required
                    data-testid="input-couple-names"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="date">Wedding Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-9"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    data-testid="input-date"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Mumbai"
                    className="pl-9"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    data-testid="input-city"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-create-wedding">
                {isLoading ? "Creating..." : "Create Wedding"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
