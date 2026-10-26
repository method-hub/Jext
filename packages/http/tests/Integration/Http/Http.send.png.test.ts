import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'image.png'));

describe('Http.send should return an image Blob with the original bytes from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'image/png' }).end(body);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/image.png`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when Content-Type is image/png', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Blob>(url);

        expect(data.type).toBe('image/png');
        expect(Buffer.from(await data.arrayBuffer())).toEqual(body);
    });
});
