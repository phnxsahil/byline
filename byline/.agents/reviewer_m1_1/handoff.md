# Handoff Report — Reviewer 1 (Milestone 1)

## 1. Observation

I observed the following files and build command results in `D:\Projects\dispatch\byline`:

1. **`src/app/components/dispatch/dashboard/TopBar.tsx`**:
   - Hardcoded hex values on lines 202, 253, 258, 263, 265:
     ```typescript
     line 202: color: "#E85E2C"
     line 253: color: logOpen ? "#E85E2C" : "var(--by-text-3)"
     line 258: background: "#E85E2C"
     line 263: background: "#E85E2C"
     line 263: color: "#F5F2EC"
     line 265: background: "#E85E2C"
     ```
   - Keydown listener on lines 47-52 of `DashboardLayout.tsx` intercepting key event globally:
     ```typescript
     const handleKeyDown = (e: KeyboardEvent) => {
       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
         e.preventDefault();
         setCommandPaletteOpen(prev => !prev);
       }
     };
     ```
   - Dropdown keyboard access is missing in `ProjectSwitcher` (no arrow keys or ESC handler).

2. **`src/app/components/dispatch/dashboard/DashboardLayout.tsx`**:
   - Resize handler on line 39: `const check = () => setIsMobile(window.innerWidth < 900);`
   - Mobile menu overlay display checks `isMobile && mobileMenuOpen`.
   - The effect for closing mobile menu is:
     ```typescript
     useEffect(() => {
       if (isMobile) setMobileMenuOpen(false);
     }, [activeTab, isMobile]);
     ```

3. **`src/styles/byline-tokens.css`**:
   - Defines `--by-accent: #E85E2C;` and `--by-text: #F5F4F0;` under `:root, [data-theme="dark"]`.

4. **Build Command Execution**:
   - Command: `npm run build`
   - Result: Successful compilation with no errors.
     ```
     vite v6.3.5 building for production...
     transforming...
     ✓ 8418 modules transformed.
     rendering chunks...
     computing gzip size...
     dist/index.html                     1.37 kB │ gzip:   0.66 kB
     dist/assets/favicon-DV-5Y69N.svg    1.39 kB │ gzip:   0.54 kB
     dist/assets/index-CQD21xVx.css     92.20 kB │ gzip:  15.24 kB
     dist/assets/index-DUGz_LEO.js     879.20 kB │ gzip: 232.57 kB
     ✓ built in 19.93s
     ```

---

## 2. Logic Chain

1. **Design Tokens Compliance**: The design system token spec requires components to use custom CSS properties from `byline-tokens.css` for background, text, and accent colors. By observing hardcoded color hexes `#E85E2C` and `#F5F2EC` in `TopBar.tsx`, the component deviates from this design requirement, preventing themed styling overrides.
2. **Resizing State Synchronization**: The mobile drawer renders only when `isMobile && mobileMenuOpen`. If a user opens the mobile menu, resizes to desktop, and resizes back to mobile, `mobileMenuOpen` is never set to false during desktop mode since `if (isMobile)` blocks cleanup when `isMobile` is false. This leads to the menu reopening automatically on resize down.
3. **Globally Hijacked Shortcut**: The Ctrl/Cmd+K shortcut calls `e.preventDefault()` unconditionally. This halts native browser/OS formatting shortcuts inside inputs or textareas (e.g. markdown link insertions), which affects editor workflows inside tabs like The Desk.
4. **Successful Build**: The command `npm run build` compiles Vite assets and reports no syntax or type compilation errors, confirming that the files are statically correct.

---

## 3. Caveats

No caveats. The source files were read in full, and build checks were executed directly in the project directory.

---

## 4. Conclusion

The worker has correctly aligned the sidebar width (232px), styling borders, backdrop filter (blur 4px), and the 6-tab navigation layout to specifications. The build compiles flawlessly. 

However, a verdict of **REQUEST_CHANGES** is issued due to major findings:
- Design token bypass via hardcoded accent/text colors in `TopBar.tsx`.
- Visual glitch with mobile sidebar sticking open on desktop transitions and popping back open on mobile resize.
- Keyboard hijacking of Cmd+K inside edit input controls.
- Missing accessibility elements in `ProjectSwitcher`.

---

## 5. Verification Method

To verify the build and styling:
1. Run `npm run build` in `D:\Projects\dispatch\byline` to ensure it continues to build successfully.
2. Open `src/app/components/dispatch/dashboard/TopBar.tsx` and verify if the hardcoded `#E85E2C` colors are replaced with `var(--by-accent)` or appropriate utility CSS variables.
3. Verify that the resize effect in `DashboardLayout.tsx` cleans up `mobileMenuOpen` state when `isMobile` changes to `false`.
