import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.sse should reconnect to a local server with Last-Event-ID', () => {
    let server: Server;
    let url: string;
    const lastIds: Array<string | undefined> = [];

    beforeAll(async () => {
        server = createServer((request, response) => {
            const lastId = request.headers['last-event-id'] as string | undefined;
            lastIds.push(lastId);
            response.writeHead(200, { 'Content-Type': 'text/event-stream' });

            if (typeof lastId === 'undefined') {
                // The first connection sends one event and drops
                response.write('retry: 10\nid: 1\ndata: first\n\n', () =>
                    setTimeout(() => response.socket?.destroy(), 20)
                );
                return;
            }

            response.end('id: 2\ndata: second\n\n');
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/events`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server drops the first connection after one event', async () => {
        const http = new Bootstrap().init();
        const received: string[] = [];

        for await (const event of http.sse(url).reconnect(3)) {
            received.push(event.data);
        }

        expect(received).toEqual(['first', 'second']);
        // eslint-disable-next-line no-undefined -- the first connection has no Last-Event-ID header
        expect(lastIds).toEqual([undefined, '1']);
    });
});
