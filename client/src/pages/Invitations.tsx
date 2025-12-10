import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, MessageSquare } from "lucide-react";
import InviteTemplateCard from "@/components/InviteTemplateCard";
import { useToast } from "@/hooks/use-toast";

interface WeddingDetails {
  coupleNames: string;
  date: string;
  city: string;
  haldiDateTime: string;
  sangeetDateTime: string;
  weddingDateTime: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  template: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Elegant Traditional",
    category: "Traditional",
    template: `With great joy and blessings from the Almighty,
the families of {CoupleNames} cordially invite you
to celebrate the auspicious occasion of their wedding.

Wedding Ceremony:
{WeddingDateTime}
{City}

Your presence will make this celebration complete.
We look forward to sharing this beautiful moment with you.`,
  },
  {
    id: "2",
    name: "Modern Friendly",
    category: "Modern",
    template: `Hey there!

We're getting married! {CoupleNames} would love for you to join us as we tie the knot.

Save the Date: {WeddingDateTime}
Location: {City}

Can't wait to celebrate with you!`,
  },
  {
    id: "3",
    name: "Family Warmth",
    category: "Traditional",
    template: `With hearts full of love and joy,
our families are delighted to announce
the wedding of {CoupleNames}.

We would be honored by your presence
as we celebrate this beautiful union.

{WeddingDateTime}
{City}

With warm regards,
The Families`,
  },
  {
    id: "4",
    name: "Multi-Event",
    category: "Modern",
    template: `{CoupleNames} are getting married!

Join us for the celebrations:

Haldi Ceremony: {HaldiDateTime}
Sangeet Night: {SangeetDateTime}
Wedding: {WeddingDateTime}

Venue: {City}

We can't wait to celebrate with you!`,
  },
  {
    id: "5",
    name: "Minimal One-liner",
    category: "Modern",
    template: `{CoupleNames} are getting married on {Date} in {City}. You're invited!`,
  },
  {
    id: "6",
    name: "Destination Wedding",
    category: "Modern",
    template: `Pack your bags!

{CoupleNames} are saying "I do" and we want you there!

Destination: {City}
Date: {WeddingDateTime}

Get ready for an unforgettable celebration!
More details to follow.`,
  },
  {
    id: "7",
    name: "Gujarati Style",
    category: "Regional",
    template: `Jai Shri Krishna!

{CoupleNames} na lagan nu amantran

Tamne ane tamara parivar ne amara
lagan prasange padharo eva vinanti.

Lagn: {WeddingDateTime}
Sthan: {City}

Aashirwad aapo evi asha raakhiye.`,
  },
  {
    id: "8",
    name: "Hindi Traditional",
    category: "Regional",
    template: `Shubh Vivah

Param Pita Parmatma ki kripa se,
{CoupleNames} ke paawan vivah samaroh mein
aapko sar sahit aamantrit kiya jaata hai.

Vivah: {WeddingDateTime}
Sthan: {City}

Aapki upasthiti se yeh avsar aur bhi
mangalmay ho jayega.`,
  },
  {
    id: "9",
    name: "Punjabi/Sikh Tone",
    category: "Regional",
    template: `Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh!

{CoupleNames} di anand karaj di rasam maukay
tuhanu saanu tan samey aun da satkaar bhari
nimantran hai.

Anand Karaj: {WeddingDateTime}
Jagah: {City}

Tuhada pyaar te ashirwad di lodd hai!`,
  },
  {
    id: "10",
    name: "South Indian Style",
    category: "Regional",
    template: `Sree Ganeshaya Namaha

With the blessings of Lord Ganesha,
we invite you to the auspicious wedding of
{CoupleNames}

Muhurtham: {WeddingDateTime}
Venue: {City}

Please grace the occasion with your presence
and bless the couple.`,
  },
];

export default function Invitations() {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [copied, setCopied] = useState(false);

  // todo: remove mock data - replace with real wedding data
  const weddingDetails: WeddingDetails = {
    coupleNames: "Priya & Rahul",
    date: "February 15, 2025",
    city: "Mumbai",
    haldiDateTime: "February 14, 2025 at 10:00 AM",
    sangeetDateTime: "February 14, 2025 at 7:00 PM",
    weddingDateTime: "February 15, 2025 at 6:00 PM",
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const fillTemplate = (template: string): string => {
    return template
      .replace(/{CoupleNames}/g, weddingDetails.coupleNames)
      .replace(/{Date}/g, weddingDetails.date)
      .replace(/{City}/g, weddingDetails.city)
      .replace(/{HaldiDateTime}/g, weddingDetails.haldiDateTime)
      .replace(/{SangeetDateTime}/g, weddingDetails.sangeetDateTime)
      .replace(/{WeddingDateTime}/g, weddingDetails.weddingDateTime);
  };

  const filledMessage = selectedTemplate ? fillTemplate(selectedTemplate.template) : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filledMessage);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invitation message copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 pb-20" data-testid="page-invitations">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Invitation Generator</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select a template and copy the message to share with your guests
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Choose a Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <InviteTemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              category={template.category}
              preview={template.template.slice(0, 80) + "..."}
              isSelected={selectedTemplateId === template.id}
              onClick={setSelectedTemplateId}
            />
          ))}
        </div>
      </div>

      <Card data-testid="card-invitation-preview">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <CardTitle className="text-base">Preview</CardTitle>
          <Button onClick={handleCopy} data-testid="button-copy-invitation">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Text
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea
            value={filledMessage}
            readOnly
            className="min-h-[200px] resize-none bg-muted/50"
            data-testid="textarea-invitation-preview"
          />
        </CardContent>
      </Card>
    </div>
  );
}
