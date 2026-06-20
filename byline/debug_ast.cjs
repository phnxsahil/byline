const fs = require("fs");
const ts = require("typescript");

const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

// Try to find the exact issue by tokenizing
const sf = ts.createSourceFile("test.tsx", c, ts.ScriptTarget.Latest, true);

// Show all parse diagnostics with context
for (const d of sf.parseDiagnostics) {
  const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  const pos = d.start;
  const lineChar = sf.getLineAndCharacterOfPosition(pos);
  const context =
    c.substring(Math.max(0, pos - 80), Math.min(c.length, pos + 80));
  console.log("=== Parse Error ===");
  console.log("Position:", pos);
  console.log("Line:", lineChar.line, "Col:", lineChar.character);
  console.log("Message:", msg);
  console.log("Context:", JSON.stringify(context));
  console.log();
}

// Now let's get a more detailed AST
// Try using the binder to check for scope issues
console.log("=== AST Structure ===");
function printNode(node, indent = "") {
  if (!node) return;
  const kind = ts.SyntaxKind[node.kind] || "Unknown";
  const pos = node.pos;
  const end = node.end;
  const len = end - pos;
  if (len > 0) {
    const text = c.substring(pos, Math.min(pos + 50, end)).replace(/\n/g, "\\n");
    if (len > 100) {
      console.log(
        indent + kind + " [" + pos + "-" + end + "] len=" + len + ": " + text + "..."
      );
    } else {
      console.log(indent + kind + " [" + pos + "-" + end + "]: " + text);
    }
  }
  ts.forEachChild(node, (child) => printNode(child, indent + "  "));
}

// Only print top 2 levels
const topStatements = sf.statements;
for (const stmt of topStatements) {
  printNode(stmt, "");
}
