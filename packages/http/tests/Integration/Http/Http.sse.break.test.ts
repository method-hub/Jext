import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.sse should close the connection to a local server', () => {
    let server: Server;
    let url: string;
    let closed: Promise<void>;

    beforeAll(async () => {
        server = createServer((request, response) => {
            closed = new Promise<void>((resolve) => response.on('close', resolve));
            response.writeHead(200, { 'Content-Type': 'text/event-stream' });
            response.write('data: first\n\n');
            // The stream never ends on its own
            const timer = setInterval(() => response.write('data: more\n\n'), 10);
            request.socket.on('close', () => clearInterval(timer));
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/events`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the loop breaks after the first event', async () => {
        const http = new Bootstrap().init();
        const received: string[] = [];

        for await (const event of http.sse(url)) {
            received.push(event.data);
            break;
        }

        await expect(closed).resolves.toBeUndefined();
        expect(received).toEqual(['first']);
    });
});
