import { beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError with status 0', () => {
    let url: string;

    beforeAll(async () => {
        const server = createServer();

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/json`;
        await new Promise((resolve) => server.close(resolve));
    });

    it('when nothing listens on the port', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.send<unknown>(url);
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(0);
        expect(error?.cause).toHaveProperty('name', 'TypeError');
    });
});
