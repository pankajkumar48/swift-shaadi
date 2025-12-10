import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import TeamMemberCard, { TeamRole } from "@/components/TeamMemberCard";
import EmptyState from "@/components/EmptyState";
import TeamMemberFormDialog from "@/components/TeamMemberFormDialog";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
}

export default function Team() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  // todo: remove mock data - replace with real API data
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", name: "Priya Sharma", email: "priya@example.com", role: "owner" },
    { id: "2", name: "Rahul Sharma", email: "rahul@example.com", role: "family_admin" },
    { id: "3", name: "Meera Patel", email: "meera@example.com", role: "helper" },
    { id: "4", name: "Amit Kumar", email: "amit@example.com", role: "family_admin" },
  ]);

  const currentUserId = "1"; // todo: replace with actual current user

  const handleChangeRole = (id: string, role: TeamRole) => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
  };

  const handleRemove = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleAddMember = (member: Omit<TeamMember, "id">) => {
    const newMember: TeamMember = { ...member, id: Date.now().toString() };
    setMembers([...members, newMember]);
    setShowAddDialog(false);
  };

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
              isCurrentUser={member.id === currentUserId}
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
