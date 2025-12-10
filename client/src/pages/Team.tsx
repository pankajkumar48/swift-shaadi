import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import TeamMemberCard, { TeamRole } from "@/components/TeamMemberCard";
import EmptyState from "@/components/EmptyState";
import TeamMemberFormDialog from "@/components/TeamMemberFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWedding, useTeamQuery, useCreateTeamMemberMutation, useUpdateTeamMemberMutation, useDeleteTeamMemberMutation } from "@/hooks/use-wedding";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
}

export default function Team() {
  const { toast } = useToast();
  const { wedding } = useWedding();
  const weddingId = wedding?.id || null;

  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: teamData, isLoading } = useTeamQuery(weddingId);
  const createTeamMemberMutation = useCreateTeamMemberMutation();
  const updateTeamMemberMutation = useUpdateTeamMemberMutation();
  const deleteTeamMemberMutation = useDeleteTeamMemberMutation();

  const members: TeamMember[] = (teamData || []).map(m => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role as TeamRole,
  }));

  const ownerMember = members.find(m => m.role === "owner");

  const handleChangeRole = async (id: string, role: TeamRole) => {
    if (!weddingId) return;
    try {
      await updateTeamMemberMutation.mutateAsync({ id, weddingId, role });
      toast({ title: "Role updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
    }
  };

  const handleRemove = async (id: string) => {
    if (!weddingId) return;
    try {
      await deleteTeamMemberMutation.mutateAsync({ id, weddingId });
      toast({ title: "Team member removed" });
    } catch {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
    }
  };

  const handleAddMember = async (member: Omit<TeamMember, "id">) => {
    if (!weddingId) return;
    try {
      await createTeamMemberMutation.mutateAsync({
        weddingId,
        name: member.name,
        email: member.email,
        role: member.role,
      });
      setShowAddDialog(false);
      toast({ title: "Team member added successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20" data-testid="page-team">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Team</h2>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20" data-testid="page-team">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Team</h2>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-member">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="mb-4 p-4 rounded-lg bg-muted/50">
        <h3 className="font-medium text-sm mb-2">Team Roles</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li><strong>Owner:</strong> Full access to all features</li>
          <li><strong>Family Admin:</strong> Can manage guests, timeline, tasks & budget</li>
          <li><strong>Helper:</strong> Can view timeline & update tasks only</li>
        </ul>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Add family members or helpers to collaborate on wedding planning."
          actionLabel="Add First Member"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {members.length} team member{members.length !== 1 ? "s" : ""}
          </p>
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              {...member}
              isCurrentUser={member.id === ownerMember?.id}
              onChangeRole={handleChangeRole}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <TeamMemberFormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddMember}
      />
    </div>
  );
}
