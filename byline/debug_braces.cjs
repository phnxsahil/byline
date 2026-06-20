const fs = require("fs");
const c = fs.readFileSync(
  "src/app/components/dispatch/dashboard/AgentRail.tsx",
  "utf-8"
);

let depth = 0;
let maxDepth = 0;
let inString = false;
let stringChar = "";
let inTemplate = false;
let maxDepthPos = -1;

for (let i = 0; i < c.length; i++) {
  const ch = c[i];

  if (!inString && !inTemplate) {
    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === "`") {
      inTemplate = true;
      continue;
    }
  } else if (inString) {
    if (ch === "\\" && i + 1 < c.length) {
      i++;
      continue;
    }
    if (ch === stringChar) {
      inString = false;
    }
    continue;
  } else if (inTemplate) {
    if (ch === "`") {
      inTemplate = false;
    }
    if (ch === "$" && i + 1 < c.length && c[i + 1] === "{") {
      depth++;
      i++;
    }
    continue;
  }

  if (ch === "/" && i + 1 < c.length) {
    if (c[i + 1] === "/") {
      while (i < c.length && c[i] !== "\n") i++;
      continue;
    }
    if (c[i + 1] === "*") {
      i += 2;
      while (i < c.length && !(c[i] === "*" && c[i + 1] === "/")) i++;
      i++;
      continue;
    }
  }

  if (ch === "{") {
    depth++;
    if (depth > maxDepth) {
      maxDepth = depth;
      maxDepthPos = i;
    }
  } else if (ch === "}") {
    depth--;
    if (depth < 0) {
      console.log(
        "NEGATIVE at",
        i,
        "ctx:",
        c.substring(Math.max(0, i - 20), i + 5)
      );
    }
  }
}

console.log("Final depth:", depth);
console.log("Max depth:", maxDepth, "at", maxDepthPos);
if (maxDepthPos >= 0) {
  console.log(
    "Ctx:",
    c.substring(maxDepthPos, Math.min(c.length, maxDepthPos + 40))
  );
}
