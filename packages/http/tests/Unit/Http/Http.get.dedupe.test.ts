import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should send one request and give both callers the data', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when two identical requests with dedupe are in flight at once', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const results = await Promise.all([
            http.get<string>('https://api.example.com/users').dedupe(),
            http.get<string>('https://api.example.com/users').dedupe(),
        ]);

        expect(results).toEqual([
            { data: 'ok', error: null },
            { data: 'ok', error: null },
        ]);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
