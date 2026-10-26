import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

interface Echo {
    method: string;
    url: string;
    contentType: string | null;
    body: string;
}

/**
 * The server answers every request with what it received, so the test sees the request as it went over the wire.
 */
describe('Http.patch should send a URL-encoded body to a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((request, response) => {
            const chunks: Buffer[] = [];
            request.on('data', (chunk: Buffer) => chunks.push(chunk));
            request.on('end', () => {
                const echo: Echo = {
                    method: request.method ?? '',
                    url: request.url ?? '',
                    contentType: request.headers['content-type'] ?? null,
                    body: Buffer.concat(chunks).toString(),
                };
                response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(echo));
            });
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the body is URLSearchParams', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.patch<Echo>(url).body(new URLSearchParams({ name: 'Alice Smith' }));

        expect(data?.contentType).toMatch(/^application\/x-www-form-urlencoded/);
        expect(data?.body).toBe('name=Alice+Smith');
    });
});
