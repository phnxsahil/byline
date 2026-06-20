# Milestone 2 Command Palette Refactoring Analysis & Strategy Report

## Summary of Core Findings
Byline's command palette and dashboard components are modified to support Milestone 2 requirements: centring the modal overlay at a 560px max-width, using the `IBM Plex Mono` font for keyboard shortcuts, implementing character-subsequence fuzzy matching for navigation links and document headings, handling tab navigation and automatic heading scrolling via React state/DOM selectors, and offering a dynamic dispatch fallback row when no navigation/doc queries match. 

---

## 1. Observations

We examined the following source files:
1. **`src/app/components/dispatch/CommandPalette.tsx`**
2. **`src/app/components/dispatch/dashboard/DashboardLayout.tsx`**
3. **`src/app/components/dispatch/dashboard/DocsTab.tsx`**

### Target File: `CommandPalette.tsx`
* **Modal Dimensions & Positioning**:
  - The modal overlay is currently aligned to the top of the viewport (at `12vh`) rather than fully centered:
    ```typescript
    // Lines 118-121
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "12vh",
    ```
  - The width is constrained to `540` instead of the requested `560` max-width:
    ```typescript
    // Lines 129-130
    width: "100%",
    maxWidth: 540,
    ```
* **Fonts for Keyboard Hints**:
  - The keyboard shortcuts (`kbd` tags) and footer hints currently use `'DM Mono', monospace` rather than `'IBM Plex Mono', monospace`:
    ```typescript
    // Lines 190, 233, 261
    fontFamily: "'DM Mono', monospace",
    ```
* **Escape Key Behavior**:
  - Escape is handled only on keydown events registered directly on the outer wrapper `div`, meaning focus loss could break Escape key functionality:
    ```typescript
    // Line 73
    if (e.key === "Escape") { onClose(); return; }
    ```

### Target File: `DashboardLayout.tsx`
* **Pipeline Run**:
  - The `runPipeline` function does not accept a query string parameter for customized runs:
    ```typescript
    // Lines 72-73
    const runPipeline = () => {
      if (isRunning) return;
    ```
* **Commands Metadata**:
  - The `commands` array does not index documentation headings and defines tabs with varying name formats:
    ```typescript
    // Lines 116-118
    const commands = [
      // Navigation Group
      {
        id: "nav-overview",
        label: "Navigate to Overview",
    ```

### Target File: `DocsTab.tsx`
* **Headings Structure**:
  - There are two primary headings: `h1` (`"Documentation"`) and `h3` (`"Getting Started"`), but neither has an `id` attribute, making them inaccessible for direct anchor scrolling:
    ```typescript
    // Line 22
    <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
      Documentation
    </h1>
    // Line 42
    <h3 style={{ margin: 0, fontSize: 16, color: "var(--by-text)" }}>Getting Started</h3>
    ```

---

## 2. Logic Chain

1. **Overlay Centering & Sizing**:
   - To transition the layout to a vertically and horizontally centered modal, we must change `alignItems: "flex-start"` (with `paddingTop: "12vh"`) to `alignItems: "center"`, `justifyContent: "center"`, and set `maxWidth` on the modal body container to `560` (or `560px`).
2. **Keyboard Hints Font**:
   - Replacing all instances of `'DM Mono'` with `'IBM Plex Mono'` inside `CommandPalette.tsx` will satisfy the typography requirement for keyboard hints and shortcuts.
3. **Fuzzy Matching & Docs Headings Indexing**:
   - The doc headings from `DocsTab.tsx` must be declared as command structures under a new `"Documentation"` group (e.g., `Docs: Documentation` and `Docs: Getting Started`).
   - The subsequence-based `fuzzyMatch` function in `CommandPalette.tsx` already handles character-skipping matches perfectly.
   - When a heading is clicked/selected, the palette must call a unified navigation handler in `DashboardLayout.tsx` passing both the tab slug (`"docs"`) and the heading ID (`"documentation"` or `"getting-started"`).
4. **Scrolling to Elements**:
   - Setting a target scroll state (`docsScrollTarget`) in the parent `DashboardLayout.tsx` and passing it to `DocsTab` allows `DocsTab`'s `useEffect` to safely locate the heading element in the DOM (via its new `id="docs-heading-*"` attributes) and call `scrollIntoView({ behavior: "smooth", block: "start" })` once it mounts. This prevents React rendering race conditions.
5. **Dynamic Fallback Row & Pipeline Dispatching**:
   - When `query.trim() !== ""` and the filtered list of matches contains no navigation or documentation elements (`!hasNavOrDocMatches`), we inject a fallback action row: `Dispatch: '{query}'`.
   - Selecting this row calls `runPipeline(query)` in `DashboardLayout.tsx` and closes the command palette.
   - The fallback command should be dynamically appended to `flatItems` inside `CommandPalette.tsx` to inherit keyboard navigation and scroll index selection automatically.
6. **Global Escape Key Handler**:
   - Registering a window-level keydown event listener inside a `useEffect` inside `CommandPalette` guarantees that the modal will close on `Escape` regardless of which DOM element has active focus.

---

## 3. Caveats

* **Static Heading Indexing**: This design indexes the headings statically. If additional headings are added to `DocsTab.tsx` in the future, they must be manually declared in the `commands` array.
* **Vite Mock Environment**: The pipeline run is mocked on the frontend (represented by a step timer). In a production environment, `runPipeline(query)` would issue an asynchronous REST API call to `/api/dispatch` with the custom milestone input.

---

## 4. Conclusion

To implement these updates, the implementer needs to perform the following:
1. Update `CommandPalette.tsx` to handle window-level Escape keys, apply centered styling, format styling parameters (`max-width: 560px`), set fonts (`IBM Plex Mono`), and inject the `Dispatch: '{query}'` fallback command into the search results.
2. Update `DashboardLayout.tsx` to define `docsScrollTarget` state, pass a modified `runPipeline(query)` handler, and define the indexed `"Documentation"` commands.
3. Update `DocsTab.tsx` to accept the `scrollTarget` prop and apply matching HTML `id` attributes onto the headings.

Refer to the following proposed files in the agent's folder for reference implementations:
* `proposed_CommandPalette.tsx`
* `proposed_DashboardLayout.tsx`
* `proposed_DocsTab.tsx`

---

## 5. Verification Method

### Automated Verification
Run the Playwright test suite to automatically verify the changes:
```powershell
# 1. Start the Vite development server (should run on http://localhost:5174)
npm run dev

# 2. In a separate terminal, execute the playwright test suite specifically targeting dashboard smoke specs
npx playwright test scripts/dashboard-smoke.spec.ts
```

### Manual Verification
1. Open the app and press `Ctrl+K` or click the search box.
2. Verify that the modal overlay is centered vertically and horizontally.
3. Verify that the shortcuts/hints (e.g. `↑↓ navigate`) use `IBM Plex Mono`.
4. Type `getstart` and select "Docs: Getting Started". Verify the app navigates to the Docs tab and scrolls to the "Getting Started" heading.
5. Type a random string like `deploy to production` and verify the row `Dispatch: 'deploy to production'` appears. Press Enter and verify that the pipeline runs logs panel opens.
6. Press `Escape` and verify the palette closes immediately.
