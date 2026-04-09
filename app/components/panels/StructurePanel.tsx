// components/panels/StructurePanel.tsx
"use client";
import { PageBlade } from "@/app/lib/bladeDefinitions";

interface Props {
  blades: PageBlade[];
  activeIdx: number | null;
  onSelect: (idx: number) => void;
  onMove: (idx: number, dir: -1 | 1) => void;
  onRemove: (idx: number) => void;
  onAddClick: () => void;
}

export function StructurePanel({ blades, activeIdx, onSelect, onMove, onRemove, onAddClick }: Props) {
  if (!blades.length) {
    return (
      <div className="tab-content">
        <div className="section-label">Page order</div>
        <div className="empty-state">No blades added yet.<br />Go to Library to add one.</div>
        <button className="add-blade-btn" onClick={onAddClick}>+ Add blade</button>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-label">Page order</div>
      {blades.map((b, i) => (
        <div
          key={b.id}
          className={`structure-row${activeIdx === i ? " active" : ""}`}
          onClick={() => onSelect(i)}
        >
          <span className="sr-handle" title="Drag handle">⠿</span>
          <div className="sr-info">
            <div className="sr-label">{b.label}</div>
            <div className="sr-type">{b.type}</div>
          </div>
          <div className="sr-actions">
            <button
              className="sr-btn"
              title="Move up"
              disabled={i === 0}
              onClick={(e) => { e.stopPropagation(); onMove(i, -1); }}
            >↑</button>
            <button
              className="sr-btn"
              title="Move down"
              disabled={i === blades.length - 1}
              onClick={(e) => { e.stopPropagation(); onMove(i, 1); }}
            >↓</button>
            <button
              className="sr-btn danger"
              title="Remove"
              onClick={(e) => { e.stopPropagation(); onRemove(i); }}
            >×</button>
          </div>
        </div>
      ))}
      <button className="add-blade-btn" onClick={onAddClick}>+ Add blade</button>
    </div>
  );
}
