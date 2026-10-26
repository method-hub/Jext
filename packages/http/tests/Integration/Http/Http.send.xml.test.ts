import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'data.xml'));

describe('Http.send should return parsed XML from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'application/xml' }).end(body);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/xml`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when Content-Type is application/xml', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<{ catalog: { book: Array<{ title: string; year: number }> } }>(url);

        expect(data).toMatchObject({
            catalog: {
                book: [
                    { title: 'Dune', year: 1965 },
                    { title: 'Solaris', year: 1961 },
                ],
            },
        });
    });
});
