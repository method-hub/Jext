import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError with the decoded body from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(500, { 'Content-Type': 'text/plain' }).end('Something broke');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users/42`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server answers 500 with a text body', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.send<unknown, string>(url);

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(500);
        expect(error?.data).toBe('Something broke');
    });
});
