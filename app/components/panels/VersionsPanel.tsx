"use client";
import { useState } from "react";
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
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SnapRow({ snap, onRestore, onDelete }: {
  snap: Snapshot;
  onRestore: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="snapshot-row">
      <div className="snapshot-info">
        <div className="snapshot-name">{snap.name}</div>
        <div className="snapshot-meta">
          {relTime(snap.savedAt)} &middot; {snap.blades.length} blade{snap.blades.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="snapshot-actions">
        <button className="sr-btn" title="Restore this snapshot" onClick={onRestore}>↩</button>
        {onDelete && (
          <button className="sr-btn danger" title="Delete" onClick={onDelete}>×</button>
        )}
      </div>
    </div>
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
    <div className="tab-content">

      {/* ── Save version ── */}
      <div className="section-label">Save version</div>
      <div className="version-save-row">
        <input
          className="field-input version-name-input"
          placeholder="Version name…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSave()}
        />
        <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
      </div>

      {/* ── Named versions ── */}
      <div className="section-label versions-section-label">
        Saved versions <span className="count-badge">{versions.length}</span>
      </div>
      {versions.length === 0 ? (
        <div className="empty-state" style={{ padding: "10px 0" }}>
          No versions saved yet. Type a name above and hit Save.
        </div>
      ) : (
        versions.map(v => (
          <SnapRow
            key={v.id}
            snap={v}
            onRestore={() => handleRestore(v)}
            onDelete={() => { onDeleteVersion(v.id); onToast("Version deleted", "warn"); }}
          />
        ))
      )}

      {/* ── Auto-revisions ── */}
      <div className="section-label versions-section-label">
        Auto-revisions <span className="count-badge">{revisions.length}</span>
      </div>
      {revisions.length === 0 ? (
        <div className="empty-state" style={{ padding: "10px 0" }}>
          Revisions are saved automatically when you add, remove, or reorder blades.
        </div>
      ) : (
        revisions.map(r => (
          <SnapRow
            key={r.id}
            snap={r}
            onRestore={() => handleRestore(r)}
          />
        ))
      )}

    </div>
  );
}
