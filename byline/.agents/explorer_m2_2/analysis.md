# Strategy & Refactoring Plan: Command Palette (Milestone 2)

This report outlines the detailed strategy to refactor and rewrite `src/app/components/dispatch/CommandPalette.tsx` and integrate it with `DashboardLayout.tsx` and `DocsTab.tsx` for Milestone 2.

---

## 1. Centered Modal Overlay & Layout Styling

### Objective
Update the styling of the command palette modal to be centered on screen, with a maximum width of `560px`, utilizing the background color `var(--by-bg-2)` and border color `var(--by-border)`.

### Code Design (`src/app/components/dispatch/CommandPalette.tsx`)
1. **Outer Overlay Div**:
   - Change `alignItems` from `"flex-start"` to `"center"`.
   - Remove `paddingTop: "12vh"`.
   - Add a default padding of `16px` to prevent layout clipping on small heights.

   ```typescript
   // Style object for outer overlay div (CommandPalette.tsx:110-126)
   style={{
     position: "fixed",
     inset: 0,
     zIndex: 9999,
     display: "flex",
     alignItems: "center", // Centered vertically
     justifyContent: "center",
     padding: 16, // Avoid edge clipping
     backgroundColor: "rgba(0,0,0,0.55)",
     backdropFilter: "blur(2px)",
     WebkitBackdropFilter: "blur(2px)",
   }}
   ```

2. **Modal Content Div**:
   - Change `maxWidth` from `540` to `560`.
   - Ensure the border utilizes `var(--by-border)` and the background utilizes `var(--by-bg-2)`.

   ```typescript
   // Style object for modal container (CommandPalette.tsx:127-138)
   style={{
     width: "100%",
     maxWidth: 560, // Refactored to max-width 560px
     backgroundColor: "var(--by-bg-2)",
     border: "1px solid var(--by-border)",
     borderRadius: 10,
     boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
     overflow: "hidden",
     animation: "cp-scale-in 0.12s ease-out",
   }}
   ```

---

## 2. Monospace Font for Keyboard Hints

### Objective
Ensure that all keyboard hints use the `'IBM Plex Mono', monospace` font family instead of `'DM Mono', monospace`.

### Code Design (`src/app/components/dispatch/CommandPalette.tsx`)
1. **Command Shortcut Hints** (lines 230-245):
   Change the `fontFamily` of the `<kbd>` tag to `'IBM Plex Mono', monospace`.

   ```typescript
   <kbd
     style={{
       fontFamily: "'IBM Plex Mono', monospace", // Updated from DM Mono
       fontSize: 9,
       color: "var(--by-text-3)",
       padding: "1px 5px",
       borderRadius: 3,
       border: "0.5px solid var(--by-border)",
       backgroundColor: "rgba(255,255,255,0.03)",
       lineHeight: "16px",
     }}
   >
     {cmd.shortcut}
   </kbd>
   ```

2. **Footer Navigation Hints** (lines 254-269):
   Change the `fontFamily` of the footer container `div` to `'IBM Plex Mono', monospace`.

   ```typescript
   <div
     style={{
       display: "flex",
       alignItems: "center",
       gap: 12,
       padding: "6px 14px",
       borderTop: "1px solid var(--by-border)",
       fontFamily: "'IBM Plex Mono', monospace", // Updated from DM Mono
       fontSize: 9,
       color: "var(--by-text-3)",
     }}
   >
     <span>↑↓ navigate</span>
     <span>↵ select</span>
     <span>esc close</span>
   </div>
   ```

---

## 3. Navigation & Documentation Headings Indexing & Fuzzy Matching

### Objective
Index headings in `DocsTab.tsx` and allow users to search for both navigation tabs and docs sections via fuzzy matching. Selecting a doc heading should switch to the Docs tab and scroll the viewport to that heading.

### Step 1: Assign DOM IDs in `src/app/components/dispatch/dashboard/DocsTab.tsx`
Modify `DocsTab.tsx` to add unique HTML `id` attributes to each heading:
- `h1` "Documentation" (line 22): `<h1 id="doc-heading-documentation" ...>`
- `h3` "Getting Started" (line 42): `<h3 id="doc-heading-getting-started" ...>`

