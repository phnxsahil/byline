# Scope: R1 Navigation & Sidebar (Milestone 1)

## Architecture
- Replace horizontal centered tab navigation in `src/app/components/dispatch/dashboard/TopBar.tsx` with a persistent left sidebar (232px) in `src/app/components/dispatch/dashboard/DashboardLayout.tsx`.
- Sidebar rendered with background `var(--by-bg-2)`, right border `0.5px solid var(--by-border)`, and width `232px`.
- Renders 6 nav items: Overview, Desk, Signal, Activity, Settings, Docs.
- Active items show left border `2px solid var(--by-accent)` and primary text color `var(--by-text)`.
- Simplified TopBar keeps Logo, Project Switcher, Avatar, and a visible `⌘K` keyboard shortcut pill button (IBM Plex Mono).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1.1 | Sidebar Navigation Layout | Re-architect DashboardLayout.tsx to use left sidebar and remove LeftPanel.tsx from main layout. | None | PLANNED |
| 1.2 | TopBar Simplification | Remove centered tabs from TopBar.tsx and add ⌘K pill button. | None | PLANNED |
| 1.3 | Mobile Hamburger Support | Implement collapsing sidebar overlay for screens under 900px wide. | M1.1 | PLANNED |

## Interface Contracts
- Sidebar tab-click updates `activeTab` state in `DashboardLayout.tsx`.
- Sidebar responsive overlay uses `mobileMenuOpen` state.
