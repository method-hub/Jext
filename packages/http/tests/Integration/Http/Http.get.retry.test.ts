import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.get should get the data from a local server after it recovers', () => {
    let hits: number;
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            hits += 1;

            if (hits < 3) {
                response.writeHead(503, { 'Content-Type': 'text/plain' }).end('busy');
                return;
            }

            response.writeHead(200, { 'Content-Type': 'application/json' }).end('{"id":1}');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    beforeEach(() => {
        hits = 0;
    });

    it('when the server answers 503 twice and then 200', async () => {
        const http = new Bootstrap().init();

        const result = await http.get<{ id: number }>(`${origin}/users/1`).retry({ limit: 2, delay: 0 });

        expect(result).toEqual({ data: { id: 1 }, error: null });
        expect(hits).toBe(3);
    });
});
