// @ts-check
/**
 * Collects the documentation of the repository into website/.content, where VitePress reads it.
 *
 *   node scripts/collect.mjs           copy the pages, rewrite their links, write the indexes and sidebars
 *   node scripts/collect.mjs --check   only check that every package has its documents in en and ru
 *
 * Nothing is written into the packages: the markdown stays where it is and keeps working on GitHub. The TypeDoc
 * reference (`npm run api`) is generated into .content/api/<pkg>/reference before this script runs.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { branch, packages, repository } from '../site.config.mjs';

const WEBSITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(WEBSITE, '..');
const OUT = join(WEBSITE, '.content');
const GITHUB = `https://github.com/${repository}`;

/** The variants of every lesson, in the order of the tabs: file name in the lesson folder → tab label. */
const VARIANTS = {
    jext: 'jext',
    fetch: 'fetch',
    xhr: 'XMLHttpRequest',
    axios: 'axios',
    ky: 'ky',
    ofetch: 'ofetch',
};

/** The line of a lesson text that the tabs replace; only a line of its own counts. */
const MARKER = '<!-- @variants -->';

/** @typedef {{ source: string, route: string, lang: 'en' | 'ru', title?: string }} Page */

/** Words of the generated pages and sidebars. */
const WORDS = {
    en: {
        api: 'API',
        apiLead: 'Packages for people who use Jext: what each one does, how to start and the reference of every method.',
        dev: 'Development',
        devLead: 'For people who work on Jext: how the repository and every package are built, and why.',
        repo: 'Repository',
        repoSummary: 'The monorepo: layout, aliases, tests, builds, JSDoc and the decisions behind them.',
        overview: 'Overview',
        guide: 'Lessons',
        reference: 'API reference',
        architecture: 'Architecture',
        contributing: 'Contributing',
        releasing: 'Releases and CI/CD',
        adr: 'Decisions (ADR)',
    },
    ru: {
        api: 'API',
        apiLead: 'Пакеты для тех, кто пользуется Jext: что делает каждый, как начать и справочник всех методов.',
        dev: 'Разработка',
        devLead: 'Для тех, кто работает над Jext: как устроены репозиторий и каждый пакет и почему.',
        repo: 'Репозиторий',
        repoSummary: 'Монорепозиторий: структура, алиасы, тесты, сборка, JSDoc и решения, которые за ними стоят.',
        overview: 'Обзор',
        guide: 'Уроки',
        reference: 'Справочник API (EN)',
        architecture: 'Архитектура',
        contributing: 'Участие в проекте',
        releasing: 'Релизы и CI/CD',
        adr: 'Решения (ADR, EN)',
    },
};

/**
 * @summary The files every listed package must have, in both languages where a language applies.
 *
 * @param {string} pkg - The folder name in `packages/`.
 * @returns {string[]} Paths relative to the repository root.
 */
function required(pkg) {
    const dir = `packages/${pkg}`;

    return [
        `${dir}/index.ts`,
        `${dir}/README.md`,
        `${dir}/RUADME.md`,
        `${dir}/docs/en/ARCHITECTURE.md`,
        `${dir}/docs/ru/ARCHITECTURE.md`,
        `${dir}/adr/README.md`,
    ];
}

/**
 * @summary The markdown file names of a folder, sorted.
 *
 * @param {string} dir - A folder relative to the repository root.
 * @returns {string[]} The names, empty when the folder does not exist.
 */
function markdown(dir) {
    const abs = join(ROOT, dir);

    return existsSync(abs) ? readdirSync(abs).filter((name) => name.endsWith('.md')).sort() : [];
}

/**
 * @summary Checks that each package has its documents and that every `en/` folder has the same files as `ru/`.
 *
 * @returns {string[]} The problems found, empty when there are none.
 */
function check() {
    const problems = packages.flatMap((pkg) =>
        required(pkg)
            .filter((path) => !existsSync(join(ROOT, path)))
            .map((path) => `packages/${pkg}: ${path} is missing`)
    );
    const pairs = ['.github/docs', ...packages.map((pkg) => `packages/${pkg}/docs`)];

    for (const dir of pairs) {
        const en = markdown(`${dir}/en`);
        const ru = markdown(`${dir}/ru`);

        en.filter((name) => !ru.includes(name)).forEach((name) => problems.push(`${dir}/ru/${name} is missing`));
        ru.filter((name) => !en.includes(name)).forEach((name) => problems.push(`${dir}/en/${name} is missing`));
    }

    packages.forEach((pkg) => problems.push(...checkLessons(pkg)));

    return problems;
}

