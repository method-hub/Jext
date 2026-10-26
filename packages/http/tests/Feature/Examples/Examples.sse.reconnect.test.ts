// @vitest-environment jsdom-with-fetch

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/81.sse.reconnect/jext';
import viaFetch from '../../../examples/81.sse.reconnect/fetch';
import viaXhr from '../../../examples/81.sse.reconnect/xhr';
import viaAxios from '../../../examples/81.sse.reconnect/axios';
import viaKy from '../../../examples/81.sse.reconnect/ky';
import viaOfetch from '../../../examples/81.sse.reconnect/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.sse.reconnect should continue the stream after a drop from the last event', () => {
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
        const expected = ['one', 'two', 'three'];

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
