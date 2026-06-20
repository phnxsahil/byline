const fs = require("fs");
const path = require("path");

const basedir = "src/app/components/dispatch/dashboard";

// Step 1: Strip ALL comments (// and /* */) from all TSX files
const files = fs.readdirSync(basedir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const fpath = path.join(basedir, file);
  let c = fs.readFileSync(fpath, "utf-8");
  let result = "";
  let i = 0;

  while (i < c.length) {
    const ch = c[i];
    const next = i + 1 < c.length ? c[i + 1] : "";

    // Skip strings
    if (ch === '"') {
      result += ch; i++;
      while (i < c.length && c[i] !== '"') {
        if (c[i] === "\\") { result += c[i]; i++; if (i < c.length) { result += c[i]; i++; } }
        else { result += c[i]; i++; }
      }
      if (i < c.length) { result += '"'; i++; }
      continue;
    }

    if (ch === "'") {
      result += ch; i++;
      while (i < c.length && c[i] !== "'") {
        if (c[i] === "\\") { result += c[i]; i++; if (i < c.length) { result += c[i]; i++; } }
        else { result += c[i]; i++; }
      }
      if (i < c.length) { result += "'"; i++; }
      continue;
    }

    if (ch === "`") {
      result += ch; i++;
      let depth = 0;
      while (i < c.length) {
        if (c[i] === "\\") { result += c[i]; i++; if (i < c.length) { result += c[i]; i++; } }
        else if (c[i] === "$" && i + 1 < c.length && c[i + 1] === "{") { result += "${"; i += 2; depth++; }
        else if (c[i] === "}" && depth > 0) { result += "}"; i++; depth--; }
        else if (c[i] === "`" && depth === 0) { result += "`"; i++; break; }
        else { result += c[i]; i++; }
      }
      continue;
    }

    // Skip // line comments
    if (ch === "/" && next === "/") {
      i += 2;
      while (i < c.length && c[i] !== "\n") i++;
      // Replace with nothing (strip the comment)
      continue;
    }

    // Skip /* */ block comments
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < c.length && !(c[i] === "*" && i + 1 < c.length && c[i + 1] === "/")) i++;
      if (i < c.length) i += 2;
      // Replace with nothing (strip the comment)
      continue;
    }

    result += ch;
    i++;
  }

  fs.writeFileSync(fpath, result, "utf-8");
  console.log("Stripped comments:", file, result.length, "chars");
}

// Step 2: Run prettier on all formatted files
console.log("\nRunning prettier...");
const { execSync } = require("child_process");
try {
  execSync(
    `npx prettier --write "${basedir}/*.tsx" --parser typescript`,
    { stdio: "pipe", cwd: process.cwd() }
  );
  console.log("Prettier ran successfully");
} catch (e) {
  console.log("Prettier stderr:", e.stderr?.toString() || e.message);
}
