// components/panels/EditPanel.tsx
"use client";
import { PageBlade, BLADE_DEFS, FieldDef } from "@/app/lib/bladeDefinitions";

interface Props {
  blade: PageBlade | null;
  idx: number | null;
  total: number;
  onUpdate: (idx: number, key: string, value: string) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  onRemove: (idx: number) => void;
}

export function EditPanel({ blade, idx, total, onUpdate, onMove, onRemove }: Props) {
  if (!blade || idx === null) {
    return (
      <div className="tab-content">
        <div className="empty-state">Click a blade in the preview<br />to edit its content.</div>
      </div>
    );
  }

  const def = BLADE_DEFS[blade.type];

  return (
    <div className="tab-content">
      <div className="edit-blade-header">
        <div className="edit-blade-icon" style={{ background: def.iconBg }}>{def.icon}</div>
        <div>
          <div className="edit-blade-name">{def.label}</div>
          <div className="edit-blade-pos">Blade {idx + 1} of {total}</div>
        </div>
      </div>

      <div className="edit-fields">
        {def.fields.map((f) => (
          <FieldEditor
            key={f.id}
            field={f}
            value={blade.data[f.id] || ""}
            onChange={(v) => onUpdate(idx, f.id, v)}
          />
        ))}
      </div>

      <div className="edit-actions">
        <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => onMove(idx, -1)}>↑ Move up</button>
        <button className="btn btn-ghost btn-sm" disabled={idx === total - 1} onClick={() => onMove(idx, 1)}>↓ Move down</button>
        <button className="btn btn-danger btn-sm" onClick={() => onRemove(idx)}>Remove</button>
      </div>
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const len = value.length;
  const pct = len / field.maxLength;
  const countClass = pct > 1 ? "over" : pct > 0.85 ? "warn" : "";
  const isOver = len > field.maxLength;

  return (
    <div className="field-group">
      <label className="field-label">
        <span>{field.label}{field.required && <span className="required"> *</span>}</span>
        {field.type !== "select" && (
          <span className={`char-count ${countClass}`}>{len}/{field.maxLength}</span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          className={`field-input${isOver ? " invalid" : ""}`}
          rows={field.rows || 3}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          className={`field-input${isOver ? " invalid" : ""}`}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {isOver && (
        <div className="field-warn">⚠ Too long — please shorten ({len - field.maxLength} chars over)</div>
      )}
    </div>
  );
}
