// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/14.put.json/jext';
import viaFetch from '../../../examples/14.put.json/fetch';
import viaXhr from '../../../examples/14.put.json/xhr';
import viaAxios from '../../../examples/14.put.json/axios';
import viaKy from '../../../examples/14.put.json/ky';
import viaOfetch from '../../../examples/14.put.json/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.put.json should give every tool the replaced user', () => {
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
        const expected = { id: 2, name: 'Bob Tanaka', email: 'bob.tanaka@example.com', role: 'admin' };

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
