"use client";
import { BLADE_DEFS, BladeType } from "@/app/lib/bladeDefinitions";

interface Props {
  onAdd: (type: BladeType) => string | null;
  onToast: (msg: string, type?: "default" | "warn" | "error") => void;
}

export function LibraryPanel({ onAdd, onToast }: Props) {
  const handleAdd = (type: BladeType) => {
    const err = onAdd(type);
    if (err) onToast(err, "warn");
    else onToast(`${BLADE_DEFS[type].label} blade added`);
  };

  return (
    <div className="tab-content">
      <div className="section-label">WSO2 blade library</div>
      {(Object.entries(BLADE_DEFS) as [BladeType, typeof BLADE_DEFS[BladeType]][]).map(([type, def]) => (
        <button key={type} className="blade-chip" onClick={() => handleAdd(type)}>
          <div className="chip-icon" style={{ background: def.iconBg }}>{def.icon}</div>
          <div className="chip-meta">
            <div className="chip-name">{def.label}</div>
            <div className="chip-desc">{def.description}</div>
          </div>
          <div className="chip-add">+</div>
        </button>
      ))}
    </div>
  );
}
