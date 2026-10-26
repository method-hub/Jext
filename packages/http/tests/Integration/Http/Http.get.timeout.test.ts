import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.get should return a timeout error from a local server that answers too late', () => {
    let timer: NodeJS.Timeout;
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            timer = setTimeout(() => response.writeHead(200, { 'Content-Type': 'text/plain' }).end('late'), 2000);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    afterEach(() => clearTimeout(timer));

    it('when the timeout is shorter than the answer', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.get<string>(`${origin}/slow`).timeout(50);

        expect(data).toBeNull();
        expect(error?.status).toBe(0);
        expect(error?.message).toBe('The request timed out after 50 ms');
        expect(error?.cause).toHaveProperty('name', 'TimeoutError');
    });
});
