// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/03.get.headers/jext';
import viaFetch from '../../../examples/03.get.headers/fetch';
import viaXhr from '../../../examples/03.get.headers/xhr';
import viaAxios from '../../../examples/03.get.headers/axios';
import viaKy from '../../../examples/03.get.headers/ky';
import viaOfetch from '../../../examples/03.get.headers/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.get.headers should give every tool the signed-in user', () => {
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
        ['jext', jext],
        ['fetch', viaFetch],
        ['XMLHttpRequest', viaXhr],
        ['axios', viaAxios],
        ['ky', viaKy],
        ['ofetch', viaOfetch],
    ])('when the lesson uses %s', async (_tool, run) => {
        const expected = { id: 1, name: 'Alice Moreau', email: 'alice@example.com', role: 'admin' };

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
