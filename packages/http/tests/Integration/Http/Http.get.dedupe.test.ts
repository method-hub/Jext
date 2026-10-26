import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.get should reach a local server once', () => {
    let server: Server;
    let url: string;
    let hits = 0;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            hits += 1;
            setTimeout(() => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ hits }));
            }, 30);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when three identical requests with dedupe are sent at once', async () => {
        const http = new Bootstrap().init();

        const results = await Promise.all([1, 2, 3].map(() => http.get<{ hits: number }>(url).dedupe()));

        expect(results.map(({ data }) => data)).toEqual([{ hits: 1 }, { hits: 1 }, { hits: 1 }]);
        expect(hits).toBe(1);
    });
});
