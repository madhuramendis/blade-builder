"use client";
import { useState } from "react";
import {
  Box, Typography, TextField, Button, ButtonBase,
  Avatar, Divider, Alert, Chip,
} from "@wso2/oxygen-ui";
import { MAX_USERS } from "@/app/lib/useUsers";

interface Props {
  users:           string[];
  onLogin:         (name: string) => void;
  onCreate:        (name: string) => string | null;
  onOpenSetup:     () => void;
  sheetsConnected?: boolean;
}

export function UserGate({ users, onLogin, onCreate, onOpenSetup, sheetsConnected = false }: Props) {
  const [newName, setNewName] = useState("");
  const [error, setError]    = useState<string | null>(null);

  const handleCreate = () => {
    const err = onCreate(newName);
    if (err) setError(err);
    else { setNewName(""); setError(null); }
  };

  const canCreate = users.length < MAX_USERS;

  return (
    <Box sx={{
      position: "fixed", inset: 0, bgcolor: "#1a1f36",
      display: "flex", alignItems: "center", justifyContent: "center",
      p: 3, overflowY: "auto",
    }}>
      <Box sx={{
        bgcolor: "background.paper", borderRadius: 3, p: 5,
        width: "100%", maxWidth: 420, boxShadow: 24,
      }}>
        {/* Brand */}
        <Typography variant="h5" fontWeight={800} color="#1a1f36" gutterBottom>
          Blade Builder
          <Chip label="PMM" size="small" sx={{ ml: 1, fontSize: 10, height: 20, bgcolor: "#f0f2f5", color: "#6b7a99" }} />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select your name to open your workspace.
        </Typography>

        {/* Existing users */}
        {users.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 2.5 }}>
            {users.map(u => (
              <ButtonBase
                key={u}
                onClick={() => onLogin(u)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
                  borderRadius: 2, border: "1px solid", borderColor: "divider",
                  textAlign: "left", width: "100%", transition: "all 0.12s",
                  "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
                }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#1a1f36", fontSize: 15, fontWeight: 700 }}>
                  {u[0].toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>{u}</Typography>
                <Typography color="text.disabled">→</Typography>
              </ButtonBase>
            ))}
          </Box>
        )}

        {/* Create */}
        {canCreate ? (
          <>
            {users.length > 0 && <Divider sx={{ mb: 2 }}><Typography variant="caption" color="text.secondary">or add new ({users.length}/{MAX_USERS})</Typography></Divider>}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Your name…"
                value={newName}
                onChange={e => { setNewName(e.target.value); setError(null); }}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
                autoFocus={users.length === 0}
                sx={{ flex: 1 }}
              />
              <Button variant="contained" size="small" onClick={handleCreate}
                sx={{ bgcolor: "#ff7300", "&:hover": { bgcolor: "#e56500" }, whiteSpace: "nowrap" }}>
                Join
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          </>
        ) : (
          <Alert severity="info">Max {MAX_USERS} users reached. Select an existing user above.</Alert>
        )}

        {/* Footer */}
        <Divider sx={{ mt: 3, mb: 1.5 }} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: sheetsConnected ? "success.main" : "grey.400" }} />
            <Typography variant="caption" color={sheetsConnected ? "success.main" : "text.disabled"}>
              {sheetsConnected ? "Google Sheets connected" : "Local storage only"}
            </Typography>
          </Box>
          <Button size="small" variant="text" onClick={onOpenSetup} sx={{ fontSize: 11 }}>
            {sheetsConnected ? "Reconnect" : "Connect Sheets"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
