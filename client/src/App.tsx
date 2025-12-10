import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Dashboard from "@/pages/Dashboard";
import Guests from "@/pages/Guests";
import Timeline from "@/pages/Timeline";
import Tasks from "@/pages/Tasks";
import Budget from "@/pages/Budget";
import Invitations from "@/pages/Invitations";
import Team from "@/pages/Team";
import Settings from "@/pages/Settings";
import More from "@/pages/More";
import Auth from "@/pages/Auth";
import CreateWedding from "@/pages/CreateWedding";

type AppState = "auth" | "create-wedding" | "app";

function App() {
  // todo: replace with real auth state from API
  const [appState, setAppState] = useState<AppState>("auth");
  const [currentPath, setCurrentPath] = useState("/");

  const handleAuth = () => {
    setAppState("create-wedding");
  };

  const handleWeddingCreated = () => {
    setAppState("app");
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  if (appState === "auth") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Auth onAuth={handleAuth} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (appState === "create-wedding") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CreateWedding onComplete={handleWeddingCreated} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <Dashboard onNavigate={handleNavigate} />;
      case "/guests":
        return <Guests />;
      case "/timeline":
        return <Timeline />;
      case "/tasks":
        return <Tasks />;
      case "/budget":
        return <Budget />;
      case "/invitations":
        return <Invitations />;
      case "/team":
        return <Team />;
      case "/settings":
        return <Settings onNavigate={handleNavigate} />;
      case "/more":
        return <More onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  // todo: replace with real wedding data from API
  const weddingName = "Priya & Rahul";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background" data-testid="app-container">
          <Header 
            weddingName={weddingName}
            onSettingsClick={() => handleNavigate("/settings")}
            onNotificationsClick={() => console.log("Notifications")}
          />
          <main className="pb-16">
            {renderPage()}
          </main>
          <BottomNav 
            currentPath={currentPath} 
            onNavigate={handleNavigate} 
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
