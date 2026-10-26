// @vitest-environment jsdom-with-fetch

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/62.abort.signal/jext';
import viaFetch from '../../../examples/62.abort.signal/fetch';
import viaXhr from '../../../examples/62.abort.signal/xhr';
import viaAxios from '../../../examples/62.abort.signal/axios';
import viaKy from '../../../examples/62.abort.signal/ky';
import viaOfetch from '../../../examples/62.abort.signal/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.abort.signal should cancel the request before the answer', () => {
    let server: Server;

    beforeAll(async () => {
        server = createLessonServer(join(__dirname, '../../../examples/__fixtures__'));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        mockApi = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    beforeEach(() => {
        // jsdom also reports a dropped or aborted XMLHttpRequest on the console; the lesson handles it
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
        const expected = 'cancelled';

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
