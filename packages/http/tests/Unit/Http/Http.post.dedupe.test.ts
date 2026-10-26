import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.post should not share a request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when two identical POST requests with dedupe are in flight', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await Promise.all([
            http.post<string>('https://api.example.com/users').body({ name: 'Ann' }).dedupe(),
            http.post<string>('https://api.example.com/users').body({ name: 'Ann' }).dedupe(),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
