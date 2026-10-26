import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should not repeat the request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementationOnce(() => Promise.resolve(new Response(null, { status: 503 })))
            .mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request turns retries off with retry(0)', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ retry: { limit: 2, delay: 0 } });

        const { error } = await api.get<string>('/users').retry(0);

        expect(error?.status).toBe(503);
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
