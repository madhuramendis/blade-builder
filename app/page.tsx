"use client";
import { useState, useEffect } from "react";
import { useUsers } from "@/app/lib/useUsers";
import { getScriptUrl } from "@/app/lib/sheetsStorage";
import { SetupScreen } from "@/app/components/SetupScreen";
import { UserGate } from "@/app/components/UserGate";
import PageBuilder from "@/app/components/PageBuilder";

type AppState = "loading" | "setup" | "gate" | "builder";

export default function Home() {
  const [appState, setAppState]     = useState<AppState>("loading");
  const [scriptUrl, setScriptUrl]   = useState<string | null>(null);
  const { users, currentUser, ready, login, logout, createUser } = useUsers();

  // All localStorage reads must happen inside useEffect (no SSR access)
  useEffect(() => {
    const setupDone = localStorage.getItem("blade-builder-setup-done");
    setScriptUrl(getScriptUrl());
    if (!setupDone) {
      setAppState("setup");
    }
    // else: wait for useUsers to become ready (second effect handles it)
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (appState === "loading") {
      setAppState(currentUser ? "builder" : "gate");
    }
  }, [ready, currentUser, appState]);

  const handleSetupDone = () => {
    localStorage.setItem("blade-builder-setup-done", "1");
    setScriptUrl(getScriptUrl());
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

  // Show a minimal spinner until JS hydrates and effects fire
  if (appState === "loading") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#1a1f36", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ff7300", fontSize: 14, fontFamily: "system-ui, sans-serif", letterSpacing: 1 }}>Loading…</div>
      </div>
    );
  }

  if (appState === "setup") {
    return <SetupScreen existingUrl={scriptUrl} onDone={handleSetupDone} />;
  }

  if (appState === "gate" || !currentUser) {
    return (
      <UserGate
        users={users}
        onLogin={handleLogin}
        onCreate={handleCreate}
        onOpenSetup={openSetup}
        sheetsConnected={!!scriptUrl}
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
