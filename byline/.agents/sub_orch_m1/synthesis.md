# Explorer Synthesis - Milestone 1: R1 Navigation & Sidebar

## Consensus
- **Navigation Layout**: The old horizontal TopBar centered tabs must be removed, and a persistent left sidebar (`232px` wide) styled with `--by-bg-2` and `--by-border` (right border) must be added.
- **TopBar Simplification**: Keep logo and user avatar. Lift project selection state to `DashboardLayout.tsx` and render a dropdown selector in the TopBar. Add a visible `⌘K` keyboard shortcut trigger button styled in `IBM Plex Mono`.
- **Active Navigation Indicators**: Active items must show a left border of `2px solid var(--by-accent)` and primary text color `var(--by-text)`. Inactive items display `var(--by-text-2)`.
- **Mobile Collapsing (<900px)**: The persistent sidebar is hidden by default. A hamburger menu button in the mobile TopBar opens the sidebar as a drawer overlay (`z-index: 100`) with a blurry dark backdrop overlay underneath (`rgba(0,0,0,0.55)` and `backdrop-filter: blur(2px)`).
- **Docs Tab Component**: Create a placeholder `DocsTab.tsx` component to avoid compilation crashes when switching to the `docs` tab.
- **Command Palette Integration**: Bind `metaKey`/`ctrlKey` + `k` and the TopBar search button to toggle the Command Palette. Pass navigation actions and pipeline actions into it.

## Resolved Conflicts
- None. Both Explorer 2 and Explorer 3 reached identical architectural conclusions and implementation approaches.

## Gaps
- None. Complete component files and modifications have been mapped out.
