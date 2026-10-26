# 0002. AGENTS.md is the single source of agent instructions

- Status: accepted
- Date: 2026-10-23

## Context

`CLAUDE.md`, `GEMINI.md` and `.cursorrules` were identical copies and had already drifted from the code (they listed packages and scripts that do not exist).

## Decision

The root `AGENTS.md` holds all instructions, and each package can add its own `AGENTS.md`. `CLAUDE.md` and `GEMINI.md` contain only `@AGENTS.md`: both Claude Code and Gemini CLI import the referenced file. Cursor reads `AGENTS.md` natively; scoped Cursor rules live in `.cursor/rules/*.mdc` and only point to it. No tool-specific folder (`.claude/`, `.gemini/`) is needed. `skills/` is reserved for skills that teach agents to use the Jext libraries; instructions for working on this repository stay in `AGENTS.md` files.

## Consequences

One file to edit. Pointer files must stay one line.

## Alternatives considered

- Symlinks: break on Windows checkouts without `core.symlinks`.
- Copies synced by a script: one more moving part.
- `.agents/skills/`: the convention for installed published skills, not for a project's own sources.
