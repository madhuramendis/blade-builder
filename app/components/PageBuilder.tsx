"use client";
import { useState, useRef } from "react";
import { usePageBuilder } from "@/app/lib/usePageBuilder";
import { BladePreview } from "@/app/components/blades/BladePreview";
import { LibraryPanel } from "@/app/components/panels/LibraryPanel";
import { StructurePanel } from "@/app/components/panels/StructurePanel";
import { EditPanel } from "@/app/components/panels/EditPanel";
import { VersionsPanel } from "@/app/components/panels/VersionsPanel";
import { Toast, useToast } from "@/app/components/ui/Toast";
import { BladeType } from "@/app/lib/bladeDefinitions";

type Tab = "library" | "structure" | "edit" | "versions";
type Viewport = "desktop" | "tablet" | "mobile";

interface Props {
  userId:       string;
  onSwitch:     () => void;
  onOpenSetup:  () => void;
}

export default function PageBuilder({ userId, onSwitch, onOpenSetup }: Props) {
  const pb = usePageBuilder(userId);
  const { toast, showToast } = useToast();
  const [tab, setTab]           = useState<Tab>("library");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const previewRef = useRef<HTMLDivElement>(null);

  const handleAddBlade = (type: BladeType) => {
    const err = pb.addBlade(type);
    if (!err) setTab("structure");
    return err;
  };

  const handleSelectBlade = (idx: number) => {
    pb.setActiveIdx(idx);
    setTab("edit");
  };

  const exportPNG = async () => {
    if (!pb.blades.length) { showToast("Add some blades first", "warn"); return; }
    showToast("Generating PNG…");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = previewRef.current;
      if (!canvas) return;
      const c = await html2canvas(canvas, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const link = document.createElement("a");
      link.download = (pb.pageTitle || "page").replace(/[^a-z0-9_-]/gi, "-").toLowerCase() + ".png";
      link.href = c.toDataURL("image/png");
      link.click();
      showToast("PNG downloaded");
    } catch {
      showToast("PNG export failed", "error");
    }
  };

  const exportPDF = () => {
    if (!pb.blades.length) { showToast("Add some blades first", "warn"); return; }
    window.print();
  };

  const copyHandoff = async () => {
    const json = pb.getHandoffJSON();
    try {
      await navigator.clipboard.writeText(json);
      showToast("Handoff JSON copied to clipboard");
    } catch {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "blade-handoff.json"; a.click();
      URL.revokeObjectURL(url);
      showToast("Handoff JSON downloaded");
    }
  };

  const vpClass = viewport === "tablet" ? "vp-tablet" : viewport === "mobile" ? "vp-mobile" : "";

  return (
    <div className="app-shell">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">
            <div className="logo-mark">W2</div>
            <span className="logo-text">Blade Builder</span>
            <span className="logo-tag">PMM</span>
          </div>
        </div>
        <div className="topbar-center">
          <input
            className="page-title-input"
            value={pb.pageTitle}
            onChange={(e) => pb.setPageTitle(e.target.value)}
            placeholder="Page title…"
          />
        </div>
        <div className="topbar-right">
          <button className="btn btn-ghost user-switcher" onClick={onSwitch} title="Switch user">
            <div className="topbar-avatar">{userId[0].toUpperCase()}</div>
            {userId}
          </button>
          <button className="btn btn-ghost sheets-btn" onClick={onOpenSetup} title="Sheets settings">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
          </button>
          <div className="export-group">
            <button className="btn btn-secondary" onClick={exportPNG}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9l4-4 4 4 4-6 4 4"/></svg>
              PNG
            </button>
            <button className="btn btn-secondary" onClick={exportPDF}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              PDF
            </button>
            <button className="btn btn-primary" onClick={copyHandoff}>Copy handoff ↗</button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="main-layout">
        {/* LEFT PANEL */}
        <aside className="left-panel">
          <div className="panel-tabs">
            {(["library", "structure", "edit", "versions"] as Tab[]).map((t) => (
              <button key={t} className={`panel-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="panel-body">
            {tab === "library"   && <LibraryPanel onAdd={handleAddBlade} onToast={showToast} />}
            {tab === "structure" && <StructurePanel blades={pb.blades} activeIdx={pb.activeIdx} onSelect={handleSelectBlade} onMove={pb.moveBlade} onRemove={pb.removeBlade} onAddClick={() => setTab("library")} />}
            {tab === "edit"      && <EditPanel blade={pb.activeIdx !== null ? pb.blades[pb.activeIdx] : null} idx={pb.activeIdx} total={pb.blades.length} onUpdate={pb.updateField} onMove={pb.moveBlade} onRemove={pb.removeBlade} />}
            {tab === "versions"  && <VersionsPanel versions={pb.versions} revisions={pb.revisions} onSaveVersion={pb.saveVersion} onLoadSnapshot={pb.loadSnapshot} onDeleteVersion={pb.deleteVersion} onToast={showToast} />}
          </div>
        </aside>

        {/* PREVIEW */}
        <main className="preview-area">
          <div className="preview-toolbar">
            <span className="preview-label">Live preview — wso2.com style</span>
            <div className="viewport-toggle">
              {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
                <button key={v} className={`vp-btn${viewport === v ? " active" : ""}`} onClick={() => setViewport(v)} title={v}>
                  {v === "desktop" && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>}
                  {v === "tablet"  && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>}
                  {v === "mobile"  && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>}
                </button>
              ))}
            </div>
          </div>

          <div className="preview-scroll">
            <div className={`preview-frame ${vpClass}`}>
              {pb.blades.length === 0 ? (
                <div className="preview-empty">
                  <div className="empty-icon">⬡</div>
                  <div className="empty-title">Your page is empty</div>
                  <div className="empty-sub">Add blades from the WSO2 library to start building your platform page.</div>
                  <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setTab("library")}>Browse blade library</button>
                </div>
              ) : (
                <div ref={previewRef}>
                  {pb.blades.map((blade, i) => (
                    <div key={blade.id} className={`preview-blade${pb.activeIdx === i ? " active" : ""}`} onClick={() => handleSelectBlade(i)}>
                      <div className="blade-overlay">
                        <span>{blade.label}</span>
                        <span className="overlay-edit">Click to edit</span>
                      </div>
                      <BladePreview blade={blade} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