/**
 * @summary The lesson folders of a package: `examples/NN.<subject>.<case>`.
 *
 * @param {string} pkg - The folder name in `packages/`.
 * @returns {string[]} The folder names, sorted; empty when the package has no lessons.
 */
function lessons(pkg) {
    const dir = join(ROOT, `packages/${pkg}/examples`);

    return existsSync(dir) ? readdirSync(dir).filter((name) => /^\d{2}\./.test(name)).sort() : [];
}

/**
 * @summary Checks every lesson: both texts with the tabs marker, the six variants, its feature test and its line in
 * both indexes.
 *
 * @param {string} pkg - The folder name in `packages/`.
 * @returns {string[]} The problems found.
 */
function checkLessons(pkg) {
    const dir = `packages/${pkg}/examples`;
    const problems = [];
    const folders = lessons(pkg);

    if (folders.length === 0) {
        return problems;
    }

    const indexes = ['README.md', 'RUADME.md'].map((name) => (existsSync(join(ROOT, dir, name)) ? read(`${dir}/${name}`) : ''));

    for (const folder of folders) {
        const files = [...Object.keys(VARIANTS).map((name) => `${name}.ts`), 'en.md', 'ru.md'];
        const test = `packages/${pkg}/tests/Feature/Examples/Examples.${folder.replace(/^\d+\./, '')}.test.ts`;

        files.filter((name) => !existsSync(join(ROOT, dir, folder, name))).forEach((name) => problems.push(`${dir}/${folder}/${name} is missing`));
        ['en.md', 'ru.md']
            .filter((name) => existsSync(join(ROOT, dir, folder, name)) && !read(`${dir}/${folder}/${name}`).includes(`\n${MARKER}\n`))
            .forEach((name) => problems.push(`${dir}/${folder}/${name} has no ${MARKER} line`));
        [test].filter((path) => !existsSync(join(ROOT, path))).forEach((path) => problems.push(`${path} is missing`));
        [`${folder}/en.md`, `${folder}/ru.md`].forEach((link, at) => {
            if (!indexes[at].includes(`](${link})`)) {
                problems.push(`${dir}/${at === 0 ? 'README' : 'RUADME'}.md does not link ${link}`);
            }
        });
    }

    return problems;
}

/**
 * @summary The pages of the lessons: `examples/README.md` and `RUADME.md` are the indexes, every lesson a page.
 *
 * @param {string} pkg - The folder name in `packages/`.
 * @returns {Page[]} The pages; empty when the package has no lessons.
 */
function guide(pkg) {
    const dir = `packages/${pkg}/examples`;

    if (lessons(pkg).length === 0) {
        return [];
    }

    return [
        { source: `${dir}/README.md`, route: `api/${pkg}/guide/index.md`, lang: 'en' },
        { source: `${dir}/RUADME.md`, route: `ru/api/${pkg}/guide/index.md`, lang: 'ru' },
        ...lessons(pkg).flatMap((folder) => {
            // Dots in a route would look like a file extension to the web server
            const slug = folder.replace(/\./g, '-');

            return /** @type {Page[]} */ ([
                { source: `${dir}/${folder}/en.md`, route: `api/${pkg}/guide/${slug}.md`, lang: 'en' },
                { source: `${dir}/${folder}/ru.md`, route: `ru/api/${pkg}/guide/${slug}.md`, lang: 'ru' },
            ]);
        }),
    ];
}

/**
 * @summary The six variants of a lesson as a VitePress `code-group`: one tab per tool.
 *
 * @param {string} folder - The lesson folder relative to the repository root.
 * @returns {string} The markdown of the tabs.
 */
function tabs(folder) {
    const blocks = Object.entries(VARIANTS).map(([name, label]) => {
        const code = read(`${folder}/${name}.ts`).trimEnd();

        return `\`\`\`ts [${label}]\n${code}\n\`\`\``;
    });

    return ['::: code-group', ...blocks, ':::'].join('\n\n');
}

/**
 * @summary Lists every page taken from the repository with the route it gets on the site.
 *
 * @returns {Page[]} The pages.
 */
