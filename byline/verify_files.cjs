const fs = require("fs");
const ts = require("typescript");

for (const file of [
  "AgentRail.tsx",
  "ActivityTab.tsx",
  "ChatPanel.tsx",
  "DashboardLayout.tsx",
  "DeskTab.tsx",
  "DocsTab.tsx",
  "LeftPanel.tsx",
  "OverviewTab.tsx",
  "RunLogPanel.tsx",
  "SettingsTab.tsx",
  "SetupChecklist.tsx",
  "SignalTab.tsx",
  "StatusBar.tsx",
  "TopBar.tsx",
]) {
  const c = fs.readFileSync(
    "src/app/components/dispatch/dashboard/" + file,
    "utf-8"
  );
  const sf = ts.createSourceFile(file, c, ts.ScriptTarget.Latest, true);
  const errors = sf.parseDiagnostics;
  if (errors.length > 0) {
    console.log(file + ": " + errors.length + " parse error(s)");
    for (const e of errors) {
      const msg = ts.flattenDiagnosticMessageText(e.messageText, "\n");
      const ctx = c.substring(
        Math.max(0, e.start - 30),
        Math.min(c.length, e.start + 30)
      );
      console.log("  ", msg, "at", e.start, "ctx:", JSON.stringify(ctx));
    }
  } else {
    console.log(file + ": OK");
  }
}
