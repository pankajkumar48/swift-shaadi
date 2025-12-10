import TeamMemberCard from "../TeamMemberCard";

export default function TeamMemberCardExample() {
  return (
    <div className="space-y-3">
      <TeamMemberCard
        id="1"
        name="Priya Sharma"
        email="priya@example.com"
        role="owner"
        isCurrentUser={true}
      />
      <TeamMemberCard
        id="2"
        name="Rahul Sharma"
        email="rahul@example.com"
        role="family_admin"
        onChangeRole={(id, role) => console.log("Change role", id, role)}
        onRemove={(id) => console.log("Remove", id)}
      />
      <TeamMemberCard
        id="3"
        name="Meera Patel"
        email="meera@example.com"
        role="helper"
        onChangeRole={(id, role) => console.log("Change role", id, role)}
        onRemove={(id) => console.log("Remove", id)}
      />
    </div>
  );
}
