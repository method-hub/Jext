import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import Bootstrap from '@Http/Bootstrap';

describe('Http.sse should post a body with headers and read the answer as JSON', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((request, response) => {
            let body = '';
            request.on('data', (chunk: Buffer) => (body += chunk.toString()));
            request.on('end', () => {
                const { prompt } = JSON.parse(body) as { prompt: string };
                response.writeHead(200, { 'Content-Type': 'text/event-stream' });
                response.write(
                    `data: ${JSON.stringify({ method: request.method, auth: request.headers.authorization })}\n\n`
                );
                [...prompt].forEach((letter) => response.write(`data: ${JSON.stringify({ delta: letter })}\n\n`));
                response.end();
            });
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/chat`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when a prompt is posted with an Authorization header', async () => {
        const http = new Bootstrap().init();
        const received: unknown[] = [];

        for await (const { data } of http
            .sse(url)
            .headers({ Authorization: 'Bearer t' })
            .body({ prompt: 'Hi' })
            .json()) {
            received.push(data);
        }

        expect(received).toEqual([{ method: 'POST', auth: 'Bearer t' }, { delta: 'H' }, { delta: 'i' }]);
    });
});
