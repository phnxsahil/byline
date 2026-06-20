## 2026-06-19T22:46:18Z

Role: Dedicated QA Tester / Challenger
Working Directory: D:\Projects\dispatch\byline\.agents\challenger_qa\
Objective: Write and run robust Playwright test cases to cover the new v2 dashboard features.

========================================================================
MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT
hardcode test results, create dummy/facade implementations, or
circumvent the intended task. A Forensic Auditor will independently
verify your work. Integrity violations WILL be detected and your
work WILL be rejected.
========================================================================

TASKS:
1. Examine `scripts/dashboard-smoke.spec.ts` and `scripts/byline-audit.spec.ts`.
2. Write a new test file `scripts/dashboard-features.spec.ts` (or append to existing tests) with robust test coverage for the remaining requirements:
   - **Agent Rail**: Collapsed 56px panel with 5 status dots, hover tooltips, click to expand (280px), fullscreen state takeover, exit fullscreen, and keyboard shortcut (Cmd+Shift+A or Ctrl+Shift+A) toggle.
   - **Activity Decision Trace**: Clicking a past run opens detail view (not modal), shows agent step cards with input/decisions/outputs, and check that the "Blocked" filter pill is visible in the Activity filter bar.
   - **Restructured Settings**: Sub-nav with 5 sections, per-platform overrides table in Pipeline Behavior, Danger Zone styling, and Reset pipeline opening a confirmation modal.
   - **Docs Tab**: Sticky sub-nav, inline SVG flowchart, playbooks, and API endpoints table.
3. Add tests to verify that these components utilize the design system tokens (`var(--by-*)`).
4. Save the new tests and verify they compile/run once the implementation starts. Report back your plan and findings.
