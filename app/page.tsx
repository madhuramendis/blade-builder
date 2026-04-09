"use client";
import { useState, useEffect } from "react";
import { useUsers } from "@/app/lib/useUsers";
import { getScriptUrl } from "@/app/lib/sheetsStorage";
import { SetupScreen } from "@/app/components/SetupScreen";
import { UserGate } from "@/app/components/UserGate";
import PageBuilder from "@/app/components/PageBuilder";

type AppState = "loading" | "setup" | "gate" | "builder";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("loading");
  const { users, currentUser, ready, login, logout, createUser } = useUsers();

  // Determine initial screen
  useEffect(() => {
    if (appState !== "loading") return;
    // Check if setup has been completed (script URL set, or explicitly skipped)
    const setupDone = localStorage.getItem("blade-builder-setup-done");
    if (!setupDone) { setAppState("setup"); return; }
    // Let useUsers finish loading
  }, [appState]);

  useEffect(() => {
    if (!ready) return;
    if (appState === "loading") {
      const setupDone = localStorage.getItem("blade-builder-setup-done");
      if (!setupDone) return; // still on setup
      setAppState(currentUser ? "builder" : "gate");
    }
  }, [ready, currentUser, appState]);

  const handleSetupDone = () => {
    localStorage.setItem("blade-builder-setup-done", "1");
    setAppState(currentUser ? "builder" : "gate");
  };

  const handleLogin = (name: string) => {
    login(name);
    setAppState("builder");
  };

  const handleCreate = (name: string): string | null => {
    const err = createUser(name);
    if (!err) setAppState("builder");
    return err;
  };

  const handleSwitch = () => {
    logout();
    setAppState("gate");
  };

  const openSetup = () => setAppState("setup");

  if (appState === "loading") return null;

  if (appState === "setup") {
    return <SetupScreen existingUrl={getScriptUrl()} onDone={handleSetupDone} />;
  }

  if (appState === "gate" || !currentUser) {
    return (
      <UserGate
        users={users}
        onLogin={handleLogin}
        onCreate={handleCreate}
        onOpenSetup={openSetup}
      />
    );
  }

  return (
    <PageBuilder
      userId={currentUser}
      onSwitch={handleSwitch}
      onOpenSetup={openSetup}
    />
  );
}
