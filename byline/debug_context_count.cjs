const fs = require("fs");
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

// Context-aware brace counting (ignoring strings and comments)
let depth = 0;
let inSingle = false;
let inDouble = false;
let inTemplate = false;
let inLineComment = false;
let inBlockComment = false;

for (let i = 0; i < c.length; i++) {
  const ch = c[i];
  const next = i + 1 < c.length ? c[i + 1] : "";

  // Handle strings
  if (inSingle) {
    if (ch === "\\") { i++; continue; }
    if (ch === "'") inSingle = false;
    continue;
  }
  if (inDouble) {
    if (ch === "\\") { i++; continue; }
    if (ch === '"') inDouble = false;
    continue;
  }
  if (inTemplate) {
    if (ch === "\\") { i++; continue; }
    if (ch === "`") inTemplate = false;
    if (ch === "$" && next === "{") {
      depth++; // template expression
      i++;
    }
    continue;
  }

  // Handle comments
  if (ch === "/" && next === "/") {
    inLineComment = true;
    i++;
    continue;
  }
  if (inLineComment) {
    if (ch === "\n") inLineComment = false;
    continue;
  }
  if (ch === "/" && next === "*") {
    inBlockComment = true;
    i++;
    continue;
  }
  if (inBlockComment) {
    if (ch === "*" && next === "/") { inBlockComment = false; i++; }
    continue;
  }

  // Start strings
  if (ch === "'") { inSingle = true; continue; }
  if (ch === '"') { inDouble = true; continue; }
  if (ch === "`") { inTemplate = true; continue; }

  // Track braces
  if (ch === "{") {
    depth++;
  } else if (ch === "}") {
    depth--;
    if (depth < 0) {
      console.log("NEGATIVE DEPTH at pos", i, "ctx:", JSON.stringify(c.substring(Math.max(0, i - 20), i + 5)));
    }
  }
}

console.log("Final context-aware depth:", depth);

// Now do simple brace char count for reference
let simpleDepth = 0;
let minDepth = 0;
for (let i = 0; i < c.length; i++) {
  if (c[i] === "{") simpleDepth++;
  else if (c[i] === "}") simpleDepth--;
  if (simpleDepth < minDepth) minDepth = simpleDepth;
}
console.log("Simple char count depth:", simpleDepth);
console.log("Min depth reached:", minDepth);
