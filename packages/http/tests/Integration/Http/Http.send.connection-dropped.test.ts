import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write('{"id":', () => response.socket?.destroy());
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/json`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server drops the connection in the middle of the body', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.send<unknown>(url);
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(200);
        expect(error?.cause).toHaveProperty('name', 'TypeError');
    });
});
