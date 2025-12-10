import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RsvpStatus, Side } from "@/components/GuestCard";

interface GuestFormData {
  name: string;
  accompanyingCount: number;
  phone: string;
  email: string;
  side: Side;
  group: string;
  rsvpStatus: RsvpStatus;
}

interface GuestFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuestFormData) => void;
  initialData?: Partial<GuestFormData>;
  isEditing?: boolean;
}

export default function GuestFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: GuestFormDialogProps) {
  const form = useForm<GuestFormData>({
    defaultValues: {
      name: "",
      accompanyingCount: 0,
      phone: "",
      email: "",
      side: "bride",
      group: "",
      rsvpStatus: "invited",
      ...initialData,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        name: "",
        accompanyingCount: 0,
        phone: "",
        email: "",
        side: "bride",
        group: "",
        rsvpStatus: "invited",
        ...initialData,
      });
    } else if (open && !initialData) {
      form.reset({
        name: "",
        accompanyingCount: 0,
        phone: "",
        email: "",
        side: "bride",
        group: "",
        rsvpStatus: "invited",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: GuestFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-guest-form">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Guest" : "Add Guest"}</DialogTitle>
        </DialogHeader>
        
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
                    <Input placeholder="Enter guest name" {...field} data-testid="input-guest-name" />
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
                      data-testid="input-guest-accompanying" 
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
                      <Input placeholder="+91 XXXXX XXXXX" {...field} data-testid="input-guest-phone" />
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
                      <Input placeholder="email@example.com" {...field} data-testid="input-guest-email" />
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
                        <SelectTrigger data-testid="select-guest-side">
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
                    <FormControl>
                      <Input placeholder="e.g., Family, Friends" {...field} data-testid="input-guest-group" />
                    </FormControl>
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
                  <FormLabel>RSVP Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-guest-rsvp">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="invited">Invited</SelectItem>
                      <SelectItem value="going">Going</SelectItem>
                      <SelectItem value="not_going">Not Going</SelectItem>
                      <SelectItem value="maybe">Maybe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-guest">
                {isEditing ? "Save Changes" : "Add Guest"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
