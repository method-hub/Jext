# Architecture Decision Records

Why Jext is built the way it is: decisions that affect the whole repository. Decisions that affect a single
package live in `packages/<pkg>/adr/`. What gets an ADR and how: [0001](0001-record-architecture-decisions.md),
template [0000-template.md](0000-template.md).

| No. | Decision | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | accepted |
| [0002](0002-agents-md-single-source.md) | AGENTS.md is the single source of agent instructions | accepted |
| [0003](0003-npm-workspaces-monorepo.md) | Monorepo on npm workspaces | accepted, package names superseded by [0008](0008-versioning-and-releases.md) |
| [0004](0004-no-runtime-dependencies.md) | No runtime dependencies | accepted |
| [0005](0005-test-taxonomy.md) | Test types and where they live | accepted, runners superseded by [0009](0009-browser-tests-vitest.md) and [0010](0010-all-tests-vitest.md) |
| [0006](0006-jsdoc-required.md) | JSDoc on every member, checked by ESLint | accepted |
| [0007](0007-docs-site.md) | Documentation site generated with VitePress and TypeDoc | accepted |
| [0008](0008-versioning-and-releases.md) | Package names, versions and releases with Changesets | accepted |
| [0009](0009-browser-tests-vitest.md) | Browser tests on Vitest Browser Mode with Playwright | accepted, "other types stay on Jest" superseded by [0010](0010-all-tests-vitest.md) |
| [0010](0010-all-tests-vitest.md) | All tests on Vitest, in Node unless a file asks for jsdom | accepted |

Package decisions: [collection](../../../packages/collection/adr/README.md), [http](../../../packages/http/adr/README.md).
