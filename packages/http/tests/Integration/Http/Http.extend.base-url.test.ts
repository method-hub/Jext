import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.extend should send the base URL and the headers to a local server', () => {
    let seen: { url: string; authorization: string };
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((request, response) => {
            seen = { url: request.url ?? '', authorization: request.headers.authorization ?? '' };
            response.writeHead(200, { 'Content-Type': 'application/json' }).end('{"ok":true}');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the extended client makes a request', async () => {
        const api = new Bootstrap().init().extend({ baseUrl: `${origin}/v2/`, headers: { Authorization: 'Bearer t' } });

        const { data } = await api.get<{ ok: boolean }>('/users').query({ page: 2 });

        expect(seen).toEqual({ url: '/v2/users?page=2', authorization: 'Bearer t' });
        expect(data).toEqual({ ok: true });
    });
});
