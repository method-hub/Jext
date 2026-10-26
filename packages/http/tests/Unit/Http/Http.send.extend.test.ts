import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should use the base URL and the headers of the client', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when send is called on an extended client', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ baseUrl: 'https://api.example.com', headers: { Authorization: 'Bearer t' } });

        await api.send<string>('/users', { headers: { Accept: 'text/plain' } });

        const [[url, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        const headers = new Headers(init.headers);
        expect(url).toBe('https://api.example.com/users');
        expect(headers.get('Authorization')).toBe('Bearer t');
        expect(headers.get('Accept')).toBe('text/plain');
    });
});
