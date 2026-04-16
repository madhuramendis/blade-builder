"use client";
import { useState, useRef } from "react";
import {
  Box, Tabs, Tab, Typography, InputBase, Button, IconButton, Tooltip, Divider,
  Avatar, Menu, MenuItem, ListItemText,
} from "@wso2/oxygen-ui";
import { usePageBuilder } from "@/app/lib/usePageBuilder";
import { BladePreview } from "@/app/components/blades/BladePreview";
import { LibraryPanel } from "@/app/components/panels/LibraryPanel";
import { StructurePanel } from "@/app/components/panels/StructurePanel";
import { EditPanel } from "@/app/components/panels/EditPanel";
import { VersionsPanel } from "@/app/components/panels/VersionsPanel";
import { Toast, useToast } from "@/app/components/ui/Toast";
import { BladeType } from "@/app/lib/bladeDefinitions";

type Tab = 0 | 1 | 2 | 3; // library | structure | edit | versions
type Viewport = "desktop" | "tablet" | "mobile";

interface Props {
  userId:      string;
  onSwitch:    () => void;
  onOpenSetup: () => void;
}

export default function PageBuilder({ userId, onSwitch, onOpenSetup }: Props) {
  const pb = usePageBuilder(userId);
  const { toast, showToast, closeToast } = useToast();
  const [tab, setTab]                   = useState<Tab>(0);
  const [viewport, setViewport]         = useState<Viewport>("desktop");
  const [menuAnchor, setMenuAnchor]     = useState<HTMLElement | null>(null);
  const [exportAnchor, setExportAnchor] = useState<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleAddBlade = (type: BladeType) => {
    const err = pb.addBlade(type);
    if (!err) setTab(1);
    return err;
  };

  const handleSelectBlade = (idx: number) => {
    pb.setActiveIdx(idx);
    setTab(2);
  };

  const exportPNG = async () => {
    if (!pb.blades.length) { showToast("Add some blades first", "warn"); return; }
    showToast("Generating PNG…");
    try {
      const { default: html2canvas } = await import("html2canvas");
      if (!previewRef.current) return;
      const c = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const link = document.createElement("a");
      link.download = (pb.pageTitle || "page").replace(/[^a-z0-9_-]/gi, "-").toLowerCase() + ".png";
      link.href = c.toDataURL("image/png");
      link.click();
      showToast("PNG downloaded");
    } catch { showToast("PNG export failed", "error"); }
  };

  const exportJPG = async () => {
    if (!pb.blades.length) { showToast("Add some blades first", "warn"); return; }
    showToast("Generating JPG…");
    try {
      const { default: html2canvas } = await import("html2canvas");
      if (!previewRef.current) return;
      const c = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const link = document.createElement("a");
      link.download = (pb.pageTitle || "page").replace(/[^a-z0-9_-]/gi, "-").toLowerCase() + ".jpg";
      link.href = c.toDataURL("image/jpeg", 0.92);
      link.click();
      showToast("JPG downloaded");
    } catch { showToast("JPG export failed", "error"); }
  };

  const exportPDF = () => {
    if (!pb.blades.length) { showToast("Add some blades first", "warn"); return; }
    window.print();
  };

  const copyHandoff = async () => {
    const json = pb.getHandoffJSON();
    try {
      await navigator.clipboard.writeText(json);
      showToast("Handoff JSON copied");
    } catch {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = "blade-handoff.json"; a.click();
      showToast("Handoff JSON downloaded");
    }
  };

  const vpMaxWidth = viewport === "tablet" ? 768 : viewport === "mobile" ? 390 : "100%";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* ── TOP HEADER ── */}
      <Box sx={{
        flexShrink: 0, zIndex: 10, bgcolor: "#1a1f36",
        display: "flex", alignItems: "center", px: 2, gap: 1,
        height: 56, borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        {/* Brand */}
        <Typography sx={{ fontWeight: 800, fontSize: 15, color: "#fff", whiteSpace: "nowrap", mr: 1 }}>
          Blade Builder
        </Typography>

        {/* Page title input */}
        <InputBase
          value={pb.pageTitle}
          onChange={e => pb.setPageTitle(e.target.value)}
          placeholder="Page title…"
          inputProps={{ "aria-label": "page title" }}
          sx={{
            flex: 1, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.9)",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 1.5, px: 1.5, py: 0.5, maxWidth: 320,
            "&:hover": { background: "rgba(255,255,255,0.12)" },
            "& input": { textAlign: "center" },
          }}
        />

        <Box sx={{ flex: 1 }} />

        {/* Actions */}
        <Button size="small" variant="outlined" onClick={e => setExportAnchor(e.currentTarget)}
          sx={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
          Export ↓
        </Button>
        <Menu anchorEl={exportAnchor} open={Boolean(exportAnchor)} onClose={() => setExportAnchor(null)}>
          <MenuItem onClick={() => { setExportAnchor(null); exportPNG(); }}>Download PNG</MenuItem>
          <MenuItem onClick={() => { setExportAnchor(null); exportJPG(); }}>Download JPG</MenuItem>
          <MenuItem onClick={() => { setExportAnchor(null); exportPDF(); }}>Download PDF</MenuItem>
        </Menu>

        <Button size="small" variant="contained" onClick={copyHandoff}
          sx={{ bgcolor: "#ff7300", "&:hover": { bgcolor: "#e56500" }, whiteSpace: "nowrap" }}>
          Copy handoff ↗
        </Button>

        <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.2)", mx: 0.5 }} />

        <Tooltip title="Sheets settings">
          <IconButton size="small" onClick={onOpenSetup}
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>
            </svg>
          </IconButton>
        </Tooltip>

        <Tooltip title={userId}>
          <Avatar
            onClick={e => setMenuAnchor(e.currentTarget)}
            sx={{ width: 32, height: 32, bgcolor: "#ff7300", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {userId[0].toUpperCase()}
          </Avatar>
        </Tooltip>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem disabled sx={{ opacity: "1 !important" }}>
            <ListItemText primary={userId} secondary="Blade Builder PMM" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setMenuAnchor(null); onSwitch(); }}>Switch user</MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); onOpenSetup(); }}>Sheets settings</MenuItem>
        </Menu>
      </Box>

      {/* ── BODY: LEFT PANEL + PREVIEW ── */}
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* Left panel */}
        <Box sx={{
          width: 300, minWidth: 300, borderRight: "1px solid", borderColor: "divider",
          display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "background.paper",
        }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v as Tab)}
            variant="fullWidth"
            sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}
          >
            <Tab label="Library" sx={{ fontSize: 11, minHeight: 40 }} />
            <Tab label="Structure" sx={{ fontSize: 11, minHeight: 40 }} />
            <Tab label="Edit" sx={{ fontSize: 11, minHeight: 40 }} />
            <Tab label="Versions" sx={{ fontSize: 11, minHeight: 40 }} />
          </Tabs>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {tab === 0 && <LibraryPanel onAdd={handleAddBlade} onToast={showToast} />}
            {tab === 1 && <StructurePanel blades={pb.blades} activeIdx={pb.activeIdx} onSelect={handleSelectBlade} onMove={pb.moveBlade} onRemove={pb.removeBlade} onAddClick={() => setTab(0)} />}
            {tab === 2 && <EditPanel blade={pb.activeIdx !== null ? pb.blades[pb.activeIdx] : null} idx={pb.activeIdx} total={pb.blades.length} onUpdate={pb.updateField} onMove={pb.moveBlade} onRemove={pb.removeBlade} />}
            {tab === 3 && <VersionsPanel versions={pb.versions} revisions={pb.revisions} onSaveVersion={pb.saveVersion} onLoadSnapshot={pb.loadSnapshot} onDeleteVersion={pb.deleteVersion} onToast={showToast} />}
          </Box>
        </Box>

        {/* Preview area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "grey.100" }}>
          {/* Viewport toolbar */}
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 2, py: 0.75, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider", flexShrink: 0,
          }}>
            <Typography variant="caption" color="text.secondary">Live preview — wso2.com style</Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {(["desktop", "tablet", "mobile"] as Viewport[]).map(v => (
                <Tooltip key={v} title={v}>
                  <IconButton
                    size="small"
                    onClick={() => setViewport(v)}
                    sx={{
                      border: "1px solid",
                      borderColor: viewport === v ? "primary.main" : "divider",
                      bgcolor: viewport === v ? "primary.50" : "transparent",
                      color: viewport === v ? "primary.main" : "text.secondary",
                      borderRadius: 1,
                      width: 30, height: 30,
                    }}
                  >
                    {v === "desktop" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
                    {v === "tablet"  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>}
                    {v === "mobile"  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Preview canvas */}
          <Box sx={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", p: 3 }}>
            <Box sx={{
              width: "100%", maxWidth: vpMaxWidth, bgcolor: "#fff",
              border: "1px solid", borderColor: "divider", borderRadius: 2,
              overflow: "hidden", boxShadow: 2, minHeight: 200,
              transition: "max-width 0.25s ease",
            }}>
              {pb.blades.length === 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, p: 5, textAlign: "center" }}>
                  <Typography sx={{ fontSize: 38, opacity: 0.2, mb: 2 }}>⬡</Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Your page is empty</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mb: 3 }}>
                    Add blades from the WSO2 library to start building your platform page.
                  </Typography>
                  <Button variant="contained" onClick={() => setTab(0)}
                    sx={{ bgcolor: "#ff7300", "&:hover": { bgcolor: "#e56500" } }}>
                    Browse blade library
                  </Button>
                </Box>
              ) : (
                <div ref={previewRef}>
                  {pb.blades.map((blade, i) => (
                    <Box
                      key={blade.id}
                      onClick={() => handleSelectBlade(i)}
                      sx={{
                        position: "relative", cursor: "pointer",
                        border: "2px solid",
                        borderColor: pb.activeIdx === i ? "#ff7300" : "transparent",
                        transition: "border-color 0.12s",
                        "&:hover": { borderColor: pb.activeIdx === i ? "#ff7300" : "rgba(255,115,0,0.3)" },
                        "&:hover .blade-overlay": { opacity: 1 },
                        ...(pb.activeIdx === i && { "& .blade-overlay": { opacity: 1, bgcolor: "rgba(255,115,0,0.9)" } }),
                      }}
                    >
                      <Box
                        className="blade-overlay"
                        sx={{
                          position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center",
                          gap: 0.75, bgcolor: "rgba(26,31,54,0.8)", color: "#fff", borderRadius: 1,
                          px: 1, py: 0.25, fontSize: 11, fontWeight: 500, opacity: 0,
                          transition: "opacity 0.15s", zIndex: 5, pointerEvents: "none",
                        }}
                      >
                        <span>{blade.label}</span>
                        <Typography component="span" sx={{ fontSize: 10, opacity: 0.75 }}>Click to edit</Typography>
                      </Box>
                      <BladePreview blade={blade} />
                    </Box>
                  ))}
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Toast toast={toast} onClose={closeToast} />
    </Box>
  );
}
