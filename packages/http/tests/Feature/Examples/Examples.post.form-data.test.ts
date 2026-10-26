// @vitest-environment jsdom-with-fetch

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/11.post.form-data/jext';
import viaFetch from '../../../examples/11.post.form-data/fetch';
import viaXhr from '../../../examples/11.post.form-data/xhr';
import viaAxios from '../../../examples/11.post.form-data/axios';
import viaKy from '../../../examples/11.post.form-data/ky';
import viaOfetch from '../../../examples/11.post.form-data/ofetch';

interface Bodies {
    FormData: typeof FormData;
    Blob: typeof Blob;
    URLSearchParams: typeof URLSearchParams;
}

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

/**
 * jsdom's XMLHttpRequest, which the XMLHttpRequest and axios lessons use here, accepts only jsdom's own FormData, Blob
 * and URLSearchParams, while fetch needs Node's. A browser has one of each, so each tool gets the ones it can send.
 */
const node: Bodies = { FormData, Blob, URLSearchParams };
const jsdom = (globalThis as unknown as { jsdomBodies: Bodies }).jsdomBodies;

describe('Examples.post.form-data should give every tool the fields the server received', () => {
    let server: Server;

    beforeAll(async () => {
        server = createLessonServer(join(__dirname, '../../../examples/__fixtures__'));
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        mockApi = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterEach(() => {
        Object.assign(globalThis, node);
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it.each([
        ['jext', jext, node],
        ['fetch', viaFetch, node],
        ['XMLHttpRequest', viaXhr, jsdom],
        ['axios', viaAxios, jsdom],
        ['ky', viaKy, node],
        ['ofetch', viaOfetch, node],
    ])('when the lesson uses %s', async (_tool, run, bodies) => {
        const expected = { name: 'Eve Laurent', message: 'The lessons helped a lot!' };
        Object.assign(globalThis, bodies);

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
