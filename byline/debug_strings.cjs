const fs = require("fs");
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

// Find all strings and check for braces inside them
let inStr = false;
let strChar = "";
let inTmpl = false;
let strStart = -1;
let strContent = "";

console.log("=== Strings containing braces ===");
for (let i = 0; i < c.length; i++) {
  const ch = c[i];
  const next = i + 1 < c.length ? c[i + 1] : "";

  if (inStr) {
    strContent += ch;
    if (ch === "\\") { i++; if (i < c.length) strContent += c[i]; continue; }
    if (ch === strChar) {
      // End of string
      if (strContent.includes("{") || strContent.includes("}")) {
        console.log(
          "String at",
          strStart,
          "-",
          i,
          "type:",
          strChar,
          "content:",
          JSON.stringify(strContent.substring(0, 100))
        );
      }
      inStr = false;
      strContent = "";
    }
    continue;
  }

  if (inTmpl) {
    if (ch === "\\") { i++; continue; }
    if (ch === "`") { inTmpl = false; continue; }
    if (ch === "$" && next === "{") {
      // Template expression - skip past the ${...}
      // Just continue normally
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

  if (ch === "'") { inStr = true; strChar = "'"; strStart = i; strContent = ""; continue; }
  if (ch === '"') { inStr = true; strChar = '"'; strStart = i; strContent = ""; continue; }
  if (ch === "`") { inTmpl = true; continue; }
}

console.log("\n=== Last 200 chars for reference ===");
console.log(JSON.stringify(c.substring(c.length - 200)));
console.log("\n=== Full simple brace trace from last 200 ===");
const tail = c.substring(c.length - 200);
let d = 0;
for (let i = 0; i < tail.length; i++) {
  if (tail[i] === "{") d++;
  if (tail[i] === "}") d--;
  if (tail[i] === "{" || tail[i] === "}") {
    const filePos = c.length - 200 + i;
    console.log("  pos", filePos, "char:", tail[i], "depth:", d, "ctx:", JSON.stringify(c.substring(Math.max(0, filePos - 10), filePos + 5)));
  }
}
console.log("Final tail depth:", d);
