import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should apply the options object', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when query and headers are passed as options', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await http.get<string>('/api/users', { query: { page: 2 }, headers: { Accept: 'text/plain' } });

        const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
        expect(url).toBe('/api/users?page=2');
        expect(new Headers(init.headers).get('Accept')).toBe('text/plain');
    });
});
