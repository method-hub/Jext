import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import browserServer from './tests/support/browser-server.ts';
import { alias } from './vitest.config.ts';

/**
 * Browser tests: Vitest runs each test file in real Chromium, Firefox and WebKit through Playwright.
 * `npm run tests:browser` runs all three, `npm run tests:browser -- --project chromium` one of them.
 * `tests/support/browser-server.ts` answers requests on the same origin, because a browser cannot start a server.
 */
export default defineConfig({
  plugins: [browserServer()],
  resolve: { alias },
  test: {
    include: ['tests/Browser/**/*.test.ts', 'packages/*/tests/Browser/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }],
    },
  },
});
