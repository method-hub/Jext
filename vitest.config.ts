import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * The aliases of the source, as tsconfig.json declares them, plus the package names that lessons and the aggregator
 * import (they point at the entry files, so no build is needed). vitest.browser.config.ts reuses them.
 */
export const alias = {
  '@Collection': path.resolve(import.meta.dirname, 'packages/collection/src'),
  '@Http': path.resolve(import.meta.dirname, 'packages/http/src'),
  '@metapraxis/jext-http': path.resolve(import.meta.dirname, 'packages/http/index.ts'),
  '@metapraxis/jext-collection': path.resolve(import.meta.dirname, 'packages/collection/index.ts'),
};

/**
 * Unit, integration, feature and performance tests, one Vitest project each: `vitest run --project unit`.
 * They run in plain Node. A file that needs the DOM or XHR starts with `// @vitest-environment jsdom-with-fetch`:
 * the alias below points that name at tests/support/jsdom-with-fetch.ts (jsdom with the Fetch API of Node).
 * Browser tests have their own config: vitest.browser.config.ts.
 */
export default defineConfig({
  resolve: {
    alias: {
      ...alias,
      'vitest-environment-jsdom-with-fetch': path.resolve(import.meta.dirname, 'tests/support/jsdom-with-fetch.ts'),
    },
  },
  test: {
    environment: 'node',
    projects: [
      { extends: true, test: { name: 'unit', include: ['packages/*/tests/Unit/**/*.test.ts'] } },
      { extends: true, test: { name: 'integration', include: ['packages/*/tests/Integration/**/*.test.ts'] } },
      {
        extends: true,
        test: { name: 'feature', include: ['tests/Feature/**/*.test.ts', 'packages/*/tests/Feature/**/*.test.ts'] },
      },
      {
        extends: true,
        test: {
          name: 'performance',
          include: ['packages/*/tests/Performance/**/*.perf.test.ts'],
        },
      },
    ],
  },
});
