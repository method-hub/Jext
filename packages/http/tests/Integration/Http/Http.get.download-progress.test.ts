import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

const size = 256 * 1024;

describe('Http.get should report the download from a local server chunk by chunk', () => {
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Length': size });
            [0, 1, 2, 3].forEach(() => response.write(Buffer.alloc(size / 4, 1)));
            response.end();
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server sends Content-Length', async () => {
        const http = new Bootstrap().init();
        const reports: Progress[] = [];

        const { data } = await http.get<ArrayBuffer>(`${origin}/file.bin`).onDownloadProgress((p) => reports.push(p));

        const loaded = reports.map((report) => report.loaded);
        expect(data?.byteLength).toBe(size);
        expect(loaded).toEqual([...loaded].sort((a, b) => a - b));
        expect(reports[reports.length - 1]).toEqual({ loaded: size, total: size, percent: 100 });
    });
});
