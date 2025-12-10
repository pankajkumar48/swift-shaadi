import Header from "../Header";

export default function HeaderExample() {
  return (
    <Header 
      weddingName="Priya & Rahul" 
      onSettingsClick={() => console.log("Settings clicked")}
      onNotificationsClick={() => console.log("Notifications clicked")}
    />
  );
}
