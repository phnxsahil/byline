const fs = require("fs");
const ts = require("typescript");

// Test: what happens if we add closing braces at the end?
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

// Try adding various numbers of closing braces
for (let extra = 0; extra <= 5; extra++) {
  const testContent = c + "}".repeat(extra);
  const sf = ts.createSourceFile("test.tsx", testContent, ts.ScriptTarget.Latest, true);
  const errCount = sf.parseDiagnostics.length;
  console.log("Extra " + extra + " }: parse errors = " + errCount);
  // Check if function body extends properly
  const func = sf.statements.find(
    (s) => ts.isFunctionDeclaration(s) || ts.isFunctionExpression(s)
  );
  if (func) {
    console.log(
      "  Function body end:",
      func.body ? func.body.end : "no body",
      "of",
      testContent.length
    );
  }
}
