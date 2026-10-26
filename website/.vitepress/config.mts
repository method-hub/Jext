import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import { base, repository } from '../site.config.mjs';

/** Sidebars written by `scripts/collect.mjs`, keyed by path prefix. */
const sidebars = JSON.parse(readFileSync(fileURLToPath(new URL('../.content/sidebars.json', import.meta.url)), 'utf8'));

/**
 * The documentation site. Pages come from `.content`, which `npm run collect` fills from the packages; nothing in
 * `.content` is edited by hand.
 */
export default withMermaid(
    defineConfig({
        srcDir: '.content',
        srcExclude: ['sidebars.json'],
        base: base(),
        title: 'Jext',
        cleanUrls: true,
        lastUpdated: false,
        locales: {
            root: {
                label: 'English',
                lang: 'en',
                description: 'Strictly typed utilities for web development',
                themeConfig: {
                    nav: [
                        { text: 'API', link: '/api/', activeMatch: '^/api/' },
                        { text: 'Development', link: '/dev/', activeMatch: '^/dev/' },
                    ],
                },
            },
            ru: {
                label: 'Русский',
                lang: 'ru',
                description: 'Строго типизированные утилиты для веб-разработки',
                themeConfig: {
                    nav: [
                        { text: 'API', link: '/ru/api/', activeMatch: '^/ru/api/' },
                        { text: 'Разработка', link: '/ru/dev/', activeMatch: '^/ru/dev/' },
                    ],
                    outline: { label: 'На этой странице', level: [2, 3] },
                    docFooter: { prev: 'Назад', next: 'Вперёд' },
                },
            },
        },
        themeConfig: {
            sidebar: sidebars,
            outline: { level: [2, 3] },
            search: { provider: 'local' },
            socialLinks: [{ icon: 'github', link: `https://github.com/${repository}` }],
        },
        mermaid: {},
        vite: {
            // Mermaid alone is over 500 kB; the warning says nothing about our pages
            build: { chunkSizeWarningLimit: 4096 },
            // Mermaid 11 imports fastdom, a CommonJS module the mermaid plugin does not pre-bundle; served as is, it
            // has no default export and the dev server shows a blank page. Pre-bundling mermaid with its dependencies
            // converts them; the build is not affected.
            optimizeDeps: { include: ['mermaid'] },
        },
    })
);
