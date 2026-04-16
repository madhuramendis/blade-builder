"use client";
import {
  Box, Typography, TextField, Select, MenuItem, FormControl,
  InputLabel, Button, Divider, IconButton, Tooltip,
} from "@wso2/oxygen-ui";
import { PageBlade, BLADE_DEFS, FieldDef } from "@/app/lib/bladeDefinitions";

interface Props {
  blade:    PageBlade | null;
  idx:      number | null;
  total:    number;
  onUpdate: (idx: number, key: string, value: string) => void;
  onMove:   (idx: number, dir: -1 | 1) => void;
  onRemove: (idx: number) => void;
}

export function EditPanel({ blade, idx, total, onUpdate, onMove, onRemove }: Props) {
  if (!blade || idx === null) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Click a blade in the preview to edit its content.
        </Typography>
      </Box>
    );
  }

  const def = BLADE_DEFS[blade.type];

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, pb: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1.5, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0,
            background: def.iconBg, border: "1px solid", borderColor: "divider", color: "#1a1f36",
          }}
        >
          {def.icon}
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={700}>{def.label}</Typography>
          <Typography variant="caption" color="text.secondary">Blade {idx + 1} of {total}</Typography>
        </Box>
      </Box>

      {/* Fields */}
      {def.fields.map(f => (
        <FieldEditor
          key={f.id}
          field={f}
          value={blade.data[f.id] || ""}
          onChange={v => onUpdate(idx, f.id, v)}
        />
      ))}

      {/* Actions */}
      <Divider />
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Tooltip title="Move up">
          <span>
            <Button size="small" variant="outlined" disabled={idx === 0} onClick={() => onMove(idx, -1)}>↑ Up</Button>
          </span>
        </Tooltip>
        <Tooltip title="Move down">
          <span>
            <Button size="small" variant="outlined" disabled={idx === total - 1} onClick={() => onMove(idx, 1)}>↓ Down</Button>
          </span>
        </Tooltip>
        <Button size="small" variant="outlined" color="error" onClick={() => onRemove(idx)}>Remove</Button>
      </Box>
    </Box>
  );
}

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const len  = value.length;
  const over = len > field.maxLength;
  const warn = !over && len / field.maxLength > 0.85;

  const helperText = field.type !== "select"
    ? (over ? `${len - field.maxLength} chars over limit` : `${len} / ${field.maxLength}`)
    : undefined;

  if (field.type === "select") {
    return (
      <FormControl size="small" fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          label={field.label}
          value={value}
          onChange={e => onChange(e.target.value as string)}
        >
          {(field.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      label={field.label}
      size="small"
      fullWidth
      multiline={field.type === "textarea"}
      rows={field.type === "textarea" ? (field.rows || 3) : undefined}
      placeholder={field.placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={field.required}
      error={over}
      helperText={helperText}
      FormHelperTextProps={{ sx: { color: over ? "error.main" : warn ? "warning.main" : "text.secondary" } }}
    />
  );
}
