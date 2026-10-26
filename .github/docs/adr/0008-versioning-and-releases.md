# 0008. Package names, versions and releases with Changesets

- Status: accepted
- Date: 2026-10-24

## Context

Nothing has been published yet. [0003](0003-npm-workspaces-monorepo.md) named the packages `@jext/<name>`, but the
`@jext` scope on npm is not ours; the owner registered `@metapraxis`. `npm run release` called `standard-version`,
which is not installed and only knows one version per repository, while each package here has its own version and
`packages/jext` depends on the others by exact version. The package builds were not publishable either (http did not
build, collection's types entry was empty, the aggregator had no build). Publishing from a laptop leaves no record of
which commit a tarball came from.

## Decision

The packages are published under the `@metapraxis` scope: `@metapraxis/jext-<name>` for each package and
`@metapraxis/jext` for the aggregator in `packages/jext`; the root is the private `jext-monorepo`. This supersedes the
names in [0003](0003-npm-workspaces-monorepo.md). Each package builds itself with Vite into `dist/` (`index.mjs`,
`index.cjs`, `index.umd.js`, `types/`) and publishes only `dist`, `README.md`, `CHANGELOG.md` and the root `LICENSE`.

Versions follow SemVer per package and are managed with Changesets (`@changesets/cli`, exact-pinned devDependency).
A change that users notice comes with a file in `.changeset/` (`npm run changeset`) naming the packages and the bump.
`.github/workflows/release.yml` turns pending changesets into a release pull request that bumps versions, updates
internal dependencies and writes the CHANGELOGs; merging it publishes from CI every package whose version is not on
npm yet, with npm provenance, a git tag and a GitHub release. Publishing happens only in `method-hub/Jext`, only from
CI, and never from a laptop. Step by step: `.github/docs/en/RELEASING.md`.

## Consequences

A release is a reviewed pull request, and a version reaches npm only when it changes in a `package.json`, so a push to
`main` never publishes by accident. The CHANGELOG entry is written once, in the changeset, instead of under
`Unreleased`. The repository needs the `NPM_TOKEN` secret, Actions allowed to create pull requests and Pages set to
"GitHub Actions". The release pull request opened with `GITHUB_TOKEN` does not trigger CI by itself. `npm run
release:version` also refreshes `package-lock.json`, because changesets does not.

## Alternatives considered

- standard-version / release-please per repository: one version for all packages, or per-package config by hand.
- semantic-release: versions from commit messages; one commit often touches several packages with different bumps.
- Lerna: a whole monorepo tool on top of npm workspaces, which already do the linking.
- Publishing by hand with `npm publish`: no review, no provenance, easy to forget the aggregator.
