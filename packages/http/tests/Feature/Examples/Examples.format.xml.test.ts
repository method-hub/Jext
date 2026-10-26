// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/31.format.xml/jext';
import viaFetch from '../../../examples/31.format.xml/fetch';
import viaXhr from '../../../examples/31.format.xml/xhr';
import viaAxios from '../../../examples/31.format.xml/axios';
import viaKy from '../../../examples/31.format.xml/ky';
import viaOfetch from '../../../examples/31.format.xml/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.format.xml should give every tool the titles of the books', () => {
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
        const expected = ['Patterns of Enterprise Application Architecture', 'Designing Data-Intensive Applications'];

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
