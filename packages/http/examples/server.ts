import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';

/** A user from `__fixtures__/users.json`. */
interface User {
    /** The id in the URL `/users/:id`. */
    id: number;
    /** Full name. */
    name: string;
    /** Email address. */
    email: string;
    /** `admin`, `editor` or `viewer`. */
    role: string;
}

/** What a route handler gets. */
interface Exchange {
    /** The incoming request. */
    request: IncomingMessage;
    /** The response to write. */
    response: ServerResponse;
    /** The parsed URL of the request. */
    url: URL;
    /** The folder with the fixtures. */
    fixtures: string;
    /** How many times each `?key=` was requested, for the routes that answer differently on a repeat. */
    counts: Map<string, number>;
}

/** A route: a method, a path pattern and what it answers. */
interface Route {
    /** HTTP method. */
    method: string;
    /** Pattern of the path; the named group `id` is the id of a user. */
    path: RegExp;
    /** Writes the response. */
    handle: (exchange: Exchange, id: number) => Promise<void> | void;
}

/** The token that `/login` gives and `/me` expects. */
const TOKEN = 'secret-token';

/** Who may call the server: every origin, every method and header, so that lessons work in a browser too. */
const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Expose-Headers': '*',
};

/**
 * @summary Writes a JSON response.
 *
 * @param response - The response to write.
 * @param status - The status code.
 * @param value - The value to send as JSON.
 */
function json(response: ServerResponse, status: number, value: unknown): void {
    response.writeHead(status, { ...CORS, 'Content-Type': 'application/json' }).end(JSON.stringify(value));
}

/**
 * @summary Writes a fixture file as it is.
 *
 * @param exchange - The request, the response and the fixtures folder.
 * @param name - The file name in the fixtures folder.
 * @param type - The Content-Type of the file.
 */
function file(exchange: Exchange, name: string, type: string): void {
    exchange.response
        .writeHead(200, { ...CORS, 'Content-Type': type })
        .end(readFileSync(join(exchange.fixtures, name)));
}

/**
 * @summary Reads the users fixture.
 *
 * @param fixtures - The folder with the fixtures.
 * @returns The users.
 */
function users(fixtures: string): User[] {
    return JSON.parse(readFileSync(join(fixtures, 'users.json'), 'utf8')) as User[];
}

/**
 * @summary Turns the request into a Fetch `Request`, which can read JSON, forms and multipart bodies.
 *
 * @param request - The incoming request.
 * @returns A `Request` with the same headers and body.
 */
function body(request: IncomingMessage): Request {
    const headers = new Headers();
    Object.entries(request.headers).forEach(([name, value]) => headers.set(name, String(value)));

    return new Request('http://localhost/', {
        method: request.method,
        headers,
        body: Readable.toWeb(request) as ReadableStream,
        duplex: 'half',
    } as RequestInit);
}

/**
 * @summary Turns a form into a plain object; a file becomes its name, size and type.
 *
 * @param form - The form the request sent.
 * @returns The fields of the form.
 */
function fields(form: FormData): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    form.forEach((value, name) => {
        result[name] = typeof value === 'string' ? value : { name: value.name, size: value.size, type: value.type };
    });

    return result;
}

/**
 * @summary Answers with the user or with 404.
 *
 * @param exchange - The request and the response.
 * @param id - The id from the URL.
 */
function user({ response, fixtures, request }: Exchange, id: number): void {
    const found = users(fixtures).find((candidate) => candidate.id === id);

    if (!found) {
        json(response, 404, { message: `User ${id} not found` });
    } else if (request.method === 'HEAD') {
        response.writeHead(200, { ...CORS, 'Content-Type': 'application/json' }).end();
    } else {
        json(response, 200, found);
    }
}

/**
 * @summary Counts a request to a route with `?key=`: lessons give each variant its own key.
 *
 * @param exchange - The request, its URL and the counters.
 * @returns How many times this route and key were requested, this request included.
 */
function count({ url, counts }: Exchange): number {
    const key = `${url.pathname}?${url.searchParams.get('key') ?? ''}`;
    const value = (counts.get(key) ?? 0) + 1;
    counts.set(key, value);

    return value;
}

/**
 * @summary Writes Server-Sent Events, one `id:` (when given) and `data:` per event.
 *
 * @param response - The response to write.
 * @param list - The events: their data and, optionally, their id.
 * @param end - Whether to end the stream after them; `false` breaks the connection instead.
 */
