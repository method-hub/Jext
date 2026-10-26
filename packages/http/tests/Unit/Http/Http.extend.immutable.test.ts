import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should leave the original client unchanged', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a new client is created from it', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ baseUrl: 'https://api.example.com', headers: { Authorization: 'Bearer t' } });

        await http.get<string>('/users');

        const [[url, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(api).not.toBe(http);
        expect(url).toBe('/users');
        expect(new Headers(init.headers).has('Authorization')).toBe(false);
    });
});
