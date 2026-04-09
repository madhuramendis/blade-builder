"use client";
import { useState } from "react";
import { saveScriptUrl, testScriptUrl, clearScriptUrl } from "@/app/lib/sheetsStorage";

const APPS_SCRIPT = `// ═══════════════════════════════════════════════════════
// WSO2 Blade Builder — Google Apps Script
// Paste this into: Extensions > Apps Script > Code.gs
// Then: Deploy > New Deployment > Web App
//   Execute as: Me
//   Who has access: Anyone
// Copy the Web App URL and paste it into Blade Builder.
// ═══════════════════════════════════════════════════════

const SHEET_NAME = "BladeBuilderData";

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Key", "Value", "UpdatedAt"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow(sheet, key) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) return i + 1; // 1-indexed
  }
  return -1;
}

function doGet(e) {
  const key = e.parameter.key;
  if (key === "__ping__") {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = getSheet();
  const row = findRow(sheet, key);
  const value = row > 0 ? sheet.getRange(row, 2).getValue() : null;
  return ContentService
    .createTextOutput(JSON.stringify({ value }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, key, value } = body;
    const sheet = getSheet();
    const row = findRow(sheet, key);

    if (action === "set") {
      if (row > 0) {
        sheet.getRange(row, 2).setValue(value);
        sheet.getRange(row, 3).setValue(new Date().toISOString());
      } else {
        sheet.appendRow([key, value, new Date().toISOString()]);
      }
    } else if (action === "delete" && row > 0) {
      sheet.deleteRow(row);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface Props {
  onDone:      () => void;
  existingUrl: string | null;
}

export function SetupScreen({ onDone, existingUrl }: Props) {
  const [url, setUrl]         = useState(existingUrl ?? "");
  const [status, setStatus]   = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [errMsg, setErrMsg]   = useState("");
  const [copied, setCopied]   = useState(false);

  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = APPS_SCRIPT;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTest = async () => {
    if (!url.trim()) return;
    setStatus("testing");
    setErrMsg("");
    const err = await testScriptUrl(url.trim());
    if (err) {
      setStatus("error");
      setErrMsg(err);
    } else {
      setStatus("ok");
      saveScriptUrl(url.trim());
    }
  };

  const handleSkip = () => {
    clearScriptUrl();
    onDone();
  };

  const handleContinue = () => {
    saveScriptUrl(url.trim());
    onDone();
  };

  return (
    <div className="user-gate-overlay">
      <div className="setup-card">

        <div className="user-gate-logo">
          <span className="logo-text">Blade Builder</span>
          <span className="logo-tag">PMM</span>
        </div>

        <h2 className="user-gate-title">Connect Google Sheets</h2>
        <p className="user-gate-sub">
          Saves all users, pages, versions and revisions to a shared Google Sheet — accessible from any device.
        </p>

        {/* Step 1 */}
        <div className="setup-step">
          <div className="setup-step-num">1</div>
          <div className="setup-step-body">
            <div className="setup-step-title">Open your Google Sheet</div>
            <p className="setup-step-desc">
              Create a new Google Sheet (or use an existing one), then go to{" "}
              <strong>Extensions → Apps Script</strong>.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="setup-step">
          <div className="setup-step-num">2</div>
          <div className="setup-step-body">
            <div className="setup-step-title">Paste the script</div>
            <p className="setup-step-desc">
              Replace everything in <code>Code.gs</code> with the script below, then save.
            </p>
            <button className="btn btn-secondary btn-sm setup-copy-btn" onClick={copyScript}>
              {copied ? "✓ Copied!" : "Copy Apps Script"}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="setup-step">
          <div className="setup-step-num">3</div>
          <div className="setup-step-body">
            <div className="setup-step-title">Deploy as a Web App</div>
            <p className="setup-step-desc">
              Click <strong>Deploy → New deployment</strong>. Set type to <em>Web App</em>,
              execute as <em>Me</em>, access to <em>Anyone</em>. Authorise and copy the Web App URL.
            </p>
          </div>
        </div>

        {/* Step 4 — URL input */}
        <div className="setup-step">
          <div className="setup-step-num">4</div>
          <div className="setup-step-body">
            <div className="setup-step-title">Paste the Web App URL here</div>
            <div className="setup-url-row">
              <input
                className="field-input"
                placeholder="https://script.google.com/macros/s/…/exec"
                value={url}
                onChange={e => { setUrl(e.target.value); setStatus("idle"); }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleTest}
                disabled={!url.trim() || status === "testing"}
              >
                {status === "testing" ? "Testing…" : "Test"}
              </button>
            </div>
            {status === "ok"    && <div className="setup-ok">✓ Connected — Sheets is working</div>}
            {status === "error" && <div className="setup-err">✗ {errMsg}</div>}
          </div>
        </div>

        <div className="setup-actions">
          <button className="btn btn-ghost-dark" onClick={handleSkip}>
            Skip — use local storage only
          </button>
          <button
            className="btn btn-primary"
            disabled={!url.trim()}
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
}
