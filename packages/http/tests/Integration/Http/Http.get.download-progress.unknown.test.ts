import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

describe('Http.get should report only the loaded bytes from a local server', () => {
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.write('hello ');
            response.end('world');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server sends the body in chunks without Content-Length', async () => {
        const http = new Bootstrap().init();
        const reports: Progress[] = [];

        const { data } = await http.get<string>(`${origin}/stream`).onDownloadProgress((p) => reports.push(p));

        expect(data).toBe('hello world');
        expect(reports[reports.length - 1]).toEqual({ loaded: 11 });
    });
});
