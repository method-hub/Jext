import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.send should return null from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(204, { 'Content-Type': 'application/json' }).end();
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users/1`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the status is 204 No Content', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<null>(url, { method: 'DELETE' });

        expect(data).toBeNull();
    });
});
