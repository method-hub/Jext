# Contributing to Jext

Thank you for your interest in Jext! This page is a short preview. The full guides:
**[English](.github/docs/en/CONTRIBUTING.md)** · **[Русский](.github/docs/ru/CONTRIBUTING.md)**.

## Principles

Every package must beat the best-known libraries of its kind on developer experience and on speed, and prove it with
performance tests and side-by-side lessons. Write code that is fast and elegant at once:
[Principles](.github/docs/en/CONTRIBUTING.md#-principles).

## Quick start

You need Node.js 22+ and npm 10+.

```bash
git clone https://github.com/method-hub/Jext.git
cd Jext
npm ci
npm run tests:guardian
```

`npm ci` also installs the Git hooks that check every commit and push.

## Pull Request Process

1. Start from an [issue](https://github.com/method-hub/Jext/issues): describe the bug or idea, or pick an open one.
2. Create a branch from `main`, for example `feat/collection-shuffle`.
3. Write the code together with its tests.
4. Update the docs the change touches (`ARCHITECTURE.md` in `en/` and `ru/`, JSDoc), add a changeset for a
   user-visible change (`npm run changeset`) and an ADR if you made an architectural decision.
5. Run `npm run prettier`, `npm run lint` and `npm run tests:guardian`.
6. Commit with [Conventional Commits](https://www.conventionalcommits.org/) and open a Pull Request to `main` using
   the template.

## Commit messages

```text
<type>(<scope>): <short description>
```

- **Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `ci` `chore`
- **Scopes:** `main` `docs` `deps` `ci` `format` `git` `other`, or a package: `collection` `http` `jext`

## Working with AI agents

Agents follow the same rules as people; their instructions live in [AGENTS.md](AGENTS.md). The process: give the
agent the issue, talk the task through, let it ask questions and argue, choose the best option, implement it with
tests, refactor, run the checks, update the docs and ADRs, then commit, push and open a PR. You review every line.
Details: [Development with AI Agents](.github/docs/en/CONTRIBUTING.md#-development-with-ai-agents).

## More

- [Code of Conduct](CODE_OF_CONDUCT.md) · [Security policy](SECURITY.md)
- [Architecture](.github/docs/en/ARCHITECTURE.md) · [Архитектура](.github/docs/ru/ARCHITECTURE.md)
- [Architecture decision records](.github/docs/adr/README.md)
- [MIT License](LICENSE)
