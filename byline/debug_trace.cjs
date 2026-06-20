const fs = require("fs");
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

let depth = 0;
let inStr = false;
let strChar = "";
let inTmpl = false;
let lastDepth1Pos = -1;
let lastDepthChar = "";

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
    if (ch === "$" && next === "{") {
      depth++;
      i++;
    }
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
    if (depth === 1) {
      lastDepth1Pos = i;
      lastDepthChar = "{";
    }
  } else if (ch === "}") {
    if (depth === 1) {
      lastDepth1Pos = i;
      lastDepthChar = "}";
    }
    depth--;
  }
}

console.log("Final depth:", depth);
console.log("Last depth=1 at:", lastDepth1Pos, "char:", lastDepthChar);
if (lastDepth1Pos >= 0) {
  console.log(
    "Context:",
    JSON.stringify(
      c.substring(
        Math.max(0, lastDepth1Pos - 40),
        Math.min(c.length, lastDepth1Pos + 40)
      )
    )
  );
}

// Now find the unclosed { by tracking when depth stays > 0
console.log("\n--- Tracing unclosed brace ---");
let d = 0;
let lastOpenPos = -1;
for (let i = 0; i < c.length; i++) {
  if (c[i] === "{") { d++; if (d === 1) lastOpenPos = i; }
  else if (c[i] === "}") { d--; if (d === 0) lastOpenPos = -1; }
}
console.log("After loop, d=", d, "lastOpenPos=", lastOpenPos);
if (lastOpenPos >= 0) {
  console.log(
    "Unclosed { at:",
    JSON.stringify(
      c.substring(
        Math.max(0, lastOpenPos - 20),
        Math.min(c.length, lastOpenPos + 50)
      )
    )
  );
}
