import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return the HttpError of the last attempt', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() =>
                Promise.resolve(new Response('busy', { status: 503, statusText: 'Service Unavailable' }))
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when every attempt is answered with 503', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { error } = await http.send<string, string>(
            'https://api.example.com/x',
            {},
            { retry: { limit: 2, delay: 0 } }
        );

        expect(error?.status).toBe(503);
        expect(error?.message).toBe('503 Service Unavailable');
        expect(error?.data).toBe('busy');
        expect(fetch).toHaveBeenCalledTimes(3);
    });
});
