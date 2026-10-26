import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

/**
 * Test server of the browser tests. A browser cannot start a `node:http` server, so the Vite server that serves the
 * tests answers on `/__test/echo` itself, on the same origin (no CORS).
 *
 * By default the answer is JSON describing the request: `{ method, path, headers, received }`, where `received` is
 * the number of body bytes. Query parameters change it: `status` sets the status, `type` the Content-Type and `body`
 * the body sent back instead of the description.
 *
 * @returns A Vite plugin that adds the route.
 */
export default function browserServer(): Plugin {
    return {
        name: 'jext-browser-test-server',
        configureServer(server) {
            server.middlewares.use('/__test/echo', (request: IncomingMessage, response: ServerResponse) => {
                let received = 0;

                request.on('data', (chunk: Buffer) => {
                    received += chunk.length;
                });
                request.on('end', () => {
                    const url = new URL(request.url ?? '/', 'http://localhost');
                    const status = Number(url.searchParams.get('status') ?? 200);
                    const type = url.searchParams.get('type') ?? 'application/json';
                    const body =
                        url.searchParams.get('body') ??
                        JSON.stringify({
                            method: request.method,
                            path: url.pathname,
                            headers: request.headers,
                            received,
                        });

                    response.writeHead(status, { 'Content-Type': type }).end(body);
                });
            });
        },
    };
}
