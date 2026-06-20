const fs = require("fs");
const path = require("path");

const basedir = "src/app/components/dispatch/dashboard";
const files = fs.readdirSync(basedir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const fpath = path.join(basedir, file);
  let c = fs.readFileSync(fpath, "utf-8");

  // Only replace // that are actual comments (preceded by space, tab, or at line start)
  // and not inside strings
  // Since the file is minified (single line), we need to be careful
  // Strategy: process the file character by character to identify comments vs strings
  let result = "";
  let inStr = false;
  let strChar = "";
  let inTmpl = false;

  for (let i = 0; i < c.length; i++) {
    const ch = c[i];
    const next = i + 1 < c.length ? c[i + 1] : "";

    if (inStr) {
      result += ch;
      if (ch === "\\") { i++; if (i < c.length) result += c[i]; continue; }
      if (ch === strChar) inStr = false;
      continue;
    }

    if (inTmpl) {
      result += ch;
      if (ch === "\\") { i++; if (i < c.length) result += c[i]; continue; }
      if (ch === "`") inTmpl = false;
      continue;
    }

    if (ch === "/" && next === "/") {
      // Line comment - capture everything until newline
      let commentContent = "";
      i += 2; // skip //
      while (i < c.length && c[i] !== "\n") {
        commentContent += c[i];
        i++;
      }
      // i is now at \n or past end
      result += "/* " + commentContent.trim() + " */";
      if (i < c.length && c[i] === "\n") {
        result += "\n";
      }
      continue;
    }

    if (ch === "/" && next === "*") {
      // Block comment - pass through unchanged
      result += "/*";
      i += 2;
      while (i < c.length && !(c[i] === "*" && c[i + 1] === "/")) {
        result += c[i];
        i++;
      }
      if (i < c.length) {
        result += "*/";
        i++;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inStr = true;
      strChar = ch;
    }

    if (ch === "`") {
      inTmpl = true;
    }

    result += ch;
  }

  fs.writeFileSync(fpath, result, "utf-8");
  console.log("Fixed comments in:", file, result.length, "chars");
}
