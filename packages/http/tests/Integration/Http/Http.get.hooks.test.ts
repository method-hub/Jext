import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.get should send to a local server what the hooks set', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((request, response) => {
            response.writeHead(200, { 'Content-Type': 'application/json', 'X-Server': 'local' });
            response.end(JSON.stringify({ auth: request.headers.authorization }));
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/me`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when a beforeRequest hook adds a token and an afterResponse hook reads a header', async () => {
        const seen: Array<string | null> = [];
        const http = new Bootstrap().init().extend({
            hooks: {
                beforeRequest: [
                    async ({ url: target, init }) => {
                        const headers = new Headers(init.headers);
                        headers.set('Authorization', await Promise.resolve('Bearer t'));
                        return { url: target, init: { ...init, headers } };
                    },
                ],
                afterResponse: [(response) => void seen.push(response.headers.get('X-Server'))],
            },
        });

        const result = await http.get<{ auth: string }>(url);

        expect(result).toEqual({ data: { auth: 'Bearer t' }, error: null });
        expect(seen).toEqual(['local']);
    });
});
