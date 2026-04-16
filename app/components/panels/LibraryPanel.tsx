"use client";
import { Box, ButtonBase, Typography } from "@wso2/oxygen-ui";
import { BLADE_DEFS, BladeType } from "@/app/lib/bladeDefinitions";

interface Props {
  onAdd:    (type: BladeType) => string | null;
  onToast:  (msg: string, type?: "default" | "warn" | "error") => void;
}

export function LibraryPanel({ onAdd, onToast }: Props) {
  const handleAdd = (type: BladeType) => {
    const err = onAdd(type);
    if (err) onToast(err, "warn");
    else onToast(`${BLADE_DEFS[type].label} added`);
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography variant="overline" color="text.secondary" sx={{ px: 0.5, lineHeight: 2 }}>
        WSO2 blade library
      </Typography>
      {(Object.entries(BLADE_DEFS) as [BladeType, typeof BLADE_DEFS[BladeType]][]).map(([type, def]) => (
        <ButtonBase
          key={type}
          onClick={() => handleAdd(type)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 1.25,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "left",
            width: "100%",
            transition: "all 0.12s",
            "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0,
              background: def.iconBg,
              border: "1px solid",
              borderColor: "divider",
              color: "#1a1f36",
            }}
          >
            {def.icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{def.label}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap display="block">{def.description}</Typography>
          </Box>
          <Typography color="text.disabled" sx={{ fontSize: 22, fontWeight: 300, flexShrink: 0, lineHeight: 1 }}>+</Typography>
        </ButtonBase>
      ))}
    </Box>
  );
}
