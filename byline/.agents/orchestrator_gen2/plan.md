# Plan - Byline Dashboard Rebuild (Gen 2)

## Core Objective
Orchestrate the rebuilding of the Byline dashboard following specifications and design tokens.

## Execution Plan
1. **Explore & Analyze**: Spawn an Explorer to review the current status of the codebase, see what modifications were already made (e.g. if Milestone 1 or part of it was implemented), and compile a report.
2. **Setup QA & Smoke Tests**: Establish a dedicated QA and testing strategy, spawning a Tester subagent to verify components as they are built.
3. **Milestone 1 (R1 Navigation & Sidebar)**: Implement Left Sidebar Navigation (232px, `var(--by-bg-2)`, right border) and simplify TopBar.
4. **Milestone 2 (R2 Command Palette)**: Update CommandPalette.tsx with fuzzy match, freeform input, and fuzzy matching into Docs sections.
5. **Milestone 3 (R3 Agent Rail)**: Build collapsible right AgentRail (56px/280px/fullscreen) replacing ChatPanel.tsx.
6. **Milestone 4 (R4 & R7 Simulation & Trace)**: Update setInterval simulation in DashboardLayout.tsx to emit AgentStep objects, and render them in AgentRail and ActivityTab.tsx.
7. **Milestone 5 (R5 Settings Restructure)**: Group settings into Connect, Voice & Brand, Pipeline Behavior (including per-platform override table), API & Developer, and Danger Zone.
8. **Milestone 6 (R6 Docs Tab)**: Build DocsTab.tsx with quick start, pipeline inline SVG, platform playbooks, API reference.
9. **Final Verification & Auditing**: Run unit tests, E2E tests, and a Forensic Auditor to ensure layout compliance, proper tokens, and no hardcoded values or cheating.
