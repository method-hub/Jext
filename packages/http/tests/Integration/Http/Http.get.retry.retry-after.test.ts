import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.get should wait as long as Retry-After says before the repeat', () => {
    let times: number[];
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            times.push(Date.now());

            if (times.length === 1) {
                response.writeHead(429, { 'Retry-After': '1' }).end();
                return;
            }

            response.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    beforeEach(() => {
        times = [];
    });

    it('when the server answers 429 with Retry-After: 1', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<string>(`${origin}/limited`).retry({ limit: 1, delay: 0 });

        const [first, second] = times;
        expect(data).toBe('ok');
        expect(second - first).toBeGreaterThanOrEqual(950);
    });
});