function pages() {
    /** @type {Page[]} */
    const list = [
        { source: '.github/docs/en/README.md', route: 'index.md', lang: 'en' },
        { source: '.github/docs/ru/README.md', route: 'ru/index.md', lang: 'ru' },
        { source: '.github/docs/en/ARCHITECTURE.md', route: 'dev/repo/index.md', lang: 'en' },
        { source: '.github/docs/ru/ARCHITECTURE.md', route: 'ru/dev/repo/index.md', lang: 'ru' },
        { source: '.github/docs/en/CONTRIBUTING.md', route: 'dev/repo/contributing.md', lang: 'en' },
        { source: '.github/docs/ru/CONTRIBUTING.md', route: 'ru/dev/repo/contributing.md', lang: 'ru' },
        { source: '.github/docs/en/RELEASING.md', route: 'dev/repo/releasing.md', lang: 'en' },
        { source: '.github/docs/ru/RELEASING.md', route: 'ru/dev/repo/releasing.md', lang: 'ru' },
        ...adr('.github/docs/adr', 'dev/repo/adr'),
    ];

    for (const pkg of packages) {
        const dir = `packages/${pkg}`;

        list.push(
            { source: `${dir}/README.md`, route: `api/${pkg}/index.md`, lang: 'en' },
            { source: `${dir}/RUADME.md`, route: `ru/api/${pkg}/index.md`, lang: 'ru' },
            { source: `${dir}/docs/en/ARCHITECTURE.md`, route: `dev/${pkg}/index.md`, lang: 'en' },
            { source: `${dir}/docs/ru/ARCHITECTURE.md`, route: `ru/dev/${pkg}/index.md`, lang: 'ru' },
            ...adr(`${dir}/adr`, `dev/${pkg}/adr`),
            ...guide(pkg)
        );
    }

    return list.map((page) => ({ ...page, title: title(read(page.source)) }));
}

/**
 * @summary The pages of an ADR folder: its `README.md` becomes the index, every record keeps its file name.
 *
 * @param {string} dir - The ADR folder relative to the repository root.
 * @param {string} route - The route of the folder on the site.
 * @returns {Page[]} The pages, in English only.
 */
function adr(dir, route) {
    return markdown(dir).map((name) => ({
        source: `${dir}/${name}`,
        route: `${route}/${name === 'README.md' ? 'index.md' : name}`,
        lang: /** @type {const} */ ('en'),
    }));
}

/**
 * @summary Reads a file of the repository.
 *
 * @param {string} path - The path relative to the repository root.
 * @returns {string} The text.
 */
function read(path) {
    return readFileSync(join(ROOT, path), 'utf8');
}

/**
 * @summary The text of the first `#` heading.
 *
 * @param {string} text - Markdown.
 * @returns {string} The heading, empty when there is none.
 */
function title(text) {
    return /^# (?<heading>.+)$/m.exec(text)?.groups?.heading.trim() ?? '';
}

/**
 * @summary The first paragraph after the first heading, joined into one line, without links.
 *
 * @param {string} text - Markdown.
 * @returns {string} The paragraph.
 */
function lead(text) {
    const body = text.replace(/^# .+$/m, '').trim();
    const paragraph = body.split(/\n\s*\n/).find((block) => !block.startsWith('[') && !block.startsWith('```'));

    // Links are dropped: they are relative to the source file, not to the index page
    return (paragraph ?? '')
        .replace(/\[(?<text>[^\]]*)\]\([^)]*\)/g, '$<text>')
        .replace(/\s*\n\s*/g, ' ')
        .trim();
}

/**
 * @summary Rewrites the relative links of a page: a collected page becomes its route, any other file a GitHub link.
 *
 * @description The line that links to the other language is dropped, because the site has a language switch.
 * A link to a missing file is left as it is, so the VitePress build reports it as a dead link.
 *
 * @param {Page} page - The page.
 * @param {Map<string, string>} routes - Source path → route of every collected page.
 * @returns {string} The rewritten markdown.
 */
