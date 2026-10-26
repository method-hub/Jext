import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should not share a request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the requests differ in a header', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await Promise.all([
            http.get<string>('https://api.example.com/users').headers({ 'X-Lang': 'en' }).dedupe(),
            http.get<string>('https://api.example.com/users').headers({ 'X-Lang': 'ru' }).dedupe(),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
