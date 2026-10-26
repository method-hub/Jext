// @vitest-environment jsdom-with-fetch

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

describe('Http.post should report the upload progress to a local server and decode its answer', () => {
    let server: Server;
    let origin: string;

    beforeAll(async () => {
        server = createServer((request, response) => {
            let received = 0;
            request.on('data', (chunk: Buffer) => {
                received += chunk.length;
            });
            request.on('end', () => {
                response
                    .writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
                    .end(JSON.stringify({ received }));
            });
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when a 1 MB text body is sent through XMLHttpRequest', async () => {
        const http = new Bootstrap().init();
        const body = 'x'.repeat(1024 * 1024);
        const reports: Progress[] = [];

        const { data } = await http
            .post<{ received: number }>(`${origin}/upload`)
            .body(body)
            .onUploadProgress((progress) => reports.push(progress));

        expect(data).toEqual({ received: body.length });
        expect(reports.length).toBeGreaterThan(0);
        expect(reports[reports.length - 1]).toEqual({ loaded: body.length, total: body.length, percent: 100 });
    });
});
