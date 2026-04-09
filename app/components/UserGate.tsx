"use client";
import { useState } from "react";
import { MAX_USERS } from "@/app/lib/useUsers";

import { getScriptUrl } from "@/app/lib/sheetsStorage";

interface Props {
  users:        string[];
  onLogin:      (name: string) => void;
  onCreate:     (name: string) => string | null;
  onOpenSetup:  () => void;
}

export function UserGate({ users, onLogin, onCreate, onOpenSetup }: Props) {
  const sheetsConnected = !!getScriptUrl();
  const [newName, setNewName] = useState("");
  const [error, setError]    = useState<string | null>(null);

  const handleCreate = () => {
    const err = onCreate(newName);
    if (err) setError(err);
    else { setNewName(""); setError(null); }
  };

  const canCreate = users.length < MAX_USERS;

  return (
    <div className="user-gate-overlay">
      <div className="user-gate-card">
        <div className="user-gate-logo">
          <div className="logo-mark">W2</div>
          <span className="logo-text">Blade Builder</span>
          <span className="logo-tag">PMM</span>
        </div>
        <h2 className="user-gate-title">Who are you?</h2>
        <p className="user-gate-sub">Select your name to open your workspace.</p>

        {users.length > 0 && (
          <div className="user-list">
            {users.map(u => (
              <button key={u} className="user-btn" onClick={() => onLogin(u)}>
                <div className="user-avatar">{u[0].toUpperCase()}</div>
                <span className="user-name">{u}</span>
                <span className="user-arrow">→</span>
              </button>
            ))}
          </div>
        )}

        {canCreate ? (
          <div className="user-create">
            <div className="user-create-label">
              {users.length === 0 ? "Create your workspace" : `Add user (${users.length}/${MAX_USERS})`}
            </div>
            <div className="user-create-row">
              <input
                className="field-input"
                placeholder="Your name…"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                autoFocus={users.length === 0}
              />
              <button className="btn btn-primary btn-sm" onClick={handleCreate}>Join</button>
            </div>
            {error && <div className="user-error">{error}</div>}
          </div>
        ) : (
          <div className="user-full">Max {MAX_USERS} users reached. Select an existing user above.</div>
        )}

        <div className="gate-footer">
          <div className={`sheets-status ${sheetsConnected ? "connected" : "disconnected"}`}>
            <span className="sheets-dot" />
            {sheetsConnected ? "Google Sheets connected" : "Local storage only"}
          </div>
          <button className="btn-link-subtle" onClick={onOpenSetup}>
            {sheetsConnected ? "Reconnect Sheets" : "Connect Google Sheets"}
          </button>
        </div>
      </div>
    </div>
  );
}
