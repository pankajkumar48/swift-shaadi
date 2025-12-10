import { useState } from "react";
import BottomNav from "../BottomNav";

export default function BottomNavExample() {
  const [currentPath, setCurrentPath] = useState("/");
  
  return (
    <div className="min-h-[120px] relative">
      <BottomNav currentPath={currentPath} onNavigate={setCurrentPath} />
    </div>
  );
}