### Step 2: Index Headings in `src/app/components/dispatch/dashboard/DashboardLayout.tsx`
Add commands representing the doc headings to the `commands` array. The actions must:
1. Set the active tab to `"docs"` (`setActiveTab("docs")`).
2. Delay execution slightly using `setTimeout` (e.g., `100ms`) to allow the `DocsTab` component to mount in the DOM.
3. Call `scrollIntoView({ behavior: "smooth", block: "start" })` on the matching DOM element.

```typescript
// Define within the commands array in DashboardLayout.tsx
{
  id: "doc-heading-documentation",
  label: "Docs: Documentation",
  shortcut: "G H D", // Optional shortcut: Go Help Documentation
  group: "Documentation",
  action: () => {
    setActiveTab("docs");
    setTimeout(() => {
      document.getElementById("doc-heading-documentation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
},
{
  id: "doc-heading-getting-started",
  label: "Docs: Getting Started",
  shortcut: "G H G", // Optional shortcut: Go Help Getting-started
  group: "Documentation",
  action: () => {
    setActiveTab("docs");
    setTimeout(() => {
      document.getElementById("doc-heading-getting-started")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
}
```

### Step 3: Fuzzy Matching in `CommandPalette.tsx`
Use the existing subsequence matching algorithm `fuzzyMatch` to match the search query against command labels:
- If a query matches "docs", both "Navigate to Docs" and the specific headings will match.
- If a query matches "get", the "Docs: Getting Started" command matches.

---

## 4. Fallback Row for Pipeline Dispatch

### Objective
If the query does not match any navigation or documentation headings, display a single fallback row: `Dispatch: '{query}'`. Selecting it triggers `runPipeline(query)` and closes the palette.

### Step 1: Detect Mismatches in `CommandPalette.tsx`
Define navigation/doc commands and verify if any of them fuzzy match the query:

```typescript
// Identify navigation or doc commands
const isNavOrDoc = (c: Command) =>
  c.group === "Navigation" || c.group === "Documentation";

// Check if any matching commands exist in these groups
const hasNavOrDocMatches = query
  ? commands.some((c) => isNavOrDoc(c) && fuzzyMatch(query, c.label))
  : true;

const showFallback = query && !hasNavOrDocMatches;
```

### Step 2: Inject Fallback Item Into Results
To keep keyboard navigation (`selectedIdx`, arrow key scrolling, enter key activation) working automatically, inject a virtual fallback command object when `showFallback` is true:

```typescript
const fallbackItem: Command = {
  id: "fallback-dispatch",
  label: `Dispatch: '${query}'`,
  group: "Pipeline Trigger",
  action: () => {
    if (onFallback) {
      onFallback(query);
    }
  }
};

// Filter results
const filtered = query
  ? (showFallback ? [fallbackItem] : commands.filter((c) => fuzzyMatch(query, c.label)))
  : commands;
```

### Step 3: Connect `runPipeline(query)` in `DashboardLayout.tsx`
1. Update `CommandPaletteProps` to accept `onFallback?: (query: string) => void`.
2. Modify `runPipeline` in `DashboardLayout.tsx` to receive an optional query parameter:

```typescript
const runPipeline = (query?: string) => {
  if (isRunning) return;
  setIsRunning(true);
  setLogOpen(true);
  setRunningAgent(0);

  if (query) {
    console.log(`[Pipeline] Triggered via command palette query: "${query}"`);
    // Optional extension: pass the query to the log panel state so the log shows:
    // "Evaluating post-worthiness of raw input: '{query}'..."
  }

  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i >= 5) {
      clearInterval(interval);
      setIsRunning(false);
      setRunningAgent(0);
    } else {
      setRunningAgent(i);
    }
  }, 1800);
};
```

3. Pass `runPipeline` to `CommandPalette`:

```typescript
<CommandPalette
  open={commandPaletteOpen}
  onClose={() => setCommandPaletteOpen(false)}
  commands={commands}
  onFallback={runPipeline}
/>
```

---

## 5. Dismissal via Escape Key

### Objective
Ensure pressing the Escape key always closes the command palette.

### Code Design (`src/app/components/dispatch/CommandPalette.tsx`)
In addition to the localized keydown listener on the container, add a global event listener inside a `useEffect` hook that triggers when the palette is open. This ensures Escape closes the menu even if focus has shifted:

```typescript
useEffect(() => {
  if (!open) return;

  const handleGlobalKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleGlobalKeyDown);
  return () => {
    window.removeEventListener("keydown", handleGlobalKeyDown);
  };
}, [open, onClose]);
```
