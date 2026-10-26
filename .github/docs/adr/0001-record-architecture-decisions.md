# 0001. Record architecture decisions

- Status: accepted
- Date: 2026-10-23

## Context

Decisions in Jext were made in heads and chats. AI agents and new contributors see only the code and "fix"
deliberate choices back. A log that records every small change would bury the few decisions that matter.

## Decision

Decisions are written down as ADRs, numbered, one page at most, in English, from `0000-template.md`.

- Only decisions that change the architecture or how the project is used get an ADR: structure or patterns,
  package boundaries, public API or return types, a new dependency, a choice between real alternatives. Bug
  fixes, renames, refactors inside a module, lint fixes, new tests and doc edits do not.
- Two levels: `.github/docs/adr/` for decisions that affect more than one package, the tooling or the process;
  `packages/<pkg>/adr/` for decisions that affect only that package. Each level is numbered from `0001` and has
  its own `README.md` index. A package gets the folder with its first ADR.
- Accepted ADRs are not edited. A new ADR supersedes an old one, which gets `Superseded by …`.

## Consequences

Each important decision has a short record next to the code it governs. `ARCHITECTURE.md` describes how things
are now and links to ADRs for why.

## Alternatives considered

- Decisions in commit messages only: not discoverable.
- Full design docs per feature: too heavy for the project's size.
- One global folder for every package: package decisions get lost among repository ones.
