// lib/usePageBuilder.ts — central state for the page builder
"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { BLADE_DEFS, PageBlade, BladeType } from "./bladeDefinitions";
import { storageGet, storageSet } from "./sheetsStorage";

function uid() {
  return Math.random().toString(36).slice(2, 8);
}

const MAX_REVISIONS = 25;

export interface Snapshot {
  id: string;
  name: string;
  savedAt: string;
  pageTitle: string;
  blades: PageBlade[];
}

export function usePageBuilder(userId: string) {
  const versionsKey  = `blade-builder-${userId}-versions`;
  const revisionsKey = `blade-builder-${userId}-revisions`;
  const draftKey     = `blade-builder-${userId}-draft`;

  const [pageTitle, setPageTitle] = useState("Untitled Page");
  const [blades, setBlades]       = useState<PageBlade[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [versions, setVersions]   = useState<Snapshot[]>([]);
  const [revisions, setRevisions] = useState<Snapshot[]>([]);

  // Load user-specific data on mount / user switch — seed from localStorage
  // immediately so UI is instant, then let Sheets override
  useEffect(() => {
    setBlades([]);
    setPageTitle("Untitled Page");
    setActiveIdx(null);
    setVersions([]);
    setRevisions([]);
    isFirstStructure.current = true;
    prevBladeIds.current = "";

    Promise.all([
      storageGet<{ pageTitle?: string; blades?: PageBlade[] } | null>(draftKey, null),
      storageGet<Snapshot[]>(versionsKey, []),
      storageGet<Snapshot[]>(revisionsKey, []),
    ]).then(([draft, vers, revs]) => {
      setBlades(draft?.blades ?? []);
      setPageTitle(draft?.pageTitle ?? "Untitled Page");
      setVersions(vers);
      setRevisions(revs);
      isFirstStructure.current = true;
      prevBladeIds.current = (draft?.blades ?? []).map((b: PageBlade) => b.id).join(",");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Auto-save draft on every change
  const pageTitleRef = useRef(pageTitle);
  pageTitleRef.current = pageTitle;

  useEffect(() => {
    storageSet(draftKey, { pageTitle, blades, savedAt: new Date().toISOString() });
  }, [pageTitle, blades, draftKey]);

  // Track structural changes for auto-revisions
  const isFirstStructure = useRef(true);
  const prevBladeIds     = useRef<string>("");

  useEffect(() => {
    const currentIds = blades.map(b => b.id).join(",");

    if (isFirstStructure.current) {
      isFirstStructure.current = false;
      prevBladeIds.current = currentIds;
      return;
    }
    if (currentIds === prevBladeIds.current) return;

    const prevArr = prevBladeIds.current.split(",").filter(Boolean);
    const currArr = blades.map(b => b.id);
    let desc = "Reordered blades";
    if (currArr.length > prevArr.length) {
      const added = blades.find(b => !prevArr.includes(b.id));
      desc = added ? `Added "${added.label}"` : "Added blade";
    } else if (currArr.length < prevArr.length) {
      desc = "Removed blade";
    }
    prevBladeIds.current = currentIds;

    const rev: Snapshot = {
      id: uid(),
      name: desc,
      savedAt: new Date().toISOString(),
      pageTitle: pageTitleRef.current,
      blades: JSON.parse(JSON.stringify(blades)),
    };

    setRevisions(prev => {
      const updated = [rev, ...prev].slice(0, MAX_REVISIONS);
      storageSet(revisionsKey, updated);
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blades]);

  const addBlade = useCallback((type: BladeType) => {
    const def = BLADE_DEFS[type];
    const existing = blades.filter((b) => b.type === type).length;
    if (def.maxInstances && existing >= def.maxInstances) {
      return `"${def.label}" can only be added ${def.maxInstances} time(s) per page`;
    }
    setBlades(prev => [
      ...prev,
      { id: uid(), type, label: def.label, data: { ...def.defaults } },
    ]);
    return null;
  }, [blades]);

  const removeBlade = useCallback((idx: number) => {
    setActiveIdx(prev => {
      if (prev === null) return null;
      if (prev === idx)  return null;
      if (prev > idx)    return prev - 1;
      return prev;
    });
    setBlades(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const moveBlade = useCallback((idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    setBlades(prev => {
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
    setActiveIdx(prev => prev === idx ? idx + dir : prev);
  }, []);

  const updateField = useCallback((idx: number, key: string, value: string) => {
    setBlades(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], data: { ...next[idx].data, [key]: value } };
      return next;
    });
  }, []);

  // ── Versions ──────────────────────────────────────────────────

  const saveVersion = useCallback((name: string) => {
    const v: Snapshot = {
      id: uid(),
      name,
      savedAt: new Date().toISOString(),
      pageTitle,
      blades: JSON.parse(JSON.stringify(blades)),
    };
    setVersions(prev => {
      const updated = [v, ...prev];
      storageSet(versionsKey, updated);
      return updated;
    });
  }, [pageTitle, blades, versionsKey]);

  const loadSnapshot = useCallback((snap: Snapshot) => {
    setBlades(JSON.parse(JSON.stringify(snap.blades)));
    setPageTitle(snap.pageTitle);
    setActiveIdx(null);
  }, []);

  const deleteVersion = useCallback((id: string) => {
    setVersions(prev => {
      const updated = prev.filter(v => v.id !== id);
      storageSet(versionsKey, updated);
      return updated;
    });
  }, [versionsKey]);

  const getHandoffJSON = useCallback(() => {
    return JSON.stringify(
      {
        pageTitle,
        exportedAt: new Date().toISOString(),
        blades: blades.map(b => ({ type: b.type, label: b.label, content: b.data })),
      },
      null,
      2
    );
  }, [pageTitle, blades]);

  return {
    pageTitle, setPageTitle,
    blades,
    activeIdx, setActiveIdx,
    addBlade, removeBlade, moveBlade, updateField,
    getHandoffJSON,
    versions, revisions,
    saveVersion, loadSnapshot, deleteVersion,
  };
}
