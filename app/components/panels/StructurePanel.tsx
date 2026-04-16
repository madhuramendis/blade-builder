"use client";
import { Box, Typography, IconButton, Tooltip, Button } from "@wso2/oxygen-ui";
import { PageBlade } from "@/app/lib/bladeDefinitions";

interface Props {
  blades:    PageBlade[];
  activeIdx: number | null;
  onSelect:  (idx: number) => void;
  onMove:    (idx: number, dir: -1 | 1) => void;
  onRemove:  (idx: number) => void;
  onAddClick: () => void;
}

export function StructurePanel({ blades, activeIdx, onSelect, onMove, onRemove, onAddClick }: Props) {
  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography variant="overline" color="text.secondary" sx={{ px: 0.5, lineHeight: 2 }}>
        Page order
      </Typography>

      {blades.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          No blades yet. Go to Library to add one.
        </Typography>
      ) : (
        blades.map((b, i) => (
          <Box
            key={b.id}
            onClick={() => onSelect(i)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.25,
              borderRadius: 2,
              border: "1px solid",
              borderColor: activeIdx === i ? "primary.main" : "divider",
              bgcolor: activeIdx === i ? "primary.50" : "background.paper",
              cursor: "pointer",
              transition: "all 0.12s",
              "&:hover": { borderColor: "primary.light" },
            }}
          >
            <Typography color="text.disabled" sx={{ fontSize: 14, cursor: "grab", userSelect: "none", mr: 0.25 }}>⠿</Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>{b.label}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">{b.type}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.25 }} onClick={e => e.stopPropagation()}>
              <Tooltip title="Move up">
                <span>
                  <IconButton size="small" disabled={i === 0} onClick={() => onMove(i, -1)}>↑</IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Move down">
                <span>
                  <IconButton size="small" disabled={i === blades.length - 1} onClick={() => onMove(i, 1)}>↓</IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Remove">
                <IconButton size="small" color="error" onClick={() => onRemove(i)}>×</IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))
      )}

      <Button variant="outlined" size="small" onClick={onAddClick} sx={{ mt: 1, borderStyle: "dashed" }}>
        + Add blade
      </Button>
    </Box>
  );
}
