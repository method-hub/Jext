import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'data.json'));

describe('Http.get should decode JSON chosen with as from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(body);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users/1`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server sends JSON as text/plain', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<{ id: number; name: string; tags: string[] }>(url).as('json');

        expect(data).toEqual({ id: 1, name: 'Alice', tags: ['admin', 'editor'] });
    });
});
