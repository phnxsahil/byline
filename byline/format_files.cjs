const fs = require("fs");
const path = require("path");

const basedir = "src/app/components/dispatch/dashboard";
const files = fs.readdirSync(basedir).filter(f => f.endsWith(".tsx"));

for (const file of files) {
  const fpath = path.join(basedir, file);
  let c = fs.readFileSync(fpath, "utf-8");

  // Add newlines after semicolons between statements (but not inside strings)
  // Strategy: split by semicolons and add newlines for import/export/const statements
  // More targeted: add newlines at major break points
  c = c
    // After ; that ends a terminal statement (not for loop semicolons)
    .replace(/;(?:\s*)(?=(?:import|export|const|let|var|interface|type|function|class)\s)/g, ";\n")
    // After closing brace when followed by another top-level construct
    .replace(/}(?:\s*)(?=(?:import|export|const|let|var|interface|type|function|class)\s)/g, "}\n")
    // After { when it's a function/block start (add newline after)
    .replace(/\{\s*(?=(?:const|let|var|if|for|while|switch|return|try|function|useEffect|useState|useRef)\b)/g, "{\n    ")
    // After { that opens JSX expression
    .replace(/\{\s*(?=(?:agentSteps\.|railState|AGENTS_LIST|hoveredAgent|input|chatImages|handleSend|headerAgentName|runningStep))/g, "{\n        ")
    // Fix JSX prop blocks
    .replace(/style=\{\{/g, "style={{\n")
    .replace(/\}\}/g, "\n}}")
    // Add newline after > for JSX elements that span multiple attributes
    .replace(/\s{2,}(?=\w+=)/g, "\n    ")
    // Split long JSX opening tags
    .replace(/<div/g, "\n<div")
    .replace(/<span/g, "\n<span")
    .replace(/<button/g, "\n<button")
    .replace(/<input/g, "\n<input")
    .replace(/<textarea/g, "\n<textarea")
    .replace(/<\/div>/g, "\n</div>")
    .replace(/<\/span>/g, "\n</span>")
    .replace(/<\/button>/g, "\n</button>")
    // Cleanup double newlines
    .replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(fpath, c, "utf-8");
  console.log("Reformatted:", file, "->", c.length, "chars");
}
