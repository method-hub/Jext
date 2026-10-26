# 0007. Documentation site generated with VitePress and TypeDoc

- Status: accepted
- Date: 2026-10-24

## Context

Users of a package need its API, guides and examples in one place; contributors need the architecture, diagrams and
decisions. All of this already exists as markdown next to the code (`README.md`, `docs/{en,ru}/`, `adr/`,
`.github/docs/`) and as JSDoc ([0006](0006-jsdoc-required.md)). Writing the same text again for a site would make two
copies that drift apart. The docs are in English and Russian and use Mermaid diagrams.

## Decision

A private workspace `website/` (`jext-website`, never published) builds a static site from those files. VitePress
renders the pages with an en/ru locale, local search and Mermaid (`vitepress-plugin-mermaid`). TypeDoc with
`typedoc-plugin-markdown` and `typedoc-vitepress-theme` turns the JSDoc of `packages/<pkg>/index.ts` into the
English-only API reference, with strict validation. `website/scripts/collect.mjs` copies the documents into routes
(`/api/<pkg>/`, `/dev/<pkg>/`, `/dev/repo/`), rewrites relative links, writes index pages and sidebars, and checks
that every package on the site has its readmes and en/ru docs. The Russian readme is `RUADME.md` next to
`README.md`. Generated pages go to the ignored `website/.content/`; the sources stay the only place to edit. The
tools are exact-pinned devDependencies of `website/` and never reach a published package. How it works:
`.github/docs/en/ARCHITECTURE.md` › Documentation site.

## Consequences

A change to code or docs shows up on the site with no extra writing, and `npm run docs:build` fails on a dead link,
an unexported public type or an undocumented export, so the site cannot silently go stale. The install gets heavier
(VitePress, Mermaid, TypeDoc). A package joins the site only when it has the required files and is listed in
`website/site.config.mjs`; `collection` waits for its redesign. Publishing (GitHub Pages workflow) comes later.

## Alternatives considered

- Docusaurus: React and MDX, a heavier setup and its own i18n file layout that does not match `docs/{en,ru}/`.
- TypeDoc HTML alone: an API reference without guides, architecture pages or a Russian locale.
- Starlight (Astro): good i18n, but TypeDoc and Mermaid support through less mature plugins; VitePress is from the
  same ecosystem as Vite, which the packages already build with.
- Writing the site pages by hand: a second copy of every document.
