import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'events.sse'));

/**
 * The server streams the fixture in 7-byte chunks, so events and lines arrive split across reads.
 */
const writeInChunks = async (response: ServerResponse): Promise<void> => {
    for (let offset = 0; offset < body.length; offset += 7) {
        response.write(body.subarray(offset, offset + 7));
        await new Promise((resolve) => setTimeout(resolve, 2));
    }

    response.end();
};

describe('Http.sse should yield the events of a local server', () => {
    let server: Server;
    let url: string;
    let accept: string | undefined;

    beforeAll(async () => {
        server = createServer((request, response) => {
            ({ accept } = request.headers);
            response.writeHead(200, { 'Content-Type': 'text/event-stream' });
            void writeInChunks(response);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/events`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the server sends the events in small chunks', async () => {
        const http = new Bootstrap().init();
        const received: ServerEvent[] = [];

        for await (const event of http.sse(url)) {
            received.push(event);
        }

        expect(accept).toBe('text/event-stream');
        expect(received).toEqual([
            { event: 'progress', data: '{"percent":50}', id: '1', retry: null },
            { event: 'progress', data: '{"percent":100}', id: '2', retry: null },
            { event: 'message', data: 'done\nbye', id: '2', retry: null },
        ]);
    });
});
