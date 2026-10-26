// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import { createLessonServer } from '../../../examples/server';
import jext from '../../../examples/42.schema.mismatch/jext';
import viaFetch from '../../../examples/42.schema.mismatch/fetch';
import viaXhr from '../../../examples/42.schema.mismatch/xhr';
import viaAxios from '../../../examples/42.schema.mismatch/axios';
import viaKy from '../../../examples/42.schema.mismatch/ky';
import viaOfetch from '../../../examples/42.schema.mismatch/ofetch';

let mockApi = '';
vi.mock('../../../examples/api', () => ({
    get API(): string {
        return mockApi;
    },
}));

describe('Examples.schema.mismatch should give every tool the issue of the missing field', () => {
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
        const expected = ['Invalid input: expected number, received undefined'];

        const actual = await run();

        expect(actual).toEqual(expected);
    });
});
