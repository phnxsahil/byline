const fs = require("fs");
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

// Full trace with context awareness
let depth = 0;
let inStr = false;
let strChar = "";
let inTmpl = false;
let logChanges = [];

for (let i = 0; i < c.length; i++) {
  const ch = c[i];
  const next = i + 1 < c.length ? c[i + 1] : "";

  if (inStr) {
    if (ch === "\\") { i++; continue; }
    if (ch === strChar) inStr = false;
    continue;
  }
  if (inTmpl) {
    if (ch === "\\") { i++; continue; }
    if (ch === "`") inTmpl = false;
    if (ch === "$" && next === "{") { depth++; i++; }
    continue;
  }
  if (ch === "/" && next === "/") {
    while (i < c.length && c[i] !== "\n") i++;
    continue;
  }
  if (ch === "/" && next === "*") {
    i += 2;
    while (i < c.length && !(c[i] === "*" && c[i + 1] === "/")) i++;
    i++;
    continue;
  }

  if (ch === "'") { inStr = true; strChar = "'"; continue; }
  if (ch === '"') { inStr = true; strChar = '"'; continue; }
  if (ch === "`") { inTmpl = true; continue; }

  if (ch === "{") {
    depth++;
    if (depth >= 1) {
      logChanges.push({
        pos: i,
        prevDepth: depth - 1,
        newDepth: depth,
        context: c.substring(Math.max(0, i - 10), i + 50),
      });
    }
  } else if (ch === "}") {
    if (depth === 1) {
      // This would close the function body
    }
    depth--;
    if (depth < 0) {
      logChanges.push({
        pos: i,
        prevDepth: depth + 1,
        newDepth: depth,
        context: "*** NEGATIVE *** " + c.substring(Math.max(0, i - 10), i + 20),
      });
    }
  }
}

// Find the LAST time depth went from 2 -> 1 (or higher)
// Actually, find when depth last went above 1 and never went back to 1
const transitionToAbove1 = logChanges.filter((l) => l.newDepth >= 2);
console.log("Transitions to depth >= 2:", transitionToAbove1.length);
if (transitionToAbove1.length > 0) {
  const lastTransition = transitionToAbove1[transitionToAbove1.length - 1];
  console.log("Last transition:");
  console.log("  pos:", lastTransition.pos);
  console.log("  prevDepth:", lastTransition.prevDepth);
  console.log("  newDepth:", lastTransition.newDepth);
  // Filter transitions AFTER this point
  const after = logChanges.filter((l) => l.pos > lastTransition.pos);
  const closes2to1 = after.filter((l) => l.prevDepth >= 2 && l.newDepth <= 1);
  console.log("  Subsequent transitions back to <=1:", closes2to1.length);
  if (closes2to1.length === 0) {
    console.log("  *** THIS IS THE UNCLOSED BRACE!");
    console.log("  Context:", lastTransition.context);
  }
}

// Also print the last few transitions
console.log("\nLast 20 transitions:");
for (const t of logChanges.slice(-20)) {
  console.log(
    "  pos",
    t.pos,
    "depth",
    t.prevDepth,
    "->",
    t.newDepth,
    ":",
    t.context.substring(0, 80)
  );
}
