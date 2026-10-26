// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/21.error.server/jext';
import viaFetch from '../../../examples/21.error.server/fetch';
import viaXhr from '../../../examples/21.error.server/xhr';
import viaAxios from '../../../examples/21.error.server/axios';
import viaKy from '../../../examples/21.error.server/ky';
import viaOfetch from '../../../examples/21.error.server/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.error.server should give every tool the status and the text of a 500 response', () => {
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
        const expected = { status: 500, body: 'The report service is down' };

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
