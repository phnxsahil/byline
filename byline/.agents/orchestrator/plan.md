# Plan - Byline Dashboard Rebuild

## Core Objective
Orchestrate the rebuilding of the Byline dashboard following specifications and design tokens.

## Steps
1. **Initialize & Setup**: Create required coordinator state files in `.agents/orchestrator/`.
2. **Exploration**: Spawn an Explorer subagent to analyze the current codebase, existing components, and project layout, as well as read specifications: `byline-v2-spec.md`, `byline-frontend-prompts.md`, and `.agents/ORIGINAL_REQUEST.md`.
3. **Milestone Decomposition**: Create `PROJECT.md` at project root (`D:\Projects\dispatch\byline\PROJECT.md`) detailing the architecture, milestones, interface contracts, and code layout.
4. **Execution (Dual Track)**:
   - **Track 1: Implementation**: Spawn Workers to implement changes milestone-by-milestone, followed by Reviewers and Challengers to verify correctness.
   - **Track 2: Testing**: E2E Testing track to build/verify tests.
5. **Auditing**: Run a Forensic Auditor to ensure no cheating, hardcoded strings, or integrity violations.
6. **Acceptance**: Verify all tests pass, and report back to the parent agent.