function events(response: ServerResponse, list: { id?: string; data: string }[], end = true): void {
    response.writeHead(200, { ...CORS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    list.forEach(({ id, data }) => response.write(`${id ? `id: ${id}\n` : ''}data: ${data}\n\n`));

    if (end) {
        response.end();
    } else {
        // The events reach the client first, then the stream breaks: a malformed chunk is a network error to any client
        setTimeout(() => response.socket?.end('broken\r\n'), 50);
    }
}

/** The routes of the lesson server. */
const routes: Route[] = [
    {
        method: 'GET',
        path: /^\/users$/u,
        handle: ({ response, url, fixtures }) => {
            const role = url.searchParams.get('role');
            const limit = Number(url.searchParams.get('limit') ?? Infinity);
            const found = users(fixtures).filter((candidate) => !role || candidate.role === role);
            json(response, 200, found.slice(0, limit));
        },
    },
    { method: 'GET', path: /^\/users\/(?<id>\d+)$/u, handle: user },
    { method: 'HEAD', path: /^\/users\/(?<id>\d+)$/u, handle: user },
    {
        method: 'POST',
        path: /^\/users$/u,
        handle: async ({ request, response, fixtures }) => {
            const created = (await body(request).json()) as Partial<User>;
            json(response, 201, { id: users(fixtures).length + 1, ...created });
        },
    },
    {
        method: 'PUT',
        path: /^\/users\/(?<id>\d+)$/u,
        handle: async ({ request, response }, id) => json(response, 200, { ...(await body(request).json()), id }),
    },
    {
        method: 'PATCH',
        path: /^\/users\/(?<id>\d+)$/u,
        handle: async ({ request, response, fixtures }, id) => {
            const found = users(fixtures).find((candidate) => candidate.id === id);
            json(response, 200, { ...found, ...(await body(request).json()), id });
        },
    },
    {
        method: 'DELETE',
        path: /^\/users\/(?<id>\d+)$/u,
        handle: ({ response }) => {
            response.writeHead(204, CORS).end();
        },
    },
    {
        method: 'GET',
        path: /^\/me$/u,
        handle: ({ request, response, fixtures }) => {
            if (request.headers.authorization === `Bearer ${TOKEN}`) {
                json(response, 200, users(fixtures)[0]);
            } else {
                json(response, 401, { message: 'Missing or wrong token' });
            }
        },
    },
    {
        method: 'POST',
        path: /^\/login$/u,
        handle: async ({ request, response }) => {
            const form = await body(request).formData();
            const valid = form.get('username') === 'alice' && form.get('password') === 'wonderland';
            json(response, valid ? 200 : 401, valid ? { token: TOKEN } : { message: 'Wrong username or password' });
        },
    },
    {
        method: 'POST',
        path: /^\/(?:feedback|files)$/u,
        handle: async ({ request, response }) => json(response, 201, fields(await body(request).formData())),
    },
    { method: 'GET', path: /^\/robots\.txt$/u, handle: (exchange) => file(exchange, 'robots.txt', 'text/plain') },
    { method: 'GET', path: /^\/about\.html$/u, handle: (exchange) => file(exchange, 'about.html', 'text/html') },
    {
        method: 'GET',
        path: /^\/broken\.json$/u,
        handle: (exchange) => file(exchange, 'broken.json', 'application/json'),
    },
    {
        method: 'GET',
        path: /^\/reports\/daily$/u,
        handle: ({ response }) => {
            response.writeHead(500, { ...CORS, 'Content-Type': 'text/plain' }).end('The report service is down');
        },
    },
    { method: 'GET', path: /^\/drop$/u, handle: ({ request }) => request.socket.destroy() },
    ...formats(),
    ...reliability(),
    ...transfers(),
    ...streams(),
    {
        method: 'GET',
        path: /^\/slow$/u,
        handle: ({ response }) => {
            const timer = setTimeout(() => json(response, 200, { done: true }), 1000);
            response.on('close', () => clearTimeout(timer));
        },
    },
];

/**
 * @summary The routes of the format lessons (3x) and the client lessons (5x): files with their Content-Type.
 *
 * @returns The routes.
 */
function formats(): Route[] {
    const fixture = (path: RegExp, name: string, headers: Record<string, string>): Route => ({
        method: 'GET',
        path,
        handle: ({ response, fixtures }) => {
            response.writeHead(200, { ...CORS, ...headers });
            response.end(readFileSync(join(fixtures, name)));
        },
    });

    return [
        fixture(/^\/report\.csv$/u, 'report.csv', { 'Content-Type': 'text/csv' }),
        fixture(/^\/books\.xml$/u, 'books.xml', { 'Content-Type': 'application/xml' }),
        fixture(/^\/events\.ndjson$/u, 'events.ndjson', { 'Content-Type': 'application/x-ndjson' }),
        fixture(/^\/logo\.png$/u, 'logo.png', { 'Content-Type': 'image/png' }),
        fixture(/^\/export$/u, 'report.csv', {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="report.csv"',
        }),
        fixture(/^\/settings$/u, 'settings.json', { 'Content-Type': 'text/plain' }),
        {
            method: 'GET',
            path: /^\/echo\/headers$/u,
            handle: ({ request, response }) =>
                json(response, 200, {
                    app: request.headers['x-app'] ?? null,
                    authorization: request.headers.authorization ?? null,
                }),
        },
    ];
}

/**
 * @summary The routes of the reliability lessons (6x): failures that pass after a retry, a slow counter.
 *
 * @returns The routes.
 */
function reliability(): Route[] {
    return [
        {
            method: 'GET',
            path: /^\/flaky$/u,
            handle: (exchange) => {
                const attempt = count(exchange);
                json(exchange.response, attempt < 3 ? 503 : 200, attempt < 3 ? { message: 'Try again' } : { attempt });
            },
        },
        {
            method: 'GET',
            path: /^\/busy$/u,
            handle: (exchange) => {
                const attempt = count(exchange);

                if (attempt > 1) {
                    json(exchange.response, 200, { attempt });
                    return;
                }

                exchange.response.setHeader('Retry-After', '1');
                json(exchange.response, 429, { message: 'Slow down' });
            },
        },
        {
            method: 'GET',
            path: /^\/counter$/u,
            handle: (exchange) => {
                const hits = count(exchange);
                setTimeout(() => json(exchange.response, 200, { hits }), 100);
            },
        },
    ];
}

/**
 * @summary The routes of the progress lessons (7x): an upload that counts its bytes and a download of known size.
 *
 * @returns The routes.
 */
function transfers(): Route[] {
    return [
        {
            method: 'POST',
            path: /^\/upload$/u,
            handle: async ({ request, response }) => {
                const received = (await body(request).arrayBuffer()).byteLength;
                json(response, 200, { received });
            },
        },
        {
            method: 'GET',
            path: /^\/download$/u,
            handle: ({ response }) => {
                const bytes = Buffer.alloc(256 * 1024, 7);
                response.writeHead(200, {
                    ...CORS,
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': String(bytes.length),
                });
                response.end(bytes);
            },
        },
    ];
}

/**
 * @summary The routes of the stream lessons (8x): Server-Sent Events that end, drop and resume, or answer a POST.
 *
 * @returns The routes.
 */
function streams(): Route[] {
    return [
        {
            method: 'GET',
            path: /^\/events$/u,
            handle: ({ response }) => events(response, [{ data: 'first' }, { data: 'second' }, { data: 'third' }]),
        },
        {
            method: 'GET',
            path: /^\/ticker$/u,
            handle: ({ request, response }) => {
                if (request.headers['last-event-id'] === '1') {
                    events(response, [
                        { id: '2', data: 'two' },
                        { id: '3', data: 'three' },
                    ]);
                } else {
                    events(response, [{ id: '1', data: 'one' }], false);
                }
            },
        },
        {
            method: 'POST',
            path: /^\/chat$/u,
            handle: async ({ request, response }) => {
                const { prompt } = (await body(request).json()) as { prompt: string };
                const words = ['Hi', `, ${prompt.split(' ').pop() ?? 'there'}`, '!'];
                events(
                    response,
                    words.map((text) => ({ data: JSON.stringify({ text }) }))
                );
            },
        },
    ];
}

/**
 * @summary Finds the route of a request and runs it; answers preflight requests and unknown paths itself.
 *
 * @param exchange - The request, the response, the URL and the fixtures folder.
 */
async function dispatch(exchange: Exchange): Promise<void> {
    const { request, response, url } = exchange;

    if (request.method === 'OPTIONS') {
        const headers = request.headers['access-control-request-headers'] ?? '';
        response.writeHead(204, { ...CORS, 'Access-Control-Allow-Headers': headers }).end();
        return;
    }

    const route = routes.find((candidate) => candidate.method === request.method && candidate.path.test(url.pathname));
    const id = Number(route?.path.exec(url.pathname)?.groups?.id ?? 0);

    await (route ? route.handle(exchange, id) : json(response, 404, { message: `No route for ${url.pathname}` }));
}

/**
 * @summary Creates the server the lessons talk to; it is not listening yet.
 *
 * @description `npm run examples:serve -w @metapraxis/jext-http` starts it on `http://localhost:4000`; the feature tests of
 * the lessons start it on a free port. It keeps no state: `POST`, `PUT`, `PATCH` and `DELETE` answer as if they
 * changed the users, and the next request sees the fixture again. Only the counters of `/flaky`, `/busy` and `/counter`
 * remember requests, per `?key=`, so that a lesson can show a failure that passes on a repeat.
 *
 * @param fixtures - The folder with the fixtures, `examples/__fixtures__`.
 * @returns A Node HTTP server.
 */
export function createLessonServer(fixtures: string): Server {
    const counts = new Map<string, number>();

    return createServer((request, response) => {
        const url = new URL(request.url ?? '/', 'http://localhost');

        dispatch({ request, response, url, fixtures, counts }).catch((error: unknown) => {
            json(response, 400, { message: error instanceof Error ? error.message : 'Bad request' });
        });
    });
}
