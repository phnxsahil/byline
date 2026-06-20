const fs = require("fs");
const path = require("path");

const basedir = "src/app/components/dispatch/dashboard";
const files = fs.readdirSync(basedir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const fpath = path.join(basedir, file);
  let c = fs.readFileSync(fpath, "utf-8");

  // Strategy: Process char by char. For each // comment, we need to
  // convert it to /* */ but ONLY the comment portion, not the subsequent code.
  // Since code and comments are interleaved on the same line in minified files,
  // we need to: (1) find // position, (2) find next // position or end,
  // (3) the content between them is comment+code mixed.
  // 
  // The key insight: in minified code, comment text after // is followed by
  // code until the next //. We can't distinguish them. So instead:
  // Insert a newline BEFORE each // comment to break the line comment's reach,
  // and terminate each comment with */ followed by newline.
  
  let result = "";
  let i = 0;

  while (i < c.length) {
    const ch = c[i];
    const next = i + 1 < c.length ? c[i + 1] : "";

    // Skip string literals
    if (ch === '"') {
      result += ch;
      i++;
      while (i < c.length && c[i] !== '"') {
        if (c[i] === "\\") { result += c[i]; i++; if (i < c.length) { result += c[i]; i++; } }
        else { result += c[i]; i++; }
      }
      if (i < c.length) { result += '"'; i++; }
      continue;
    }

    if (ch === "'") {
      result += ch;
      i++;
      while (i < c.length && c[i] !== "'") {
        if (c[i] === "\\") { result += c[i]; i++; if (i < c.length) { result += c[i]; i++; } }
        else { result += c[i]; i++; }
      }
      if (i < c.length) { result += "'"; i++; }
      continue;
    }

    if (ch === "`") {
      result += ch;
      i++;
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

    // Skip block comments
    if (ch === "/" && next === "*") {
      result += "/*";
      i += 2;
      while (i < c.length && !(c[i] === "*" && i + 1 < c.length && c[i + 1] === "/")) {
        result += c[i];
        i++;
      }
      if (i < c.length) { result += "*/"; i += 2; }
      continue;
    }

    // Handle line comment
    if (ch === "/" && next === "/") {
      result += "/*";
      i += 2;
      // Collect comment content up to the next // or end of string
      let commentEnd = i;
      let foundNextComment = false;
      while (commentEnd < c.length) {
        if (c[commentEnd] === "/" && commentEnd + 1 < c.length && c[commentEnd + 1] === "/") {
          foundNextComment = true;
          break;
        }
        commentEnd++;
      }
      
      if (foundNextComment) {
        // Everything from i to commentEnd is the comment + code
        // We need to separate: after the // comment text, there's code
        // Insert newline before the code
        result += c.substring(i, commentEnd).trim();
        result += " */\n";
        i = commentEnd;
      } else {
        // Last comment - extends to end of file (or \n)
        let content = "";
        while (i < c.length && c[i] !== "\n") {
          content += c[i];
          i++;
        }
        result += content.trim() + " */";
        if (i < c.length && c[i] === "\n") {
          result += "\n";
          i++;
        }
      }
      continue;
    }

    result += ch;
    i++;
  }

  fs.writeFileSync(fpath, result, "utf-8");
  console.log("Fixed:", file, result.length, "chars");
}
