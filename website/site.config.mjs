// @ts-check

/**
 * @summary What the documentation site is built from: one place for the repository and the packages it shows.
 *
 * @description `collect.mjs` and `.vitepress/config.mts` both read this file. A package appears on the site when
 * it is listed in `packages` and has the files `collect.mjs --check` asks for.
 */

/** The GitHub repository, `owner/name`. GitHub Actions sets `GITHUB_REPOSITORY`; locally the main repository. */
export const repository = process.env.GITHUB_REPOSITORY ?? 'method-hub/Jext';

/** The branch that links to source files point to. */
export const branch = 'main';

/** The packages shown on the site, by folder name in `packages/`. `collection` joins after its redesign. */
export const packages = ['http'];

/**
 * @summary The base path of the site: `/<repo>/` on GitHub Pages of a repository, `/` otherwise.
 *
 * @returns {string} The base path, with a slash at both ends.
 */
export function base() {
    if (process.env.DOCS_BASE) {
        return process.env.DOCS_BASE;
    }

    return process.env.GITHUB_ACTIONS ? `/${repository.split('/')[1]}/` : '/';
}
