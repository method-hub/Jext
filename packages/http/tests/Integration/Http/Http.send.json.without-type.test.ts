import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'data.json'));

describe('Http.send should detect JSON from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, {}).end(body);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/json`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server sends no Content-Type', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ id: number; name: string; tags: string[] }>(url);

        expect(data).toEqual({ id: 1, name: 'Alice', tags: ['admin', 'editor'] });
    });
});
