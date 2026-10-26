// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.client.hooks.refresh-token should let every client renew the token and repeat the request', () => {
    let server: Server;

    beforeAll(async () => {
        server = createLessonServer(join(__dirname, '../../../examples/__fixtures__'));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        mockApi = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it.each([
        ['jext', 'jext'],
        ['fetch', 'fetch'],
        ['XMLHttpRequest', 'xhr'],
        ['axios', 'axios'],
        ['ky', 'ky'],
        ['ofetch', 'ofetch'],
    ])('when the lesson uses %s', async (_tool, file) => {
        // The lesson creates its client on import with the server address, so it is imported once the server listens
        const { default: run } = (await import(`../../../examples/52.client.hooks.refresh-token/${file}`)) as {
            default: () => Promise<unknown>;
        };
        const expected = 'Alice Moreau';

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
