import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RsvpStatus, Side } from "@/components/GuestCard";

interface InvitationFormData {
  name: string;
  accompanyingCount: number;
  phone: string;
  email: string;
  side: Side;
  group: string;
  rsvpStatus: RsvpStatus;
}

export default function InvitationResponse() {
  const [, params] = useRoute("/weddings/:weddingId/invitation");
  const weddingId = params?.weddingId;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupleNames, setCoupleNames] = useState<string>("");

  const form = useForm<InvitationFormData>({
    defaultValues: {
      name: "",
      accompanyingCount: 0,
      phone: "",
      email: "",
      side: "bride",
      group: "",
      rsvpStatus: "going",
    },
  });

  useEffect(() => {
    if (weddingId) {
      fetch(`/api/weddings/${weddingId}`)
        .then(response => response.json())
        .then(data => {
          setCoupleNames(data.couple_names || "");
        })
        .catch(error => {
          console.error("Failed to fetch wedding details:", error);
        });
    }
  }, [weddingId]);

  const handleSubmit = async (data: InvitationFormData) => {
    if (!weddingId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/weddings/${weddingId}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          accompanying_count: data.accompanyingCount,
          phone: data.phone,
          email: data.email,
          side: data.side,
          group: data.group,
          rsvp_status: data.rsvpStatus,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit invitation response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground">
            You have replied to the invitation. We look forward to celebrating with you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Wedding Invitation</h1>
          {coupleNames && (
            <p className="text-lg font-semibold text-primary">
              {coupleNames}
            </p>
          )}
          <p className="text-muted-foreground">
            Please fill in your details to RSVP
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accompanyingCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accompanying Members</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 XXXXX XXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="side"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Side</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bride">Bride's Side</SelectItem>
                          <SelectItem value="groom">Groom's Side</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friends">Friends</SelectItem>
                          <SelectItem value="Colleagues">Colleagues</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rsvpStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Will you attend?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select response" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="going">Yes, I'll be there</SelectItem>
                        <SelectItem value="not_going">Sorry, can't make it</SelectItem>
                        <SelectItem value="maybe">Maybe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
