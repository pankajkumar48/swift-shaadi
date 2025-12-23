import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WeddingContext, Wedding } from "@/hooks/use-wedding";
import { User } from "@/hooks/use-auth";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Landing from "@/pages/Landing";
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
import InvitationResponse from "@/pages/InvitationResponse";

type AppState = "loading" | "auth" | "create-wedding" | "app";

function MainApp() {
  const [location, setLocation] = useLocation();
  const [appState, setAppState] = useState<AppState>("loading");
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const currentPath = location.startsWith("/app") ? location : "/app";

  const { data: authData, isLoading: authLoading, error: authError, isError: authIsError } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const { data: weddings, isLoading: weddingsLoading, isError: weddingsIsError } = useQuery<Wedding[]>({
    queryKey: ["/api/weddings"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (authLoading) {
      setAppState("loading");
      return;
    }

    if (authIsError || authError || !authData?.user) {
      setAppState("auth");
      setUser(null);
      setWedding(null);
      setIsAuthenticated(false);
      return;
    }

    setUser(authData.user);
    setIsAuthenticated(true);

    if (weddingsLoading) {
      setAppState("loading");
      return;
    }

    if (weddingsIsError) {
      setAppState("auth");
      setUser(null);
      setWedding(null);
      setIsAuthenticated(false);
      return;
    }

    if (!weddings || weddings.length === 0) {
      setAppState("create-wedding");
      return;
    }

    if (!wedding) {
      setWedding(weddings[0]);
    }
    setAppState("app");
  }, [authData, authLoading, authError, authIsError, weddings, weddingsLoading, weddingsIsError, wedding]);

  const handleAuth = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  const handleWeddingCreated = (newWedding: Wedding) => {
    setWedding(newWedding);
    queryClient.invalidateQueries({ queryKey: ["/api/weddings"] });
  };

  const handleNavigate = (path: string) => {
    const appPath = path.startsWith("/app") ? path : `/app${path === "/" ? "" : path}`;
    setLocation(appPath);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (e) {
      console.error(e);
    }
    queryClient.clear();
    setUser(null);
    setWedding(null);
    setIsAuthenticated(false);
    setAppState("auth");
    setLocation("/");
  };

  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="loading-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === "auth") {
    return (
      <>
        <Auth onAuth={handleAuth} />
        <Toaster />
      </>
    );
  }

  if (appState === "create-wedding") {
    return (
      <>
        <CreateWedding onComplete={handleWeddingCreated} />
        <Toaster />
      </>
    );
  }

  const getPageFromPath = () => {
    if (currentPath === "/app" || currentPath === "/app/") {
      return <Dashboard onNavigate={handleNavigate} />;
    }
    if (currentPath === "/app/guests") return <Guests />;
    if (currentPath === "/app/timeline") return <Timeline />;
    if (currentPath === "/app/tasks") return <Tasks />;
    if (currentPath === "/app/budget") return <Budget />;
    if (currentPath === "/app/invitations") return <Invitations />;
    if (currentPath === "/app/team") return <Team />;
    if (currentPath === "/app/settings") return <Settings onNavigate={handleNavigate} onLogout={handleLogout} />;
    if (currentPath === "/app/more") return <More onNavigate={handleNavigate} onLogout={handleLogout} />;
    return <Dashboard onNavigate={handleNavigate} />;
  };

  return (
    <WeddingContext.Provider value={{ wedding, setWedding }}>
      <div className="min-h-screen bg-background" data-testid="app-container">
        <Header 
          weddingName={wedding?.couple_names || "Your Wedding"}
          onSettingsClick={() => handleNavigate("/app/settings")}
          onNotificationsClick={() => console.log("Notifications")}
        />
        <main className="pb-16">
          {getPageFromPath()}
        </main>
        <BottomNav 
          currentPath={currentPath} 
          onNavigate={handleNavigate} 
        />
      </div>
      <Toaster />
    </WeddingContext.Provider>
  );
}

function LandingPage() {
  const [, setLocation] = useLocation();
  
  const handleOpenApp = () => {
    setLocation("/app");
  };

  return (
    <>
      <Landing onOpenApp={handleOpenApp} />
      <Toaster />
    </>
  );
}

function AppContent() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/weddings/:weddingId/invitation" component={InvitationResponse} />
      <Route path="/app" component={MainApp} />
      <Route path="/app/:rest*" component={MainApp} />
      <Route component={LandingPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
