import RsvpSummary from "../RsvpSummary";

export default function RsvpSummaryExample() {
  return (
    <RsvpSummary
      total={248}
      going={156}
      notGoing={32}
      maybe={28}
      pending={32}
      onClick={() => console.log("Navigate to guests")}
    />
  );
}
