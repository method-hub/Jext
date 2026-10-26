import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should let a request leave the dedupe of the client', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request calls dedupe(false)', async () => {
        const api = new Http(new Root<string>().add(new TextParser())).extend({ dedupe: true });

        await Promise.all([
            api.get<string>('https://api.example.com/users'),
            api.get<string>('https://api.example.com/users').dedupe(false),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
