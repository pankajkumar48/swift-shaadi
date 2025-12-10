import { useState } from "react";
import InviteTemplateCard from "../InviteTemplateCard";

export default function InviteTemplateCardExample() {
  const [selected, setSelected] = useState("1");
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <InviteTemplateCard
        id="1"
        name="Elegant Traditional"
        category="Traditional"
        preview="With great joy and blessings, the families of {CoupleNames} request the pleasure of your company..."
        isSelected={selected === "1"}
        onClick={setSelected}
      />
      <InviteTemplateCard
        id="2"
        name="Modern Friendly"
        category="Modern"
        preview="Hey! We're getting married! {CoupleNames} would love for you to join us..."
        isSelected={selected === "2"}
        onClick={setSelected}
      />
    </div>
  );
}
