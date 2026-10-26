// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/35.format.as/jext';
import viaFetch from '../../../examples/35.format.as/fetch';
import viaXhr from '../../../examples/35.format.as/xhr';
import viaAxios from '../../../examples/35.format.as/axios';
import viaKy from '../../../examples/35.format.as/ky';
import viaOfetch from '../../../examples/35.format.as/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.format.as should give every tool the settings although the server calls them text', () => {
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
        const expected = { theme: 'dark', language: 'en' };

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
