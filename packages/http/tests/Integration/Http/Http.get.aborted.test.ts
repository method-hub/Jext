import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import HttpError from '@Http/Error/HttpError';

describe('Http.get should return an HttpError with status 0 from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer(() => {
            // never answers, so only the signal can end the request
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/slow`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the signal aborts a request the server does not answer', async () => {
        const http = new Bootstrap().init();
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 50);

        const { data, error } = await http.get<string>(url).signal(controller.signal);

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(0);
        expect(error?.cause).toHaveProperty('name', 'AbortError');
    });
});
