// lib/sheetsStorage.ts
// Dual-layer storage: localStorage (instant) + Google Sheets (persistent/shared).
// Reads prefer Sheets; writes go to localStorage immediately then sync to Sheets.

const SCRIPT_URL_KEY = "blade-builder-script-url";

export function getScriptUrl(): string | null {
  try { return localStorage.getItem(SCRIPT_URL_KEY); } catch { return null; }
}

export function saveScriptUrl(url: string) {
  localStorage.setItem(SCRIPT_URL_KEY, url.trim());
}

export function clearScriptUrl() {
  localStorage.removeItem(SCRIPT_URL_KEY);
}

// ── Helpers ────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function lsRemove(key: string) {
  try { localStorage.removeItem(key); } catch {}
}

// POST to Apps Script — uses plain string body to avoid CORS preflight
async function scriptPost(action: string, key: string, value?: string): Promise<boolean> {
  const url = getScriptUrl();
  if (!url) return false;
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ action, key, value }),
    });
    return true;
  } catch { return false; }
}

// GET from Apps Script
async function scriptGet(key: string): Promise<string | null> {
  const url = getScriptUrl();
  if (!url) return null;
  try {
    const res = await fetch(`${url}?key=${encodeURIComponent(key)}`);
    const data = await res.json() as { value?: string };
    return data.value ?? null;
  } catch { return null; }
}

// ── Public API ─────────────────────────────────────────────────

// Read: checks Sheets first, falls back to localStorage cache
export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  const raw = await scriptGet(key);
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw) as T;
      lsSet(key, parsed); // keep local cache fresh
      return parsed;
    } catch {}
  }
  return lsGet<T>(key, fallback);
}

// Write: localStorage immediately, Sheets async
export function storageSet(key: string, value: unknown): void {
  lsSet(key, value);
  scriptPost("set", key, JSON.stringify(value)); // fire-and-forget
}

// Delete: localStorage immediately, Sheets async
export function storageRemove(key: string): void {
  lsRemove(key);
  scriptPost("delete", key); // fire-and-forget
}

// Verify the script URL works — used on setup screen
export async function testScriptUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(`${url}?key=__ping__`);
    if (!res.ok) return `HTTP ${res.status}`;
    await res.json();
    return null; // null = success
  } catch (e) {
    return e instanceof Error ? e.message : "Network error";
  }
}