function rewrite(page, routes) {
    const from = dirname(page.source);
    const text = read(page.source)
        .replace(/^\[(?:Русская версия|English version)\]\([^)]*\)\n\n?/m, '')
        .replace(new RegExp(`^${MARKER}$`, 'm'), () => tabs(from));

    return text.replace(/(?<prefix>!?\[[^\]]*\]\()(?<target>[^)\s]+)\)/g, (match, prefix, target) => {
        if (/^(?:[a-z]+:|#|\/)/i.test(target)) {
            return match;
        }

        const [path, anchor] = target.split('#');
        const file = relative(ROOT, resolve(ROOT, from, path)).replace(/\/$/, '');
        const hash = anchor ? `#${anchor}` : '';
        const route = routes.get(file) ?? (statSafe(file)?.isDirectory() ? routes.get(`${file}/README.md`) : null);

        if (route) {
            return `${prefix}${link(route)}${hash})`;
        }

        if (!statSafe(file)) {
            return match;
        }

        const kind = statSafe(file)?.isDirectory() ? 'tree' : prefix.startsWith('!') ? 'raw' : 'blob';
        return `${prefix}${GITHUB}/${kind}/${branch}/${file}${hash})`;
    });
}

/**
 * @summary `fs.statSync` that returns `null` for a missing path.
 *
 * @param {string} path - The path relative to the repository root.
 * @returns {import('node:fs').Stats | null} The stats.
 */
function statSafe(path) {
    try {
        return statSync(join(ROOT, path));
    } catch {
        return null;
    }
}

/**
 * @summary The site link of a route: `dev/http/index.md` → `/dev/http/`, `dev/http/adr/0001-x.md` → `/dev/http/adr/0001-x`.
 *
 * @param {string} route - The route of a page.
 * @returns {string} The link.
 */
function link(route) {
    return `/${route.replace(/(?:^|\/)index\.md$/, '/').replace(/\.md$/, '')}`.replace(/\/+/g, '/');
}

/**
 * @summary Writes a file into `.content`, creating its folder.
 *
 * @param {string} route - The path inside `.content`.
 * @param {string} text - The content.
 */
function write(route, text) {
    const file = join(OUT, route);

    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
}

/**
 * @summary The home page: a hero with links to both sections, then the philosophy from `.github/docs/<lang>/README.md`.
 *
 * @param {'en' | 'ru'} lang - The language.
 * @param {string} body - The rewritten README.
 * @returns {string} The page.
 */
function home(lang, body) {
    const words = WORDS[lang];
    const prefix = lang === 'en' ? '' : '/ru';

    return [
        '---',
        'layout: home',
        'hero:',
        '  name: Jext',
        `  tagline: "${lang === 'en' ? 'Strictly typed utilities for web development' : 'Строго типизированные утилиты для веб-разработки'}"`,
        '  actions:',
        `    - { theme: brand, text: "${words.api}", link: "${prefix}/api/" }`,
        `    - { theme: alt, text: "${words.dev}", link: "${prefix}/dev/" }`,
        '---',
        '',
        body,
    ].join('\n');
}

/**
 * @summary The index of a section: one entry per package, with the first paragraph of its document.
 *
 * @param {'en' | 'ru'} lang - The language.
 * @param {'api' | 'dev'} section - The section.
 * @returns {string} The page.
 */
function index(lang, section) {
    const words = WORDS[lang];
    const prefix = lang === 'en' ? '' : '/ru';
    const entries = packages.map((pkg) => {
        const source =
            section === 'api'
                ? `packages/${pkg}/${lang === 'en' ? 'README' : 'RUADME'}.md`
                : `packages/${pkg}/docs/${lang}/ARCHITECTURE.md`;
        const name = JSON.parse(read(`packages/${pkg}/package.json`)).name;

        return `## [${name}](${prefix}/${section}/${pkg}/)\n\n${lead(read(source))}`;
    });
    const repo = `## [${words.repo}](${prefix}/dev/repo/)\n\n${words.repoSummary}`;

    return [`# ${words[section]}`, words[`${section}Lead`], ...(section === 'dev' ? [repo] : []), ...entries].join('\n\n') + '\n';
}

/**
 * @summary The sidebars of every section, keyed by path prefix, for `.vitepress/config.mts`.
 *
 * @param {Page[]} list - The collected pages.
 * @returns {Record<string, unknown[]>} The sidebars.
 */
