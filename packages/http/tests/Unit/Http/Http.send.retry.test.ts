import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return the data of the repeated request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementationOnce(() => Promise.resolve(new Response(null, { status: 503 })))
            .mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the first attempt is answered with 503', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const result = await http.send<string>('https://api.example.com/x', {}, { retry: { limit: 1, delay: 0 } });

        expect(result).toEqual({ data: 'ok', error: null });
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
