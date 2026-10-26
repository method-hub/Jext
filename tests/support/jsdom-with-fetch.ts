import { builtinEnvironments, type Environment } from 'vitest/runtime';

/** The Node implementations that replace jsdom's, so http runs against the real Fetch API. */
const native = [
    'fetch',
    'Request',
    'Response',
    'Headers',
    'FormData',
    'Blob',
    'ReadableStream',
    'TextEncoder',
    'TextDecoder',
    'URLSearchParams',
    'AbortController',
    'AbortSignal',
    'TransformStream',
] as const;

/**
 * Test environment for the files that need the DOM or XHR: jsdom with the Fetch API of Node. A test file asks for it
 * with `// @vitest-environment jsdom-with-fetch` on its first line; every other file runs in plain Node.
 *
 * jsdom has no Fetch API and Node has no DOM, while http needs both. The environment starts jsdom, then puts the
 * Node classes from `native` back over it. jsdom's own `FormData`, `Blob` and `URLSearchParams` stay available as
 * `jsdomBodies`, because jsdom's `XMLHttpRequest` accepts only those; the form lessons of http use them.
 */
export default <Environment>{
    name: 'jsdom-with-fetch',
    viteEnvironment: 'client',
    async setup(global, options) {
        const node = Object.fromEntries(native.map((name) => [name, global[name]]));
        const jsdom = await builtinEnvironments.jsdom.setup(global, options);

        global.jsdomBodies = { FormData: global.FormData, Blob: global.Blob, URLSearchParams: global.URLSearchParams };
        Object.assign(global, node);

        return {
            teardown(scope) {
                delete scope.jsdomBodies;
                return jsdom.teardown(scope);
            },
        };
    },
};
