// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/70.progress.upload/jext';
import viaFetch from '../../../examples/70.progress.upload/fetch';
import viaXhr from '../../../examples/70.progress.upload/xhr';
import viaAxios from '../../../examples/70.progress.upload/axios';
import viaKy from '../../../examples/70.progress.upload/ky';
import viaOfetch from '../../../examples/70.progress.upload/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.progress.upload should report the progress of the upload', () => {
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
        ['jext', jext, true],
        ['fetch', viaFetch, false],
        ['XMLHttpRequest', viaXhr, true],
        ['axios', viaAxios, true],
        ['ky', viaKy, false],
        ['ofetch', viaOfetch, false],
    ])('when the lesson uses %s', async (_tool, run, supported) => {
        // A tool without this feature returns null; its tab says so and shows what to use instead
        const expected = supported ? { received: 65536, reported: true } : null;

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
