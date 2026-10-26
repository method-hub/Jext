# 0004. No runtime dependencies

- Status: accepted
- Date: 2026-10-23

## Context

Jext aims to be a self-contained toolkit that can be imported piece by piece.

## Decision

Packages have no runtime dependencies. Exception: `fast-xml-parser` in `@jext/http` (XML parsing is not worth reimplementing). Any new exception needs its own ADR. Dev dependencies are unrestricted.

## Consequences

Smaller install and audit surface. Some features take more code.

## Alternatives considered

- Allow small utility dependencies freely: undermines the goal.
