import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should send every request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when identical requests are in flight without dedupe', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await Promise.all([
            http.get<string>('https://api.example.com/users'),
            http.get<string>('https://api.example.com/users'),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
