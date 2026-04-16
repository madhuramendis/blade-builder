"use client";
import { useState } from "react";
import {
  Box, Typography, TextField, Button, IconButton,
  Tooltip, Divider, Chip,
} from "@wso2/oxygen-ui";
import { Snapshot } from "@/app/lib/usePageBuilder";

interface Props {
  versions:        Snapshot[];
  revisions:       Snapshot[];
  onSaveVersion:   (name: string) => void;
  onLoadSnapshot:  (snap: Snapshot) => void;
  onDeleteVersion: (id: string) => void;
  onToast:         (msg: string, type?: "default" | "warn" | "error") => void;
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SnapRow({ snap, onRestore, onDelete }: {
  snap:      Snapshot;
  onRestore: () => void;
  onDelete?: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", gap: 1,
        p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>{snap.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {relTime(snap.savedAt)} · {snap.blades.length} blade{snap.blades.length !== 1 ? "s" : ""}
        </Typography>
      </Box>
      <Tooltip title="Restore">
        <IconButton size="small" onClick={onRestore}>↩</IconButton>
      </Tooltip>
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={onDelete}>×</IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export function VersionsPanel({ versions, revisions, onSaveVersion, onLoadSnapshot, onDeleteVersion, onToast }: Props) {
  const [name, setName] = useState("");

  const handleSave = () => {
    const vname = name.trim() || `Version — ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    onSaveVersion(vname);
    setName("");
    onToast(`Saved "${vname}"`);
  };

  const handleRestore = (snap: Snapshot) => {
    onLoadSnapshot(snap);
    onToast(`Restored "${snap.name}"`);
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>

      {/* Save */}
      <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 2 }}>Save version</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Version name…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
      </Box>

      <Divider />

      {/* Named versions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 2 }}>Saved versions</Typography>
        <Chip label={versions.length} size="small" />
      </Box>
      {versions.length === 0 ? (
        <Typography variant="caption" color="text.secondary">No versions saved yet.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {versions.map(v => (
            <SnapRow
              key={v.id}
              snap={v}
              onRestore={() => handleRestore(v)}
              onDelete={() => { onDeleteVersion(v.id); onToast("Version deleted", "warn"); }}
            />
          ))}
        </Box>
      )}

      <Divider />

      {/* Auto-revisions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 2 }}>Auto-revisions</Typography>
        <Chip label={revisions.length} size="small" />
      </Box>
      {revisions.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          Auto-saved on add, remove, or reorder.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {revisions.map(r => (
            <SnapRow key={r.id} snap={r} onRestore={() => handleRestore(r)} />
          ))}
        </Box>
      )}

    </Box>
  );
}
