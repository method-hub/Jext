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

    it('when one of the requests has a download listener', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        await Promise.all([
            http.get<string>('https://api.example.com/file').dedupe(),
            http.get<string>('https://api.example.com/file').dedupe().onDownloadProgress(vi.fn()),
        ]);

        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
