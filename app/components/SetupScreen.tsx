"use client";
import { useState } from "react";
import {
  Box, Typography, TextField, Button, Alert, Chip,
  Stepper, Step, StepLabel, StepContent, Divider,
} from "@wso2/oxygen-ui";
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
    if (data[i][0] === key) return i + 1;
  }
  return -1;
}

function doGet(e) {
  const key = e.parameter.key;
  if (key === "__ping__") {
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = getSheet();
  const row = findRow(sheet, key);
  const value = row > 0 ? sheet.getRange(row, 2).getValue() : null;
  return ContentService.createTextOutput(JSON.stringify({ value })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, key, value } = body;
    const sheet = getSheet();
    const row = findRow(sheet, key);
    if (action === "set") {
      if (row > 0) { sheet.getRange(row, 2).setValue(value); sheet.getRange(row, 3).setValue(new Date().toISOString()); }
      else { sheet.appendRow([key, value, new Date().toISOString()]); }
    } else if (action === "delete" && row > 0) {
      sheet.deleteRow(row);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface Props {
  existingUrl: string | null;
  onDone:      () => void;
}

export function SetupScreen({ existingUrl, onDone }: Props) {
  const [url, setUrl]       = useState(existingUrl ?? "");
  const [status, setStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const copyScript = async () => {
    try { await navigator.clipboard.writeText(APPS_SCRIPT); }
    catch { const el = Object.assign(document.createElement("textarea"), { value: APPS_SCRIPT }); document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTest = async () => {
    if (!url.trim()) return;
    setStatus("testing");
    const err = await testScriptUrl(url.trim());
    if (err) { setStatus("error"); setErrMsg(err); }
    else { setStatus("ok"); saveScriptUrl(url.trim()); }
  };

  const steps = [
    {
      label: "Open your Google Sheet",
      content: <>Open a Google Sheet (or create a new one), then go to <strong>Extensions → Apps Script</strong>.</>,
    },
    {
      label: "Paste the script",
      content: (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>Replace everything in <code>Code.gs</code> with the script below, then save.</Typography>
          <Button variant="outlined" size="small" onClick={copyScript} fullWidth>
            {copied ? "✓ Copied!" : "Copy Apps Script"}
          </Button>
        </>
      ),
    },
    {
      label: "Deploy as Web App",
      content: <>Click <strong>Deploy → New deployment</strong>. Type: <em>Web App</em>. Execute as: <em>Me</em>. Access: <em>Anyone</em>. Authorise and copy the URL.</>,
    },
    {
      label: "Paste the Web App URL",
      content: (
        <>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="https://script.google.com/macros/s/…/exec"
              value={url}
              onChange={e => { setUrl(e.target.value); setStatus("idle"); }}
            />
            <Button variant="contained" size="small" disabled={!url.trim() || status === "testing"} onClick={handleTest}
              sx={{ whiteSpace: "nowrap" }}>
              {status === "testing" ? "Testing…" : "Test"}
            </Button>
          </Box>
          {status === "ok"    && <Alert severity="success" sx={{ mt: 1 }}>Connected — Sheets is working</Alert>}
          {status === "error" && <Alert severity="error" sx={{ mt: 1 }}>{errMsg}</Alert>}
        </>
      ),
    },
  ];

  return (
    <Box sx={{
      position: "fixed", inset: 0, bgcolor: "#1a1f36",
      display: "flex", alignItems: "center", justifyContent: "center",
      p: 3, overflowY: "auto",
    }}>
      <Box sx={{ bgcolor: "background.paper", borderRadius: 3, p: 5, width: "100%", maxWidth: 520, boxShadow: 24 }}>
        <Typography variant="h5" fontWeight={800} color="#1a1f36" gutterBottom>
          Connect Google Sheets
          <Chip label="PMM" size="small" sx={{ ml: 1, fontSize: 10, height: 20, bgcolor: "#f0f2f5", color: "#6b7a99" }} />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Save all users, pages, versions and revisions to a shared Google Sheet — accessible from any device.
        </Typography>

        <Stepper orientation="vertical">
          {steps.map(s => (
            <Step key={s.label} active>
              <StepLabel>{s.label}</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary" component="div">{s.content}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="text" color="inherit" onClick={() => { clearScriptUrl(); onDone(); }} sx={{ color: "text.secondary" }}>
            Skip — use local storage only
          </Button>
          <Button variant="contained" disabled={!url.trim()} onClick={() => { saveScriptUrl(url.trim()); onDone(); }}
            sx={{ bgcolor: "#ff7300", "&:hover": { bgcolor: "#e56500" } }}>
            Continue →
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