function sidebars(list) {
    /** @type {Record<string, unknown[]>} */
    const result = {};

    for (const lang of /** @type {const} */ (['en', 'ru'])) {
        const words = WORDS[lang];
        const prefix = lang === 'en' ? '' : '/ru';
        const records = (/** @type {string} */ route) =>
            list
                .filter((page) => page.route.startsWith(`${route}/`) && !page.route.endsWith('index.md'))
                .map((page) => ({ text: page.title, link: link(page.route) }));

        for (const pkg of packages) {
            const reference = JSON.parse(readFileSync(join(OUT, `api/${pkg}/reference/typedoc-sidebar.json`), 'utf8'));

            result[`${prefix}/api/${pkg}/`] = [
                { text: words.overview, link: `${prefix}/api/${pkg}/` },
                ...lessonsSidebar(pkg, lang),
                { text: words.reference, link: `/api/${pkg}/reference/`, collapsed: false, items: reference },
            ];
            result[`${prefix}/dev/${pkg}/`] = [
                { text: words.architecture, link: `${prefix}/dev/${pkg}/` },
                { text: words.adr, link: `/dev/${pkg}/adr/`, collapsed: true, items: records(`dev/${pkg}/adr`) },
            ];
        }

        result[`${prefix}/dev/repo/`] = [
            { text: words.architecture, link: `${prefix}/dev/repo/` },
            { text: words.contributing, link: `${prefix}/dev/repo/contributing` },
            { text: words.releasing, link: `${prefix}/dev/repo/releasing` },
            { text: words.adr, link: '/dev/repo/adr/', collapsed: true, items: records('dev/repo/adr') },
        ];
    }

    return result;
}

/**
 * @summary The lessons group of a package sidebar, with the sections and titles of `examples/README.md` (or
 * `RUADME.md`).
 *
 * @param {string} pkg - The folder name in `packages/`.
 * @param {'en' | 'ru'} lang - The language.
 * @returns {unknown[]} One group, or none when the package has no lessons.
 */
function lessonsSidebar(pkg, lang) {
    if (lessons(pkg).length === 0) {
        return [];
    }

    const prefix = lang === 'en' ? '' : '/ru';
    const text = read(`packages/${pkg}/examples/${lang === 'en' ? 'README' : 'RUADME'}.md`);
    const sections = text
        .split(/^## /m)
        .slice(1)
        .map((section) => ({
            text: section.split('\n')[0].trim(),
            items: [...section.matchAll(/^- \[(?<title>[^\]]+)\]\((?<folder>\d{2}\.[^/]+)\/(?:en|ru)\.md\)/gm)].map((match) => ({
                text: match.groups?.title,
                link: `${prefix}/api/${pkg}/guide/${match.groups?.folder.replace(/\./g, '-')}`,
            })),
        }))
        .filter((section) => section.items.length > 0);

    return [{ text: WORDS[lang].guide, link: `${prefix}/api/${pkg}/guide/`, collapsed: false, items: sections }];
}

/**
 * @summary Collects everything into `.content`.
 */
function collect() {
    const list = pages();
    const routes = new Map(list.map((page) => [page.source, page.route]));

    for (const page of list) {
        const body = rewrite(page, routes);
        write(page.route, page.route.endsWith('/index.md') || page.route === 'index.md' ? homeOr(page, body) : body);
    }

    for (const lang of /** @type {const} */ (['en', 'ru'])) {
        const prefix = lang === 'en' ? '' : 'ru/';
        write(`${prefix}api/index.md`, index(lang, 'api'));
        write(`${prefix}dev/index.md`, index(lang, 'dev'));
    }

    write('sidebars.json', `${JSON.stringify(sidebars(list), null, 2)}\n`);
    console.log(`collect: ${list.length} pages for ${packages.join(', ')} → ${relative(ROOT, OUT)}`);
}

/**
 * @summary Wraps a home page into the hero layout; any other index page stays as it is.
 *
 * @param {Page} page - The page.
 * @param {string} body - The rewritten markdown.
 * @returns {string} The page.
 */
function homeOr(page, body) {
    return page.route === 'index.md' || page.route === 'ru/index.md' ? home(page.lang, body) : body;
}

const problems = check();

if (problems.length > 0) {
    console.error(`docs:check found ${problems.length} problem(s):\n${problems.map((line) => `  - ${line}`).join('\n')}`);
    process.exit(1);
}

if (process.argv.includes('--check')) {
    console.log(`docs:check: ${packages.join(', ')} and .github/docs have every document in en and ru`);
} else {
    collect();
}
