# Adversarial Challenge Report — Milestone 1: R1 Navigation & Sidebar

## Challenge Summary

**Overall risk assessment**: MEDIUM

While the layout and components render correctly in happy-path scenarios, two key logic flaws could disrupt normal usage in interactive environments:
1. **Unconditional Global Cmd+K Interception**: The search listener hijacks standard shortcut behaviors in all text inputs and textareas.
2. **Mobile Menu Resizing Sticky State**: Resizing viewport across the 900px breakpoint can leave the mobile menu in a stale "open" state when scaled back down.

---

## Challenges

### [Medium] Challenge 1: Unconditional Keyboard Event Hijacking (Cmd+K)
- **Assumption challenged**: The user only wants to open the Search/Command Palette when pressing Cmd+K / Ctrl+K.
- **Attack scenario**: The user is inside a textarea editing a platform draft (e.g. on The Desk tab) and wants to insert/format a link using the standard Markdown shortcut `Cmd+K`. The event handler captures this and prevents default, opening the command palette instead of allowing the input control to handle link formatting.
- **Blast radius**: Disrupts rich-text or markdown editor formatting workflows inside dashboard views.
- **Mitigation**: Prevent hijacking when focus is on text inputs or textareas that support formatted text, or use key modifiers to distinguish global vs. local scope.
  ```typescript
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      // Check active element
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        // Option: allow link formatting or let input handle it if necessary
      }
      e.preventDefault();
      setCommandPaletteOpen(prev => !prev);
    }
  };
  ```

### [Medium] Challenge 2: Sticky Mobile Menu State on Viewport Resize
- **Assumption challenged**: Viewport sizes are static, or resizing to desktop cleans up mobile navigation states.
- **Attack scenario**: 
  1. User is on mobile (width < 900px).
  2. User opens the mobile sidebar drawer (`mobileMenuOpen === true`).
  3. User resizes the browser window or rotates their tablet to landscape (width >= 900px). The desktop sidebar appears, and mobile view disappears. `isMobile` changes to `false`.
  4. The effect `useEffect(() => { if (isMobile) setMobileMenuOpen(false); }, [activeTab, isMobile])` executes. Since `isMobile` is `false`, it does NOT call `setMobileMenuOpen(false)`. Thus, `mobileMenuOpen` remains `true` in state.
  5. User resizes the browser back to mobile or rotates back to portrait (width < 900px).
  6. Because `mobileMenuOpen` is still `true`, the mobile menu instantly pops open covering the screen without user action.
- **Blast radius**: Minor layout visual glitch that displays open overlay on resize.
- **Mitigation**: Update the effect to reset `mobileMenuOpen` when `isMobile` becomes `false` or active tab changes, regardless of whether it's mobile.
  ```typescript
  useEffect(() => {
    if (!isMobile || activeTab) {
      setMobileMenuOpen(false);
    }
  }, [activeTab, isMobile]);
  ```

---

## Stress Test Results

- **Resize state loop test** → Simulated transition `isMobile: true` (menu open) → `isMobile: false` → `isMobile: true` → Result: Menu pops open automatically → **FAIL** (mitigation recommended)
- **Cmd+K Case Sensitivity** → Simulated caps-lock on (pressing `Cmd+K` when key is `"K"`) → Result: Event handler checks `e.key === "k"` (case-sensitive) which will fail to open command palette → **FAIL** (suggest checking `e.key.toLowerCase() === "k"`)
- **Mac OS vs Windows modifiers** → Verified `e.metaKey || e.ctrlKey` handles Cmd on Mac and Ctrl on Windows → **PASS**

---

## Unchallenged Areas

None.
