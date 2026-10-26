import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { HttpRequest } from '@Http/Contract/HttpRequest';

describe('Http method helpers should send their HTTP method', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it.each([
        ['GET', (http: Http): HttpRequest<string> => http.get<string>('/api/users')],
        ['HEAD', (http: Http): HttpRequest<string> => http.head<string>('/api/users')],
        ['DELETE', (http: Http): HttpRequest<string> => http.delete<string>('/api/users')],
        ['POST', (http: Http): HttpRequest<string> => http.post<string>('/api/users')],
        ['PUT', (http: Http): HttpRequest<string> => http.put<string>('/api/users')],
        ['PATCH', (http: Http): HttpRequest<string> => http.patch<string>('/api/users')],
    ])('when the helper is for %s', async (method, call) => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await call(http);

        expect(fetch).toHaveBeenCalledWith('/api/users', expect.objectContaining({ method }));
    });
});
