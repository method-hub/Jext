// @vitest-environment jsdom-with-fetch

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/22.error.network/jext';
import viaFetch from '../../../examples/22.error.network/fetch';
import viaXhr from '../../../examples/22.error.network/xhr';
import viaAxios from '../../../examples/22.error.network/axios';
import viaKy from '../../../examples/22.error.network/ky';
import viaOfetch from '../../../examples/22.error.network/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.error.network should give every tool status 0 when the connection breaks', () => {
    let server: Server;

    beforeAll(async () => {
        server = createLessonServer(join(__dirname, '../../../examples/__fixtures__'));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        mockApi = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    beforeEach(() => {
        // jsdom reports the dropped connection of XMLHttpRequest on the console as well; the lesson handles it.
        vi.spyOn(console, 'error').mockImplementation(() => null);
    });

    afterEach(() => vi.restoreAllMocks());

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
        const expected = 0;

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
